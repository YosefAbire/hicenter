from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.models import GraduateProfile, Role, StudentProfile, TeacherProfile, User
from accounts.permissions import IsPlatformAdmin, IsSchoolAdminOrPlatformAdmin
from accounts.serializers import InvitationCreatedSerializer, UserSerializer
from accounts.services import provision_user
from schools.models import School
from schools.serializers import (
    GraduateCreateSerializer,
    SchoolAdminCreateSerializer,
    SchoolSerializer,
    TeacherCreateSerializer,
    parse_roster_csv,
)


class SchoolViewSet(viewsets.ModelViewSet):
    serializer_class = SchoolSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post", "patch", "head", "options"]

    def get_queryset(self):
        user = self.request.user
        if user.role == Role.PLATFORM_ADMIN:
            return School.objects.all()
        if user.school_id:
            return School.objects.filter(pk=user.school_id)
        return School.objects.none()

    def get_permissions(self):
        if self.action in {"create"}:
            return [IsPlatformAdmin()]
        if self.action in {"partial_update", "update"}:
            return [IsSchoolAdminOrPlatformAdmin()]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save()

    def _school_or_404(self) -> School:
        school = get_object_or_404(self.get_queryset(), pk=self.kwargs["pk"])
        user = self.request.user
        if user.role != Role.PLATFORM_ADMIN and user.school_id != school.id:
            raise PermissionDenied("You cannot access another school.")
        return school

    def _require_school_admin_or_platform(self):
        if self.request.user.role not in {Role.SCHOOL_ADMIN, Role.PLATFORM_ADMIN}:
            raise PermissionDenied("School admin or platform admin required.")

    @action(detail=True, methods=["post"], permission_classes=[IsPlatformAdmin], url_path="admins")
    def create_admin(self, request, pk=None):
        school = self._school_or_404()
        serializer = SchoolAdminCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if User.objects.filter(email__iexact=serializer.validated_data["email"]).exists():
            raise ValidationError({"email": "A user with this email already exists."})
        with transaction.atomic():
            user, invitation = provision_user(
                email=serializer.validated_data["email"],
                first_name=serializer.validated_data["first_name"],
                last_name=serializer.validated_data["last_name"],
                role=Role.SCHOOL_ADMIN,
                school=school,
                invited_by=request.user,
            )
        return Response(
            {
                "user": UserSerializer(user).data,
                "invitation": InvitationCreatedSerializer(
                    {"email": user.email, "token": invitation.token, "role": user.role}
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=True,
        methods=["get", "post"],
        permission_classes=[IsSchoolAdminOrPlatformAdmin],
        url_path="teachers",
    )
    def teachers(self, request, pk=None):
        school = self._school_or_404()
        self._require_school_admin_or_platform()
        if request.method == "GET":
            users = User.objects.filter(school=school, role=Role.TEACHER).select_related("teacher_profile")
            return Response(UserSerializer(users, many=True).data)

        serializer = TeacherCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if User.objects.filter(email__iexact=serializer.validated_data["email"]).exists():
            raise ValidationError({"email": "A user with this email already exists."})
        with transaction.atomic():
            user, invitation = provision_user(
                email=serializer.validated_data["email"],
                first_name=serializer.validated_data["first_name"],
                last_name=serializer.validated_data["last_name"],
                role=Role.TEACHER,
                school=school,
                invited_by=request.user,
            )
            TeacherProfile.objects.create(user=user, subjects=serializer.validated_data.get("subjects", ""))
        return Response(
            {
                "user": UserSerializer(user).data,
                "invitation": InvitationCreatedSerializer(
                    {"email": user.email, "token": invitation.token, "role": user.role}
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=True,
        methods=["get"],
        permission_classes=[IsSchoolAdminOrPlatformAdmin],
        url_path="students",
    )
    def students(self, request, pk=None):
        school = self._school_or_404()
        self._require_school_admin_or_platform()
        users = (
            User.objects.filter(school=school, role=Role.STUDENT)
            .select_related("student_profile")
            .order_by("student_profile__grade", "email")
        )
        grade = request.query_params.get("grade")
        if grade:
            try:
                grade_value = int(grade)
            except ValueError as exc:
                raise ValidationError({"grade": "Grade must be 11 or 12."}) from exc
            users = users.filter(student_profile__grade=grade_value)
        return Response(UserSerializer(users, many=True).data)

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsSchoolAdminOrPlatformAdmin],
        parser_classes=[MultiPartParser, FormParser, JSONParser],
        url_path="roster",
    )
    def roster(self, request, pk=None):
        school = self._school_or_404()
        self._require_school_admin_or_platform()
        upload = request.FILES.get("file")
        if upload is None:
            raise ValidationError({"file": "Upload a CSV file in the 'file' field."})
        rows = parse_roster_csv(upload)
        created = []
        with transaction.atomic():
            for row in rows:
                if User.objects.filter(email__iexact=row["email"]).exists():
                    raise ValidationError(
                        {"email": f"{row['email']} already exists.", "row_email": row["email"]}
                    )
                user, invitation = provision_user(
                    email=row["email"],
                    first_name=row["first_name"],
                    last_name=row["last_name"],
                    role=Role.STUDENT,
                    school=school,
                    invited_by=request.user,
                )
                StudentProfile.objects.create(
                    user=user,
                    grade=row["grade"],
                    stream=row.get("stream") or "",
                    enrollment_year=row["enrollment_year"],
                )
                created.append(
                    {"email": user.email, "token": invitation.token, "role": user.role}
                )
        return Response(
            {
                "created": len(created),
                "invitations": InvitationCreatedSerializer(created, many=True).data,
            },
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=True,
        methods=["get", "post"],
        permission_classes=[IsSchoolAdminOrPlatformAdmin],
        url_path="graduates",
    )
    def graduates(self, request, pk=None):
        school = self._school_or_404()
        self._require_school_admin_or_platform()
        if request.method == "GET":
            users = User.objects.filter(school=school, role=Role.GRADUATE).select_related(
                "graduate_profile"
            )
            return Response(UserSerializer(users, many=True).data)

        serializer = GraduateCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if User.objects.filter(email__iexact=serializer.validated_data["email"]).exists():
            raise ValidationError({"email": "A user with this email already exists."})
        with transaction.atomic():
            user, invitation = provision_user(
                email=serializer.validated_data["email"],
                first_name=serializer.validated_data["first_name"],
                last_name=serializer.validated_data["last_name"],
                role=Role.GRADUATE,
                school=school,
                invited_by=request.user,
            )
            GraduateProfile.objects.create(
                user=user,
                university=serializer.validated_data.get("university", ""),
                major=serializer.validated_data.get("major", ""),
            )
        return Response(
            {
                "user": UserSerializer(user).data,
                "invitation": InvitationCreatedSerializer(
                    {"email": user.email, "token": invitation.token, "role": user.role}
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsSchoolAdminOrPlatformAdmin],
        url_path=r"graduates/(?P<user_id>[^/.]+)/verify",
    )
    def verify_graduate(self, request, pk=None, user_id=None):
        school = self._school_or_404()
        self._require_school_admin_or_platform()
        graduate = get_object_or_404(
            User.objects.filter(school=school, role=Role.GRADUATE), pk=user_id
        )
        profile = graduate.graduate_profile
        from django.utils import timezone

        from config.architecture import GRADUATE_VERIFICATION_SOURCES

        source = "platform" if request.user.role == Role.PLATFORM_ADMIN else "school"
        assert source in GRADUATE_VERIFICATION_SOURCES
        profile.verified_at = timezone.now()
        profile.verified_by = request.user
        profile.verification_source = source
        profile.save(update_fields=["verified_at", "verified_by", "verification_source"])
        return Response(UserSerializer(graduate).data)

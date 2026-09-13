from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.models import (
    GraduateProfile,
    Invitation,
    Role,
    StudentProfile,
    TeacherProfile,
    User,
)
from schools.models import School


class SchoolSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ("id", "name", "code", "is_active")


class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ("grade", "stream", "enrollment_year")


class TeacherProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherProfile
        fields = ("subjects",)


class GraduateProfileSerializer(serializers.ModelSerializer):
    is_verified = serializers.BooleanField(read_only=True)

    class Meta:
        model = GraduateProfile
        fields = (
            "university",
            "major",
            "why_chose_field",
            "challenges",
            "advice_for_students",
            "verified_at",
            "verification_source",
            "is_verified",
        )


class UserSerializer(serializers.ModelSerializer):
    school = SchoolSummarySerializer(read_only=True)
    student_profile = StudentProfileSerializer(read_only=True)
    teacher_profile = TeacherProfileSerializer(read_only=True)
    graduate_profile = GraduateProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "role",
            "is_active",
            "school",
            "student_profile",
            "teacher_profile",
            "graduate_profile",
        )


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(
            request=self.context.get("request"),
            username=attrs["email"].lower().strip(),
            password=attrs["password"],
        )
        if user is None:
            raise serializers.ValidationError("Invalid email or password.")
        if not user.is_active:
            raise serializers.ValidationError("This account is not active.")
        attrs["user"] = user
        attrs["refresh"] = RefreshToken.for_user(user)
        return attrs


class ActivateSerializer(serializers.Serializer):
    token = serializers.CharField()
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        try:
            invitation = Invitation.objects.select_related("user").get(token=attrs["token"])
        except Invitation.DoesNotExist as exc:
            raise serializers.ValidationError({"token": "Invalid activation token."}) from exc
        if not invitation.is_usable():
            raise serializers.ValidationError({"token": "This invitation has expired or was already used."})
        attrs["invitation"] = invitation
        return attrs

    def save(self, **kwargs):
        invitation: Invitation = self.validated_data["invitation"]
        user = invitation.user
        user.set_password(self.validated_data["password"])
        user.is_active = True
        user.save(update_fields=["password", "is_active"])
        from django.utils import timezone

        invitation.accepted_at = timezone.now()
        invitation.save(update_fields=["accepted_at"])
        return user


class InvitationCreatedSerializer(serializers.Serializer):
    email = serializers.EmailField()
    token = serializers.CharField()
    role = serializers.ChoiceField(choices=Role.choices)

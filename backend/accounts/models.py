from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Q
from django.utils import timezone

from config.architecture import (
    ALLOWED_GRADES,
    GRADUATE_VERIFICATION_SOURCES,
    ROLES,
    STUDENT_STREAM_CHOICES,
)


class Role(models.TextChoices):
    PLATFORM_ADMIN = "platform_admin", "Platform admin"
    SCHOOL_ADMIN = "school_admin", "School admin"
    TEACHER = "teacher", "Teacher"
    STUDENT = "student", "Student"
    GRADUATE = "graduate", "Graduate"


assert tuple(Role.values) == ROLES


class User(AbstractUser):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=32, choices=Role.choices)
    school = models.ForeignKey(
        "schools.School",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="users",
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        indexes = [
            models.Index(fields=["role"]),
            models.Index(fields=["school", "role"]),
        ]

    def _normalize_identity(self):
        if self.email:
            self.email = self.email.lower().strip()
            self.username = self.email

    def save(self, *args, **kwargs):
        self._normalize_identity()
        super().save(*args, **kwargs)

    def full_clean(self, *args, **kwargs):
        self._normalize_identity()
        super().full_clean(*args, **kwargs)

    def clean(self):
        self._normalize_identity()
        if self.role == Role.PLATFORM_ADMIN and self.school_id is not None:
            raise ValidationError("Platform admin cannot belong to a school.")
        if self.role != Role.PLATFORM_ADMIN and self.school_id is None:
            raise ValidationError("This role requires a school.")

    @property
    def is_platform_admin(self) -> bool:
        return self.role == Role.PLATFORM_ADMIN

    @property
    def is_school_admin(self) -> bool:
        return self.role == Role.SCHOOL_ADMIN


class StudentProfile(models.Model):
    class Stream(models.TextChoices):
        NATURAL = "natural", "Natural"
        SOCIAL = "social", "Social"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="student_profile",
    )
    grade = models.PositiveSmallIntegerField()
    stream = models.CharField(
        max_length=16,
        choices=Stream.choices,
        blank=True,
        default="",
    )
    enrollment_year = models.PositiveSmallIntegerField()

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=Q(grade__in=ALLOWED_GRADES),
                name="student_grade_11_or_12",
            ),
        ]

    def clean(self):
        if self.grade not in ALLOWED_GRADES:
            raise ValidationError({"grade": "HiCenter is limited to Grade 11 and 12."})
        if self.stream and self.stream not in STUDENT_STREAM_CHOICES:
            raise ValidationError({"stream": "Stream must be natural or social."})
        if self.user_id and self.user.role != Role.STUDENT:
            raise ValidationError("Student profile requires a student user.")


assert tuple(StudentProfile.Stream.values) == STUDENT_STREAM_CHOICES


class TeacherProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="teacher_profile",
    )
    subjects = models.CharField(
        max_length=255,
        blank=True,
        help_text="Comma-separated subject names this teacher covers.",
    )

    def clean(self):
        if self.user_id and self.user.role != Role.TEACHER:
            raise ValidationError("Teacher profile requires a teacher user.")


class GraduateProfile(models.Model):
    class VerificationSource(models.TextChoices):
        SCHOOL = "school", "School"
        PLATFORM = "platform", "Platform"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="graduate_profile",
    )
    university = models.CharField(max_length=255, blank=True)
    major = models.CharField(max_length=255, blank=True)
    why_chose_field = models.TextField(blank=True)
    challenges = models.TextField(blank=True)
    advice_for_students = models.TextField(blank=True)
    verified_at = models.DateTimeField(null=True, blank=True)
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="verified_graduates",
    )
    verification_source = models.CharField(
        max_length=16,
        choices=VerificationSource.choices,
        blank=True,
        default="",
    )

    def clean(self):
        if self.user_id and self.user.role != Role.GRADUATE:
            raise ValidationError("Graduate profile requires a graduate user.")
        if (
            self.verification_source
            and self.verification_source not in GRADUATE_VERIFICATION_SOURCES
        ):
            raise ValidationError({"verification_source": "Invalid verification source."})

    @property
    def is_verified(self) -> bool:
        return self.verified_at is not None


assert tuple(GraduateProfile.VerificationSource.values) == GRADUATE_VERIFICATION_SOURCES


class Invitation(models.Model):
    class Kind(models.TextChoices):
        SCHOOL_ADMIN = "school_admin", "School admin"
        TEACHER = "teacher", "Teacher"
        STUDENT = "student", "Student"
        GRADUATE = "graduate", "Graduate"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="invitations",
    )
    token = models.CharField(max_length=64, unique=True)
    kind = models.CharField(max_length=32, choices=Kind.choices)
    invited_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="sent_invitations",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    accepted_at = models.DateTimeField(null=True, blank=True)

    def is_usable(self) -> bool:
        return self.accepted_at is None and timezone.now() < self.expires_at

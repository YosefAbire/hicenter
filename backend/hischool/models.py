from django.conf import settings
from django.db import models


class StudyNote(models.Model):
    school = models.ForeignKey(
        "schools.School",
        on_delete=models.CASCADE,
        related_name="notes",
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="authored_notes",
    )
    title = models.CharField(max_length=255)
    subject = models.CharField(max_length=100)
    chapter = models.CharField(max_length=100)
    summary = models.TextField()
    verified = models.BooleanField(default=False)
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="verified_notes",
    )
    verified_by_label = models.CharField(max_length=255, blank=True, default="")
    download_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} ({self.subject})"


class PracticeQuiz(models.Model):
    class Kind(models.TextChoices):
        FORMATIVE = "formative", "Formative"
        TIMED_SPRINT = "timed_sprint", "Timed Sprint"

    school = models.ForeignKey(
        "schools.School",
        on_delete=models.CASCADE,
        related_name="quizzes",
    )
    title = models.CharField(max_length=255)
    subject = models.CharField(max_length=100)
    kind = models.CharField(
        max_length=20,
        choices=Kind.choices,
        default=Kind.FORMATIVE,
    )
    questions_count = models.PositiveIntegerField(default=10)
    estimated_minutes = models.PositiveIntegerField(default=15)
    mastery_score = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.subject}"


class StudyCircle(models.Model):
    school = models.ForeignKey(
        "schools.School",
        on_delete=models.CASCADE,
        related_name="study_circles",
    )
    lead = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="led_study_circles",
    )
    name = models.CharField(max_length=255)
    subject = models.CharField(max_length=100)
    next_session = models.CharField(max_length=255)
    is_live = models.BooleanField(default=False)
    members_count = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.subject})"


class GraduatePathway(models.Model):
    title = models.CharField(max_length=255)
    alum_name = models.CharField(max_length=255)
    grad_year = models.CharField(max_length=50)
    institution = models.CharField(max_length=255)
    quote = models.TextField()
    advice = models.TextField()
    electives = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.alum_name}"

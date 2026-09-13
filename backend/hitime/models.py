from django.conf import settings
from django.db import models


class Task(models.Model):
    class DuePeriod(models.TextChoices):
        NOW = "Now", "Now"
        NEXT = "Next", "Next"
        LATER = "Later", "Later"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="tasks",
    )
    title = models.CharField(max_length=255)
    subject = models.CharField(max_length=100, default="General")
    due_period = models.CharField(
        max_length=16,
        choices=DuePeriod.choices,
        default=DuePeriod.NOW,
    )
    due_time = models.CharField(max_length=100, blank=True, default="")
    time_estimate = models.CharField(max_length=50, blank=True, default="30m")
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    notes = models.CharField(max_length=255, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} ({self.due_period})"


class FocusSession(models.Model):
    class Mode(models.TextChoices):
        POMODORO = "pomodoro", "Pomodoro (25m)"
        DEEP = "deep", "Deep Focus (50m)"
        BREAK = "break", "Short Break (5m)"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="focus_sessions",
    )
    target_task = models.ForeignKey(
        Task,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="sessions",
    )
    mode = models.CharField(
        max_length=16,
        choices=Mode.choices,
        default=Mode.POMODORO,
    )
    duration_minutes = models.PositiveIntegerField(default=25)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


class RoutineItem(models.Model):
    class Kind(models.TextChoices):
        MORNING = "morning", "Morning Prep"
        EVENING = "evening", "Evening Review"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="routines",
    )
    kind = models.CharField(max_length=16, choices=Kind.choices)
    label = models.CharField(max_length=255)
    done = models.BooleanField(default=False)

    def __str__(self):
        return f"[{self.kind}] {self.label}"

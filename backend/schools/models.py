from django.core.exceptions import ValidationError
from django.db import models


class School(models.Model):
    name = models.CharField(max_length=255)
    code = models.SlugField(unique=True)
    is_active = models.BooleanField(default=True)
    academic_year_start = models.DateField(null=True, blank=True)
    academic_year_end = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name

    def clean(self):
        if (
            self.academic_year_start
            and self.academic_year_end
            and self.academic_year_end <= self.academic_year_start
        ):
            raise ValidationError("Academic year end must be after start.")

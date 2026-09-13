import csv
import io
from datetime import datetime

from rest_framework import serializers

from config.architecture import ALLOWED_GRADES, ROSTER_CSV_FIELDS, STUDENT_STREAM_CHOICES
from schools.models import School


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = (
            "id",
            "name",
            "code",
            "is_active",
            "academic_year_start",
            "academic_year_end",
            "created_at",
        )
        read_only_fields = ("id", "created_at")


class SchoolAdminCreateSerializer(serializers.Serializer):
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150, allow_blank=True)


class TeacherCreateSerializer(serializers.Serializer):
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150, allow_blank=True)
    subjects = serializers.CharField(required=False, allow_blank=True, default="")


class GraduateCreateSerializer(serializers.Serializer):
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150, allow_blank=True)
    university = serializers.CharField(required=False, allow_blank=True, default="")
    major = serializers.CharField(required=False, allow_blank=True, default="")


class RosterRowSerializer(serializers.Serializer):
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150, allow_blank=True)
    grade = serializers.IntegerField()
    stream = serializers.CharField(required=False, allow_blank=True, default="")
    enrollment_year = serializers.IntegerField(required=False)

    def validate_grade(self, value):
        if value not in ALLOWED_GRADES:
            raise serializers.ValidationError("Grade must be 11 or 12.")
        return value

    def validate_stream(self, value):
        value = (value or "").strip().lower()
        if not value:
            return ""
        if value not in STUDENT_STREAM_CHOICES:
            raise serializers.ValidationError("Stream must be natural or social.")
        return value

    def validate_enrollment_year(self, value):
        if value is None:
            return datetime.now().year
        if value < 2000 or value > 2100:
            raise serializers.ValidationError("Enrollment year looks invalid.")
        return value

    def validate(self, attrs):
        if "enrollment_year" not in attrs or attrs.get("enrollment_year") is None:
            attrs["enrollment_year"] = datetime.now().year
        return attrs


def parse_roster_csv(file) -> list[dict]:
    raw = file.read()
    if isinstance(raw, bytes):
        raw = raw.decode("utf-8-sig")
    reader = csv.DictReader(io.StringIO(raw))
    if not reader.fieldnames:
        raise serializers.ValidationError("CSV file is empty.")
    headers = [h.strip().lower() for h in reader.fieldnames]
    required = {"email", "first_name", "last_name", "grade"}
    missing = required - set(headers)
    if missing:
        raise serializers.ValidationError(
            f"CSV is missing columns: {', '.join(sorted(missing))}. "
            f"Expected {', '.join(ROSTER_CSV_FIELDS)}."
        )
    rows = []
    for index, row in enumerate(reader, start=2):
        normalized = {k.strip().lower(): (v or "").strip() for k, v in row.items() if k}
        if not any(normalized.values()):
            continue
        serializer = RosterRowSerializer(data=normalized)
        if not serializer.is_valid():
            raise serializers.ValidationError({"row": index, "errors": serializer.errors})
        rows.append(serializer.validated_data)
    if not rows:
        raise serializers.ValidationError("CSV has no student rows.")
    emails = [row["email"].lower() for row in rows]
    if len(emails) != len(set(emails)):
        raise serializers.ValidationError("CSV contains duplicate emails.")
    return rows

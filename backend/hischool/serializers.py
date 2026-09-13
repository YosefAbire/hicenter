from rest_framework import serializers
from hischool.models import StudyNote, PracticeQuiz, StudyCircle, GraduatePathway


class StudyNoteSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.get_full_name", read_only=True)

    class Meta:
        model = StudyNote
        fields = [
            "id",
            "school",
            "author",
            "author_name",
            "title",
            "subject",
            "chapter",
            "summary",
            "verified",
            "verified_by_label",
            "download_count",
            "created_at",
        ]
        read_only_fields = ["id", "author", "created_at"]


class PracticeQuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = PracticeQuiz
        fields = [
            "id",
            "school",
            "title",
            "subject",
            "kind",
            "questions_count",
            "estimated_minutes",
            "mastery_score",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class StudyCircleSerializer(serializers.ModelSerializer):
    lead_name = serializers.CharField(source="lead.get_full_name", read_only=True)

    class Meta:
        model = StudyCircle
        fields = [
            "id",
            "school",
            "lead",
            "lead_name",
            "name",
            "subject",
            "next_session",
            "is_live",
            "members_count",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class GraduatePathwaySerializer(serializers.ModelSerializer):
    class Meta:
        model = GraduatePathway
        fields = [
            "id",
            "title",
            "alum_name",
            "grad_year",
            "institution",
            "quote",
            "advice",
            "electives",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

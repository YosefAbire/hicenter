from rest_framework import serializers
from hitime.models import Task, FocusSession, RoutineItem


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "subject",
            "due_period",
            "due_time",
            "time_estimate",
            "completed",
            "completed_at",
            "notes",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class FocusSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FocusSession
        fields = [
            "id",
            "target_task",
            "mode",
            "duration_minutes",
            "completed",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class RoutineItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoutineItem
        fields = ["id", "kind", "label", "done"]
        read_only_fields = ["id"]

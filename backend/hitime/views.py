from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from hitime.models import Task, FocusSession, RoutineItem
from hitime.serializers import TaskSerializer, FocusSessionSerializer, RoutineItemSerializer


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"])
    def toggle(self, request, pk=None):
        task = self.get_object()
        task.completed = not task.completed
        task.completed_at = timezone.now() if task.completed else None
        task.save()
        return Response(TaskSerializer(task).data)


class FocusSessionViewSet(viewsets.ModelViewSet):
    serializer_class = FocusSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FocusSession.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RoutineItemViewSet(viewsets.ModelViewSet):
    serializer_class = RoutineItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return RoutineItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

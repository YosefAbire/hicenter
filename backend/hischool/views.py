from rest_framework import viewsets, permissions
from hischool.models import StudyNote, PracticeQuiz, StudyCircle, GraduatePathway
from hischool.serializers import (
    StudyNoteSerializer,
    PracticeQuizSerializer,
    StudyCircleSerializer,
    GraduatePathwaySerializer,
)


class StudyNoteViewSet(viewsets.ModelViewSet):
    serializer_class = StudyNoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_platform_admin or not user.school:
            return StudyNote.objects.all()
        return StudyNote.objects.filter(school=user.school)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user, school=self.request.user.school)


class PracticeQuizViewSet(viewsets.ModelViewSet):
    serializer_class = PracticeQuizSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_platform_admin or not user.school:
            return PracticeQuiz.objects.all()
        return PracticeQuiz.objects.filter(school=user.school)


class StudyCircleViewSet(viewsets.ModelViewSet):
    serializer_class = StudyCircleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_platform_admin or not user.school:
            return StudyCircle.objects.all()
        return StudyCircle.objects.filter(school=user.school)

    def perform_create(self, serializer):
        serializer.save(lead=self.request.user, school=self.request.user.school)


class GraduatePathwayViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GraduatePathway.objects.all()
    serializer_class = GraduatePathwaySerializer
    permission_classes = [permissions.AllowAny]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from hischool.views import (
    StudyNoteViewSet,
    PracticeQuizViewSet,
    StudyCircleViewSet,
    GraduatePathwayViewSet,
)

router = DefaultRouter()
router.register("notes", StudyNoteViewSet, basename="note")
router.register("quizzes", PracticeQuizViewSet, basename="quiz")
router.register("circles", StudyCircleViewSet, basename="circle")
router.register("pathways", GraduatePathwayViewSet, basename="pathway")

urlpatterns = [
    path("", include(router.urls)),
]

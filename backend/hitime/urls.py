from django.urls import path, include
from rest_framework.routers import DefaultRouter
from hitime.views import TaskViewSet, FocusSessionViewSet, RoutineItemViewSet

router = DefaultRouter()
router.register("tasks", TaskViewSet, basename="task")
router.register("sessions", FocusSessionViewSet, basename="session")
router.register("routines", RoutineItemViewSet, basename="routine")

urlpatterns = [
    path("", include(router.urls)),
]

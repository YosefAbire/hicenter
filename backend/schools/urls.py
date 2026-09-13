from django.urls import include, path
from rest_framework.routers import DefaultRouter

from schools.views import SchoolViewSet

router = DefaultRouter()
router.register("schools", SchoolViewSet, basename="school")

urlpatterns = [
    path("", include(router.urls)),
]

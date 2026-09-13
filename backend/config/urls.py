from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("accounts.urls")),
    path("api/", include("schools.urls")),
    path("api/hischool/", include("hischool.urls")),
    path("api/hitime/", include("hitime.urls")),
]

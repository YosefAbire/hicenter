from django.urls import path

from accounts.views import ActivateView, HealthView, LoginView, LogoutView, MeView, RefreshView

urlpatterns = [
    path("health/", HealthView.as_view(), name="health"),
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("auth/logout/", LogoutView.as_view(), name="auth-logout"),
    path("auth/refresh/", RefreshView.as_view(), name="auth-refresh"),
    path("auth/me/", MeView.as_view(), name="auth-me"),
    path("auth/activate/", ActivateView.as_view(), name="auth-activate"),
]

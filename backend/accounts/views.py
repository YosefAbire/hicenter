from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.cookies import clear_auth_cookies, set_auth_cookies
from accounts.models import User
from accounts.serializers import ActivateSerializer, LoginSerializer, UserSerializer


class HealthView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, _request):
        return Response({"status": "ok", "service": "hicenter"})


class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        refresh = serializer.validated_data["refresh"]
        response = Response({"user": UserSerializer(user).data})
        set_auth_cookies(response, str(refresh.access_token), str(refresh))
        return response


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, _request):
        response = Response({"detail": "Logged out."})
        clear_auth_cookies(response)
        return response


class RefreshView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        from django.conf import settings

        raw = request.COOKIES.get(settings.AUTH_COOKIE_REFRESH_NAME)
        if not raw:
            return Response({"detail": "Refresh token missing."}, status=401)
        try:
            refresh = RefreshToken(raw)
            access = str(refresh.access_token)
        except TokenError:
            return Response({"detail": "Invalid refresh token."}, status=401)
        response = Response({"detail": "Token refreshed."})
        set_auth_cookies(response, access, str(refresh))
        return response


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = (
            User.objects.select_related(
                "school",
                "student_profile",
                "teacher_profile",
                "graduate_profile",
            ).get(pk=request.user.pk)
        )
        return Response(UserSerializer(user).data)


class ActivateView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = ActivateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        response = Response({"user": UserSerializer(user).data})
        set_auth_cookies(response, str(refresh.access_token), str(refresh))
        return response

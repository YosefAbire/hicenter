from django.conf import settings
from rest_framework_simplejwt.authentication import JWTAuthentication


class CookieJWTAuthentication(JWTAuthentication):
    """Read JWTs from httpOnly cookies, with Authorization header as fallback."""

    def authenticate(self, request):
        raw_token = request.COOKIES.get(settings.AUTH_COOKIE_ACCESS_NAME)
        if raw_token is None:
            header = self.get_header(request)
            if header is None:
                return None
            raw_token = self.get_raw_token(header)
            if raw_token is None:
                return None
        else:
            raw_token = raw_token.encode("utf-8") if isinstance(raw_token, str) else raw_token

        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token

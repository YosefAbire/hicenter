from django.conf import settings


def set_auth_cookies(response, access: str, refresh: str):
    cookie_kwargs = {
        "httponly": True,
        "secure": settings.AUTH_COOKIE_SECURE,
        "samesite": settings.AUTH_COOKIE_SAMESITE,
        "path": settings.AUTH_COOKIE_PATH,
    }
    response.set_cookie(
        settings.AUTH_COOKIE_ACCESS_NAME,
        access,
        max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
        **cookie_kwargs,
    )
    response.set_cookie(
        settings.AUTH_COOKIE_REFRESH_NAME,
        refresh,
        max_age=settings.AUTH_COOKIE_REFRESH_MAX_AGE,
        **cookie_kwargs,
    )
    return response


def clear_auth_cookies(response):
    response.delete_cookie(
        settings.AUTH_COOKIE_ACCESS_NAME,
        path=settings.AUTH_COOKIE_PATH,
        samesite=settings.AUTH_COOKIE_SAMESITE,
    )
    response.delete_cookie(
        settings.AUTH_COOKIE_REFRESH_NAME,
        path=settings.AUTH_COOKIE_PATH,
        samesite=settings.AUTH_COOKIE_SAMESITE,
    )
    return response

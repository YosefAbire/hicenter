from rest_framework.permissions import BasePermission

from accounts.models import Role


class IsPlatformAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == Role.PLATFORM_ADMIN
        )


class IsSchoolAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == Role.SCHOOL_ADMIN
        )


class IsSchoolAdminOrPlatformAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in {Role.SCHOOL_ADMIN, Role.PLATFORM_ADMIN}
        )


class IsTeacher(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == Role.TEACHER
        )


class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == Role.STUDENT
        )

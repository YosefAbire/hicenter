from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from accounts.models import GraduateProfile, Invitation, StudentProfile, TeacherProfile, User

admin.site.site_header = "HiCenter"
admin.site.site_title = "HiCenter admin"


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    list_display = ("email", "role", "school", "is_active")
    list_filter = ("role", "is_active")
    search_fields = ("email", "first_name", "last_name")
    ordering = ("email",)
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Profile", {"fields": ("first_name", "last_name", "role", "school")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2", "role", "school"),
            },
        ),
    )


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "grade", "stream", "enrollment_year")
    list_filter = ("grade", "stream")


@admin.register(TeacherProfile)
class TeacherProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "subjects")


@admin.register(GraduateProfile)
class GraduateProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "university", "major", "verified_at", "verification_source")


@admin.register(Invitation)
class InvitationAdmin(admin.ModelAdmin):
    list_display = ("user", "kind", "expires_at", "accepted_at")
    list_filter = ("kind",)

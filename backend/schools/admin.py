from django.contrib import admin

from schools.models import School


@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "is_active", "academic_year_start", "academic_year_end")
    search_fields = ("name", "code")
    prepopulated_fields = {"code": ("name",)}

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import Role, StudentProfile, TeacherProfile, GraduateProfile
from schools.models import School
from hitime.models import Task, FocusSession, RoutineItem
from hischool.models import StudyNote, PracticeQuiz, StudyCircle, GraduatePathway

User = get_user_model()


class Command(BaseCommand):
    help = "Seed demo data for HiCenter (Schools, Platform Admin, School Admin, Student Maya Chen, HiTime, HiSchool)"

    def handle(self, *args, **options):
        self.stdout.write("Seeding HiCenter database...")

        # 1. Platform Admin
        admin_user, _ = User.objects.get_or_create(
            email="platform@hicenter.local",
            defaults={
                "username": "platform@hicenter.local",
                "first_name": "Platform",
                "last_name": "Admin",
                "role": Role.PLATFORM_ADMIN,
                "is_staff": True,
                "is_superuser": True,
            }
        )
        admin_user.set_password("change-me")
        admin_user.save()

        # 2. Schools
        stjude, _ = School.objects.get_or_create(
            code="STJUDE",
            defaults={
                "name": "St. Jude Collegiate Academy",
                "is_active": True,
            }
        )

        beacon, _ = School.objects.get_or_create(
            code="BEACON",
            defaults={
                "name": "Beacon Hill Preparatory Center",
                "is_active": True,
            }
        )

        # 3. School Admin
        school_admin, _ = User.objects.get_or_create(
            email="elena.rostova@stjude.edu",
            defaults={
                "username": "elena.rostova@stjude.edu",
                "first_name": "Elena",
                "last_name": "Rostova",
                "role": Role.SCHOOL_ADMIN,
                "school": stjude,
            }
        )
        school_admin.set_password("password123")
        school_admin.save()

        # 4. Teacher
        teacher_user, _ = User.objects.get_or_create(
            email="dr.aris@stjude.edu",
            defaults={
                "username": "dr.aris@stjude.edu",
                "first_name": "Aris",
                "last_name": "Vance",
                "role": Role.TEACHER,
                "school": stjude,
            }
        )
        teacher_user.set_password("password123")
        teacher_user.save()
        TeacherProfile.objects.get_or_create(user=teacher_user, defaults={"subjects": "Physics, AP Calculus"})

        # 5. Student Maya Chen
        student_user, _ = User.objects.get_or_create(
            email="scholar@academy.edu",
            defaults={
                "username": "scholar@academy.edu",
                "first_name": "Maya",
                "last_name": "Chen",
                "role": Role.STUDENT,
                "school": stjude,
            }
        )
        student_user.set_password("password123")
        student_user.save()
        StudentProfile.objects.get_or_create(
            user=student_user,
            defaults={
                "grade": 11,
                "stream": "natural",
                "enrollment_year": 2024,
            }
        )

        # 6. HiTime Tasks
        Task.objects.get_or_create(
            user=student_user,
            title="Calculus BC Problem Set 9 (Problems 12–24)",
            defaults={
                "subject": "Math",
                "due_period": Task.DuePeriod.NOW,
                "due_time": "Now",
                "time_estimate": "40 min",
                "notes": "Active Target"
            }
        )
        Task.objects.get_or_create(
            user=student_user,
            title="Revise Physics lab methodology section",
            defaults={
                "subject": "Physics",
                "due_period": Task.DuePeriod.NOW,
                "due_time": "Now",
                "time_estimate": "20 min",
            }
        )

        # 7. HiSchool Notes
        StudyNote.objects.get_or_create(
            school=stjude,
            title="Thermodynamics & Gibbs Free Energy",
            defaults={
                "author": teacher_user,
                "subject": "AP Chemistry",
                "chapter": "Unit 6",
                "summary": "Comprehensive synthesis of enthalpy, entropy changes (ΔS°), and spontaneous cell potential derivations.",
                "verified": True,
                "verified_by": teacher_user,
                "verified_by_label": "Verified by Mr. Davies",
                "download_count": 68
            }
        )

        # 8. Graduate Pathways
        GraduatePathway.objects.get_or_create(
            title="Biomechanical Engineering",
            defaults={
                "alum_name": "Maya Lin",
                "grad_year": "Class of 2023",
                "institution": "Johns Hopkins University",
                "quote": "Formulas are tools of thought, not substitutes for it.",
                "advice": "3 recommended Grade 12 electives & university prerequisite map are available for early review with your advisor.",
                "electives": ["✓ AP Physics 1", "Physics C (G12)", "Multivariable Calc"]
            }
        )

        self.stdout.write(self.style.SUCCESS("Successfully seeded HiCenter demo data!"))

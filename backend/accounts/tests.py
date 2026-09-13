from django.core.files.uploadedfile import SimpleUploadedFile
from django.db.utils import IntegrityError
from django.test import TestCase
from rest_framework.test import APITestCase

from accounts.models import Invitation, Role, StudentProfile, User
from schools.models import School


class GradeConstraintTests(TestCase):
    def setUp(self):
        self.school = School.objects.create(name="North High", code="north")
        self.user = User.objects.create(
            email="student@north.edu",
            role=Role.STUDENT,
            school=self.school,
            is_active=True,
        )
        self.user.set_password("password12")
        self.user.save()

    def test_grade_10_rejected_by_database(self):
        profile = StudentProfile(
            user=self.user,
            grade=10,
            enrollment_year=2026,
        )
        with self.assertRaises(IntegrityError):
            profile.save()

    def test_grade_11_accepted(self):
        StudentProfile.objects.create(user=self.user, grade=11, enrollment_year=2026)
        self.assertEqual(self.user.student_profile.grade, 11)


class IdentityApiTests(APITestCase):
    def setUp(self):
        self.platform = User.objects.create(
            email="platform@hicenter.local",
            role=Role.PLATFORM_ADMIN,
            is_active=True,
            is_staff=True,
        )
        self.platform.set_password("platform-pass")
        self.platform.save()

    def _login(self, email, password):
        response = self.client.post(
            "/api/auth/login/",
            {"email": email, "password": password},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("access_token", response.cookies)
        return response

    def test_health(self):
        response = self.client.get("/api/health/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "ok")

    def test_no_public_register(self):
        response = self.client.post(
            "/api/auth/register/",
            {"email": "public@example.com", "password": "password12"},
            format="json",
        )
        self.assertEqual(response.status_code, 404)

    def test_school_roster_activation_and_grade_lock(self):
        self._login("platform@hicenter.local", "platform-pass")
        school_res = self.client.post(
            "/api/schools/",
            {"name": "Rift Valley High", "code": "rift"},
            format="json",
        )
        self.assertEqual(school_res.status_code, 201)
        school_id = school_res.data["id"]

        admin_res = self.client.post(
            f"/api/schools/{school_id}/admins/",
            {"email": "admin@rift.edu", "first_name": "School", "last_name": "Admin"},
            format="json",
        )
        self.assertEqual(admin_res.status_code, 201)
        admin_token = admin_res.data["invitation"]["token"]

        self.client.cookies.clear()
        activate = self.client.post(
            "/api/auth/activate/",
            {
                "token": admin_token,
                "password": "admin-pass1",
                "password_confirm": "admin-pass1",
            },
            format="json",
        )
        self.assertEqual(activate.status_code, 200)
        self.assertEqual(activate.data["user"]["role"], "school_admin")

        csv_body = (
            "email,first_name,last_name,grade,stream,enrollment_year\n"
            "s11@rift.edu,Ana,Eleven,11,natural,2026\n"
            "s12@rift.edu,Ben,Twelve,12,social,2026\n"
        )
        roster = self.client.post(
            f"/api/schools/{school_id}/roster/",
            {"file": SimpleUploadedFile("roster.csv", csv_body.encode(), content_type="text/csv")},
            format="multipart",
        )
        self.assertEqual(roster.status_code, 201, roster.data)
        self.assertEqual(roster.data["created"], 2)
        student_token = next(
            item["token"] for item in roster.data["invitations"] if item["email"] == "s11@rift.edu"
        )

        self.client.cookies.clear()
        student_activate = self.client.post(
            "/api/auth/activate/",
            {
                "token": student_token,
                "password": "student-pass1",
                "password_confirm": "student-pass1",
            },
            format="json",
        )
        self.assertEqual(student_activate.status_code, 200)
        me = self.client.get("/api/auth/me/")
        self.assertEqual(me.data["role"], "student")
        self.assertEqual(me.data["student_profile"]["grade"], 11)
        self.assertEqual(me.data["school"]["code"], "rift")

        rejected = self.client.post(
            "/api/auth/login/",
            {"email": "s12@rift.edu", "password": "student-pass1"},
            format="json",
        )
        self.assertEqual(rejected.status_code, 400)

    def test_roster_rejects_grade_outside_11_12(self):
        self._login("platform@hicenter.local", "platform-pass")
        school_id = self.client.post(
            "/api/schools/",
            {"name": "East High", "code": "east"},
            format="json",
        ).data["id"]
        admin_token = self.client.post(
            f"/api/schools/{school_id}/admins/",
            {"email": "admin@east.edu", "first_name": "A", "last_name": "B"},
            format="json",
        ).data["invitation"]["token"]
        self.client.cookies.clear()
        self.client.post(
            "/api/auth/activate/",
            {"token": admin_token, "password": "admin-pass1", "password_confirm": "admin-pass1"},
            format="json",
        )
        csv_body = "email,first_name,last_name,grade\nbad@east.edu,Too,Young,10\n"
        roster = self.client.post(
            f"/api/schools/{school_id}/roster/",
            {"file": SimpleUploadedFile("roster.csv", csv_body.encode(), content_type="text/csv")},
            format="multipart",
        )
        self.assertEqual(roster.status_code, 400)
        self.assertFalse(User.objects.filter(email="bad@east.edu").exists())
        self.assertFalse(Invitation.objects.filter(user__email="bad@east.edu").exists())

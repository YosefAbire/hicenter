import os

from django.core.management.base import BaseCommand, CommandError

from accounts.models import Role, User


class Command(BaseCommand):
    help = "Create the initial platform admin if one does not exist."

    def add_arguments(self, parser):
        parser.add_argument("--email", default=os.getenv("PLATFORM_ADMIN_EMAIL"))
        parser.add_argument("--password", default=os.getenv("PLATFORM_ADMIN_PASSWORD"))

    def handle(self, *args, **options):
        email = (options.get("email") or "").strip().lower()
        password = options.get("password") or ""
        if not email or not password:
            raise CommandError("Provide --email and --password (or PLATFORM_ADMIN_* env vars).")
        existing = User.objects.filter(role=Role.PLATFORM_ADMIN).first()
        if existing:
            self.stdout.write(self.style.WARNING(f"Platform admin already exists: {existing.email}"))
            return
        if User.objects.filter(email=email).exists():
            raise CommandError(f"User {email} already exists with a different role.")
        user = User(
            email=email,
            role=Role.PLATFORM_ADMIN,
            school=None,
            is_active=True,
            is_staff=True,
            is_superuser=True,
        )
        user.set_password(password)
        user.full_clean()
        user.save()
        self.stdout.write(self.style.SUCCESS(f"Created platform admin {user.email}"))

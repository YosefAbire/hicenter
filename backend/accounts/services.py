import secrets
from datetime import timedelta

from django.conf import settings
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils import timezone

from accounts.models import Invitation, Role, User
from rest_framework.exceptions import ValidationError as APIValidationError


def new_token() -> str:
    return secrets.token_urlsafe(32)


def issue_invitation(user: User, invited_by: User | None) -> Invitation:
    kind_map = {
        Role.SCHOOL_ADMIN: Invitation.Kind.SCHOOL_ADMIN,
        Role.TEACHER: Invitation.Kind.TEACHER,
        Role.STUDENT: Invitation.Kind.STUDENT,
        Role.GRADUATE: Invitation.Kind.GRADUATE,
    }
    return Invitation.objects.create(
        user=user,
        token=new_token(),
        kind=kind_map[user.role],
        invited_by=invited_by,
        expires_at=timezone.now() + timedelta(days=settings.INVITATION_TTL_DAYS),
    )


def provision_user(
    *,
    email: str,
    first_name: str,
    last_name: str,
    role: str,
    school,
    invited_by: User | None,
) -> tuple[User, Invitation]:
    user = User(
        email=email.lower().strip(),
        first_name=first_name,
        last_name=last_name,
        role=role,
        school=school,
        is_active=False,
    )
    user.set_unusable_password()
    try:
        user.full_clean()
    except DjangoValidationError as exc:
        raise APIValidationError(exc.message_dict if hasattr(exc, "message_dict") else exc.messages) from exc
    user.save()
    invitation = issue_invitation(user, invited_by)
    return user, invitation

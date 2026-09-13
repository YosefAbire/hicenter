"""Frozen Phase 1 architecture decisions.

These values are the source of truth for identity and tenancy models.
They were locked from the HiCenter architecture plan before domain models
were written.
"""

# National/shared subject catalog; schools enable or disable entries.
CURRICULUM_OWNERSHIP = "shared_catalog"

# Either a school admin or a platform admin may verify a graduate.
GRADUATE_VERIFICATION = "school_or_platform"
GRADUATE_VERIFICATION_SOURCES = ("school", "platform")

# Grade 11/12 is required. Natural/social (or equivalent) is optional.
STUDENT_STREAMS_ENABLED = True
STUDENT_STREAM_CHOICES = ("natural", "social")

# School admins onboard students via CSV roster upload.
ROSTER_FORMAT = "csv"
ROSTER_CSV_FIELDS = (
    "email",
    "first_name",
    "last_name",
    "grade",
    "stream",
    "enrollment_year",
)

# Browser sessions use JWT in httpOnly cookies, not localStorage.
AUTH_TRANSPORT = "httponly_cookie"
AUTH_COOKIE_ACCESS = "access_token"
AUTH_COOKIE_REFRESH = "refresh_token"

ALLOWED_GRADES = (11, 12)

ROLES = (
    "platform_admin",
    "school_admin",
    "teacher",
    "student",
    "graduate",
)

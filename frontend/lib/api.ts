export type Role =
  | "platform_admin"
  | "school_admin"
  | "teacher"
  | "student"
  | "graduate";

export type SchoolSummary = {
  id: number;
  name: string;
  code: string;
  is_active: boolean;
};

export type Me = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
  is_active: boolean;
  school: SchoolSummary | null;
  student_profile: {
    grade: number;
    stream: string;
    enrollment_year: number;
  } | null;
  teacher_profile: { subjects: string } | null;
  graduate_profile: {
    university: string;
    major: string;
    verified_at: string | null;
    verification_source: string;
    is_verified: boolean;
  } | null;
};

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    super(extractMessage(body) || `Request failed (${status})`);
    this.status = status;
    this.body = body;
  }
}

function firstString(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return "";
}

function extractMessage(body: unknown): string {
  if (!body || typeof body !== "object") return "";
  const record = body as Record<string, unknown>;
  const direct = firstString(record.detail) || firstString(record.non_field_errors);
  if (direct) return direct;
  for (const value of Object.values(record)) {
    const message = firstString(value);
    if (message) return message;
  }
  return "";
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/django-api";

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const isForm = init.body instanceof FormData;
  if (!isForm && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });
  if (response.status === 204) {
    return undefined as T;
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(response.status, body);
  }
  return body as T;
}

export function homeForRole(role: Role): string {
  switch (role) {
    case "platform_admin":
      return "/platform/schools";
    case "school_admin":
      return "/school-admin/roster";
    case "teacher":
      return "/teacher";
    case "graduate":
      return "/graduate";
    default:
      return "/dashboard";
  }
}

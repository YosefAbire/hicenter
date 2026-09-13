import { CURRENT_STUDENT, StudentProfile } from "@/lib/mockData";
import { api } from "@/lib/api";

export type Role = "student" | "school_admin" | "platform_admin" | "teacher" | "graduate";

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: Role;
  school: string;
  grade?: string;
  stream?: string;
  studentId?: string;
  avatarInitials: string;
  token?: string;
}

const STORAGE_KEY = "hicenter_user_session";

export const DEFAULT_USERS: Record<string, UserSession> = {
  "scholar@academy.edu": {
    id: "usr_student_1",
    email: "scholar@academy.edu",
    name: "Maya Chen",
    role: "student",
    school: "St. Jude Collegiate Academy",
    grade: "Grade 11",
    stream: "Senior Science & Humanities",
    studentId: "#SJ-88241",
    avatarInitials: "MC",
  },
  "elena.rostova@stjude.edu": {
    id: "usr_admin_1",
    email: "elena.rostova@stjude.edu",
    name: "Elena Rostova",
    role: "school_admin",
    school: "St. Jude Collegiate Academy",
    avatarInitials: "ER",
  },
  "platform@hicenter.local": {
    id: "usr_platform_1",
    email: "platform@hicenter.local",
    name: "Platform Governance",
    role: "platform_admin",
    school: "HiCenter Central Network",
    avatarInitials: "PG",
  },
};

export const authService = {
  getCurrentSession(): UserSession {
    if (typeof window === "undefined") return DEFAULT_USERS["scholar@academy.edu"];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse auth session", e);
    }
    return DEFAULT_USERS["scholar@academy.edu"];
  },

  setCurrentSession(session: UserSession): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
  },

  login(email: string, password?: string): UserSession {
    const normalized = email.toLowerCase().trim();
    const matched = DEFAULT_USERS[normalized] || {
      id: `usr_${Date.now()}`,
      email: normalized,
      name: normalized.split("@")[0].replace(".", " "),
      role: "student" as Role,
      school: "St. Jude Collegiate Academy",
      grade: "Grade 11",
      stream: "Senior Science & Humanities",
      avatarInitials: normalized.slice(0, 2).toUpperCase(),
    };
    this.setCurrentSession(matched);

    // Attempt backend token acquisition if server is reachable
    if (password) {
      api<{ access?: string }>("/auth/login/", {
        method: "POST",
        body: JSON.stringify({ email: normalized, password }),
      })
        .then((res) => {
          if (res?.access) {
            this.setCurrentSession({ ...matched, token: res.access });
          }
        })
        .catch(() => {});
    }

    return matched;
  },

  switchRole(role: Role): UserSession {
    const current = this.getCurrentSession();
    if (role === "student") {
      const session = DEFAULT_USERS["scholar@academy.edu"];
      this.setCurrentSession(session);
      return session;
    }
    if (role === "school_admin") {
      const session = DEFAULT_USERS["elena.rostova@stjude.edu"];
      this.setCurrentSession(session);
      return session;
    }
    if (role === "platform_admin") {
      const session = DEFAULT_USERS["platform@hicenter.local"];
      this.setCurrentSession(session);
      return session;
    }
    const updated = { ...current, role };
    this.setCurrentSession(updated);
    return updated;
  },

  activateToken(token: string, password: string): { success: boolean; user?: UserSession; message?: string } {
    if (!password || password.length < 8) {
      return { success: false, message: "Password must be at least 8 characters." };
    }
    const activatedUser = DEFAULT_USERS["scholar@academy.edu"];
    this.setCurrentSession(activatedUser);

    api<any>("/auth/activate/", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    }).catch(() => {});

    return { success: true, user: activatedUser };
  },

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    api<any>("/auth/logout/", { method: "POST" }).catch(() => {});
  },
};

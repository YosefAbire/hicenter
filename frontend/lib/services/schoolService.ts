import { INITIAL_SCHOOLS, SchoolRecord } from "@/lib/mockData";

const SCHOOLS_STORAGE_KEY = "hicenter_schools_data";

export const schoolService = {
  getSchools(): SchoolRecord[] {
    if (typeof window === "undefined") return INITIAL_SCHOOLS;
    try {
      const saved = localStorage.getItem(SCHOOLS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load schools", e);
    }
    return INITIAL_SCHOOLS;
  },

  saveSchools(schools: SchoolRecord[]): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(SCHOOLS_STORAGE_KEY, JSON.stringify(schools));
    }
  },

  provisionSchool(school: Omit<SchoolRecord, "id" | "status" | "studentsCount" | "teachersCount">): SchoolRecord {
    const current = this.getSchools();
    const newSchool: SchoolRecord = {
      ...school,
      id: `sch_${Date.now()}`,
      studentsCount: 0,
      teachersCount: 1,
      status: "Provisioning",
    };
    const updated = [newSchool, ...current];
    this.saveSchools(updated);
    return newSchool;
  },

  resendAdminInvite(id: string): SchoolRecord[] {
    const current = this.getSchools();
    const updated = current.map((s) =>
      s.id === id ? { ...s, status: "Active" as const } : s
    );
    this.saveSchools(updated);
    return updated;
  },
};

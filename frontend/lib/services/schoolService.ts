import { INITIAL_SCHOOLS, SchoolRecord } from "@/lib/mockData";
import { api } from "@/lib/api";

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

    api<any>("/schools/", {
      method: "POST",
      body: JSON.stringify({
        name: school.name,
        code: school.code,
        region: school.region,
        admin_email: school.adminEmail,
        admin_name: school.adminName,
      }),
    }).catch(() => {});

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

  async syncWithBackend(): Promise<SchoolRecord[]> {
    try {
      const apiSchools = await api<any[]>("/schools/");
      if (Array.isArray(apiSchools) && apiSchools.length > 0) {
        const mapped: SchoolRecord[] = apiSchools.map((s) => ({
          id: String(s.id),
          name: s.name,
          code: s.code,
          region: s.region || "Central Region",
          tracks: ["STEM", "Pre-Med", "Humanities"],
          studentsCount: s.students_count || 0,
          teachersCount: s.teachers_count || 0,
          adminEmail: s.admin_email || "admin@school.edu",
          adminName: s.admin_name || "School Admin",
          status: s.is_active ? "Active" : "Provisioning",
        }));
        this.saveSchools(mapped);
        return mapped;
      }
    } catch (e) {
      console.log("Using offline school persistence.");
    }
    return this.getSchools();
  },
};

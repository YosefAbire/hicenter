import { INITIAL_ROSTER, RosterStudent } from "@/lib/mockData";

const ROSTER_STORAGE_KEY = "hicenter_roster_students";

export const rosterService = {
  getRoster(): RosterStudent[] {
    if (typeof window === "undefined") return INITIAL_ROSTER;
    try {
      const saved = localStorage.getItem(ROSTER_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load roster", e);
    }
    return INITIAL_ROSTER;
  },

  saveRoster(roster: RosterStudent[]): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(ROSTER_STORAGE_KEY, JSON.stringify(roster));
    }
  },

  addStudent(student: Omit<RosterStudent, "id" | "invitedDate">): RosterStudent {
    const current = this.getRoster();
    const token = `act_${Date.now()}`;
    const newStudent: RosterStudent = {
      ...student,
      id: `ros_${Date.now()}`,
      activationLink: `https://hicenter.app/activate/${token}`,
      invitedDate: "Today, Just Now",
    };
    const updated = [newStudent, ...current];
    this.saveRoster(updated);
    return newStudent;
  },

  parseCSVAndAdd(csvText: string): { count: number; roster: RosterStudent[] } {
    const lines = csvText.split("\n").map((l) => l.trim()).filter(Boolean);
    let addedCount = 0;
    const current = this.getRoster();
    const newRecords: RosterStudent[] = [];

    // Simple CSV parser
    lines.forEach((line, index) => {
      if (index === 0 && line.toLowerCase().includes("email")) return; // Header skip
      const parts = line.split(",").map((p) => p.trim());
      if (parts.length >= 2) {
        const name = parts[0] || "New Student";
        const email = parts[1] || `student_${Date.now()}@stjude.edu`;
        const grade = parts[2] || "Grade 11";
        const stream = parts[3] || "General Sciences";
        const token = `act_${Date.now()}_${index}`;
        newRecords.push({
          id: `ros_csv_${Date.now()}_${index}`,
          name,
          email,
          grade,
          stream,
          status: "Pending Activation",
          activationLink: `https://hicenter.app/activate/${token}`,
          invitedDate: "Just Now",
        });
        addedCount++;
      }
    });

    const updated = [...newRecords, ...current];
    this.saveRoster(updated);
    return { count: addedCount, roster: updated };
  },

  resendInvite(id: string): RosterStudent[] {
    const current = this.getRoster();
    const updated = current.map((s) =>
      s.id === id ? { ...s, invitedDate: "Resent Just Now" } : s
    );
    this.saveRoster(updated);
    return updated;
  },
};

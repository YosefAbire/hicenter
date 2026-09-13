import { NoteItem, QuizItem, StudyGroup, GraduatePathway, INITIAL_NOTES, INITIAL_QUIZZES, INITIAL_STUDY_GROUPS, PRIMARY_PATHWAY } from "@/lib/mockData";

const NOTES_STORAGE_KEY = "hicenter_notes_data";
const QUIZZES_STORAGE_KEY = "hicenter_quizzes_data";
const CIRCLES_STORAGE_KEY = "hicenter_circles_data";
const SAVED_PATHWAYS_KEY = "hicenter_saved_pathways";
const DISCUSSIONS_STORAGE_KEY = "hicenter_discussions_data";

export interface DiscussionPost {
  id: string;
  circleId: string;
  author: string;
  authorInitials: string;
  timestamp: string;
  content: string;
  likes: number;
}

export const INITIAL_DISCUSSIONS: DiscussionPost[] = [
  {
    id: "disc1",
    circleId: "sg1",
    author: "Maya Chen",
    authorInitials: "MC",
    timestamp: "10 mins ago",
    content: "Has anyone worked through Problem Set 9 question 14 on Taylor polynomials error bounds?",
    likes: 4,
  },
  {
    id: "disc2",
    circleId: "sg1",
    author: "Dr. Aris Vance",
    authorInitials: "AV",
    timestamp: "5 mins ago",
    content: "Remember to check the (n+1)th derivative maximum bound on the interval [0, x].",
    likes: 8,
  },
];

export const ALL_PATHWAYS: GraduatePathway[] = [
  PRIMARY_PATHWAY,
  {
    id: "p2",
    title: "Applied Computer Science & AI Systems",
    alumName: "David Kim",
    gradYear: "Class of 2022",
    currentField: "Software Systems Engineering",
    institution: "MIT School of Engineering",
    quote: "Learn Discrete Math and Data Structures in Grade 11. Coding is just syntax; logic is structure.",
    advice: "Focus on AP Calculus BC and Computer Science Principles. Participate in peer whiteboard study circles.",
    electives: ["✓ AP Calculus BC", "AP Computer Science A", "Linear Algebra"],
  },
  {
    id: "p3",
    title: "Pre-Medical & Cellular Bio-Sciences",
    alumName: "Sophia Patel",
    gradYear: "Class of 2023",
    currentField: "Biochemistry & Cellular Biology",
    institution: "Harvard University Pre-Med",
    quote: "Organic Chemistry lab prep in Grade 11 made university cell bio feel like second nature.",
    advice: "Pair Chemistry 11 and Organic Biology with regular diagnostic self-check quizzes in HiSchool.",
    electives: ["✓ Organic Chemistry", "Biology 11", "Biostatistics"],
  },
];

export const hischoolService = {
  // Notes
  getNotes(): NoteItem[] {
    if (typeof window === "undefined") return INITIAL_NOTES;
    try {
      const saved = localStorage.getItem(NOTES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load notes", e);
    }
    return INITIAL_NOTES;
  },

  incrementDownload(id: string): NoteItem[] {
    const notes = this.getNotes();
    const updated = notes.map((n) =>
      n.id === id ? { ...n, downloadCount: n.downloadCount + 1 } : n
    );
    if (typeof window !== "undefined") {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updated));
    }
    return updated;
  },

  // Quizzes
  getQuizzes(): QuizItem[] {
    if (typeof window === "undefined") return INITIAL_QUIZZES;
    try {
      const saved = localStorage.getItem(QUIZZES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load quizzes", e);
    }
    return INITIAL_QUIZZES;
  },

  recordQuizResult(id: string, scorePercentage: number): QuizItem[] {
    const quizzes = this.getQuizzes();
    const updated = quizzes.map((q) =>
      q.id === id ? { ...q, masteryScore: scorePercentage } : q
    );
    if (typeof window !== "undefined") {
      localStorage.setItem(QUIZZES_STORAGE_KEY, JSON.stringify(updated));
    }
    return updated;
  },

  // Circles
  getCircles(): StudyGroup[] {
    if (typeof window === "undefined") return INITIAL_STUDY_GROUPS;
    try {
      const saved = localStorage.getItem(CIRCLES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load circles", e);
    }
    return INITIAL_STUDY_GROUPS;
  },

  rsvpCircle(id: string): StudyGroup[] {
    const circles = this.getCircles();
    const updated = circles.map((c) =>
      c.id === id ? { ...c, membersCount: c.membersCount + 1 } : c
    );
    if (typeof window !== "undefined") {
      localStorage.setItem(CIRCLES_STORAGE_KEY, JSON.stringify(updated));
    }
    return updated;
  },

  getDiscussions(circleId: string): DiscussionPost[] {
    if (typeof window === "undefined") return INITIAL_DISCUSSIONS;
    try {
      const saved = localStorage.getItem(DISCUSSIONS_STORAGE_KEY);
      if (saved) {
        const all: DiscussionPost[] = JSON.parse(saved);
        return all.filter((d) => d.circleId === circleId);
      }
    } catch (e) {
      console.error("Failed to load discussions", e);
    }
    return INITIAL_DISCUSSIONS.filter((d) => d.circleId === circleId);
  },

  addDiscussionPost(circleId: string, author: string, initials: string, content: string): DiscussionPost[] {
    const newPost: DiscussionPost = {
      id: `disc_${Date.now()}`,
      circleId,
      author,
      authorInitials: initials,
      timestamp: "Just now",
      content,
      likes: 1,
    };
    let all = INITIAL_DISCUSSIONS;
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(DISCUSSIONS_STORAGE_KEY);
        if (saved) all = JSON.parse(saved);
      } catch (e) {}
      all = [newPost, ...all];
      localStorage.setItem(DISCUSSIONS_STORAGE_KEY, JSON.stringify(all));
    }
    return all.filter((d) => d.circleId === circleId);
  },

  // Pathways
  getPathways(): GraduatePathway[] {
    return ALL_PATHWAYS;
  },

  getSavedPathways(): string[] {
    if (typeof window === "undefined") return ["p1"];
    try {
      const saved = localStorage.getItem(SAVED_PATHWAYS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ["p1"];
  },

  toggleSavePathway(id: string): string[] {
    const saved = this.getSavedPathways();
    const isSaved = saved.includes(id);
    const updated = isSaved ? saved.filter((s) => s !== id) : [...saved, id];
    if (typeof window !== "undefined") {
      localStorage.setItem(SAVED_PATHWAYS_KEY, JSON.stringify(updated));
    }
    return updated;
  },
};

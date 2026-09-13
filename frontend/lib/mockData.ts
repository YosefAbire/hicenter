export interface StudentProfile {
  name: string;
  email: string;
  school: string;
  grade: string;
  stream: string;
  studentId: string;
  avatarInitials: string;
}

export interface TaskItem {
  id: string;
  title: string;
  subject: string;
  dueTime: string;
  location?: string;
  timeEstimate: string;
  duePeriod: "Now" | "Next" | "Later";
  completed: boolean;
  notes?: string;
}

export interface NoteItem {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  author: string;
  date: string;
  verified: boolean;
  verifiedBy?: string;
  summary: string;
  downloadCount: number;
}

export interface QuizItem {
  id: string;
  title: string;
  subject: string;
  questionsCount: number;
  estimatedMinutes: number;
  masteryScore?: number;
}

export interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  membersCount: number;
  nextSession: string;
  lead: string;
  is_live?: boolean;
}

export interface GraduatePathway {
  id: string;
  title: string;
  alumName: string;
  gradYear: string;
  currentField: string;
  institution: string;
  quote: string;
  advice: string;
  electives: string[];
}

export interface RosterStudent {
  id: string;
  name: string;
  email: string;
  grade: string;
  stream: string;
  status: "Active" | "Pending Activation";
  activationLink?: string;
  invitedDate: string;
}

export interface SchoolRecord {
  id: string;
  name: string;
  code: string;
  region: string;
  tracks: string[];
  studentsCount: number;
  teachersCount: number;
  adminEmail: string;
  adminName: string;
  status: "Active" | "Provisioning";
}

export const CURRENT_STUDENT: StudentProfile = {
  name: "Maya Chen",
  email: "scholar@academy.edu",
  school: "St. Jude Collegiate Academy",
  grade: "Grade 11",
  stream: "Senior Science & Humanities",
  studentId: "#SJ-88241",
  avatarInitials: "MC"
};

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: "t1",
    title: "Complete AP Chemistry stoichiometry problem set 4",
    subject: "AP Chemistry",
    dueTime: "Due 2:00 PM",
    location: "Carrel Desk 4",
    timeEstimate: "35m estimated",
    duePeriod: "Now",
    completed: false,
  },
  {
    id: "t2",
    title: "Review Chapter 8 notes on World War I treaties",
    subject: "European History",
    dueTime: "Next block",
    location: "Primary Sources",
    timeEstimate: "25m estimated",
    duePeriod: "Now",
    completed: false
  },
  {
    id: "t3",
    title: "Calculus BC: Taylor Series Derivations Problem Set 6",
    subject: "Mathematics",
    dueTime: "Tomorrow 9:00 AM",
    location: "Math Lab B",
    timeEstimate: "45m estimated",
    duePeriod: "Next",
    completed: false
  },
  {
    id: "t4",
    title: "Draft Outline for World History Essay",
    subject: "World History",
    dueTime: "Thursday",
    location: "Library Carrel",
    timeEstimate: "40m estimated",
    duePeriod: "Next",
    completed: false
  },
  {
    id: "t5",
    title: "SAT Math Practice Test 3 — Non-Calculator Section",
    subject: "Test Prep",
    dueTime: "Friday",
    location: "Home Desk",
    timeEstimate: "30m estimated",
    duePeriod: "Later",
    completed: false
  }
];

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: "n1",
    title: "Calculus BC: Taylor Series Derivations & Error Bounds",
    subject: "Mathematics",
    chapter: "Period 3 • Chapter 6",
    author: "Dr. Aris Vance",
    date: "Apr 15, 2026",
    verified: true,
    verifiedBy: "Dr. Aris verified notes",
    summary: "Step-by-step mathematical proof of Taylor polynomials, Lagrange error bounds, and radius of convergence.",
    downloadCount: 68
  },
  {
    id: "n2",
    title: "Modern European History: League of Nations & Treaties",
    subject: "Social Sciences",
    chapter: "Unit 4 • Primary Sources",
    author: "Elena Rostova",
    date: "Apr 14, 2026",
    verified: true,
    verifiedBy: "Ms. Gable verified notes",
    summary: "Primary document breakdown of the Versailles Treaty clauses and early diplomatic carrel archives.",
    downloadCount: 42
  },
  {
    id: "n3",
    title: "AP Chemistry Stoichiometry & Molar Gas Volume Lab",
    subject: "AP Chemistry",
    chapter: "Unit 3 • Lab Desk 4",
    author: "Maya Chen",
    date: "Apr 12, 2026",
    verified: false,
    summary: "Pre-lab calculations and uncertainty analysis tables for ideal gas law reactions.",
    downloadCount: 19
  }
];

export const INITIAL_QUIZZES: QuizItem[] = [
  {
    id: "q1",
    title: "Modern European History: League of Nations Assessment",
    subject: "Social Sciences",
    questionsCount: 12,
    estimatedMinutes: 15,
    masteryScore: 90
  },
  {
    id: "q2",
    title: "Calculus BC Taylor Polynomial Diagnostic Check",
    subject: "Mathematics",
    questionsCount: 8,
    estimatedMinutes: 20
  }
];

export const INITIAL_STUDY_GROUPS: StudyGroup[] = [
  {
    id: "sg1",
    name: "AP Chemistry Problem Circle B",
    subject: "AP Chemistry",
    membersCount: 5,
    nextSession: "Tomorrow, 4:00 PM • Carrel Desk 4",
    lead: "Maya Chen"
  },
  {
    id: "sg2",
    name: "Calculus Taylor Series Peer Carrel",
    subject: "Mathematics",
    membersCount: 4,
    nextSession: "Thursday, 3:30 PM • Math Lab",
    lead: "Dr. Aris Vance"
  }
];

export const PRIMARY_PATHWAY: GraduatePathway = {
  id: "p1",
  title: "Biomechanical Engineering",
  alumName: "Maya Lin",
  gradYear: "Class of 2023",
  currentField: "Biomedical Engineering Candidate",
  institution: "Johns Hopkins University",
  quote: "Formulas are tools of thought, not substitutes for it.",
  advice: "3 recommended Grade 12 electives & university prerequisite map are available for early review with your advisor.",
  electives: ["✓ AP Physics 1", "Physics C (G12)", "Multivariable Calc"]
};

export const INITIAL_ROSTER: RosterStudent[] = [
  {
    id: "ros-1",
    name: "Maya Chen",
    email: "scholar@academy.edu",
    grade: "Grade 11",
    stream: "Senior Science & Humanities",
    status: "Active",
    invitedDate: "Apr 01, 2026"
  },
  {
    id: "ros-2",
    name: "Marcus Vance",
    email: "marcus.vance@stjude.edu",
    grade: "Grade 11",
    stream: "STEM & Natural Sciences",
    status: "Active",
    invitedDate: "Apr 01, 2026"
  },
  {
    id: "ros-3",
    name: "Sophia Patel",
    email: "sophia.patel@stjude.edu",
    grade: "Grade 11",
    stream: "Pre-Medical Track",
    status: "Active",
    invitedDate: "Apr 01, 2026"
  },
  {
    id: "ros-4",
    name: "David Kim",
    email: "david.kim@stjude.edu",
    grade: "Grade 12",
    stream: "Humanities & Social Sciences",
    status: "Pending Activation",
    activationLink: "https://hicenter.app/activate/act_9823471029384",
    invitedDate: "Apr 10, 2026"
  }
];

export const INITIAL_SCHOOLS: SchoolRecord[] = [
  {
    id: "sch-1",
    name: "St. Jude Collegiate Academy",
    code: "STJUDE",
    region: "Boston Academic District",
    tracks: ["STEM", "Pre-Med", "Humanities", "Economics"],
    studentsCount: 340,
    teachersCount: 28,
    adminEmail: "elena.rostova@stjude.edu",
    adminName: "Elena Rostova",
    status: "Active"
  },
  {
    id: "sch-2",
    name: "Beacon Hill Preparatory Center",
    code: "BEACON",
    region: "Metropolitan West",
    tracks: ["STEM", "Humanities"],
    studentsCount: 210,
    teachersCount: 19,
    adminEmail: "d.miller@beaconhillprep.org",
    adminName: "Daniel Miller",
    status: "Active"
  }
];

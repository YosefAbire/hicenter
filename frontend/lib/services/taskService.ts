import { TaskItem } from "@/lib/mockData";

const TASKS_STORAGE_KEY = "hicenter_tasks_data";
const ROUTINES_STORAGE_KEY = "hicenter_routines_data";

export interface RoutineTask {
  id: string;
  kind: "morning" | "evening";
  label: string;
  done: boolean;
}

export const INITIAL_SERVICE_TASKS: TaskItem[] = [
  {
    id: "ht1",
    title: "Calculus BC Problem Set 9 (Problems 12–24)",
    subject: "Math",
    dueTime: "Now",
    timeEstimate: "40 min",
    duePeriod: "Now",
    completed: false,
    notes: "Active Target",
  },
  {
    id: "ht2",
    title: "Revise Physics lab methodology section",
    subject: "Physics",
    dueTime: "Now",
    timeEstimate: "20 min",
    duePeriod: "Now",
    completed: false,
  },
  {
    id: "ht3",
    title: "Review AP Macroeconomics formulas & graphs",
    subject: "Economics",
    dueTime: "Completed at 11:20 AM",
    timeEstimate: "15 min",
    duePeriod: "Now",
    completed: true,
  },
  {
    id: "ht4",
    title: "Read Literature Ch. 6–8 (The Great Gatsby)",
    subject: "English",
    dueTime: "Thursday",
    timeEstimate: "45 min",
    duePeriod: "Next",
    completed: false,
  },
  {
    id: "ht5",
    title: "Draft History essay thesis & outline",
    subject: "History",
    dueTime: "Friday",
    timeEstimate: "35 min",
    duePeriod: "Next",
    completed: false,
  },
  {
    id: "ht6",
    title: "Prepare Chemistry term project proposal",
    subject: "Chemistry",
    dueTime: "Next week",
    timeEstimate: "50 min",
    duePeriod: "Later",
    completed: false,
  },
];

export const INITIAL_SERVICE_ROUTINES: RoutineTask[] = [
  { id: "mr1", kind: "morning", label: "Review Today's Now Tasks in HiTime", done: true },
  { id: "mr2", kind: "morning", label: "Check Physics Lab Uncertainty Calculations", done: true },
  { id: "mr3", kind: "morning", label: "Prepare Calculus Problem Set 9 Materials", done: false },
  { id: "er1", kind: "evening", label: "Log completed tasks & update Next/Later queue", done: false },
  { id: "er2", kind: "evening", label: "Review verified notes in HiSchool for tomorrow", done: false },
  { id: "er3", kind: "evening", label: "Set top 2 priority focus goals for tomorrow morning", done: false },
];

export const taskService = {
  getTasks(): TaskItem[] {
    if (typeof window === "undefined") return INITIAL_SERVICE_TASKS;
    try {
      const saved = localStorage.getItem(TASKS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load tasks", e);
    }
    return INITIAL_SERVICE_TASKS;
  },

  saveTasks(tasks: TaskItem[]): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    }
  },

  addTask(task: Omit<TaskItem, "id">): TaskItem {
    const current = this.getTasks();
    const newTask: TaskItem = {
      ...task,
      id: `task_${Date.now()}`,
    };
    const updated = [newTask, ...current];
    this.saveTasks(updated);
    return newTask;
  },

  toggleTask(id: string): TaskItem[] {
    const current = this.getTasks();
    const updated = current.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    this.saveTasks(updated);
    return updated;
  },

  deleteTask(id: string): TaskItem[] {
    const current = this.getTasks();
    const updated = current.filter((t) => t.id !== id);
    this.saveTasks(updated);
    return updated;
  },

  getChecklistRoutines(): RoutineTask[] {
    if (typeof window === "undefined") return INITIAL_SERVICE_ROUTINES;
    try {
      const saved = localStorage.getItem(ROUTINES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load routines", e);
    }
    return INITIAL_SERVICE_ROUTINES;
  },

  toggleRoutine(id: string): RoutineTask[] {
    const current = this.getChecklistRoutines();
    const updated = current.map((r) =>
      r.id === id ? { ...r, done: !r.done } : r
    );
    if (typeof window !== "undefined") {
      localStorage.setItem(ROUTINES_STORAGE_KEY, JSON.stringify(updated));
    }
    return updated;
  },
};

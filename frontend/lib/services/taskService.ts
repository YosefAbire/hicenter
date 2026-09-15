import { TaskItem } from "@/lib/mockData";
import { api } from "@/lib/api";

const TASKS_STORAGE_KEY = "hicenter_tasks_data";
const ROUTINES_STORAGE_KEY = "hicenter_routines_data";

export interface RoutineTask {
  id: string;
  kind: "morning" | "evening";
  label: string;
  done: boolean;
  time?: string;
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

    // Sync asynchronously to backend REST API if server available
    api<any>("/hitime/tasks/", {
      method: "POST",
      body: JSON.stringify({
        title: task.title,
        subject: task.subject,
        due_period: task.duePeriod.toLowerCase(),
        estimated_minutes: parseInt(task.timeEstimate) || 25,
        completed: task.completed,
      }),
    }).catch(() => {});

    return newTask;
  },

  toggleTask(id: string): TaskItem[] {
    const current = this.getTasks();
    const updated = current.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    this.saveTasks(updated);

    const target = updated.find(t => t.id === id);
    if (target && !id.startsWith("task_")) {
      api<any>(`/hitime/tasks/${id}/`, {
        method: "PATCH",
        body: JSON.stringify({ completed: target.completed }),
      }).catch(() => {});
    }

    return updated;
  },

  deleteTask(id: string): TaskItem[] {
    const current = this.getTasks();
    const updated = current.filter((t) => t.id !== id);
    this.saveTasks(updated);

    if (!id.startsWith("task_")) {
      api<any>(`/hitime/tasks/${id}/`, {
        method: "DELETE",
      }).catch(() => {});
    }

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
    const target = current.find((r) => r.id === id);
    const updated = current.map((r) =>
      r.id === id ? { ...r, done: !r.done } : r
    );
    if (typeof window !== "undefined") {
      localStorage.setItem(ROUTINES_STORAGE_KEY, JSON.stringify(updated));
    }

    if (target) {
      const numId = parseInt(id.replace("mr", "").replace("er", "")) || 1;
      api<any>(`/hitime/routines/${numId}/`, {
        method: "PATCH",
        body: JSON.stringify({ done: !target.done }),
      }).catch(() => {});
    }

    return updated;
  },

  async logFocusSession(mode: string, durationMinutes: number): Promise<void> {
    try {
      await api<any>("/hitime/sessions/", {
        method: "POST",
        body: JSON.stringify({ mode, duration_minutes: durationMinutes }),
      });
    } catch (e) {
      console.warn("Failed to log focus session to backend");
    }
  },


  async syncWithBackend(): Promise<TaskItem[]> {
    try {
      const apiTasks = await api<any[]>("/hitime/tasks/");
      if (Array.isArray(apiTasks) && apiTasks.length > 0) {
        const mapped: TaskItem[] = apiTasks.map((t) => ({
          id: String(t.id),
          title: t.title,
          subject: t.subject || "General",
          dueTime: "Today",
          timeEstimate: `${t.estimated_minutes || 25} min`,
          duePeriod: (t.due_period ? t.due_period.charAt(0).toUpperCase() + t.due_period.slice(1) : "Now") as any,
          completed: Boolean(t.completed),
        }));
        this.saveTasks(mapped);
        return mapped;
      }
    } catch (e) {
      console.log("Using offline task persistence.");
    }
    return this.getTasks();
  },
};

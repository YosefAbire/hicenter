import { api } from "@/lib/api";
import { TaskItem } from "@/lib/mockData";
import { taskService } from "./taskService";

export interface SubjectMastery {
  subject: string;
  masteryScore: number;
  totalAttempts: number;
  weakTopics: string[];
}

export interface LearningLoopRecommendation {
  subject: string;
  current_mastery: number;
  focus_area: string;
  actionable_task_title: string;
  recommended_duration_minutes: number;
  due_period: string;
  rationale: string;
}

export interface LearningLoopResponse {
  user_id: number;
  recommendations: LearningLoopRecommendation[];
  overall_loop_advice: string;
}

export const INITIAL_MASTERIES: SubjectMastery[] = [
  { subject: "AP Chemistry", masteryScore: 65, totalAttempts: 3, weakTopics: ["Equilibrium & Le Chatelier Principle"] },
  { subject: "AP Calculus", masteryScore: 92, totalAttempts: 5, weakTopics: ["Taylor Series Error Bounds"] },
  { subject: "Physics", masteryScore: 80, totalAttempts: 2, weakTopics: ["Thermodynamics"] },
];

export const INITIAL_RECOMMENDATIONS: LearningLoopRecommendation[] = [
  {
    subject: "AP Chemistry",
    current_mastery: 65,
    focus_area: "Equilibrium & Le Chatelier Principle",
    actionable_task_title: "Review AP Chemistry notes & solve 3 diagnostic problems on Equilibrium",
    recommended_duration_minutes: 45,
    due_period: "Now",
    rationale: "Current mastery is 65%. Immediate targeted practice on Equilibrium will restore mastery above 80%.",
  },
  {
    subject: "Physics",
    current_mastery: 80,
    focus_area: "Thermodynamics",
    actionable_task_title: "Conduct 25-min active recall sprint on Thermodynamics",
    recommended_duration_minutes: 30,
    due_period: "Next",
    rationale: "Mastery is solid at 80%. Reinforce Thermodynamics to push mastery past 90%.",
  }
];

export const learningLoopService = {
  async fetchMastery(): Promise<SubjectMastery[]> {
    try {
      const data = await api<any[]>("/learning-loop/mastery");
      if (Array.isArray(data) && data.length > 0) {
        return data.map((m) => ({
          subject: m.subject,
          masteryScore: m.masteryScore ?? m.mastery_score ?? 75,
          totalAttempts: m.totalAttempts ?? m.total_attempts ?? 1,
          weakTopics: m.weakTopics || m.weak_topics || [],
        }));
      }
    } catch (e) {
      console.warn("Using default subject masteries fallback");
    }
    return INITIAL_MASTERIES;
  },

  async fetchRecommendations(): Promise<LearningLoopResponse> {
    try {
      const res = await api<any>("/learning-loop/recommendations");
      if (res && res.recommendations) {
        return {
          user_id: res.user_id || 1,
          recommendations: res.recommendations,
          overall_loop_advice: res.overall_loop_advice || "Prioritize 'Now' queue tasks to boost mastery.",
        };
      }
    } catch (e) {
      console.warn("Using default learning loop recommendations fallback");
    }
    return {
      user_id: 1,
      recommendations: INITIAL_RECOMMENDATIONS,
      overall_loop_advice: "Loop Active: Practice quizzes trigger real-time AI study tasks in HiTime.",
    };
  },

  async convertRecommendationToTask(rec: LearningLoopRecommendation): Promise<TaskItem> {
    try {
      const created = await api<any>("/learning-loop/tasks/convert", {
        method: "POST",
        body: JSON.stringify({
          subject: rec.subject,
          taskTitle: rec.actionable_task_title,
          duePeriod: rec.due_period.toLowerCase(),
          estimatedMinutes: rec.recommended_duration_minutes,
          notes: `AI Recommendation Rationale: ${rec.rationale}`,
        }),
      });

      const newTask: TaskItem = {
        id: String(created.id || Date.now()),
        title: created.title || rec.actionable_task_title,
        subject: created.subject || rec.subject,
        dueTime: "Now",
        timeEstimate: `${rec.recommended_duration_minutes} min`,
        duePeriod: rec.due_period as any,
        completed: false,
        notes: rec.rationale,
      };

      // Keep local task service state in sync
      taskService.addTask(newTask);
      return newTask;
    } catch (e) {
      // Offline / fallback creation
      return taskService.addTask({
        title: rec.actionable_task_title,
        subject: rec.subject,
        dueTime: "Now",
        timeEstimate: `${rec.recommended_duration_minutes} min`,
        duePeriod: rec.due_period as any,
        completed: false,
        notes: rec.rationale,
      });
    }
  }
};

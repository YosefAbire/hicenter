import { api } from "@/lib/api";
import { TaskItem } from "@/lib/mockData";
import { taskService } from "./taskService";

export interface TopicMastery {
  topic: string;
  masteryScore: number;
  attemptsCount: number;
  lastScore: number;
}

export interface SubjectMastery {
  subject: string;
  masteryScore: number;
  totalAttempts: number;
  topicMasteries: TopicMastery[];
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
  {
    subject: "Physics",
    masteryScore: 65,
    totalAttempts: 10,
    topicMasteries: [
      { topic: "Kinematics", masteryScore: 82, attemptsCount: 3, lastScore: 82 },
      { topic: "Newton's Laws", masteryScore: 61, attemptsCount: 2, lastScore: 60 },
      { topic: "Energy", masteryScore: 74, attemptsCount: 4, lastScore: 75 },
      { topic: "Momentum", masteryScore: 43, attemptsCount: 1, lastScore: 40 },
    ],
    weakTopics: ["Momentum", "Newton's Laws"],
  },
  {
    subject: "AP Chemistry",
    masteryScore: 77,
    totalAttempts: 10,
    topicMasteries: [
      { topic: "Equilibrium", masteryScore: 65, attemptsCount: 3, lastScore: 65 },
      { topic: "Thermodynamics", masteryScore: 78, attemptsCount: 2, lastScore: 80 },
      { topic: "Stoichiometry", masteryScore: 90, attemptsCount: 5, lastScore: 92 },
    ],
    weakTopics: ["Equilibrium"],
  },
  {
    subject: "AP Calculus",
    masteryScore: 92,
    totalAttempts: 9,
    topicMasteries: [
      { topic: "Taylor Series", masteryScore: 92, attemptsCount: 5, lastScore: 95 },
      { topic: "Integration", masteryScore: 92, attemptsCount: 4, lastScore: 90 },
    ],
    weakTopics: [],
  },
];

export const INITIAL_RECOMMENDATIONS: LearningLoopRecommendation[] = [
  {
    subject: "Physics",
    current_mastery: 43,
    focus_area: "Momentum",
    actionable_task_title: "Review Physics notes & solve 3 problems on Momentum",
    recommended_duration_minutes: 45,
    due_period: "Now",
    rationale: "Topic mastery in Momentum is 43%. Targeted active recall will restore topic performance.",
  },
  {
    subject: "AP Chemistry",
    current_mastery: 65,
    focus_area: "Equilibrium",
    actionable_task_title: "Review AP Chemistry notes & solve 3 diagnostic problems on Equilibrium",
    recommended_duration_minutes: 30,
    due_period: "Next",
    rationale: "Current mastery is 65%. Immediate targeted practice on Equilibrium will restore mastery above 80%.",
  }
];

export const learningLoopService = {
  async fetchMastery(): Promise<SubjectMastery[]> {
    try {
      const data = await api<any[]>("/learning-loop/mastery");
      if (Array.isArray(data) && data.length > 0) {
        return data.map((m) => ({
          subject: m.subject,
          masteryScore: m.overallMastery ?? m.overall_mastery ?? m.masteryScore ?? 75,
          totalAttempts: m.totalAssessmentsCompleted ?? m.totalAttempts ?? 1,
          topicMasteries: (m.topicMasteries || m.topic_masteries || []).map((t: any) => ({
            topic: t.topic,
            masteryScore: t.masteryScore ?? t.mastery_score ?? 70,
            attemptsCount: t.attemptsCount ?? t.attempts_count ?? 1,
            lastScore: t.lastScore ?? t.last_score ?? 70,
          })),
          weakTopics: m.recommendedFocusAreas || m.weakTopics || m.weak_topics || [],
        }));
      }
    } catch (_e) {
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

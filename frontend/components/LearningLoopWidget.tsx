"use client";

import React, { useEffect, useState } from "react";
import {
  SubjectMastery,
  LearningLoopRecommendation,
  learningLoopService,
} from "@/lib/services/learningLoopService";
import { Brain, Sparkles, CheckCircle2, ArrowRight, Zap, Target, BookOpen } from "lucide-react";

interface Props {
  onTaskConverted?: () => void;
}

export const LearningLoopWidget: React.FC<Props> = ({ onTaskConverted }) => {
  const [masteries, setMasteries] = useState<SubjectMastery[]>([]);
  const [recommendations, setRecommendations] = useState<LearningLoopRecommendation[]>([]);
  const [advice, setAdvice] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [convertingSubject, setConvertingSubject] = useState<string | null>(null);
  const [convertedSubjects, setConvertedSubjects] = useState<Set<string>>(new Set());

  const loadLoopData = async () => {
    setLoading(true);
    try {
      const [mList, recData] = await Promise.all([
        learningLoopService.fetchMastery(),
        learningLoopService.fetchRecommendations(),
      ]);
      setMasteries(mList);
      setRecommendations(recData.recommendations);
      setAdvice(recData.overall_loop_advice);
    } catch (e) {
      console.error("Failed to load learning loop data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoopData();
  }, []);

  const handleConvert = async (rec: LearningLoopRecommendation) => {
    setConvertingSubject(rec.subject);
    try {
      await learningLoopService.convertRecommendationToTask(rec);
      setConvertedSubjects((prev) => new Set(prev).add(rec.subject));
      if (onTaskConverted) onTaskConverted();
    } catch (e) {
      console.error("Failed to convert task", e);
    } finally {
      setConvertingSubject(null);
    }
  };

  const getMasteryBadgeColor = (score: number) => {
    if (score < 70) return "text-rose-400 bg-rose-500/10 border-rose-500/20";
    if (score < 85) return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  };

  const getMasteryBarGradient = (score: number) => {
    if (score < 70) return "from-rose-500 to-amber-500";
    if (score < 85) return "from-amber-500 to-emerald-500";
    return "from-emerald-500 to-cyan-500";
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md text-white mb-8">
      {/* Loop Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-400">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Learning Intelligence Loop
              </h3>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Live RAG Telemetry
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Closed-loop feedback connecting study, assessment, AI recommendation, and HiTime tasks.
            </p>
          </div>
        </div>

        {/* Visual Pipeline Flow indicator */}
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="text-indigo-300">Study</span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-purple-300">Quiz</span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-emerald-300">Mastery</span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-amber-300">AI Task</span>
        </div>
      </div>

      {advice && (
        <div className="mb-6 bg-indigo-950/40 border border-indigo-500/20 rounded-xl p-3.5 flex items-start gap-3 text-xs text-indigo-200">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>{advice}</span>
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center text-sm text-slate-400 flex items-center justify-center gap-2">
          <Zap className="w-4 h-4 animate-spin text-indigo-400" />
          <span>Calculating subject mastery telemetry & generating AI study tasks...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section 1: Subject Mastery Meters */}
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                Live Subject Mastery Tracker
              </h4>
              <span className="text-xs text-slate-400">{masteries.length} Subjects Evaluated</span>
            </div>

            <div className="space-y-4">
              {masteries.map((m, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300 font-semibold">{m.subject}</span>
                    <div className="flex items-center gap-2">
                      {m.weakTopics.length > 0 && (
                        <span className="text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                          Weak Area: {m.weakTopics[0]}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 text-xs rounded border ${getMasteryBadgeColor(m.masteryScore)}`}>
                        {m.masteryScore}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden p-0.5 border border-slate-700/50">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${getMasteryBarGradient(m.masteryScore)} transition-all duration-700`}
                      style={{ width: `${m.masteryScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: AI Recommended Actionable Tasks */}
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                AI Recommended Study Tasks
              </h4>
              <span className="text-xs text-slate-400">Targeted Focus</span>
            </div>

            <div className="space-y-3">
              {recommendations.map((rec, idx) => {
                const isConverted = convertedSubjects.has(rec.subject);
                const isConverting = convertingSubject === rec.subject;

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        {rec.subject}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {rec.recommended_duration_minutes} min • Due: {rec.due_period}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 font-medium line-clamp-2">
                      {rec.actionable_task_title}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 mt-1">
                      <span className="text-[11px] text-slate-400 italic truncate max-w-[200px]">
                        {rec.rationale}
                      </span>

                      <button
                        onClick={() => handleConvert(rec)}
                        disabled={isConverted || isConverting}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                          isConverted
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default"
                            : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 active:scale-95"
                        }`}
                      >
                        {isConverted ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Added to HiTime</span>
                          </>
                        ) : isConverting ? (
                          <>
                            <Zap className="w-3.5 h-3.5 animate-spin" />
                            <span>Creating...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 text-amber-300" />
                            <span>Convert to HiTime Task</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

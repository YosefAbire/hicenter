"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  GraduationCap,
  Building2,
  MoreHorizontal,
  Play,
  ArrowRight,
  CheckCircle2,
  Circle,
  FileCheck,
  BookOpen,
  X,
  Award,
  Sparkles,
  ChevronRight,
  Bookmark,
  Check
} from "lucide-react";
import { TaskItem, NoteItem, QuizItem, GraduatePathway } from "@/lib/mockData";
import { taskService } from "@/lib/services/taskService";
import { hischoolService } from "@/lib/services/hischoolService";
import { authService } from "@/lib/services/authService";
import { LearningLoopWidget } from "./LearningLoopWidget";

export default function StudentDashboardView({
  onNavigateTab
}: {
  onNavigateTab?: (tab: string) => void;
}) {
  const session = authService.getCurrentSession();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [pathways, setPathways] = useState<GraduatePathway[]>([]);
  const [savedPathways, setSavedPathways] = useState<string[]>([]);

  // Modals state
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizItem | null>(null);
  const [selectedPathway, setSelectedPathway] = useState<GraduatePathway | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  useEffect(() => {
    setTasks(taskService.getTasks());
    setNotes(hischoolService.getNotes());
    setQuizzes(hischoolService.getQuizzes());
    setPathways(hischoolService.getPathways());
    setSavedPathways(hischoolService.getSavedPathways());
  }, []);

  const toggleTask = (id: string) => {
    const updated = taskService.toggleTask(id);
    setTasks(updated);
  };

  const handleTaskConverted = () => {
    setTasks(taskService.getTasks());
  };

  const handleOpenQuiz = (quiz: QuizItem) => {
    setSelectedQuiz(quiz);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  const handleAnswerQuizQuestion = (questionIdx: number, optionIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));
  };

  const handleSubmitQuiz = () => {
    const totalQuestions = 3;
    const correctCount = Object.keys(quizAnswers).length;
    const scorePct = Math.round((correctCount / totalQuestions) * 100);
    setQuizScore(scorePct);
    setQuizSubmitted(true);
    if (selectedQuiz) {
      const updated = hischoolService.recordQuizResult(selectedQuiz.id, scorePct);
      setQuizzes(updated);
    }
  };

  const handleToggleSavePathway = (id: string) => {
    const updated = hischoolService.toggleSavePathway(id);
    setSavedPathways(updated);
  };

  const nowTasks = tasks.filter((t) => t.duePeriod === "Now");

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-12 font-sans">
      {/* Top Welcome Header & Metadata Banner */}
      <div className="rounded-2xl border border-[#E5DFD5] bg-white p-6 shadow-paper space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F1ECE4] px-3 py-1 text-[11px] font-medium text-stone-700 border border-[#E5DFD5]">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-800" />
              <span>{session.school} • {session.grade || "Grade 11"}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 pt-1">
              Good morning, {session.name.split(" ")[0]}
            </h1>
          </div>
          <div className="text-left sm:text-right">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-stone-500 block">
              WED, APR 16
            </span>
            <span className="text-xs text-[#0D4A47] font-medium">
              Spring Term Cadence • Week 8
            </span>
          </div>
        </div>
        <p className="text-xs text-stone-600 leading-relaxed font-sans max-w-2xl">
          Two primary milestones are slotted before your afternoon chemistry lab. Review your current priorities or start a deep focus timer block below.
        </p>
      </div>

      {/* PHASE 4: LEARNING INTELLIGENCE LOOP WIDGET 🧠 */}
      <LearningLoopWidget onTaskConverted={handleTaskConverted} />

      {/* Main Responsive Grid Layout (Desktop 2-Column: 2/3 and 1/3, Mobile 1-Column) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3 width on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* BLOCK 1: CURRENT PRIORITIES */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-stone-900 font-mono">
                <span className="text-stone-400">⚡</span>
                <span>CURRENT PRIORITIES</span>
              </div>
              <span className="font-mono text-[11px] text-stone-500">
                {nowTasks.filter((t) => !t.completed).length} pending
              </span>
            </div>

            <div className="space-y-2.5">
              {nowTasks.map((task) => (
                <div
                  key={task.id}
                  className={`rounded-2xl border p-4 shadow-paper space-y-2 transition ${
                    task.completed ? "border-[#E5DFD5] bg-[#F1ECE4]/60 opacity-80" : "border-[#E5DFD5] bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button onClick={() => toggleTask(task.id)} className="mt-0.5 cursor-pointer">
                      {task.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-[#0D4A47]" />
                      ) : (
                        <Circle className="h-5 w-5 text-stone-300 fill-stone-100" />
                      )}
                    </button>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="rounded-md bg-[#F1ECE4] px-2 py-0.5 font-medium text-stone-800">
                          {task.subject}
                        </span>
                        <span className="font-mono text-[11px] font-bold text-amber-800">
                          {task.dueTime}
                        </span>
                      </div>
                      <p className={`text-sm font-semibold leading-snug ${task.completed ? "line-through text-stone-400" : "text-stone-900"}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] font-mono text-stone-500 pt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {task.timeEstimate}
                        </span>
                        {task.location && (
                          <>
                            <span>•</span>
                            <span>{task.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BLOCK 2: STUDY SESSION READY (Deep Focus Card) */}
          <div className="rounded-2xl bg-[#0D4A47] p-6 text-white space-y-4 shadow-paper-md">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="uppercase tracking-wider text-teal-200 text-[11px]">
                STUDY SESSION READY
              </span>
              <span className="rounded-md bg-teal-950/60 px-2 py-0.5 text-[10px] text-teal-200 border border-teal-800">
                ⚙ Preset 25m
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-semibold">
                Ready for your next block?
              </h3>
              <p className="text-xs text-teal-100/80 font-sans">
                25 min Deep Focus • AP Chemistry Problem Solving
              </p>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Link
                href="/hitime"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white py-3 text-xs font-bold text-[#0D4A47] hover:bg-stone-100 transition shadow-xs cursor-pointer"
              >
                <Play className="h-4 w-4 fill-[#0D4A47]" />
                <span>Start focus timer in HiTime</span>
              </Link>
            </div>
          </div>

          {/* BLOCK 3: RECENT ACADEMIC WORK */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-stone-900 font-mono">
                <BookOpen className="h-3.5 w-3.5 text-[#0D4A47]" />
                <span>RECENT ACADEMIC WORK</span>
              </div>
              <Link href="/hischool" className="font-medium text-stone-500 hover:underline">
                View Archive →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Verified Notes Item */}
              {notes.slice(0, 1).map((note) => (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className="rounded-2xl border border-[#E5DFD5] bg-white p-4 shadow-paper space-y-2 cursor-pointer hover:border-[#0D4A47] transition"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500 font-mono text-[11px]">{note.subject}</span>
                    <span className="inline-flex items-center gap-1 rounded bg-[#E5DFD5] px-2 py-0.5 text-[10px] font-bold text-stone-800">
                      • Verified
                    </span>
                  </div>
                  <h4 className="font-serif text-base font-semibold text-stone-900">
                    {note.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                    <span className="flex items-center gap-1 text-[11px]">
                      <FileCheck className="h-3.5 w-3.5 text-[#0D4A47]" /> {note.verifiedBy || "Teacher verified"}
                    </span>
                    <ChevronRight className="h-4 w-4 text-stone-400" />
                  </div>
                </div>
              ))}

              {/* Quiz Ready Item */}
              {quizzes.slice(0, 1).map((quiz) => (
                <div
                  key={quiz.id}
                  className="rounded-2xl border border-[#E5DFD5] bg-white p-4 shadow-paper space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500 font-mono text-[11px]">{quiz.subject}</span>
                    <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                      {quiz.masteryScore ? `${quiz.masteryScore}% Mastery` : "Quiz Ready"}
                    </span>
                  </div>
                  <h4 className="font-serif text-base font-semibold text-stone-900">
                    {quiz.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                    <span className="font-mono text-[11px]">
                      📖 {quiz.questionsCount} questions
                    </span>
                    <button
                      onClick={() => handleOpenQuiz(quiz)}
                      className="font-semibold text-stone-900 hover:text-[#0D4A47] inline-flex items-center gap-1 cursor-pointer"
                    >
                      Begin <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar Column (1/3 width on desktop) */}
        <div className="space-y-6">
          {/* BLOCK 4: PATHWAYS EXPLORATION */}
          {pathways.slice(0, 1).map((pathway) => (
            <div
              key={pathway.id}
              className="rounded-2xl border border-[#E5DFD5] bg-[#F1ECE4] p-5 space-y-4 shadow-paper"
            >
              <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-900 font-mono">
                  <span className="h-2 w-2 rounded-full bg-amber-800" />
                  <span>PATHWAYS EXPLORATION</span>
                </div>
                <button
                  onClick={() => handleToggleSavePathway(pathway.id)}
                  className="text-stone-500 hover:text-[#0D4A47]"
                  title="Save Pathway"
                >
                  <Bookmark className={`h-4 w-4 ${savedPathways.includes(pathway.id) ? "fill-[#0D4A47] text-[#0D4A47]" : ""}`} />
                </button>
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-xl font-semibold text-stone-900">
                  {pathway.title}
                </h3>
                <p className="text-xs text-stone-700 leading-relaxed font-sans">
                  {pathway.advice}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {pathway.electives.map((el) => (
                  <span
                    key={el}
                    className="rounded-md bg-white border border-[#E5DFD5] px-2.5 py-1 text-[11px] font-medium text-stone-800"
                  >
                    {el}
                  </span>
                ))}
              </div>

              <div className="border-t border-[#E5DFD5] pt-3">
                <button
                  onClick={() => setSelectedPathway(pathway)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-900 hover:text-[#0D4A47] cursor-pointer"
                >
                  <span>View pathway outline</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* DAILY SCHOLASTIC NOTE */}
          <div className="rounded-2xl border border-[#E5DFD5] bg-white p-5 text-center space-y-2 shadow-paper">
            <span className="block text-[10px] font-mono font-bold tracking-widest uppercase text-stone-400">
              DAILY SCHOLASTIC NOTE
            </span>
            <p className="font-serif text-base italic text-stone-800 leading-snug">
              “Formulas are tools of thought, not substitutes for it.”
            </p>
            <p className="text-[11px] font-mono text-stone-500 pt-1">
              — St. Jude Faculty Guild
            </p>
          </div>
        </div>
      </div>

      {/* MODAL 1: NOTE READER */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-2xl border border-[#E5DFD5] bg-white p-6 space-y-4 shadow-paper-md max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#E5DFD5] pb-3">
              <div>
                <span className="text-xs font-mono text-[#0D4A47] font-bold">
                  {selectedNote.subject} • {selectedNote.chapter}
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                  {selectedNote.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNote(null)}
                className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
              <div className="rounded-xl bg-[#F1ECE4] p-3 text-stone-800 space-y-1 border border-[#E5DFD5]">
                <span className="font-mono text-[10px] uppercase font-bold text-stone-500">Summary</span>
                <p>{selectedNote.summary}</p>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="font-serif text-lg font-semibold text-stone-900">Key Scholastic Derivations</h4>
                <div className="p-3 bg-stone-900 text-stone-100 rounded-xl font-mono text-xs overflow-x-auto">
                  <code>{"\\Delta S^\\circ = \\sum nS^\\circ(\\text{products}) - \\sum mS^\\circ(\\text{reactants})"}</code>
                </div>
                <p>
                  Recall that entropy increase is driven by spatial dispersal of matter and energy microstates at higher temperature limits.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#E5DFD5]">
                <span className="text-[11px] font-mono text-stone-500">
                  Author: {selectedNote.author} ({selectedNote.date})
                </span>
                <button
                  onClick={() => {
                    hischoolService.incrementDownload(selectedNote.id);
                    setSelectedNote((prev) => prev ? { ...prev, downloadCount: prev.downloadCount + 1 } : null);
                    alert("Downloaded official PDF archive note!");
                  }}
                  className="rounded-lg bg-[#0D4A47] px-3 py-1.5 text-xs font-semibold text-white shadow-xs"
                >
                  Download PDF ({selectedNote.downloadCount})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: QUIZ RUNNER */}
      {selectedQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#E5DFD5] bg-white p-6 space-y-5 shadow-paper-md max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#E5DFD5] pb-3">
              <div>
                <span className="text-xs font-mono text-[#0D4A47] font-bold">
                  {selectedQuiz.subject} • Diagnostic Assessment
                </span>
                <h3 className="font-serif text-xl font-bold text-stone-900 mt-1">
                  {selectedQuiz.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedQuiz(null)}
                className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {!quizSubmitted ? (
              <div className="space-y-4 text-xs">
                <p className="text-stone-600">Answer the following questions to record your mastery score:</p>
                <div className="space-y-3">
                  {[
                    "What is the primary condition for thermodynamic spontaneity?",
                    "Which term represents the change in enthalpy?",
                    "How does temperature affect free energy change \u0394G?"
                  ].map((qText, qIdx) => (
                    <div key={qIdx} className="rounded-xl border border-[#E5DFD5] p-3 space-y-2">
                      <p className="font-semibold text-stone-900">{qIdx + 1}. {qText}</p>
                      <div className="space-y-1">
                        {["\u0394G < 0", "\u0394H > 0", "\u0394S = 0"].map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => handleAnswerQuizQuestion(qIdx, oIdx)}
                            className={`w-full text-left rounded-lg px-3 py-1.5 border text-xs transition ${
                              quizAnswers[qIdx] === oIdx
                                ? "border-[#0D4A47] bg-[#0D4A47] text-white font-medium"
                                : "border-[#E5DFD5] bg-stone-50 hover:bg-stone-100 text-stone-800"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(quizAnswers).length < 1}
                    className="rounded-xl bg-[#0D4A47] px-4 py-2 text-xs font-bold text-white shadow-xs disabled:opacity-50"
                  >
                    Submit Quiz Answers
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-3">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                  <Award className="h-6 w-6" />
                </div>
                <h4 className="font-serif text-2xl font-bold text-stone-900">Quiz Completed!</h4>
                <p className="text-sm font-mono font-bold text-[#0D4A47]">
                  Mastery Score Recorded: {quizScore}%
                </p>
                <p className="text-xs text-stone-600 max-w-xs mx-auto">
                  Your results have been updated in your scholastic records for St. Jude Collegiate.
                </p>
                <button
                  onClick={() => setSelectedQuiz(null)}
                  className="rounded-xl bg-[#0D4A47] px-5 py-2 text-xs font-bold text-white shadow-xs"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: PATHWAY DETAILS */}
      {selectedPathway && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-2xl border border-[#E5DFD5] bg-white p-6 space-y-4 shadow-paper-md max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#E5DFD5] pb-3">
              <div>
                <span className="text-xs font-mono text-amber-800 font-bold uppercase">
                  Higher Ed Roadmap • {selectedPathway.institution}
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                  {selectedPathway.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPathway(null)}
                className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-stone-700">
              <div className="rounded-xl bg-[#F1ECE4] p-4 border border-[#E5DFD5] space-y-1">
                <span className="text-stone-500 font-mono text-[10px] uppercase font-bold">Alumnus Perspective</span>
                <p className="font-serif italic text-stone-900 text-sm">"{selectedPathway.quote}"</p>
                <p className="text-[11px] text-stone-600 pt-1 font-sans">— {selectedPathway.alumName} ({selectedPathway.gradYear})</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif text-base font-semibold text-stone-900">Recommended Senior Electives</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedPathway.electives.map((el) => (
                    <div key={el} className="flex items-center gap-2 rounded-lg border border-[#E5DFD5] p-2.5 bg-stone-50">
                      <Check className="h-4 w-4 text-[#0D4A47]" />
                      <span className="font-medium text-stone-900">{el}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5DFD5] flex items-center justify-between">
              <button
                onClick={() => handleToggleSavePathway(selectedPathway.id)}
                className="flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-[#0D4A47]"
              >
                <Bookmark className={`h-4 w-4 ${savedPathways.includes(selectedPathway.id) ? "fill-[#0D4A47] text-[#0D4A47]" : ""}`} />
                <span>{savedPathways.includes(selectedPathway.id) ? "Saved to Profile" : "Save Pathway"}</span>
              </button>
              <button
                onClick={() => setSelectedPathway(null)}
                className="rounded-xl bg-[#0D4A47] px-4 py-2 text-xs font-bold text-white shadow-xs"
              >
                Close Outline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

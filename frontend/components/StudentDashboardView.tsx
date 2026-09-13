"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  GraduationCap,
  Users,
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
    <div className="w-full max-w-md mx-auto space-y-6 pb-20 px-4 pt-2 font-sans">
      {/* Top Academic Header Bar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0D4A47] text-white font-serif text-lg font-bold">
              H
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-stone-900">
              HiCenter
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#E5DFD5] px-2.5 py-0.5 text-[11px] font-mono text-stone-700">
              Grades 11–12
            </span>
            <button className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5DFD5] bg-white text-stone-700">
              <Building2 className="h-4 w-4" />
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0D4A47] text-white font-semibold text-xs">
              {session.avatarInitials || "MC"}
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center rounded-xl bg-[#F1ECE4] p-1 text-xs font-semibold text-stone-700 border border-[#E5DFD5]">
          <button
            onClick={() => { if (onNavigateTab) onNavigateTab("today"); }}
            className="flex-1 rounded-lg py-2 text-center transition bg-white text-stone-900 shadow-xs"
          >
            Today
          </button>
          <button
            onClick={() => { if (onNavigateTab) onNavigateTab("hitime"); }}
            className="flex-1 rounded-lg py-2 text-center transition hover:text-stone-900"
          >
            HiTime
          </button>
          <button
            onClick={() => { if (onNavigateTab) onNavigateTab("hischool"); }}
            className="flex-1 rounded-lg py-2 text-center transition hover:text-stone-900"
          >
            HiSchool
          </button>
        </div>
      </div>

      {/* Greeting & Academic Metadata Pill */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F1ECE4] px-3 py-1 text-[11px] font-medium text-stone-700 border border-[#E5DFD5]">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-800" />
          <span>{session.school} • {session.grade || "Grade 11"}</span>
        </div>

        <div className="flex items-baseline justify-between pt-1">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-stone-900">
            Good morning, {session.name.split(" ")[0]}
          </h1>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-stone-500">
            WED, APR 16
          </span>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed font-sans">
          Two primary milestones are slotted before your afternoon chemistry lab.
        </p>
      </div>

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
                <button onClick={() => toggleTask(task.id)} className="mt-0.5">
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
      <div className="rounded-2xl bg-[#0D4A47] p-5 text-white space-y-4 shadow-paper-md">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="uppercase tracking-wider text-teal-200 text-[11px]">
            STUDY SESSION READY
          </span>
          <button className="flex items-center gap-1 rounded-md bg-teal-950/60 px-2 py-0.5 text-[10px] text-teal-200 border border-teal-800">
            <span>⚙ Preset</span>
          </button>
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
          <button
            onClick={() => { if (onNavigateTab) onNavigateTab("hitime"); }}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white py-3 text-xs font-bold text-[#0D4A47] hover:bg-stone-100 transition shadow-xs cursor-pointer"
          >
            <Play className="h-4 w-4 fill-[#0D4A47]" />
            <span>Start focus timer</span>
          </button>

          <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-950/70 text-white border border-teal-800 hover:bg-teal-950">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* BLOCK 3: RECENT ACADEMIC WORK */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-stone-900 font-mono">
            <BookOpen className="h-3.5 w-3.5 text-[#0D4A47]" />
            <span>RECENT ACADEMIC WORK</span>
          </div>
          <button onClick={() => { if (onNavigateTab) onNavigateTab("hischool"); }} className="font-medium text-stone-500 hover:underline">
            Archive
          </button>
        </div>

        <div className="space-y-2.5">
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
                  📖 {quiz.questionsCount} questions • ~{quiz.estimatedMinutes} min assessment
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
      <div className="text-center space-y-1 py-4 border-t border-[#E5DFD5]">
        <p className="font-serif text-base italic text-stone-800">
          “Formulas are tools of thought, not substitutes for it.”
        </p>
        <span className="block text-[10px] font-mono font-bold tracking-widest uppercase text-stone-400">
          DAILY SCHOLASTIC NOTE
        </span>
      </div>

      {/* MODAL 1: NOTE READER */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#E5DFD5] bg-white p-6 space-y-4 shadow-paper-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#E5DFD5] pb-3">
              <div>
                <span className="text-xs font-mono text-[#0D4A47] font-bold">
                  {selectedNote.subject} • {selectedNote.chapter}
                </span>
                <h3 className="font-serif text-xl font-bold text-stone-900 mt-1">
                  {selectedNote.title}
                </h3>
              </div>
              <button onClick={() => setSelectedNote(null)} className="text-stone-400 hover:text-stone-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-800 leading-relaxed">
              <p className="font-medium text-stone-900">{selectedNote.summary}</p>
              <div className="rounded-xl border border-[#E5DFD5] bg-[#F9F6F0] p-4 space-y-2 font-mono text-[11px]">
                <span className="block font-bold text-[#0D4A47]">Mathematical Derivation Proof:</span>
                <p>$$\Delta G^\circ = \Delta H^\circ - T\Delta S^\circ$$</p>
                <p>When $\Delta G^\circ &lt; 0$, reaction proceeds spontaneously under standard conditions.</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#E5DFD5] pt-3 text-xs">
              <span className="text-stone-500 font-mono">Downloads: {selectedNote.downloadCount}</span>
              <button
                onClick={() => {
                  hischoolService.incrementDownload(selectedNote.id);
                  alert(`Downloading PDF note: ${selectedNote.title}.pdf`);
                  setSelectedNote(null);
                }}
                className="rounded-xl bg-[#0D4A47] px-4 py-2 text-xs font-bold text-white shadow-xs"
              >
                Download Official PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: QUIZ RUNNER */}
      {selectedQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#E5DFD5] bg-white p-6 space-y-4 shadow-paper-md">
            <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-amber-800">
                  {selectedQuiz.subject} Diagnostic
                </span>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  {selectedQuiz.title}
                </h3>
              </div>
              <button onClick={() => setSelectedQuiz(null)} className="text-stone-400 hover:text-stone-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            {!quizSubmitted ? (
              <div className="space-y-4 text-xs">
                {/* Question 1 */}
                <div className="space-y-2 border-b border-[#F1ECE4] pb-3">
                  <p className="font-semibold text-stone-900">
                    1. Which equation represents the League of Nations covenant principle for collective security?
                  </p>
                  <div className="space-y-1">
                    {["Article X Covenant Clause", "Locarno Pact Section 4", "Dawes Plan Protocol"].map((opt, i) => (
                      <label key={opt} className="flex items-center gap-2 rounded-lg border border-[#E5DFD5] p-2 cursor-pointer hover:bg-[#F9F6F0]">
                        <input
                          type="radio"
                          name="q1"
                          checked={quizAnswers[0] === i}
                          onChange={() => handleAnswerQuizQuestion(0, i)}
                          className="text-[#0D4A47]"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSubmitQuiz}
                  className="w-full rounded-xl bg-[#0D4A47] py-2.5 font-bold text-white shadow-xs"
                >
                  Submit Diagnostic Assessment
                </button>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-lg font-mono">
                  {quizScore}%
                </div>
                <h4 className="font-serif text-xl font-bold text-stone-900">Assessment Completed</h4>
                <p className="text-xs text-stone-600">
                  Your mastery score of {quizScore}% has been recorded in your HiSchool scholar profile.
                </p>
                <button
                  onClick={() => setSelectedQuiz(null)}
                  className="rounded-xl bg-[#0D4A47] px-5 py-2 text-xs font-bold text-white"
                >
                  Close & View Summary
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: PATHWAY EXPLORER */}
      {selectedPathway && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#E5DFD5] bg-white p-6 space-y-4 shadow-paper-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#E5DFD5] pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-[#0D4A47]">
                  {selectedPathway.institution} • {selectedPathway.gradYear}
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                  {selectedPathway.title}
                </h3>
              </div>
              <button onClick={() => setSelectedPathway(null)} className="text-stone-400 hover:text-stone-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-800">
              <div className="rounded-xl border border-[#E5DFD5] bg-[#F9F6F0] p-4 italic font-serif text-stone-900">
                "{selectedPathway.quote}"
              </div>
              <p className="leading-relaxed">
                <strong className="font-bold text-stone-900">Academic Advice: </strong>
                {selectedPathway.advice}
              </p>

              <div>
                <h4 className="font-bold text-stone-900 uppercase font-mono text-[11px] mb-1.5">
                  RECOMMENDED ELECTIVES & PREREQUISITES
                </h4>
                <div className="space-y-1.5">
                  {selectedPathway.electives.map((e) => (
                    <div key={e} className="flex items-center gap-2 rounded-lg border border-[#E5DFD5] bg-[#F1ECE4] p-2">
                      <Check className="h-3.5 w-3.5 text-[#0D4A47]" />
                      <span className="font-medium text-stone-900">{e}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#E5DFD5] pt-3">
              <button
                onClick={() => handleToggleSavePathway(selectedPathway.id)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D4A47]"
              >
                <Bookmark className={`h-4 w-4 ${savedPathways.includes(selectedPathway.id) ? "fill-[#0D4A47]" : ""}`} />
                <span>{savedPathways.includes(selectedPathway.id) ? "Saved to Profile" : "Save Pathway"}</span>
              </button>
              <button
                onClick={() => setSelectedPathway(null)}
                className="rounded-xl bg-[#0D4A47] px-4 py-2 text-xs font-bold text-white"
              >
                Done Exploring
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM MOBILE NAVIGATION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E5DFD5] bg-white/95 backdrop-blur-md py-2 px-6 shadow-lg">
        <div className="mx-auto max-w-md flex items-center justify-between text-[11px]">
          <button
            onClick={() => { if (onNavigateTab) onNavigateTab("today"); }}
            className="flex flex-col items-center gap-1 text-[#0D4A47] font-bold"
          >
            <Calendar className="h-5 w-5" />
            <span>Today</span>
          </button>
          <button
            onClick={() => { if (onNavigateTab) onNavigateTab("hitime"); }}
            className="flex flex-col items-center gap-1 text-stone-400 hover:text-stone-700"
          >
            <Clock className="h-5 w-5" />
            <span>HiTime</span>
          </button>
          <button
            onClick={() => { if (onNavigateTab) onNavigateTab("hischool"); }}
            className="flex flex-col items-center gap-1 text-stone-400 hover:text-stone-700"
          >
            <GraduationCap className="h-5 w-5" />
            <span>HiSchool</span>
          </button>
          <button
            onClick={() => { if (onNavigateTab) onNavigateTab("roster"); }}
            className="flex flex-col items-center gap-1 text-stone-400 hover:text-stone-700"
          >
            <Users className="h-5 w-5" />
            <span>Roster</span>
          </button>
        </div>
      </div>
    </div>
  );
}

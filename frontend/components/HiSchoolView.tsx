"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Users,
  Compass,
  FileCheck,
  ArrowRight,
  Play,
  MessageSquare,
  Sparkles,
  ChevronRight,
  X,
  Search,
  Plus,
  Send,
  Bookmark,
  Check
} from "lucide-react";
import { NoteItem, QuizItem, StudyGroup, GraduatePathway } from "@/lib/mockData";
import { hischoolService, DiscussionPost } from "@/lib/services/hischoolService";

export default function HiSchoolView() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [circles, setCircles] = useState<StudyGroup[]>([]);
  const [pathways, setPathways] = useState<GraduatePathway[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedPathways, setSavedPathways] = useState<string[]>([]);

  // Active Modals & Drawers
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizItem | null>(null);
  const [activeCircle, setActiveCircle] = useState<StudyGroup | null>(null);
  const [discussions, setDiscussions] = useState<DiscussionPost[]>([]);
  const [newComment, setNewComment] = useState("");
  const [selectedPathway, setSelectedPathway] = useState<GraduatePathway | null>(null);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  useEffect(() => {
    setNotes(hischoolService.getNotes());
    setQuizzes(hischoolService.getQuizzes());
    setCircles(hischoolService.getCircles());
    setPathways(hischoolService.getPathways());
    setSavedPathways(hischoolService.getSavedPathways());
  }, []);

  const handleNoteDownload = (note: NoteItem) => {
    const updated = hischoolService.incrementDownload(note.id);
    setNotes(updated);
    alert(`Downloading official PDF note: ${note.title}.pdf`);
  };

  const handleOpenQuiz = (quiz: QuizItem) => {
    setSelectedQuiz(quiz);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  const handleSubmitQuiz = () => {
    const total = 3;
    const correct = Object.keys(quizAnswers).length;
    const pct = Math.round((correct / total) * 100);
    setQuizScore(pct);
    setQuizSubmitted(true);
    if (selectedQuiz) {
      const updated = hischoolService.recordQuizResult(selectedQuiz.id, pct);
      setQuizzes(updated);
    }
  };

  const handleRsvpCircle = (circleId: string) => {
    const updated = hischoolService.rsvpCircle(circleId);
    setCircles(updated);
    alert("RSVP Check-in confirmed! You have joined this study circle session.");
  };

  const handleOpenBoard = (circle: StudyGroup) => {
    setActiveCircle(circle);
    setDiscussions(hischoolService.getDiscussions(circle.id));
  };

  const handlePostDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !activeCircle) return;
    const updated = hischoolService.addDiscussionPost(activeCircle.id, "Maya Chen", "MC", newComment);
    setDiscussions(updated);
    setNewComment("");
  };

  const handleToggleSavePathway = (id: string) => {
    const updated = hischoolService.toggleSavePathway(id);
    setSavedPathways(updated);
  };

  const filteredNotes = notes.filter((n) => {
    const matchSubj = selectedSubject === "All" || n.subject.toLowerCase().includes(selectedSubject.toLowerCase());
    const matchSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubj && matchSearch;
  });

  return (
    <div className="w-full max-w-md mx-auto space-y-6 pb-20 px-4 pt-2 font-sans">
      {/* Top Academic Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-amber-800 font-mono">
            HISCHOOL CURRICULUM
          </span>
          <button className="flex items-center gap-1 rounded-md bg-[#F1ECE4] px-2.5 py-1 text-[11px] font-medium text-stone-700 border border-[#E5DFD5]">
            <span>📁 Term 2 Repositories</span>
          </button>
        </div>

        <div className="flex items-baseline justify-between">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-stone-900">
            Upper School Archive
          </h1>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes, chapters, equations..."
          className="w-full rounded-xl border border-[#E5DFD5] bg-white py-2.5 pl-10 pr-4 text-xs text-stone-900 placeholder-stone-400 focus:border-[#0D4A47] focus:outline-none"
        />
      </div>

      {/* Subject Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
        {["All", "Calculus", "Chemistry", "History"].map((subj) => (
          <button
            key={subj}
            onClick={() => setSelectedSubject(subj)}
            className={`rounded-full px-3.5 py-1.5 transition ${
              selectedSubject === subj
                ? "bg-[#0D4A47] text-white"
                : "bg-[#F1ECE4] text-stone-700 hover:bg-[#E5DFD5]"
            }`}
          >
            {subj === "All" ? "All Subjects •" : subj}
          </button>
        ))}
      </div>

      {/* SECTION 1: ANNOTATED CHAPTER NOTES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-stone-900 font-mono">
            <span className="h-2 w-2 rounded-full bg-amber-800" />
            <span>Annotated Chapter Notes</span>
          </div>
          <span className="font-mono text-stone-500 text-[11px]">{filteredNotes.length} available</span>
        </div>

        <div className="space-y-3">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="rounded-2xl border border-[#E5DFD5] bg-white p-4 space-y-2 shadow-paper hover:border-[#0D4A47] transition"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-amber-900 text-[11px]">
                  {note.subject} • {note.chapter}
                </span>
                {note.verified ? (
                  <span className="inline-flex items-center gap-1 rounded bg-[#F1ECE4] px-2 py-0.5 text-[10px] font-semibold text-stone-800">
                    <FileCheck className="h-3 w-3 text-[#0D4A47]" /> {note.verifiedBy || "Verified"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded bg-stone-200 px-2 py-0.5 text-[10px] font-semibold text-stone-700">
                    📝 Student draft • Peer Review
                  </span>
                )}
              </div>

              <h3 className="font-serif text-lg font-semibold text-stone-900">
                {note.title}
              </h3>

              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                {note.summary}
              </p>

              <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 pt-2 border-t border-[#F1ECE4]">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Downloads: {note.downloadCount}
                </span>
                <button
                  onClick={() => setSelectedNote(note)}
                  className="font-semibold text-stone-900 hover:text-[#0D4A47] flex items-center gap-1 cursor-pointer"
                >
                  <BookOpen className="h-3 w-3 text-[#0D4A47]" /> Read Notes
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: DIAGNOSTIC & PRACTICE QUIZZES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-stone-900 font-mono">
            <span className="h-2 w-2 rounded-full bg-[#0D4A47]" />
            <span>Diagnostic & Practice Quizzes</span>
          </div>
          <span className="font-mono text-[11px] text-stone-500">Untimed & Mock Modes</span>
        </div>

        <div className="space-y-2.5">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="rounded-2xl border border-[#E5DFD5] bg-white p-4 shadow-paper flex items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1ECE4] text-stone-800">
                  <BookOpen className="h-5 w-5 text-[#0D4A47]" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="font-bold text-amber-900">{quiz.subject}</span>
                    <span className="rounded bg-[#F1ECE4] px-1.5 py-0.5 text-[10px] text-stone-600">
                      {quiz.masteryScore ? `${quiz.masteryScore}% Achieved` : "Formative"}
                    </span>
                  </div>
                  <h4 className="font-serif text-base font-semibold text-stone-900">
                    {quiz.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 font-mono">
                    {quiz.questionsCount} questions • ~{quiz.estimatedMinutes} mins
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleOpenQuiz(quiz)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0D4A47] text-white cursor-pointer"
              >
                <Play className="h-4 w-4 fill-white ml-0.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: ACTIVE COHORT STUDY CIRCLES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-stone-900 font-mono">
            <span className="h-2 w-2 rounded-full bg-orange-600" />
            <span>Active Cohort Study Circles</span>
          </div>
        </div>

        <div className="space-y-2.5">
          {circles.map((circle) => (
            <div
              key={circle.id}
              className="rounded-2xl border border-[#E5DFD5] bg-white p-4 shadow-paper space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0D4A47] px-2.5 py-0.5 text-[10px] font-bold text-white">
                  ● {circle.is_live ? "Live Room" : "Async Room"}
                </span>
                <span className="text-stone-500 text-[11px]">🕒 {circle.nextSession}</span>
              </div>

              <div>
                <h4 className="font-serif text-lg font-semibold text-stone-900">
                  {circle.name}
                </h4>
                <p className="text-xs text-stone-600 font-sans">
                  Subject: {circle.subject} • Lead: {circle.lead}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-[#F1ECE4] pt-2">
                <span className="text-xs font-mono text-stone-500">
                  {circle.membersCount} active scholars
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRsvpCircle(circle.id)}
                    className="rounded-xl bg-[#0D4A47] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs cursor-pointer"
                  >
                    RSVP Check-in
                  </button>
                  <button
                    onClick={() => handleOpenBoard(circle)}
                    className="rounded-xl border border-[#E5DFD5] bg-[#F1ECE4] px-3 py-1.5 text-xs font-bold text-stone-800 cursor-pointer"
                  >
                    Open Board
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: GRADUATE PATHWAYS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-stone-900 font-mono">
            <Compass className="h-4 w-4 text-[#0D4A47]" />
            <span>Graduate Pathways Explorer</span>
          </div>
        </div>

        <div className="space-y-3">
          {pathways.map((pathway) => (
            <div
              key={pathway.id}
              className="rounded-2xl border border-[#E5DFD5] bg-[#F1ECE4] p-4 space-y-3 shadow-paper"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-900 font-bold">{pathway.institution}</span>
                <button
                  onClick={() => handleToggleSavePathway(pathway.id)}
                  className="text-stone-500 hover:text-[#0D4A47]"
                >
                  <Bookmark className={`h-4 w-4 ${savedPathways.includes(pathway.id) ? "fill-[#0D4A47] text-[#0D4A47]" : ""}`} />
                </button>
              </div>

              <h4 className="font-serif text-lg font-semibold text-stone-900">
                {pathway.title}
              </h4>
              <p className="text-xs text-stone-700 leading-relaxed font-serif italic">
                "{pathway.quote}"
              </p>

              <button
                onClick={() => setSelectedPathway(pathway)}
                className="w-full rounded-xl bg-[#0D4A47] py-2 text-xs font-bold text-white shadow-xs cursor-pointer"
              >
                Inspect Pathway & Prerequisites →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: NOTE READER */}
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
                onClick={() => handleNoteDownload(selectedNote)}
                className="rounded-xl bg-[#0D4A47] px-4 py-2 text-xs font-bold text-white shadow-xs cursor-pointer"
              >
                Download Official PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER: DISCUSSION BOARD */}
      {activeCircle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#E5DFD5] bg-white p-6 space-y-4 shadow-paper-md max-h-[85vh] flex flex-col">
            <div className="flex items-start justify-between border-b border-[#E5DFD5] pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-[#0D4A47]">
                  Whiteboard Discussion Thread
                </span>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  {activeCircle.name}
                </h3>
              </div>
              <button onClick={() => setActiveCircle(null)} className="text-stone-400 hover:text-stone-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {discussions.map((d) => (
                <div key={d.id} className="rounded-xl border border-[#E5DFD5] bg-[#F9F6F0] p-3 space-y-1 text-xs">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="font-bold text-stone-900">{d.author}</span>
                    <span className="text-stone-500">{d.timestamp}</span>
                  </div>
                  <p className="text-stone-800 leading-snug">{d.content}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handlePostDiscussion} className="flex gap-2 pt-2 border-t border-[#E5DFD5]">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Post math derivation or comment..."
                className="flex-1 rounded-xl border border-[#E5DFD5] bg-[#F9F6F0] p-2 text-xs text-stone-900 focus:border-[#0D4A47] focus:outline-none"
              />
              <button type="submit" className="rounded-xl bg-[#0D4A47] px-3 py-2 text-xs font-bold text-white">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PATHWAY DETAIL */}
      {selectedPathway && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#E5DFD5] bg-white p-6 space-y-4 shadow-paper-md">
            <div className="flex items-start justify-between border-b border-[#E5DFD5] pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-[#0D4A47]">
                  {selectedPathway.institution} • {selectedPathway.gradYear}
                </span>
                <h3 className="font-serif text-xl font-bold text-stone-900 mt-1">
                  {selectedPathway.title}
                </h3>
              </div>
              <button onClick={() => setSelectedPathway(null)} className="text-stone-400 hover:text-stone-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-800">
              <p className="font-serif italic text-stone-900 text-sm">
                "{selectedPathway.quote}"
              </p>
              <p className="leading-relaxed">
                <strong className="font-bold text-stone-900">Advice for Upper-Years: </strong>
                {selectedPathway.advice}
              </p>
              <div>
                <span className="font-bold uppercase font-mono text-[11px] text-stone-700 block mb-1">
                  ELECTIVES & PREREQUISITES:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPathway.electives.map((e) => (
                    <span key={e} className="rounded-md bg-[#F1ECE4] border border-[#E5DFD5] px-2.5 py-1 font-medium text-stone-800">
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedPathway(null)}
                className="rounded-xl bg-[#0D4A47] px-4 py-2 text-xs font-bold text-white"
              >
                Close Pathway Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

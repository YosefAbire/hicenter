"use client";

import { useState, useEffect } from "react";
import {
  Search,
  BookOpen,
  FileCheck,
  Award,
  Users,
  MessageSquare,
  GraduationCap,
  ChevronRight,
  Sparkles,
  Bookmark,
  X,
  Send,
  Plus
} from "lucide-react";
import { NoteItem, QuizItem, StudyGroup, GraduatePathway } from "@/lib/mockData";
import { hischoolService, DiscussionPost } from "@/lib/services/hischoolService";

export default function HiSchoolView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [circles, setCircles] = useState<StudyGroup[]>([]);
  const [pathways, setPathways] = useState<GraduatePathway[]>([]);
  const [savedPathways, setSavedPathways] = useState<string[]>([]);
  const [rsvpCircles, setRsvpCircles] = useState<string[]>([]);

  // Modals / Drawers
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizItem | null>(null);
  const [selectedCircle, setSelectedCircle] = useState<StudyGroup | null>(null);
  const [discussions, setDiscussions] = useState<DiscussionPost[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedPathway, setSelectedPathway] = useState<GraduatePathway | null>(null);

  useEffect(() => {
    setNotes(hischoolService.getNotes());
    setQuizzes(hischoolService.getQuizzes());
    setCircles(hischoolService.getCircles());
    setPathways(hischoolService.getPathways());
    setSavedPathways(hischoolService.getSavedPathways());
  }, []);

  const handleOpenCircleDrawer = (circle: StudyGroup) => {
    setSelectedCircle(circle);
    setDiscussions(hischoolService.getDiscussions(circle.id));
  };

  const handleToggleRsvp = (circleId: string) => {
    setRsvpCircles((prev) =>
      prev.includes(circleId) ? prev.filter((id) => id !== circleId) : [...prev, circleId]
    );
  };

  const handleAddDiscussionPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCircle || !newPostContent.trim()) return;
    const updated = hischoolService.addDiscussionPost(selectedCircle.id, "Maya Chen", "MC", newPostContent.trim());
    setDiscussions(updated);
    setNewPostContent("");
  };

  const handleToggleSavePathway = (id: string) => {
    const updated = hischoolService.toggleSavePathway(id);
    setSavedPathways(updated);
  };

  const filteredNotes = notes.filter((n) => {
    const matchSubject = selectedSubject === "all" || n.subject.toLowerCase().includes(selectedSubject);
    const matchSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubject && matchSearch;
  });

  const filteredQuizzes = quizzes.filter((q) => {
    const matchSubject = selectedSubject === "all" || q.subject.toLowerCase().includes(selectedSubject);
    const matchSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubject && matchSearch;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-12 font-sans">
      {/* Top Academic Header */}
      <div className="rounded-2xl border border-[#E5DFD5] bg-white p-6 shadow-paper space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="font-bold uppercase tracking-wider text-amber-800 font-mono text-xs">
            📚 HISCHOOL CURRICULUM ARCHIVE
          </span>
          <span className="rounded-md bg-[#F1ECE4] px-2.5 py-1 text-[11px] font-medium text-stone-700 border border-[#E5DFD5] self-start sm:self-auto">
            📁 Term 2 Repositories
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
            Upper School Archive & Learning Hub
          </h1>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed max-w-2xl font-sans">
          Access faculty-verified notes, formative practice quizzes, active cohort study circles, and university pathways.
        </p>

        {/* Search Bar */}
        <div className="relative pt-2">
          <Search className="pointer-events-none absolute left-3.5 top-5 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, chapters, equations, or quizzes..."
            className="w-full rounded-xl border border-[#E5DFD5] bg-stone-50 py-3 pl-10 pr-4 text-xs text-stone-900 placeholder-stone-400 focus:border-[#0D4A47] focus:outline-none"
          />
        </div>
      </div>

      {/* Subject Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
        {[
          { id: "all", label: "All Subjects •" },
          { id: "calculus", label: "AP Calculus" },
          { id: "chemistry", label: "AP Chemistry" },
          { id: "history", label: "Modern History" },
          { id: "physics", label: "Physics C" },
        ].map((chip) => (
          <button
            key={chip.id}
            onClick={() => setSelectedSubject(chip.id)}
            className={`whitespace-nowrap rounded-xl px-3 py-1.5 font-bold transition cursor-pointer ${
              selectedSubject === chip.id
                ? "bg-[#0D4A47] text-white shadow-xs"
                : "bg-white text-stone-700 border border-[#E5DFD5] hover:bg-stone-50"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Main Responsive Grid Layout (Desktop 2-Column: 2/3 and 1/3, Mobile 1-Column) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3 width on desktop): Notes & Quizzes */}
        <div className="lg:col-span-2 space-y-6">
          {/* SECTION 1: ANNOTATED CHAPTER NOTES */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-stone-900 font-mono">
                <BookOpen className="h-4 w-4 text-[#0D4A47]" />
                <span>ANNOTATED CHAPTER NOTES</span>
              </div>
              <span className="font-mono text-[11px] text-stone-500">
                {filteredNotes.length} Repository Items
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-2xl border border-[#E5DFD5] bg-white p-5 shadow-paper space-y-3 hover:border-[#0D4A47] transition flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[11px] text-stone-500">{note.subject}</span>
                      <span className="inline-flex items-center gap-1 rounded bg-[#E5DFD5] px-2 py-0.5 text-[10px] font-bold text-stone-800">
                        ✓ Verified
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-semibold leading-snug text-stone-900">
                      {note.title}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-2">
                      {note.summary}
                    </p>
                  </div>

                  <div className="border-t border-[#E5DFD5] pt-3 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-stone-500">
                      {note.author}
                    </span>
                    <button
                      onClick={() => setSelectedNote(note)}
                      className="font-bold text-[#0D4A47] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Read Notes</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: DIAGNOSTIC & PRACTICE QUIZZES */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-stone-900 font-mono">
                <Award className="h-4 w-4 text-[#0D4A47]" />
                <span>DIAGNOSTIC & PRACTICE QUIZZES</span>
              </div>
              <span className="font-mono text-[11px] text-stone-500">
                {filteredQuizzes.length} Quizzes Ready
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="rounded-2xl border border-[#E5DFD5] bg-white p-5 shadow-paper space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[11px] text-stone-500">{quiz.subject}</span>
                      <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        {quiz.masteryScore ? `${quiz.masteryScore}% Mastery` : "Quiz Ready"}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-semibold leading-snug text-stone-900">
                      {quiz.title}
                    </h3>
                    <p className="text-xs text-stone-500 font-mono">
                      📖 {quiz.questionsCount} Questions • ~{quiz.estimatedMinutes} min duration
                    </p>
                  </div>

                  <div className="border-t border-[#E5DFD5] pt-3">
                    <button
                      onClick={() => setSelectedQuiz(quiz)}
                      className="w-full rounded-xl bg-[#0D4A47] py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-950 transition cursor-pointer text-center"
                    >
                      Launch Formative Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar Column (1/3 width on desktop): Study Circles & Pathways */}
        <div className="space-y-6">
          {/* SECTION 3: ACTIVE COHORT STUDY CIRCLES */}
          <div className="rounded-2xl border border-[#E5DFD5] bg-white p-5 space-y-4 shadow-paper">
            <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-900 font-mono">
                <Users className="h-4 w-4 text-[#0D4A47]" />
                <span>STUDY CIRCLES</span>
              </div>
              <span className="font-mono text-[10px] text-stone-500">Live & Async</span>
            </div>

            <div className="space-y-3">
              {circles.map((circle) => (
                <div
                  key={circle.id}
                  className="rounded-xl border border-[#E5DFD5] bg-stone-50 p-4 space-y-2.5 hover:border-[#0D4A47] transition"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#0D4A47] px-2 py-0.5 text-[10px] font-bold text-white">
                      ● Active Room
                    </span>
                    <span className="text-stone-500 text-[11px]">{circle.nextSession}</span>
                  </div>

                  <div>
                    <h4 className="font-serif text-base font-semibold text-stone-900">
                      {circle.name}
                    </h4>
                    <p className="text-xs text-stone-600">
                      Lead: {circle.lead} • {circle.membersCount} Scholars
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleToggleRsvp(circle.id)}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition cursor-pointer ${
                        rsvpCircles.includes(circle.id)
                          ? "bg-emerald-800 text-white"
                          : "border border-[#E5DFD5] bg-white text-stone-800 hover:bg-stone-100"
                      }`}
                    >
                      {rsvpCircles.includes(circle.id) ? "✓ RSVP Confirmed" : "RSVP Check-in"}
                    </button>
                    <button
                      onClick={() => handleOpenCircleDrawer(circle)}
                      className="rounded-lg bg-[#0D4A47] px-3 py-1.5 text-xs font-semibold text-white shadow-xs cursor-pointer"
                    >
                      Open Board
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: GRADUATE PATHWAYS */}
          <div className="rounded-2xl border border-[#E5DFD5] bg-[#F1ECE4] p-5 space-y-4 shadow-paper">
            <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-900 font-mono">
                <GraduationCap className="h-4 w-4 text-amber-800" />
                <span>UNIVERSITY PATHWAYS</span>
              </div>
              <span className="font-mono text-[10px] text-stone-500">Alumni Roadmaps</span>
            </div>

            <div className="space-y-3">
              {pathways.slice(0, 2).map((pathway) => (
                <div key={pathway.id} className="rounded-xl bg-white border border-[#E5DFD5] p-4 space-y-2">
                  <h4 className="font-serif text-base font-semibold text-stone-900">{pathway.title}</h4>
                  <p className="text-xs text-stone-600 font-sans line-clamp-2">"{pathway.quote}"</p>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[11px] font-mono text-stone-500">{pathway.institution}</span>
                    <button
                      onClick={() => handleToggleSavePathway(pathway.id)}
                      className="text-xs font-bold text-[#0D4A47] hover:underline"
                    >
                      {savedPathways.includes(pathway.id) ? "Saved" : "Save Pathway"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL / DRAWER: DISCUSSION BOARD */}
      {selectedCircle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#E5DFD5] bg-white p-6 space-y-4 shadow-paper-md max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#E5DFD5] pb-3">
              <div>
                <span className="text-xs font-mono text-[#0D4A47] font-bold uppercase">
                  {selectedCircle.subject} • Study Circle Board
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                  {selectedCircle.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCircle(null)}
                className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {discussions.map((disc) => (
                  <div key={disc.id} className="rounded-xl border border-[#E5DFD5] bg-stone-50 p-3 space-y-1">
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="font-bold text-stone-800">{disc.author}</span>
                      <span className="text-stone-400">{disc.timestamp}</span>
                    </div>
                    <p className="text-stone-800 font-sans text-xs">{disc.content}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddDiscussionPost} className="pt-2 space-y-2">
                <textarea
                  rows={2}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share a thought or equation query with circle peers..."
                  className="w-full rounded-xl border border-[#E5DFD5] bg-stone-50 p-2.5 text-xs text-stone-900 focus:border-[#0D4A47] focus:outline-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#0D4A47] px-4 py-2 text-xs font-bold text-white shadow-xs cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Post Discussion</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NOTE READER */}
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
                  className="rounded-lg bg-[#0D4A47] px-3 py-1.5 text-xs font-semibold text-white shadow-xs cursor-pointer"
                >
                  Download PDF ({selectedNote.downloadCount})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

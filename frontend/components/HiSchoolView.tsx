"use client";

import { useState } from "react";
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
  Bookmark
} from "lucide-react";
import { INITIAL_NOTES, INITIAL_QUIZZES, INITIAL_STUDY_GROUPS, PRIMARY_PATHWAY } from "@/lib/mockData";

export default function HiSchoolView() {
  const [selectedSubject, setSelectedSubject] = useState("All");

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

      {/* Subject Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setSelectedSubject("All")}
          className={`rounded-full px-3.5 py-1.5 transition ${
            selectedSubject === "All"
              ? "bg-[#0D4A47] text-white"
              : "bg-[#F1ECE4] text-stone-700 hover:bg-[#E5DFD5]"
          }`}
        >
          All Subjects •
        </button>
        <button
          onClick={() => setSelectedSubject("Calculus")}
          className={`rounded-full px-3.5 py-1.5 transition ${
            selectedSubject === "Calculus"
              ? "bg-[#0D4A47] text-white"
              : "bg-[#F1ECE4] text-stone-700 hover:bg-[#E5DFD5]"
          }`}
        >
          AP Calculus
        </button>
        <button
          onClick={() => setSelectedSubject("Chemistry")}
          className={`rounded-full px-3.5 py-1.5 transition ${
            selectedSubject === "Chemistry"
              ? "bg-[#0D4A47] text-white"
              : "bg-[#F1ECE4] text-stone-700 hover:bg-[#E5DFD5]"
          }`}
        >
          AP Chemistry
        </button>
        <button
          onClick={() => setSelectedSubject("History")}
          className={`rounded-full px-3.5 py-1.5 transition ${
            selectedSubject === "History"
              ? "bg-[#0D4A47] text-white"
              : "bg-[#F1ECE4] text-stone-700 hover:bg-[#E5DFD5]"
          }`}
        >
          Modern History
        </button>
      </div>

      {/* SECTION 1: ANNOTATED CHAPTER NOTES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-stone-900 font-mono">
            <span className="h-2 w-2 rounded-full bg-amber-800" />
            <span>Annotated Chapter Notes</span>
          </div>
          <button className="font-medium text-stone-500 hover:underline">
            View all (42) →
          </button>
        </div>

        <div className="space-y-3">
          {/* Note Card 1 */}
          <div className="rounded-2xl border border-[#E5DFD5] bg-white p-4 space-y-2 shadow-paper">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-amber-900 text-[11px]">
                AP CHEMISTRY • UNIT 6
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-[#F1ECE4] px-2 py-0.5 text-[10px] font-semibold text-stone-800">
                <FileCheck className="h-3 w-3 text-[#0D4A47]" /> Verified by Mr. Davies
              </span>
            </div>

            <h3 className="font-serif text-lg font-semibold text-stone-900">
              Thermodynamics & Gibbs Free Energy
            </h3>

            <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
              Comprehensive synthesis of enthalpy, entropy changes ($\Delta S^\circ$), and spontaneous cell potential derivations.
            </p>

            <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 pt-2 border-t border-[#F1ECE4]">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> Updated yesterday • 9 min read
              </span>
              <button className="font-semibold text-stone-900 hover:text-[#0D4A47] flex items-center gap-1">
                <BookOpen className="h-3 w-3 text-[#0D4A47]" /> Read Notes
              </button>
            </div>
          </div>

          {/* Note Card 2 */}
          <div className="rounded-2xl border border-[#E5DFD5] bg-white p-4 space-y-2 shadow-paper">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-stone-700 text-[11px]">
                CALCULUS BC • INTEGRATION
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-[#F1ECE4] px-2 py-0.5 text-[10px] font-semibold text-stone-700">
                📝 Student draft • Peer Review
              </span>
            </div>

            <h3 className="font-serif text-lg font-semibold text-stone-900">
              Integration by Parts & Partial Fractions
            </h3>

            <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
              Heaviside cover-up method shortcuts, tabular integration formulas, and non-repeated irreducible quadratic factors.
            </p>

            <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 pt-2 border-t border-[#F1ECE4]">
              <span>👤 Maya S. & Leo K. • 3 peer annotations</span>
              <button className="font-semibold text-stone-900 hover:text-[#0D4A47]">
                💬 Collaborate
              </button>
            </div>
          </div>

          {/* Note Card 3 */}
          <div className="rounded-2xl border border-[#E5DFD5] bg-white p-4 space-y-2 shadow-paper">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-amber-900 text-[11px]">
                MODERN HISTORY • INTERWAR EUROPE
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-[#F1ECE4] px-2 py-0.5 text-[10px] font-semibold text-stone-800">
                <FileCheck className="h-3 w-3 text-[#0D4A47]" /> Verified by Ms. Vance
              </span>
            </div>

            <h3 className="font-serif text-lg font-semibold text-stone-900">
              Weimar Republic Economic Crisis
            </h3>

            <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
              Archival breakdown of 1923 hyperinflation, the Dawes Plan stabilization, and political fallout preceding 1929.
            </p>

            <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 pt-2 border-t border-[#F1ECE4]">
              <span>📖 Primary Sources Linked • 14 min read</span>
              <button className="font-semibold text-stone-900 hover:text-[#0D4A47]">
                📖 Read Notes
              </button>
            </div>
          </div>
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
          {/* Quiz 1 */}
          <div className="rounded-2xl border border-[#E5DFD5] bg-white p-4 shadow-paper flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1ECE4] text-stone-800">
                <BookOpen className="h-5 w-5 text-[#0D4A47]" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="font-bold text-amber-900">AP CHEMISTRY</span>
                  <span className="rounded bg-[#F1ECE4] px-1.5 py-0.5 text-[10px] text-stone-600">Formative</span>
                </div>
                <h4 className="font-serif text-base font-semibold text-stone-900">
                  Stoichiometry Self-Check
                </h4>
                <p className="text-[11px] text-stone-500 font-mono">
                  15 questions • Untimed • Immediate step explanations
                </p>
              </div>
            </div>
            <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0D4A47] text-white">
              <Play className="h-4 w-4 fill-white ml-0.5" />
            </button>
          </div>

          {/* Quiz 2 */}
          <div className="rounded-2xl border border-[#E5DFD5] bg-white p-4 shadow-paper flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1ECE4] text-stone-800">
                <BookOpen className="h-5 w-5 text-[#0D4A47]" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="font-bold text-stone-700">CALCULUS BC</span>
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">Timed Sprint</span>
                </div>
                <h4 className="font-serif text-base font-semibold text-stone-900">
                  Derivative Applications Mastery
                </h4>
                <p className="text-[11px] text-stone-500 font-mono">
                  10 questions • 20 mins • Mean Value & Optimization
                </p>
              </div>
            </div>
            <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0D4A47] text-white">
              <Play className="h-4 w-4 fill-white ml-0.5" />
            </button>
          </div>

          {/* Study Strategy Tip Card */}
          <div className="rounded-2xl border border-[#E5DFD5] bg-[#F1ECE4] p-4 flex items-center gap-3 shadow-paper">
            <div className="h-14 w-14 overflow-hidden rounded-xl shrink-0 bg-stone-300">
              <img
                src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=200&q=80"
                alt="Strategy Tip"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-0.5">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-800 font-mono">
                STUDY STRATEGY TIP
              </span>
              <p className="font-serif text-xs italic font-semibold text-stone-900 leading-snug">
                "Interleaving 20 minutes of stoichiometry calculations with history source checks improves dual-recall by 24%."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: ACTIVE COHORT STUDY CIRCLES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-stone-900 font-mono">
            <span className="h-2 w-2 rounded-full bg-orange-600" />
            <span>Active Cohort Study Circles</span>
          </div>
          <button className="font-medium text-stone-500 hover:underline">
            + Join Circle
          </button>
        </div>

        <div className="space-y-2.5">
          {/* Circle 1 */}
          <div className="rounded-2xl border border-[#E5DFD5] bg-white p-4 shadow-paper space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0D4A47] px-2.5 py-0.5 text-[10px] font-bold text-white">
                ● Live Room
              </span>
              <span className="text-stone-500 text-[11px]">🕒 Meets Today 4:15 PM</span>
            </div>

            <div>
              <h4 className="font-serif text-lg font-semibold text-stone-900">
                Chem AP Study Circle
              </h4>
              <p className="text-xs text-stone-600 font-sans">
                Room 304 & HiCenter Voice Session
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-[#F1ECE4] pt-2">
              <div className="flex items-center gap-1 text-xs text-stone-500 font-mono">
                <div className="flex -space-x-1.5 overflow-hidden">
                  <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-[#0D4A47] text-white text-[10px] font-bold flex items-center justify-center">EL</div>
                  <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-teal-800 text-white text-[10px] font-bold flex items-center justify-center">RM</div>
                  <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-amber-800 text-white text-[10px] font-bold flex items-center justify-center">JD</div>
                </div>
                <span className="ml-1 text-[11px]">+14 peers prep</span>
              </div>
              <button className="rounded-xl bg-[#0D4A47] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs">
                RSVP Check-in
              </button>
            </div>
          </div>

          {/* Circle 2 */}
          <div className="rounded-2xl border border-[#E5DFD5] bg-white p-4 shadow-paper space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F1ECE4] px-2.5 py-0.5 text-[10px] font-semibold text-stone-700">
                💬 Async Discussion
              </span>
              <span className="text-stone-500 text-[11px]">Active 12m ago</span>
            </div>

            <div>
              <h4 className="font-serif text-lg font-semibold text-stone-900">
                Calculus Problem Solvers
              </h4>
              <p className="text-xs text-stone-600 font-sans">
                Async whiteboard thread on Taylor series polynomial approximations
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-[#F1ECE4] pt-2">
              <div className="flex items-center gap-1 text-xs text-stone-500 font-mono">
                <span className="text-[11px]">+46 active scholars</span>
              </div>
              <button className="rounded-xl border border-[#E5DFD5] bg-[#F1ECE4] px-3.5 py-1.5 text-xs font-bold text-stone-800">
                Open Board
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: GRADUATE PATHWAYS & HIGHER ED ROADMAPS */}
      <div className="rounded-2xl border border-[#E5DFD5] bg-[#F1ECE4] p-5 space-y-4 shadow-paper">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-900 font-mono">
          <Compass className="h-4 w-4 text-[#0D4A47]" />
          <span>FUTURE TRAJECTORIES</span>
        </div>

        <div className="space-y-1">
          <h3 className="font-serif text-xl font-semibold text-stone-900">
            Graduate Pathways & Higher Ed Roadmaps
          </h3>
          <p className="text-xs text-stone-700 leading-relaxed font-sans">
            Explore 28 University Streams, prerequisite requirements, and student alumni course journeys tailored to Grade 11–12 matriculation.
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#E5DFD5]">
          <span className="text-xs font-mono font-medium text-stone-600">
            STEM • Humanities • Pre-Med
          </span>
          <button className="inline-flex items-center gap-1.5 rounded-xl bg-[#0D4A47] px-4 py-2 text-xs font-bold text-white shadow-xs">
            <span>Browse Pathways</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

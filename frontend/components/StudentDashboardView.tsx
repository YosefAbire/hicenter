"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  GraduationCap,
  Users,
  Building2,
  User,
  MoreHorizontal,
  Play,
  ArrowRight,
  CheckCircle2,
  Circle,
  FileCheck,
  BookOpen,
  Sparkles,
  ChevronRight
} from "lucide-react";
import {
  CURRENT_STUDENT,
  INITIAL_TASKS,
  INITIAL_NOTES,
  PRIMARY_PATHWAY,
  TaskItem
} from "@/lib/mockData";

export default function StudentDashboardView({
  onNavigateTab
}: {
  onNavigateTab?: (tab: string) => void;
}) {
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [activeTabNav, setActiveTabNav] = useState<"today" | "hitime" | "hischool">("today");

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 pb-20 px-4 pt-2">
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
              MC
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center rounded-xl bg-[#F1ECE4] p-1 text-xs font-semibold text-stone-700 border border-[#E5DFD5]">
          <button
            onClick={() => setActiveTabNav("today")}
            className={`flex-1 rounded-lg py-2 text-center transition ${
              activeTabNav === "today"
                ? "bg-white text-stone-900 shadow-xs"
                : "hover:text-stone-900"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => {
              setActiveTabNav("hitime");
              if (onNavigateTab) onNavigateTab("hitime");
            }}
            className={`flex-1 rounded-lg py-2 text-center transition ${
              activeTabNav === "hitime"
                ? "bg-white text-stone-900 shadow-xs"
                : "hover:text-stone-900"
            }`}
          >
            HiTime
          </button>
          <button
            onClick={() => {
              setActiveTabNav("hischool");
              if (onNavigateTab) onNavigateTab("hischool");
            }}
            className={`flex-1 rounded-lg py-2 text-center transition ${
              activeTabNav === "hischool"
                ? "bg-white text-stone-900 shadow-xs"
                : "hover:text-stone-900"
            }`}
          >
            HiSchool
          </button>
        </div>
      </div>

      {/* Greeting & Academic Metadata Pill */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F1ECE4] px-3 py-1 text-[11px] font-medium text-stone-700 border border-[#E5DFD5]">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-800" />
          <span>St. Jude Collegiate • Grade 11 (Spring Term)</span>
        </div>

        <div className="flex items-baseline justify-between pt-1">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-stone-900">
            Good morning, Maya
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
          <span className="font-mono text-[11px] text-stone-500">2 pending</span>
        </div>

        <div className="space-y-2.5">
          {/* Item 1 */}
          <div className="rounded-2xl border border-[#E5DFD5] bg-white p-4 shadow-paper space-y-2">
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggleTask("t1")}
                className="mt-0.5 text-stone-300 hover:text-[#0D4A47] transition"
              >
                {tasks[0].completed ? (
                  <CheckCircle2 className="h-5 w-5 text-[#0D4A47]" />
                ) : (
                  <Circle className="h-5 w-5 text-stone-300 fill-stone-100" />
                )}
              </button>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="rounded-md bg-[#F1ECE4] px-2 py-0.5 font-medium text-stone-800">
                    AP Chemistry
                  </span>
                  <span className="font-mono text-[11px] font-bold text-amber-800">
                    Due 2:00 PM
                  </span>
                </div>
                <p className={`text-sm font-semibold leading-snug ${tasks[0].completed ? "line-through text-stone-400" : "text-stone-900"}`}>
                  Complete AP Chemistry stoichiometry problem set 4
                </p>
                <div className="flex items-center gap-3 text-[11px] font-mono text-stone-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> 35m estimated
                  </span>
                  <span>•</span>
                  <span>Carrel Desk 4</span>
                </div>
              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="rounded-2xl border border-[#E5DFD5] bg-white p-4 shadow-paper space-y-2">
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggleTask("t2")}
                className="mt-0.5 text-stone-300 hover:text-[#0D4A47] transition"
              >
                {tasks[1]?.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-[#0D4A47]" />
                ) : (
                  <Circle className="h-5 w-5 text-stone-300 fill-stone-100" />
                )}
              </button>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="rounded-md bg-[#F1ECE4] px-2 py-0.5 font-medium text-stone-800">
                    European History
                  </span>
                  <span className="font-mono text-[11px] text-stone-500">
                    Next block
                  </span>
                </div>
                <p className={`text-sm font-semibold leading-snug ${tasks[1]?.completed ? "line-through text-stone-400" : "text-stone-900"}`}>
                  Review Chapter 8 notes on World War I treaties
                </p>
                <div className="flex items-center gap-3 text-[11px] font-mono text-stone-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> 25m estimated
                  </span>
                  <span>•</span>
                  <span>Primary Sources</span>
                </div>
              </div>
            </div>
          </div>
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
            onClick={() => {
              if (onNavigateTab) onNavigateTab("hitime");
            }}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white py-3 text-xs font-bold text-[#0D4A47] hover:bg-stone-100 transition shadow-xs"
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
          <div className="rounded-2xl border border-[#E5DFD5] bg-white p-4 shadow-paper space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500 font-mono text-[11px]">Mathematics</span>
              <span className="inline-flex items-center gap-1 rounded bg-[#E5DFD5] px-2 py-0.5 text-[10px] font-bold text-stone-800">
                • Verified
              </span>
            </div>
            <h4 className="font-serif text-base font-semibold text-stone-900">
              Calculus BC: Taylor Series Deriv...
            </h4>
            <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
              <span className="flex items-center gap-1 text-[11px]">
                <FileCheck className="h-3.5 w-3.5 text-[#0D4A47]" /> Dr. Aris verified notes • Period 3
              </span>
              <ChevronRight className="h-4 w-4 text-stone-400" />
            </div>
          </div>

          {/* Quiz Ready Item */}
          <div className="rounded-2xl border border-[#E5DFD5] bg-white p-4 shadow-paper space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500 font-mono text-[11px]">Social Sciences</span>
              <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                Quiz Ready
              </span>
            </div>
            <h4 className="font-serif text-base font-semibold text-stone-900">
              Modern European History: Lea...
            </h4>
            <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
              <span className="font-mono text-[11px]">
                📖 12 questions • ~15 min assessment
              </span>
              <button
                onClick={() => { if (onNavigateTab) onNavigateTab("hischool"); }}
                className="font-semibold text-stone-900 hover:text-[#0D4A47] inline-flex items-center gap-1"
              >
                Begin <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BLOCK 4: PATHWAYS EXPLORATION */}
      <div className="rounded-2xl border border-[#E5DFD5] bg-[#F1ECE4] p-5 space-y-4 shadow-paper">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-900 font-mono">
          <span className="h-2 w-2 rounded-full bg-amber-800" />
          <span>PATHWAYS EXPLORATION</span>
        </div>

        <div className="space-y-1">
          <h3 className="font-serif text-xl font-semibold text-stone-900">
            {PRIMARY_PATHWAY.title}
          </h3>
          <p className="text-xs text-stone-700 leading-relaxed font-sans">
            3 recommended Grade 12 electives & university prerequisite map are available for early review with your advisor.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {PRIMARY_PATHWAY.electives.map((el) => (
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
            onClick={() => { if (onNavigateTab) onNavigateTab("hischool"); }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-900 hover:text-[#0D4A47]"
          >
            <span>View pathway outline</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* DAILY SCHOLASTIC NOTE */}
      <div className="text-center space-y-1 py-4 border-t border-[#E5DFD5]">
        <p className="font-serif text-base italic text-stone-800">
          “Formulas are tools of thought, not substitutes for it.”
        </p>
        <span className="block text-[10px] font-mono font-bold tracking-widest uppercase text-stone-400">
          DAILY SCHOLASTIC NOTE
        </span>
      </div>

      {/* BOTTOM MOBILE NAVIGATION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E5DFD5] bg-white/95 backdrop-blur-md py-2 px-6 shadow-lg">
        <div className="mx-auto max-w-md flex items-center justify-between text-[11px]">
          <button
            onClick={() => setActiveTabNav("today")}
            className={`flex flex-col items-center gap-1 ${
              activeTabNav === "today" ? "text-[#0D4A47] font-bold" : "text-stone-400 hover:text-stone-700"
            }`}
          >
            <Calendar className="h-5 w-5" />
            <span>Today</span>
          </button>
          <button
            onClick={() => {
              setActiveTabNav("hitime");
              if (onNavigateTab) onNavigateTab("hitime");
            }}
            className={`flex flex-col items-center gap-1 ${
              activeTabNav === "hitime" ? "text-[#0D4A47] font-bold" : "text-stone-400 hover:text-stone-700"
            }`}
          >
            <Clock className="h-5 w-5" />
            <span>HiTime</span>
          </button>
          <button
            onClick={() => {
              setActiveTabNav("hischool");
              if (onNavigateTab) onNavigateTab("hischool");
            }}
            className={`flex flex-col items-center gap-1 ${
              activeTabNav === "hischool" ? "text-[#0D4A47] font-bold" : "text-stone-400 hover:text-stone-700"
            }`}
          >
            <GraduationCap className="h-5 w-5" />
            <span>HiSchool</span>
          </button>
          <button
            onClick={() => {
              if (onNavigateTab) onNavigateTab("roster");
            }}
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

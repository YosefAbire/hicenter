"use client";

import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import ActivateForm from "@/components/ActivateForm";
import StudentDashboardView from "@/components/StudentDashboardView";
import HiTimeView from "@/components/HiTimeView";
import HiSchoolView from "@/components/HiSchoolView";
import SchoolAdminRosterView from "@/components/SchoolAdminRosterView";
import PlatformAdminSchoolsView from "@/components/PlatformAdminSchoolsView";
import {
  Monitor,
  Smartphone,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  Lock
} from "lucide-react";

export default function ShowcaseView() {
  const [activeScreenIndex, setActiveScreenIndex] = useState(0); // Screen 1 default
  const [viewport, setViewport] = useState<"mobile" | "desktop">("mobile");

  const screens = [
    {
      id: "screen-1",
      number: 1,
      title: "Login",
      role: "Public / Student",
      module: "Authentication",
      component: <LoginForm />
    },
    {
      id: "screen-2",
      number: 2,
      title: "Activate Account",
      role: "Student",
      module: "Onboarding",
      component: <ActivateForm />
    },
    {
      id: "screen-3",
      number: 3,
      title: "Student Dashboard (Today)",
      role: "Student (Primary)",
      module: "HiCenter Today",
      component: (
        <StudentDashboardView
          onNavigateTab={(tab) => {
            if (tab === "hitime") setActiveScreenIndex(3);
            if (tab === "hischool") setActiveScreenIndex(4);
            if (tab === "roster") setActiveScreenIndex(5);
          }}
        />
      )
    },
    {
      id: "screen-4",
      number: 4,
      title: "HiTime (Planning & Focus)",
      role: "Student",
      module: "HiTime",
      component: <HiTimeView />
    },
    {
      id: "screen-5",
      number: 5,
      title: "HiSchool (Learning Hub)",
      role: "Student / Teacher",
      module: "HiSchool",
      component: <HiSchoolView />
    },
    {
      id: "screen-6",
      number: 6,
      title: "School Admin (Roster)",
      role: "School Admin",
      module: "Roster Management",
      component: <SchoolAdminRosterView />
    },
    {
      id: "screen-7",
      number: 7,
      title: "Platform Admin (Schools)",
      role: "Platform Admin",
      module: "Multi-Center Governance",
      component: <PlatformAdminSchoolsView />
    }
  ];

  const currentScreen = screens[activeScreenIndex];

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-stone-900 font-sans flex flex-col">
      {/* Top Academic Toolbar */}
      <header className="sticky top-0 z-50 border-b border-[#E5DFD5] bg-[#F9F6F0]/95 backdrop-blur-md py-3 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Brand & Gallery Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0D4A47] text-white font-serif text-xl font-bold shadow-xs">
              H
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-semibold text-stone-900">
                  HiCenter UI Design Showcase
                </h1>
                <span className="rounded-full bg-[#0D4A47]/10 px-2.5 py-0.5 text-xs font-semibold text-[#0D4A47]">
                  Grade 11–12
                </span>
              </div>
              <p className="text-xs text-stone-500 font-serif italic">
                Learn. Plan. Grow — at the center.
              </p>
            </div>
          </div>

          {/* Viewport Switcher Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl bg-[#F1ECE4] p-1 border border-[#E5DFD5] text-xs">
              <button
                onClick={() => setViewport("mobile")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                  viewport === "mobile"
                    ? "bg-white text-[#0D4A47] font-semibold shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <Smartphone className="h-4 w-4" />
                <span>Mobile Frame View</span>
              </button>
              <button
                onClick={() => setViewport("desktop")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                  viewport === "desktop"
                    ? "bg-white text-[#0D4A47] font-semibold shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <Monitor className="h-4 w-4" />
                <span>Desktop Full View</span>
              </button>
            </div>
          </div>
        </div>

        {/* Screen Selector Drawer Chips */}
        <div className="mx-auto max-w-7xl mt-3 flex overflow-x-auto gap-2 pb-1 text-xs">
          {screens.map((scr, idx) => (
            <button
              key={scr.id}
              onClick={() => setActiveScreenIndex(idx)}
              className={`shrink-0 rounded-xl px-3.5 py-2 transition border ${
                activeScreenIndex === idx
                  ? "bg-[#0D4A47] border-[#0D4A47] text-white font-semibold shadow-xs"
                  : "bg-white border-[#E5DFD5] text-stone-700 hover:bg-[#F1ECE4]"
              }`}
            >
              <span className="font-mono text-[11px] opacity-75 mr-1.5">
                0{scr.number}
              </span>
              <span>{scr.title}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Main Showcase Frame */}
      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Active Screen Sub-header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5DFD5] pb-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
                <span>Screen #{currentScreen.number} of 7</span>
                <span>•</span>
                <span className="font-semibold text-[#0D4A47]">{currentScreen.module}</span>
                <span>•</span>
                <span>Role: {currentScreen.role}</span>
              </div>
              <h2 className="mt-0.5 font-serif text-2xl font-semibold text-stone-900">
                {currentScreen.title}
              </h2>
            </div>

            <div className="text-xs text-stone-500 font-mono">
              Mode: <span className="uppercase font-bold text-stone-800">{viewport}</span>
            </div>
          </div>

          {/* Render Screen inside viewport */}
          {viewport === "mobile" ? (
            <div className="mx-auto max-w-sm rounded-[44px] border-[12px] border-stone-900 bg-[#F9F6F0] shadow-2xl p-2 min-h-[760px] overflow-y-auto">
              <div className="mx-auto w-24 h-4 bg-stone-900 rounded-full mb-3 opacity-90" />
              <div>{currentScreen.component}</div>
            </div>
          ) : (
            <div className="rounded-3xl border border-[#E5DFD5] bg-white p-6 sm:p-8 shadow-paper-md min-h-[600px]">
              {currentScreen.component}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5DFD5] bg-[#F1ECE4] py-4 text-center text-xs text-stone-600 font-mono">
        HiCenter Scholastic System • Parchment Warm #F9F6F0 • Deep Teal #0D4A47 • Stone #1C1917
      </footer>
    </div>
  );
}

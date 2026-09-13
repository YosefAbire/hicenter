"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Clock,
  LayoutDashboard,
  Users,
  Building2,
  Smartphone,
  Monitor,
  ShieldCheck,
  GraduationCap,
  LogOut
} from "lucide-react";
import { CURRENT_STUDENT } from "@/lib/mockData";

export default function AppShell({
  children,
  currentRole = "student",
  onRoleChange
}: {
  children: React.ReactNode;
  currentRole?: string;
  onRoleChange?: (role: string) => void;
}) {
  const pathname = usePathname();
  const [viewportMode, setViewportMode] = useState<"desktop" | "mobile">("desktop");

  const studentNav = [
    { href: "/dashboard", label: "Today", icon: LayoutDashboard },
    { href: "/hischool", label: "HiSchool", icon: BookOpen },
    { href: "/hitime", label: "HiTime", icon: Clock },
  ];

  const schoolAdminNav = [
    { href: "/school-admin/roster", label: "Student Roster", icon: Users },
  ];

  const platformAdminNav = [
    { href: "/platform/schools", label: "Schools Directory", icon: Building2 },
  ];

  const navItems =
    currentRole === "school_admin"
      ? schoolAdminNav
      : currentRole === "platform_admin"
      ? platformAdminNav
      : studentNav;

  return (
    <div className="min-h-screen bg-paper-100 text-stone-900 flex flex-col font-sans">
      {/* Top Academic Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-paper-300 bg-paper-50/90 backdrop-blur-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          {/* Brand Mark */}
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-900 text-white font-serif text-lg font-bold shadow-xs">
                H
              </div>
              <div>
                <span className="font-serif text-xl font-normal tracking-tight text-stone-900 group-hover:text-teal-900 transition">
                  HiCenter
                </span>
                <span className="hidden md:inline-block ml-2 text-[11px] font-serif italic text-stone-500">
                  Learn. Plan. Grow
                </span>
              </div>
            </Link>

            {/* Navigation Tabs */}
            <nav className="hidden sm:flex items-center gap-1 text-xs font-medium">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition ${
                      isActive
                        ? "bg-teal-900 text-white font-semibold shadow-xs"
                        : "text-stone-600 hover:bg-paper-200 hover:text-stone-900"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Account Info & Viewport Switcher */}
          <div className="flex items-center gap-3 text-xs">
            {/* Viewport Simulator Toggle */}
            <div className="hidden lg:flex items-center rounded-lg bg-paper-200 p-0.5 border border-paper-300">
              <button
                onClick={() => setViewportMode("desktop")}
                className={`flex items-center gap-1 rounded-md px-2 py-1 transition ${
                  viewportMode === "desktop"
                    ? "bg-white text-teal-900 font-medium shadow-xs"
                    : "text-stone-500 hover:text-stone-800"
                }`}
                title="Desktop Layout View"
              >
                <Monitor className="h-3.5 w-3.5" />
                <span className="text-[11px]">Desktop</span>
              </button>
              <button
                onClick={() => setViewportMode("mobile")}
                className={`flex items-center gap-1 rounded-md px-2 py-1 transition ${
                  viewportMode === "mobile"
                    ? "bg-white text-teal-900 font-medium shadow-xs"
                    : "text-stone-500 hover:text-stone-800"
                }`}
                title="Mobile Phone Frame View"
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span className="text-[11px]">Mobile</span>
              </button>
            </div>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 rounded-xl border border-paper-300 bg-white px-3 py-1.5 shadow-xs">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-900 text-[10px] font-semibold text-white">
                {CURRENT_STUDENT.avatarInitials}
              </div>
              <div className="hidden sm:block text-left text-[11px] leading-tight">
                <p className="font-semibold text-stone-900">{CURRENT_STUDENT.name}</p>
                <p className="text-stone-500 font-mono text-[10px]">
                  {CURRENT_STUDENT.school} • {CURRENT_STUDENT.grade}
                </p>
              </div>
            </div>

            <Link
              href="/login"
              className="text-stone-400 hover:text-stone-700 transition"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex sm:hidden border-t border-paper-200 px-4 py-2 justify-around bg-paper-100 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                  isActive ? "bg-teal-900 text-white font-medium" : "text-stone-600"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Content Area (supports optional Mobile Phone Simulator Frame) */}
      <main className="flex-1 py-8 px-4 sm:px-6">
        {viewportMode === "mobile" ? (
          <div className="mx-auto max-w-sm rounded-[40px] border-[12px] border-stone-800 bg-paper-100 shadow-2xl p-4 min-h-[720px] overflow-y-auto">
            <div className="mx-auto w-24 h-4 bg-stone-800 rounded-full mb-4 opacity-80" />
            {children}
          </div>
        ) : (
          <div className="mx-auto max-w-5xl">{children}</div>
        )}
      </main>

      {/* Academic Footer */}
      <footer className="border-t border-paper-300 bg-paper-50 py-6 text-center text-xs text-stone-500 font-serif italic">
        <div className="mx-auto max-w-5xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>HiCenter — Grade 11–12 Daily Academic Center</span>
          <span className="font-mono text-[11px] not-italic">School-Issued Enrolled Account</span>
        </div>
      </footer>
    </div>
  );
}

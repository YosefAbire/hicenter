"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Clock,
  LayoutDashboard,
  Users,
  Building2,
  LogOut
} from "lucide-react";
import { CURRENT_STUDENT } from "@/lib/mockData";

export default function AppShell({
  children,
  currentRole = "student",
}: {
  children: React.ReactNode;
  currentRole?: string;
  onRoleChange?: (role: string) => void;
}) {
  const pathname = usePathname();

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
      <header className="sticky top-0 z-40 border-b border-paper-300 bg-paper-50/95 backdrop-blur-xs shadow-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          {/* Brand Mark */}
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0D4A47] text-white font-serif text-lg font-bold shadow-xs">
                H
              </div>
              <div>
                <span className="font-serif text-xl font-medium tracking-tight text-stone-900 group-hover:text-[#0D4A47] transition">
                  HiCenter
                </span>
                <span className="hidden md:inline-block ml-2.5 text-xs font-serif italic text-stone-500">
                  Learn. Plan. Grow
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden sm:flex items-center gap-1.5 text-xs font-medium">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 transition ${
                      isActive
                        ? "bg-[#0D4A47] text-white font-semibold shadow-xs"
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

          {/* User Account Profile & Logout */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-2.5 rounded-xl border border-paper-300 bg-white px-3 py-1.5 shadow-xs">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0D4A47] text-[10px] font-semibold text-white">
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
              className="flex items-center gap-1 text-stone-500 hover:text-stone-900 p-1.5 rounded-lg hover:bg-paper-200 transition"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline-block text-xs font-medium">Sign Out</span>
            </Link>
          </div>
        </div>

        {/* Mobile Sub-Header Navigation Bar */}
        <div className="flex sm:hidden border-t border-paper-200 px-4 py-2 justify-around bg-paper-100/90 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                  isActive ? "bg-[#0D4A47] text-white font-semibold shadow-xs" : "text-stone-600 hover:bg-paper-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Content Area — Native Responsive Container */}
      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 max-w-6xl w-full mx-auto">
        {children}
      </main>

      {/* Academic Footer */}
      <footer className="border-t border-paper-300 bg-paper-50 py-6 text-center text-xs text-stone-500 font-serif italic">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>HiCenter — Grade 11–12 Daily Academic Center</span>
          <span className="font-mono text-[11px] not-italic">School-Issued Enrolled Account</span>
        </div>
      </footer>
    </div>
  );
}

import Link from "next/link";

import LogoutButton from "@/components/LogoutButton";
import { homeForRole, type Me } from "@/lib/api";

function navFor(me: Me): { href: string; label: string }[] {
  if (me.role === "student") {
    return [
      { href: "/dashboard", label: "Today" },
      { href: "/hischool", label: "HiSchool" },
      { href: "/hitime", label: "HiTime" },
    ];
  }
  if (me.role === "school_admin") {
    return [
      { href: "/school-admin/roster", label: "Roster" },
      { href: "/school-admin/students", label: "Students" },
    ];
  }
  if (me.role === "platform_admin") {
    return [{ href: "/platform/schools", label: "Schools" }];
  }
  if (me.role === "teacher") {
    return [{ href: "/teacher", label: "Teacher" }];
  }
  return [{ href: "/graduate", label: "Pathways" }];
}

export default function AppShell({ me, children }: { me: Me; children: React.ReactNode }) {
  return (
    <div className="min-h-full bg-[var(--background)]">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-4">
          <Link href={homeForRole(me.role)} className="text-lg font-semibold tracking-tight">
            HiCenter
          </Link>
          <nav className="flex items-center gap-5 text-sm text-stone-600">
            {navFor(me).map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-stone-950">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 text-sm text-stone-500">
            <span className="hidden sm:inline">{me.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}

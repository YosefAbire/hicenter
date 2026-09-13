"use client";

import { useState } from "react";
import {
  Upload,
  FileSpreadsheet,
  Copy,
  Check,
  Search,
  CheckCircle2,
  Clock,
  Send,
  Download,
  GraduationCap,
  ChevronRight,
  RefreshCw
} from "lucide-react";

export default function SchoolAdminRosterView() {
  const [copiedId, setCopiedId] = useState<string | null>("ros-3");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const students = [
    {
      id: "ros-1",
      name: "Maya Chen",
      studentId: "STJ-8812",
      email: "maya.chen@stjude.edu",
      grade: "Grade 11",
      stream: "STEM / Pre-Med",
      status: "ACTIVE",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "ros-2",
      name: "Liam Patel",
      studentId: "STJ-7724",
      email: "liam.p@stjude.edu",
      grade: "Grade 12",
      stream: "Humanities",
      status: "ACTIVE",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "ros-3",
      name: "Zoe Althaus",
      studentId: "STJ-8931",
      email: "zoe.a@stjude.edu",
      grade: "Grade 11",
      stream: "Arts & Design",
      status: "LINK COPIED",
      initials: "ZA"
    },
    {
      id: "ros-4",
      name: "Marcus Vance",
      studentId: "STJ-7802",
      email: "marcus.v@stjude.edu",
      grade: "Grade 12",
      stream: "Economics",
      status: "ACTIVE",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "ros-5",
      name: "Hannah Kim",
      studentId: "STJ-8910",
      email: "hannah.k@stjude.edu",
      grade: "Grade 11",
      stream: "General Sciences",
      status: "PENDING",
      initials: "HK"
    }
  ];

  const handleCopyLink = (id: string) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 pb-20 px-4 pt-2 font-sans">
      {/* Top Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-stone-500 font-mono">
          <GraduationCap className="h-4 w-4 text-[#0D4A47]" />
          <span>ST. JUDE COLLEGIATE ACADEMY • ACADEMIC YEAR 2025–2026</span>
        </div>

        <div className="flex items-baseline justify-between">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-stone-900">
            Roster Management
          </h1>
          <span className="rounded-full bg-[#E5DFD5] px-2.5 py-0.5 text-[11px] font-mono text-stone-700">
            Grades 11 & 12
          </span>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          Institutional student registry, academic track calibration, and portal access issuance.
        </p>
      </div>

      {/* Cohort Provisioning Card */}
      <div className="rounded-2xl border border-[#E5DFD5] bg-[#F1ECE4] p-4 flex items-center justify-between gap-4 shadow-paper">
        <div className="space-y-1">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-800 font-mono">
            COHORT PROVISIONING
          </span>
          <h3 className="font-serif text-lg font-semibold text-stone-900 leading-snug">
            Batch Enroll Upper-Years
          </h3>
          <p className="text-xs text-stone-600 leading-snug">
            Sync departmental streams and dispatch secure student credentials directly to official emails.
          </p>
        </div>

        <div className="h-20 w-24 shrink-0 rounded-xl overflow-hidden border border-[#E5DFD5] bg-stone-300">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=300&q=80"
            alt="Batch Enroll"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Upload CSV Card */}
      <div className="rounded-2xl border border-[#E5DFD5] bg-white p-5 space-y-4 shadow-paper">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1ECE4] text-[#0D4A47]">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold text-stone-900">Upload CSV Roster</h4>
              <p className="text-xs text-stone-500">Bulk sync student cohort assignments</p>
            </div>
          </div>
          <button className="text-xs font-semibold text-amber-800 hover:underline inline-flex items-center gap-1">
            <Download className="h-3.5 w-3.5" /> CSV Template
          </button>
        </div>

        {/* Dropzone Box */}
        <div className="rounded-2xl border-2 border-dashed border-[#E5DFD5] bg-[#F9F6F0] p-6 text-center space-y-2">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5DFD5] text-[#0D4A47]">
            <Upload className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold text-stone-900">Drop file here or tap to browse</p>
          <p className="text-[11px] text-stone-500 font-mono">
            Required headers: Name, Email, Grade, Stream, StudentID
          </p>
          <div className="pt-2">
            <button className="inline-flex items-center gap-1.5 rounded-xl bg-[#0D4A47] px-4 py-2 text-xs font-bold text-white shadow-xs">
              <span> Select CSV File</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sync Status Box */}
      <div className="rounded-2xl border border-[#E5DFD5] bg-[#F1ECE4] p-3 space-y-2 text-xs">
        <div className="flex items-center gap-2 font-mono text-[11px] text-stone-700 font-semibold">
          <span className="h-2 w-2 rounded-full bg-amber-800" />
          <span>Last sync: 48 imported • 6 pending activ... Today, 08:42</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex-1 rounded-xl bg-white border border-[#E5DFD5] py-2 text-center text-xs font-bold text-stone-800 shadow-xs">
            📄 Copy Batch Links
          </button>
          <button className="flex-1 rounded-xl bg-[#0D4A47] py-2 text-center text-xs font-bold text-white shadow-xs">
            ▷ Resend Invitations
          </button>
        </div>
      </div>

      {/* UPPER-SECONDARY REGISTRY TABLE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <h2 className="font-serif text-xl font-semibold text-stone-900">
            Upper-Secondary Registry
          </h2>
          <span className="rounded-full bg-[#E5DFD5] px-2.5 py-0.5 text-[11px] font-mono text-stone-700">
            5 Scholars
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student by name or email..."
            className="w-full rounded-xl border border-[#E5DFD5] bg-white py-2.5 pl-10 pr-4 text-xs text-stone-900 placeholder-stone-400 focus:border-[#0D4A47] focus:outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full px-3.5 py-1.5 transition ${
              filter === "all" ? "bg-[#0D4A47] text-white" : "bg-[#F1ECE4] text-stone-700"
            }`}
          >
            All (5)
          </button>
          <button
            onClick={() => setFilter("g11")}
            className={`rounded-full px-3.5 py-1.5 transition ${
              filter === "g11" ? "bg-[#0D4A47] text-white" : "bg-[#F1ECE4] text-stone-700"
            }`}
          >
            Grade 11
          </button>
          <button
            onClick={() => setFilter("g12")}
            className={`rounded-full px-3.5 py-1.5 transition ${
              filter === "g12" ? "bg-[#0D4A47] text-white" : "bg-[#F1ECE4] text-stone-700"
            }`}
          >
            Grade 12
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`rounded-full px-3.5 py-1.5 transition ${
              filter === "active" ? "bg-[#0D4A47] text-white" : "bg-[#F1ECE4] text-stone-700"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`rounded-full px-3.5 py-1.5 transition ${
              filter === "pending" ? "bg-[#0D4A47] text-white" : "bg-[#F1ECE4] text-stone-700"
            }`}
          >
            Pending
          </button>
        </div>

        {/* Student Cards Stack */}
        <div className="space-y-2.5">
          {students.map((student) => (
            <div
              key={student.id}
              className="rounded-2xl border border-[#E5DFD5] bg-white p-4 shadow-paper space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {student.avatar ? (
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="h-10 w-10 rounded-xl object-cover border border-[#E5DFD5]"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1ECE4] text-[#0D4A47] font-bold text-xs">
                      {student.initials}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif text-base font-semibold text-stone-900">
                        {student.name}
                      </h4>
                      <span className="rounded bg-[#F1ECE4] px-1.5 py-0.5 font-mono text-[10px] text-stone-600 font-semibold">
                        {student.studentId}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 font-mono">{student.email}</p>
                  </div>
                </div>

                {/* Status Badge / Action */}
                <div>
                  {student.status === "ACTIVE" && (
                    <span className="rounded bg-[#F1ECE4] px-2 py-0.5 text-[10px] font-bold text-stone-800">
                      ACTIVE
                    </span>
                  )}
                  {student.status === "LINK COPIED" && (
                    <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                      LINK COPIED
                    </span>
                  )}
                  {student.status === "PENDING" && (
                    <span className="rounded bg-stone-200 px-2 py-0.5 text-[10px] font-bold text-stone-600">
                      PENDING
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-600 pt-1 border-t border-[#F1ECE4]">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <GraduationCap className="h-3.5 w-3.5 text-[#0D4A47]" /> {student.grade} • {student.stream}
                </span>

                {student.status === "LINK COPIED" ? (
                  <button
                    onClick={() => handleCopyLink(student.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#E5DFD5] bg-[#F1ECE4] px-2.5 py-1 font-mono text-[11px] font-semibold text-stone-800"
                  >
                    <span>🔗 Copy Link</span>
                  </button>
                ) : student.status === "PENDING" ? (
                  <button className="inline-flex items-center gap-1 rounded-lg border border-[#E5DFD5] bg-[#F1ECE4] px-2.5 py-1 font-mono text-[11px] font-semibold text-stone-800">
                    <span>✉ Send Invite</span>
                  </button>
                ) : (
                  <ChevronRight className="h-4 w-4 text-stone-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

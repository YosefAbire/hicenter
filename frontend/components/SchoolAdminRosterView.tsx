"use client";

import { useState, useEffect } from "react";
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
  Plus,
  X
} from "lucide-react";
import { RosterStudent } from "@/lib/mockData";
import { rosterService } from "@/lib/services/rosterService";

export default function SchoolAdminRosterView() {
  const [roster, setRoster] = useState<RosterStudent[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for manual student creation
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [grade, setGrade] = useState("Grade 11");
  const [stream, setStream] = useState("STEM / Pre-Med");

  useEffect(() => {
    setRoster(rosterService.getRoster());
  }, []);

  const handleCopyLink = (student: RosterStudent) => {
    const link = student.activationLink || `https://hicenter.app/activate/act_${student.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
    }
    setCopiedId(student.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleResendInvite = (id: string) => {
    const updated = rosterService.resendInvite(id);
    setRoster(updated);
    alert("Activation invitation resent to student email!");
  };

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    const student = rosterService.addStudent({
      name,
      email,
      grade,
      stream,
      status: "Pending Activation",
    });
    setRoster(rosterService.getRoster());
    setName("");
    setEmail("");
    setShowAddModal(false);
  };

  const handleSimulateCSVDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const mockCSV = `Name, Email, Grade, Stream\nChloe Dubois, chloe.d@stjude.edu, Grade 11, Arts & Design\nLiam O'Connor, liam.o@stjude.edu, Grade 12, Economics`;
    const res = rosterService.parseCSVAndAdd(mockCSV);
    setRoster(res.roster);
    alert(`Successfully parsed CSV roster! Added ${res.count} student activation records.`);
  };

  const filteredRoster = roster.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === "g11") return matchSearch && s.grade.includes("11");
    if (filter === "g12") return matchSearch && s.grade.includes("12");
    if (filter === "active") return matchSearch && s.status.toLowerCase().includes("active");
    if (filter === "pending") return matchSearch && s.status.toLowerCase().includes("pending");
    return matchSearch;
  });

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
          <button
            onClick={() => setShowAddModal(true)}
            className="rounded-full bg-[#0D4A47] px-3 py-1 text-xs font-bold text-white shadow-xs cursor-pointer inline-flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Student</span>
          </button>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          Institutional student registry, academic track calibration, and portal access issuance.
        </p>
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
          <button
            onClick={() => alert("Downloading sample template: roster_template_stjude.csv")}
            className="text-xs font-semibold text-amber-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" /> CSV Template
          </button>
        </div>

        {/* Dropzone Box */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleSimulateCSVDrop}
          className="rounded-2xl border-2 border-dashed border-[#E5DFD5] bg-[#F9F6F0] p-6 text-center space-y-2"
        >
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5DFD5] text-[#0D4A47]">
            <Upload className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold text-stone-900">Drop file here or tap to browse</p>
          <p className="text-[11px] text-stone-500 font-mono">
            Required headers: Name, Email, Grade, Stream, StudentID
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                const res = rosterService.parseCSVAndAdd("Chloe Dubois, chloe.d@stjude.edu, Grade 11, Arts & Design");
                setRoster(res.roster);
                alert("Simulated CSV roster upload successful! 1 student added.");
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0D4A47] px-4 py-2 text-xs font-bold text-white shadow-xs cursor-pointer"
            >
              <span>Select CSV File</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sync Status Box */}
      <div className="rounded-2xl border border-[#E5DFD5] bg-[#F1ECE4] p-3 space-y-2 text-xs">
        <div className="flex items-center gap-2 font-mono text-[11px] text-stone-700 font-semibold">
          <span className="h-2 w-2 rounded-full bg-amber-800" />
          <span>Last sync: {roster.length} enrolled scholars • Today, 08:42</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const links = roster.map((s) => `${s.name}: ${s.activationLink || "Active"}`).join("\n");
              navigator.clipboard?.writeText(links);
              alert("Copied all single-use student activation keys to clipboard!");
            }}
            className="flex-1 rounded-xl bg-white border border-[#E5DFD5] py-2 text-center text-xs font-bold text-stone-800 shadow-xs cursor-pointer"
          >
            📄 Copy Batch Links
          </button>
          <button
            onClick={() => alert("Resent activation invitations to all pending scholars.")}
            className="flex-1 rounded-xl bg-[#0D4A47] py-2 text-center text-xs font-bold text-white shadow-xs cursor-pointer"
          >
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
            {filteredRoster.length} Scholars
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
            All ({roster.length})
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
          {filteredRoster.map((student) => (
            <div
              key={student.id}
              className="rounded-2xl border border-[#E5DFD5] bg-white p-4 shadow-paper space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1ECE4] text-[#0D4A47] font-bold text-xs">
                    {student.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif text-base font-semibold text-stone-900">
                        {student.name}
                      </h4>
                    </div>
                    <p className="text-xs text-stone-500 font-mono">{student.email}</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  {student.status.toLowerCase().includes("active") ? (
                    <span className="rounded bg-[#F1ECE4] px-2 py-0.5 text-[10px] font-bold text-stone-800">
                      ACTIVE
                    </span>
                  ) : (
                    <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                      PENDING
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-600 pt-1 border-t border-[#F1ECE4]">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <GraduationCap className="h-3.5 w-3.5 text-[#0D4A47]" /> {student.grade} • {student.stream}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyLink(student)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#E5DFD5] bg-[#F1ECE4] px-2.5 py-1 font-mono text-[11px] font-semibold text-stone-800 cursor-pointer"
                  >
                    <span>{copiedId === student.id ? "✓ Link Copied" : "🔗 Copy Link"}</span>
                  </button>
                  {student.status.toLowerCase().includes("pending") && (
                    <button
                      onClick={() => handleResendInvite(student.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#E5DFD5] bg-white px-2 py-1 font-mono text-[11px] font-semibold text-stone-800"
                    >
                      <span>✉ Resend</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border border-[#E5DFD5] bg-white p-6 space-y-4 shadow-paper-md">
            <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-2">
              <h3 className="font-serif text-xl font-bold text-stone-900">Add Student Record</h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Zoe Althaus"
                  className="mt-1 w-full rounded-xl border border-[#E5DFD5] bg-[#F9F6F0] p-2.5 text-stone-900 focus:border-[#0D4A47] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase">School Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="zoe.a@stjude.edu"
                  className="mt-1 w-full rounded-xl border border-[#E5DFD5] bg-[#F9F6F0] p-2.5 text-stone-900 focus:border-[#0D4A47] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 uppercase">Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E5DFD5] bg-[#F9F6F0] p-2 text-stone-900"
                  >
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase">Stream</label>
                  <select
                    value={stream}
                    onChange={(e) => setStream(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E5DFD5] bg-[#F9F6F0] p-2 text-stone-900"
                  >
                    <option value="STEM / Pre-Med">STEM / Pre-Med</option>
                    <option value="Humanities">Humanities</option>
                    <option value="Arts & Design">Arts & Design</option>
                    <option value="Economics">Economics</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-[#E5DFD5] bg-white px-3 py-1.5 text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#0D4A47] px-4 py-1.5 text-white font-bold"
                >
                  Create & Issue Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

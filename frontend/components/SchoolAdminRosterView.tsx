"use client";

import { useState, useEffect } from "react";
import {
  Upload,
  Search,
  UserPlus,
  Copy,
  Mail,
  Check,
  Plus,
  GraduationCap,
  Download,
  X,
  FileSpreadsheet,
  Users
} from "lucide-react";
import { INITIAL_ROSTER, RosterStudent } from "@/lib/mockData";
import { rosterService } from "@/lib/services/rosterService";

export default function SchoolAdminRosterView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [students, setStudents] = useState<RosterStudent[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for new student
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newGrade, setNewGrade] = useState("Grade 11");
  const [newStream, setNewStream] = useState("Senior Science & Humanities");

  useEffect(() => {
    setStudents(rosterService.getRoster());
  }, []);

  const handleCopyLink = (id: string, link?: string) => {
    const textToCopy = link || `https://hicenter.app/activate/act_${Math.floor(Math.random() * 1000000000)}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleResendInvite = (student: RosterStudent) => {
    rosterService.resendInvite(student.id);
    alert(`Invitation dispatched to ${student.email}`);
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;
    rosterService.addStudent({
      name: newName.trim(),
      email: newEmail.trim(),
      grade: newGrade,
      stream: newStream,
      status: "Pending Activation",
    });
    setStudents(rosterService.getRoster());
    setNewName("");
    setNewEmail("");
    setShowAddModal(false);
  };

  const handleFileUpload = (file: File) => {
    if (!file.name.endsWith(".csv") && !file.name.endsWith(".txt")) {
      alert("Please upload a valid CSV file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        const result = rosterService.parseCSVAndAdd(text);
        if (result.count > 0) {
          setStudents(result.roster);
          alert(`Successfully imported ${result.count} scholars from ${file.name}!`);
        }
      }
    };
    reader.readAsText(file);
  };

  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.stream.toLowerCase().includes(searchQuery.toLowerCase());

    if (filter === "g11") return matchSearch && s.grade.includes("11");
    if (filter === "g12") return matchSearch && s.grade.includes("12");
    if (filter === "active") return matchSearch && s.status.toLowerCase().includes("active");
    if (filter === "pending") return matchSearch && s.status.toLowerCase().includes("pending");
    return matchSearch;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-12 font-sans">
      {/* Header Banner */}
      <div className="rounded-2xl border border-[#E5DFD5] bg-white p-6 shadow-paper space-y-3">
        <div className="flex items-center gap-1.5 text-xs text-stone-500 font-mono">
          <GraduationCap className="h-4 w-4 text-[#0D4A47]" />
          <span>ST. JUDE COLLEGIATE ACADEMY • ACADEMIC YEAR 2025–2026</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3">
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
            Roster & Scholar Access Management
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="rounded-xl bg-[#0D4A47] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-950 transition cursor-pointer inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Add Single Student</span>
          </button>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed max-w-2xl font-sans">
          Institutional student registry, academic track calibration, and activation link dispatching for upper-secondary scholars.
        </p>
      </div>

      {/* Responsive Layout Grid: CSV Dropzone Panel & Student Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1/3 width on desktop): Upload CSV Box */}
        <div className="space-y-6">
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
            </div>

            {/* Dropzone Box */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className={`border-2 border-dashed rounded-xl p-6 text-center space-y-2 transition ${
                dragActive ? "border-[#0D4A47] bg-[#F1ECE4]" : "border-[#E5DFD5] bg-stone-50"
              }`}
            >
              <FileSpreadsheet className="h-8 w-8 mx-auto text-stone-400" />
              <p className="text-xs text-stone-700 font-medium">
                Drag and drop CSV roster file here
              </p>
              <p className="text-[11px] text-stone-500 font-mono">or click to browse local files</p>

              <label className="inline-block mt-2">
                <input
                  type="file"
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
                <span className="rounded-lg bg-[#0D4A47] px-3 py-1.5 text-xs font-bold text-white shadow-xs cursor-pointer inline-block">
                  Select File
                </span>
              </label>
            </div>

            <div className="pt-1 flex items-center justify-between text-xs border-t border-[#E5DFD5]">
              <button
                onClick={() => alert("Downloading sample template: roster_template_stjude.csv")}
                className="text-xs font-semibold text-amber-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" /> Sample CSV Template
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (2/3 width on desktop): Search, Filter & Roster Directory */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scholars by name, email, or track..."
                className="w-full rounded-xl border border-[#E5DFD5] bg-white py-2.5 pl-10 pr-4 text-xs text-stone-900 placeholder-stone-400 focus:border-[#0D4A47] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
              {[
                { id: "all", label: "All" },
                { id: "g11", label: "Grade 11" },
                { id: "g12", label: "Grade 12" },
                { id: "active", label: "Active" },
                { id: "pending", label: "Pending" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`rounded-xl px-3 py-2 font-bold transition cursor-pointer ${
                    filter === f.id
                      ? "bg-[#0D4A47] text-white shadow-xs"
                      : "bg-white text-stone-700 border border-[#E5DFD5] hover:bg-stone-50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Table View / Mobile Card List */}
          <div className="rounded-2xl border border-[#E5DFD5] bg-white shadow-paper overflow-hidden">
            {/* Desktop View Table (hidden on small screens) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#F1ECE4] border-b border-[#E5DFD5] font-mono text-[11px] text-stone-600 uppercase">
                  <tr>
                    <th className="p-3.5">Scholar Name</th>
                    <th className="p-3.5">Grade / Stream</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DFD5]">
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-stone-50 transition">
                      <td className="p-3.5">
                        <p className="font-semibold text-stone-900">{s.name}</p>
                        <p className="font-mono text-[11px] text-stone-500">{s.email}</p>
                      </td>
                      <td className="p-3.5">
                        <p className="font-medium text-stone-800">{s.grade}</p>
                        <p className="text-[11px] text-stone-500">{s.stream}</p>
                      </td>
                      <td className="p-3.5">
                        {s.status === "Active" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                            ● Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                            ● Pending
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        {s.status === "Pending Activation" ? (
                          <>
                            <button
                              onClick={() => handleCopyLink(s.id, s.activationLink)}
                              className="rounded-lg border border-[#E5DFD5] bg-white px-2.5 py-1 text-[11px] font-bold text-stone-800 hover:bg-stone-100 transition cursor-pointer"
                            >
                              {copiedId === s.id ? "✓ Copied" : "Copy Link"}
                            </button>
                            <button
                              onClick={() => handleResendInvite(s)}
                              className="rounded-lg bg-[#0D4A47] px-2.5 py-1 text-[11px] font-bold text-white shadow-xs cursor-pointer"
                            >
                              Resend
                            </button>
                          </>
                        ) : (
                          <span className="text-[11px] font-mono text-stone-400">Verified Scholar</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View Card List (visible only on small screens) */}
            <div className="block md:hidden divide-y divide-[#E5DFD5]">
              {filteredStudents.map((s) => (
                <div key={s.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-serif text-base font-semibold text-stone-900">{s.name}</h4>
                      <p className="font-mono text-xs text-stone-500">{s.email}</p>
                    </div>
                    {s.status === "Active" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        ● Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        ● Pending
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-600 font-sans">
                    {s.grade} • {s.stream}
                  </p>

                  {s.status === "Pending Activation" && (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleCopyLink(s.id, s.activationLink)}
                        className="flex-1 rounded-xl border border-[#E5DFD5] bg-white py-2 text-xs font-bold text-stone-800 hover:bg-stone-100 transition cursor-pointer text-center"
                      >
                        {copiedId === s.id ? "✓ Copied" : "Copy Link"}
                      </button>
                      <button
                        onClick={() => handleResendInvite(s)}
                        className="flex-1 rounded-xl bg-[#0D4A47] py-2 text-xs font-bold text-white shadow-xs cursor-pointer text-center"
                      >
                        Resend Invite
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ADD STUDENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <form
            onSubmit={handleAddStudent}
            className="w-full max-w-md rounded-2xl border border-[#E5DFD5] bg-white p-6 space-y-4 shadow-paper-md"
          >
            <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-3">
              <h3 className="font-serif text-xl font-bold text-stone-900">Provision Scholar Access</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Full Student Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Maya Chen"
                  className="w-full rounded-xl border border-[#E5DFD5] bg-stone-50 p-2.5 text-stone-900 focus:border-[#0D4A47] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">School Issued Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. maya.chen@stjude.edu"
                  className="w-full rounded-xl border border-[#E5DFD5] bg-stone-50 p-2.5 text-stone-900 focus:border-[#0D4A47] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Grade Level</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    className="w-full rounded-xl border border-[#E5DFD5] bg-stone-50 p-2.5 text-stone-900 focus:border-[#0D4A47] focus:outline-none"
                  >
                    <option>Grade 11</option>
                    <option>Grade 12</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Academic Track</label>
                  <select
                    value={newStream}
                    onChange={(e) => setNewStream(e.target.value)}
                    className="w-full rounded-xl border border-[#E5DFD5] bg-stone-50 p-2.5 text-stone-900 focus:border-[#0D4A47] focus:outline-none"
                  >
                    <option>Senior Science & Humanities</option>
                    <option>STEM & Advanced Math</option>
                    <option>Pre-Medical Track</option>
                    <option>Humanities & Social Sciences</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-[#E5DFD5]">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-xl border border-[#E5DFD5] px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#0D4A47] px-4 py-2 text-xs font-bold text-white shadow-xs"
              >
                Issue Access Invite
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

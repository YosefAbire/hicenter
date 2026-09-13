"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Search,
  Plus,
  ShieldCheck,
  Globe,
  Mail,
  Users,
  CheckCircle2,
  X,
  Lock,
  ChevronRight
} from "lucide-react";
import { SchoolRecord } from "@/lib/mockData";
import { schoolService } from "@/lib/services/schoolService";

export default function PlatformAdminSchoolsView() {
  const [schools, setSchools] = useState<SchoolRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Provisioning Form state
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [region, setRegion] = useState("Boston Academic District");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminName, setAdminName] = useState("");

  // Drawer modal state for school settings
  const [selectedSchool, setSelectedSchool] = useState<SchoolRecord | null>(null);

  useEffect(() => {
    setSchools(schoolService.getSchools());
  }, []);

  const handleProvisionSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !adminEmail.trim()) return;

    const newSch = schoolService.provisionSchool({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      region,
      adminEmail: adminEmail.trim(),
      adminName: adminName.trim() || "School Administrator",
      tracks: ["STEM", "Pre-Med", "Humanities", "Economics"],
    });

    setSchools(schoolService.getSchools());
    setName("");
    setCode("");
    setAdminEmail("");
    setAdminName("");
    setShowAddForm(false);
    alert(`Provisioned ${newSch.name}! Invitation sent to ${newSch.adminEmail}`);
  };

  const filteredSchools = schools.filter((sch) => {
    const matchSearch = sch.name.toLowerCase().includes(searchQuery.toLowerCase()) || sch.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-12 font-sans">
      {/* Console Header */}
      <div className="rounded-2xl border border-[#E5DFD5] bg-white p-6 shadow-paper space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-stone-500 font-semibold">
            <span className="h-2 w-2 rounded-full bg-stone-900" />
            <span>HICENTER PLATFORM CONSOLE</span>
          </div>
          <span className="font-mono text-[11px] text-stone-500 font-semibold">
            Build 4.18.2 • Live
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 pt-1">
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
            Schools & Academic Hubs
          </h1>
          <span className="rounded-full bg-[#E5DFD5] px-3 py-1 text-xs font-mono text-stone-700 self-start sm:self-auto">
            {schools.length} Active Hubs Enrolled
          </span>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed max-w-2xl font-sans">
          Institutional directory, domain authorizations, TLS SAML identity integration, and seat allocation for scholastic preparatory programs.
        </p>
      </div>

      {/* Main Grid: Left Column Provisioning Form, Right Column Schools Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1/3 width on desktop): Provision Form */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#E5DFD5] bg-white p-5 space-y-4 shadow-paper">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#0D4A47]" />
                <h3 className="font-serif text-lg font-semibold text-stone-900">Provision School Hub</h3>
              </div>
            </div>

            <form onSubmit={handleProvisionSchool} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Official Institution Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. St. Jude Collegiate Academy"
                  className="w-full rounded-xl border border-[#E5DFD5] bg-stone-50 p-2.5 text-stone-900 focus:border-[#0D4A47] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Institution Code</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. STJUDE"
                    className="w-full rounded-xl border border-[#E5DFD5] bg-stone-50 p-2.5 uppercase font-mono text-stone-900 focus:border-[#0D4A47] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Academic Region</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full rounded-xl border border-[#E5DFD5] bg-stone-50 p-2.5 text-stone-900 focus:border-[#0D4A47] focus:outline-none"
                  >
                    <option>Boston Academic District</option>
                    <option>Metropolitan West</option>
                    <option>Pacific Coast Region</option>
                    <option>Midwest Collegiate Circuit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Admin Administrator Name</label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  className="w-full rounded-xl border border-[#E5DFD5] bg-stone-50 p-2.5 text-stone-900 focus:border-[#0D4A47] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Admin Email Address</label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="e.g. elena.rostova@stjude.edu"
                  className="w-full rounded-xl border border-[#E5DFD5] bg-stone-50 p-2.5 text-stone-900 focus:border-[#0D4A47] focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#0D4A47] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-teal-950 transition cursor-pointer text-center"
                >
                  Provision School & Send Invite
                </button>
              </div>
            </form>
          </div>

          {/* System Protocol Status Card */}
          <div className="rounded-2xl border border-[#E5DFD5] bg-[#F1ECE4] p-5 space-y-2 shadow-paper text-xs">
            <div className="flex items-center gap-2 text-[#0D4A47] font-bold font-mono">
              <ShieldCheck className="h-4 w-4" />
              <span>TLS SAML Identity Protocol</span>
            </div>
            <p className="text-stone-700 leading-relaxed font-sans">
              All enrolled hubs operate under isolated domain partition schema with zero public registration.
            </p>
          </div>
        </div>

        {/* Right Column (2/3 width on desktop): Directory & School Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schools by name or institution code..."
              className="w-full rounded-xl border border-[#E5DFD5] bg-white py-2.5 pl-10 pr-4 text-xs text-stone-900 placeholder-stone-400 focus:border-[#0D4A47] focus:outline-none"
            />
          </div>

          {/* Managed Schools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredSchools.map((sch) => (
              <div
                key={sch.id}
                className="rounded-2xl border border-[#E5DFD5] bg-white p-5 shadow-paper space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-[#F1ECE4] px-2 py-0.5 font-mono text-[10px] font-bold text-stone-700">
                      {sch.code}
                    </span>
                    {sch.status === "Active" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        ● Operational
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        ● Provisioning
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-lg font-semibold text-stone-900 leading-snug">
                    {sch.name}
                  </h3>
                  <p className="text-xs text-stone-500 font-mono">
                    Region: {sch.region}
                  </p>

                  <div className="pt-1 text-xs text-stone-700 space-y-1">
                    <p>Enrolled Scholars: <span className="font-bold">{sch.studentsCount}</span></p>
                    <p>Faculty Members: <span className="font-bold">{sch.teachersCount}</span></p>
                  </div>
                </div>

                <div className="border-t border-[#E5DFD5] pt-3 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-stone-500 truncate max-w-[150px]">
                    Admin: {sch.adminName}
                  </span>
                  <button
                    onClick={() => setSelectedSchool(sch)}
                    className="font-bold text-[#0D4A47] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Config</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL: SCHOOL CONFIGURATION */}
      {selectedSchool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#E5DFD5] bg-white p-6 space-y-4 shadow-paper-md max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#E5DFD5] pb-3">
              <div>
                <span className="text-xs font-mono text-[#0D4A47] font-bold uppercase">
                  Institutional Security & SAML
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                  {selectedSchool.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSchool(null)}
                className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-700">
              <div className="rounded-xl bg-stone-50 border border-[#E5DFD5] p-3 space-y-2 font-mono text-[11px]">
                <p>Domain Partition: <span className="font-bold text-stone-900">{selectedSchool.code.toLowerCase()}.hicenter.app</span></p>
                <p>Primary Admin: <span className="font-bold text-stone-900">{selectedSchool.adminEmail}</span></p>
                <p>SSO Provider: <span className="font-bold text-emerald-800">Verified TLS SAML v2.0</span></p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => {
                    alert(`Resent administrative credentials to ${selectedSchool.adminEmail}`);
                    setSelectedSchool(null);
                  }}
                  className="rounded-xl bg-[#0D4A47] px-4 py-2 text-xs font-bold text-white shadow-xs"
                >
                  Resend Admin Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

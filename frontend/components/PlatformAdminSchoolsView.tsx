"use client";

import { useState } from "react";
import {
  Building2,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  UserPlus,
  ShieldAlert,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  Globe,
  Mail,
  ShieldCheck,
  ExternalLink,
  ArrowLeft
} from "lucide-react";

export default function PlatformAdminSchoolsView() {
  const [showProvisionForm, setShowProvisionForm] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState("All");

  const [schoolName, setSchoolName] = useState("");
  const [domain, setDomain] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [grade11, setGrade11] = useState(true);
  const [grade12, setGrade12] = useState(true);

  const schools = [
    {
      code: "SJCA-01",
      status: "Operational",
      name: "St. Jude Collegiate Academy",
      location: "Toronto, ON • Grade 11 & 12",
      students: "420 Students",
      admin: "dr.aris@stjude.edu",
      image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=200&q=80"
    },
    {
      code: "NAI-04",
      status: "Operational",
      name: "Northridge Academic Institute",
      location: "Vancouver, BC • Grade 11 & 12",
      students: "310 Students",
      admin: "m.keller@northridge.edu",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=200&q=80"
    },
    {
      code: "OSHC-09",
      status: "Pending Setup",
      name: "Oakwood Senior High Center",
      location: "Calgary, AB • Grade 12 Only",
      students: "185 Students",
      admin: "j.thorpe@oakwood.edu",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=200&q=80"
    }
  ];

  return (
    <div className="w-full max-w-md mx-auto space-y-6 pb-20 px-4 pt-2 font-sans">
      {/* Top Console Navigation Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-stone-500 font-semibold">
            <span className="h-2 w-2 rounded-full bg-stone-900" />
            <span>HICENTER PLATFORM CONSOLE</span>
          </div>
          <span className="font-mono text-[11px] text-stone-500 font-semibold">
            Build 4.18.2 • Live
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-stone-900">
            Schools & Centers
          </h1>
          <span className="rounded-full bg-[#E5DFD5] px-2.5 py-0.5 text-[11px] font-mono text-stone-700">
            14 Active Hubs
          </span>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          Institutional directory, domain authorizations, and administrative seat issuance for collegiate preparatory programs.
        </p>
      </div>

      {/* Hero Stats Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[#E5DFD5] bg-stone-900 text-white p-5 space-y-2 shadow-paper-md">
        <img
          src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80"
          alt="Campus Architecture"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="relative z-10 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="uppercase tracking-wider text-stone-300 text-[10px]">
              ACADEMIC YEAR 2024–2025
            </span>
            <span className="rounded bg-teal-950/70 border border-teal-800 px-2 py-0.5 text-[10px] text-teal-200">
              🖥 99.9% Uptime
            </span>
          </div>
          <h3 className="font-serif text-2xl font-semibold">
            3,890 Upper Scholars Enrolled
          </h3>
        </div>
      </div>

      {/* Provision New School Form Card */}
      <div className="rounded-2xl border border-[#E5DFD5] bg-[#F1ECE4] p-4 space-y-4 shadow-paper">
        <button
          onClick={() => setShowProvisionForm(!showProvisionForm)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#0D4A47] border border-[#E5DFD5]">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold text-stone-900">Provision New School</h4>
              <p className="text-[11px] text-stone-500">Deploy institutional tenant & dispatch ad...</p>
            </div>
          </div>
          {showProvisionForm ? <ChevronUp className="h-5 w-5 text-stone-600" /> : <ChevronDown className="h-5 w-5 text-stone-600" />}
        </button>

        {showProvisionForm && (
          <form onSubmit={(e) => e.preventDefault()} className="space-y-3.5 pt-2 border-t border-[#E5DFD5] text-xs">
            <div>
              <label className="block font-bold text-stone-900 uppercase font-mono text-[11px]">
                OFFICIAL SCHOOL NAME
              </label>
              <div className="relative mt-1">
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="e.g. Westfield Senior Collegiate"
                  className="w-full rounded-xl border border-[#E5DFD5] bg-white py-2.5 px-3 pr-9 text-stone-900 placeholder-stone-400 focus:border-[#0D4A47] focus:outline-none"
                />
                <Building2 className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-stone-400" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-900 uppercase font-mono text-[11px]">
                INSTITUTIONAL DOMAIN / SUBDOMAIN
              </label>
              <div className="mt-1 flex items-center rounded-xl border border-[#E5DFD5] bg-white overflow-hidden">
                <span className="px-2.5 text-stone-400 font-mono text-[11px]">https://</span>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="westfield.edu"
                  className="w-full py-2.5 text-stone-900 placeholder-stone-400 focus:outline-none"
                />
                <span className="px-2.5 text-stone-400 font-mono text-[11px]">.hicenter.org</span>
              </div>
              <p className="text-[10px] text-stone-500 pt-1 leading-tight">
                Automated TLS certificate and SAML 2.0 endpoints provisioned upon creation.
              </p>
            </div>

            <div>
              <label className="block font-bold text-stone-900 uppercase font-mono text-[11px] mb-1">
                GRADES SERVED
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 rounded-xl border border-[#E5DFD5] bg-white p-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={grade11}
                    onChange={(e) => setGrade11(e.target.checked)}
                    className="h-4 w-4 rounded border-stone-400 text-[#0D4A47]"
                  />
                  <span className="font-semibold text-stone-900">Grade 11 (Junior)</span>
                </label>
                <label className="flex items-center gap-2 rounded-xl border border-[#E5DFD5] bg-white p-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={grade12}
                    onChange={(e) => setGrade12(e.target.checked)}
                    className="h-4 w-4 rounded border-stone-400 text-[#0D4A47]"
                  />
                  <span className="font-semibold text-stone-900">Grade 12 (Senior)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-900 uppercase font-mono text-[11px]">
                FIRST SCHOOL ADMIN INVITATION
              </label>
              <div className="relative mt-1">
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="e.g. principal@westfield.edu"
                  className="w-full rounded-xl border border-[#E5DFD5] bg-white py-2.5 px-3 pr-9 text-stone-900 placeholder-stone-400 focus:border-[#0D4A47] focus:outline-none"
                />
                <Mail className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-stone-400" />
              </div>
              <p className="text-[10px] text-stone-500 pt-1 leading-tight">
                A cryptographic setup token will be issued valid for 72 hours.
              </p>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0D4A47] py-3 text-xs font-bold text-white shadow-xs hover:bg-[#093734]"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Provision School & Send Admin Invite</span>
            </button>
          </form>
        )}
      </div>

      {/* MANAGED SCHOOLS DIRECTORY */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-stone-900 font-mono">
            <Building2 className="h-4 w-4 text-[#0D4A47]" />
            <span>Managed Schools Directory</span>
          </div>
          <span className="font-mono text-[11px] text-stone-500">Tier-1 Network</span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Filter 14 active institutions..."
            className="w-full rounded-xl border border-[#E5DFD5] bg-white py-2.5 pl-10 pr-4 text-xs text-stone-900 placeholder-stone-400 focus:border-[#0D4A47] focus:outline-none"
          />
        </div>

        {/* Region Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setSelectedRegion("All")}
            className={`rounded-full px-3.5 py-1.5 transition ${
              selectedRegion === "All" ? "bg-[#0D4A47] text-white" : "bg-[#F1ECE4] text-stone-700"
            }`}
          >
            All Regions
          </button>
          <button
            onClick={() => setSelectedRegion("Ontario")}
            className={`rounded-full px-3.5 py-1.5 transition ${
              selectedRegion === "Ontario" ? "bg-[#0D4A47] text-white" : "bg-[#F1ECE4] text-stone-700"
            }`}
          >
            Ontario (6)
          </button>
          <button
            onClick={() => setSelectedRegion("BC")}
            className={`rounded-full px-3.5 py-1.5 transition ${
              selectedRegion === "BC" ? "bg-[#0D4A47] text-white" : "bg-[#F1ECE4] text-stone-700"
            }`}
          >
            British Columbia (5)
          </button>
          <button
            onClick={() => setSelectedRegion("Alberta")}
            className={`rounded-full px-3.5 py-1.5 transition ${
              selectedRegion === "Alberta" ? "bg-[#0D4A47] text-white" : "bg-[#F1ECE4] text-stone-700"
            }`}
          >
            Alberta (3)
          </button>
        </div>

        {/* Schools Stack */}
        <div className="space-y-3">
          {schools.map((sch) => (
            <div
              key={sch.code}
              className="rounded-2xl border border-[#E5DFD5] bg-white p-4 shadow-paper space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="rounded bg-[#F1ECE4] px-1.5 py-0.5 text-[10px] font-bold text-stone-700">
                      {sch.code}
                    </span>
                    {sch.status === "Operational" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        ● Operational
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        ● Pending Setup
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif text-lg font-semibold text-stone-900 mt-1">
                    {sch.name}
                  </h4>
                  <p className="text-xs text-stone-500 font-mono">📍 {sch.location}</p>
                </div>

                <div className="h-12 w-12 rounded-xl overflow-hidden border border-[#E5DFD5] shrink-0 bg-stone-300">
                  <img src={sch.image} alt={sch.name} className="h-full w-full object-cover" />
                </div>
              </div>

              {/* Stats Box */}
              <div className="rounded-xl border border-[#E5DFD5] bg-[#F1ECE4] p-3 text-xs flex justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-stone-500 block">Active Scholars</span>
                  <span className="font-bold text-stone-900">{sch.students}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-stone-500 block">Lead Administrator</span>
                  <span className="font-mono text-[11px] text-stone-800">{sch.admin}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-2 text-xs pt-1">
                {sch.status === "Pending Setup" ? (
                  <button className="flex-1 rounded-xl bg-orange-600 py-2 text-center font-bold text-white shadow-xs">
                    ▷ Resend Invite
                  </button>
                ) : (
                  <button className="flex-1 rounded-xl bg-[#F1ECE4] border border-[#E5DFD5] py-2 text-center font-bold text-stone-800 shadow-xs">
                    Manage Roster
                  </button>
                )}
                <button className="flex-1 rounded-xl bg-[#F1ECE4] border border-[#E5DFD5] py-2 text-center font-bold text-stone-800 shadow-xs">
                  Domain Settings
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F1ECE4] border border-[#E5DFD5] text-stone-700">
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Footer Card */}
      <div className="rounded-2xl border border-[#E5DFD5] bg-[#F1ECE4] p-4 flex items-start gap-3 shadow-paper text-xs text-stone-700">
        <ShieldCheck className="h-5 w-5 text-[#0D4A47] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h5 className="font-bold text-stone-900">Academic Data Protocol Compliance</h5>
          <p className="leading-relaxed text-[11px] text-stone-600">
            All provisioned schools inherit encrypted cohort isolation complying with FERPA and regional student privacy frameworks. Root administrator actions are logged to immutable ledger.
          </p>
        </div>
      </div>
    </div>
  );
}

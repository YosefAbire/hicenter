"use client";

import { useState } from "react";
import { BookOpen, CheckCircle2, Building2, GraduationCap, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState("scholar@academy.edu");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (onSuccess) onSuccess();
    }, 600);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 px-4 py-6">
      {/* Brand Hero Header */}
      <div className="text-center space-y-3">
        <div className="relative inline-flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EFECE4] border border-[#E2DBD0] text-[#0D4A47] shadow-xs">
            <BookOpen className="h-8 w-8 stroke-[1.75]" />
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#0D4A47] text-white ring-2 ring-[#F9F6F0]">
            <CheckCircle2 className="h-3.5 w-3.5 fill-current text-[#0D4A47] bg-white rounded-full" />
          </div>
        </div>

        <div>
          <span className="block text-[11px] font-semibold tracking-widest uppercase text-stone-500 font-sans">
            SCHOLASTIC PORTAL
          </span>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
            HiCenter
          </h1>
          <p className="mt-2 font-serif text-base italic text-stone-700">
            Learn. Plan. Grow — at the center.
          </p>
        </div>
      </div>

      {/* Institutional Access Callout */}
      <div className="rounded-2xl border border-[#E5DFD5] bg-[#F1ECE4] p-5 space-y-1.5 shadow-paper">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-900">
          <Building2 className="h-4 w-4 text-[#0D4A47]" />
          <span>INSTITUTIONAL ACCESS</span>
        </div>
        <p className="text-xs text-stone-700 leading-relaxed font-sans">
          School-issued accounts only. Access is granted through your registered Grade 11 or 12 institution.
        </p>
      </div>

      {/* Form Surface */}
      <div className="rounded-2xl border border-[#E5DFD5] bg-white p-6 space-y-5 shadow-paper-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-stone-900">
                School Email
              </label>
              <span className="text-[11px] text-stone-400 font-mono">e.g. name@school.edu</span>
            </div>
            <div className="relative">
              <GraduationCap className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="scholar@academy.edu"
                className="w-full rounded-xl border border-[#E5DFD5] bg-[#F9F6F0] py-3 pl-10 pr-4 text-sm text-stone-900 placeholder-stone-400 focus:border-[#0D4A47] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0D4A47]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-stone-900">
                Security Key / Password
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Please contact your school administrator to reset credentials."); }} className="text-[11px] font-medium text-amber-800 hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-stone-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-[#E5DFD5] bg-[#F9F6F0] py-3 pl-10 pr-10 text-sm text-stone-900 placeholder-stone-400 focus:border-[#0D4A47] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0D4A47]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-stone-400 hover:text-stone-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0D4A47] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#093734] focus:outline-none focus:ring-2 focus:ring-[#0D4A47] focus:ring-offset-2 disabled:opacity-70 shadow-xs"
          >
            <span>{loading ? "Signing in..." : "Sign in"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Curated Study Session Card */}
      <div className="overflow-hidden rounded-2xl border border-[#E5DFD5] bg-[#F1ECE4] shadow-paper">
        <div className="relative h-28 bg-[#D8D2C6] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80"
            alt="Study Carrel"
            className="w-full h-full object-cover opacity-90"
          />
        </div>
        <div className="p-4 flex items-center justify-between text-xs font-semibold text-stone-900">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#0D4A47]" />
            <span className="uppercase tracking-wider">CURATED STUDY SESSION</span>
          </div>
          <span className="font-mono text-stone-500 font-normal">Term II Active</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-2 text-xs text-stone-500 space-y-1">
        <div className="flex items-center justify-center gap-1 font-medium text-stone-600">
          <Lock className="h-3 w-3" />
          <span>Secured Academic Network</span>
        </div>
        <p className="text-[11px] text-stone-400">
          Authorized Upper-Secondary Scholars • Grades 11–12
        </p>
      </div>
    </div>
  );
}

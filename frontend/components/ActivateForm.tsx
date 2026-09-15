"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ShieldCheck, Lock, Eye, EyeOff, Info, HelpCircle, AlertCircle, ArrowRight } from "lucide-react";
import { CURRENT_STUDENT } from "@/lib/mockData";
import { authService } from "@/lib/services/authService";

export default function ActivateForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [activated, setActivated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasLength = password.length >= 10;
  const hasMixed = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isValid = hasLength && hasMixed && passwordsMatch && agreed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setError("Please satisfy all password requirements and accept the Honor Agreement.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await authService.activateToken("demo_token", password);
      setLoading(false);
      if (res.success) {
        setActivated(true);
        if (onSuccess) onSuccess();
      } else {
        setError(res.message || "Activation failed.");
      }
    } catch (err) {
      setLoading(false);
      setError("Activation failed.");
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 px-4 py-6 font-sans">
      {/* Header Badge & Title */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
          <div className="flex items-center gap-1.5 text-[#0D4A47]">
            <ShieldCheck className="h-4 w-4" />
            <span>HICENTER SCHOLAR REGISTRY</span>
          </div>
          <span className="rounded-full bg-[#E5DFD5] px-2.5 py-0.5 text-[11px] font-mono text-stone-700">
            Stage 1 of 1
          </span>
        </div>

        <div>
          <span className="block text-xs font-bold uppercase tracking-wider text-amber-800 font-mono">
            INSTITUTIONAL PROVISION
          </span>
          <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-stone-900">
            Activate your student workspace
          </h1>
          <p className="mt-2 text-xs text-stone-700 leading-relaxed font-sans">
            Welcome, scholar. Please review your assigned credential profile and establish your private key to access course materials, peer carrels, and archive records.
          </p>
        </div>
      </div>

      {/* SCHOLAR FILE Card */}
      <div className="rounded-2xl border border-[#E5DFD5] bg-[#F1ECE4] p-5 space-y-4 shadow-paper">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-xl bg-stone-300 border border-[#E5DFD5]">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                alt={CURRENT_STUDENT.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-900 font-mono">
                SCHOLAR FILE
              </span>
              <h3 className="font-serif text-xl font-semibold text-stone-900">
                {CURRENT_STUDENT.name}
              </h3>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 rounded-md bg-[#E5DFD5] px-2 py-0.5 text-[11px] font-medium text-stone-800">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#0D4A47]" /> Verified ID
          </span>
        </div>

        <div className="space-y-2 border-t border-[#E5DFD5] pt-3 text-xs">
          <div className="flex items-baseline justify-between py-0.5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-stone-500">INSTITUTION</span>
            <span className="font-semibold text-stone-900">{CURRENT_STUDENT.school}</span>
          </div>
          <div className="flex items-baseline justify-between py-0.5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-stone-500">ACADEMIC TRACK</span>
            <span className="font-semibold text-stone-900">{CURRENT_STUDENT.grade} • {CURRENT_STUDENT.stream}</span>
          </div>
          <div className="flex items-baseline justify-between py-0.5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-stone-500">STUDENT ID</span>
            <span className="font-mono font-bold text-stone-900">{CURRENT_STUDENT.studentId}</span>
          </div>
        </div>

        {/* Institutional info callout */}
        <div className="flex items-start gap-2.5 rounded-xl border border-[#E5DFD5] bg-[#EBE5DB] p-3 text-xs text-stone-700">
          <Info className="h-4 w-4 shrink-0 text-stone-600 mt-0.5" />
          <p className="leading-snug">
            Your grade and school attributes are institutional provisions managed directly by your academic registrar.
          </p>
        </div>
      </div>

      {activated ? (
        <div className="rounded-2xl border border-[#E5DFD5] bg-white p-6 text-center space-y-4 shadow-paper-md">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#0D4A47] text-white">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="font-serif text-2xl font-semibold text-stone-900">Workspace Activated</h3>
          <p className="text-xs text-stone-600">
            Your private key has been established. You may now sign in to access your scholar dashboard.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0D4A47] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#093734]"
          >
            <span>Proceed to Login</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold uppercase tracking-wider text-stone-900 font-mono">
                CREATE WORKSPACE PASSWORD
              </label>
              <span className="font-mono text-[11px] text-stone-400">
                {password.length}/10 min
              </span>
            </div>

            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter secure password"
                className="w-full rounded-xl border border-[#E5DFD5] bg-white py-3 pl-4 pr-10 text-sm text-stone-900 placeholder-stone-400 focus:border-[#0D4A47] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-3.5 text-stone-400 hover:text-stone-700"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Validation Checklist */}
            <div className="rounded-xl border border-[#E5DFD5] bg-[#F1ECE4] p-3 space-y-1 text-xs text-stone-700">
              <div className="flex items-center gap-2">
                <span className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center text-[10px] ${hasLength ? "bg-[#0D4A47] border-[#0D4A47] text-white" : "border-stone-400 bg-white"}`}>
                  {hasLength ? "✓" : ""}
                </span>
                <span className={hasLength ? "font-medium text-stone-900" : "text-stone-600"}>
                  At least 10 characters
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center text-[10px] ${hasMixed ? "bg-[#0D4A47] border-[#0D4A47] text-white" : "border-stone-400 bg-white"}`}>
                  {hasMixed ? "✓" : ""}
                </span>
                <span className={hasMixed ? "font-medium text-stone-900" : "text-stone-600"}>
                  Mixed case lettering (uppercase & lowercase)
                </span>
              </div>
            </div>
          </div>

          {/* Confirm password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-900 font-mono">
              CONFIRM WORKSPACE PASSWORD
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type your password"
              className="w-full rounded-xl border border-[#E5DFD5] bg-white py-3 px-4 text-sm text-stone-900 placeholder-stone-400 focus:border-[#0D4A47] focus:outline-none"
            />
          </div>

          {/* Academic Honor Agreement */}
          <div className="rounded-xl border border-[#E5DFD5] bg-[#F1ECE4] p-4 text-xs text-stone-800 space-y-1">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-stone-400 text-[#0D4A47] focus:ring-[#0D4A47]"
              />
              <div>
                <span className="font-bold text-stone-900 block">
                  Academic Honor & Registry Agreement
                </span>
                <span className="text-stone-600 text-[11px] leading-relaxed block mt-0.5">
                  I acknowledge the HiCenter Academic Integrity & Study Collaboration Guidelines and agree to conduct research with scholarly candor.
                </span>
              </div>
            </label>
          </div>

          {/* CTA */}
          <button
            type="submit"
            disabled={!isValid || loading}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition ${
              isValid
                ? "bg-[#0D4A47] text-white hover:bg-[#093734] shadow-xs cursor-pointer"
                : "bg-[#E5DFD5] text-stone-500 cursor-not-allowed"
            }`}
          >
            <Lock className="h-4 w-4" />
            <span>{loading ? "Activating workspace..." : "Activate account"}</span>
          </button>
        </form>
      )}

      {/* Honor Carrels Footer Card */}
      <div className="rounded-2xl border border-[#E5DFD5] bg-white p-4 flex items-center gap-3 shadow-paper">
        <div className="h-14 w-14 overflow-hidden rounded-xl shrink-0 bg-stone-300">
          <img
            src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=200&q=80"
            alt="Honor Carrels"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="space-y-0.5">
          <h4 className="font-serif text-base font-semibold text-stone-900">The Honor Carrels</h4>
          <p className="text-xs text-stone-600 line-clamp-2">
            Independent inquiry grounded in community rigor. Discover peer circle carrels upon entry.
          </p>
        </div>
      </div>

      {/* Help Link */}
      <div className="text-center pt-2">
        <a href="#help" onClick={(e) => { e.preventDefault(); alert("Contact your school coordinator at registrar@stjude.edu"); }} className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 font-medium">
          <HelpCircle className="h-3.5 w-3.5 text-stone-500" />
          <span>Need help activating? Contact your school coordinator</span>
        </a>
      </div>
    </div>
  );
}

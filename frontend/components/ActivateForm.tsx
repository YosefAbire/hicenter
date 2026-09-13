"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { api, homeForRole, ApiError, type Me } from "@/lib/api";

export default function ActivateForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const data = await api<{ user: Me }>("/auth/activate/", {
        method: "POST",
        body: JSON.stringify({
          token,
          password,
          password_confirm: passwordConfirm,
        }),
      });
      router.push(homeForRole(data.user.role));
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not activate this account.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block space-y-1.5">
        <span className="text-sm text-stone-600">Password</span>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 outline-none focus:border-stone-800"
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm text-stone-600">Confirm password</span>
        <input
          type="password"
          required
          minLength={8}
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 outline-none focus:border-stone-800"
        />
      </label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-stone-900 px-4 py-2.5 text-white hover:bg-stone-800 disabled:opacity-60"
      >
        {pending ? "Activating…" : "Activate account"}
      </button>
    </form>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { api, homeForRole, ApiError, type Me } from "@/lib/api";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    api<Me>("/auth/me/")
      .then((me) => router.replace(homeForRole(me.role)))
      .catch(() => undefined);
  }, [router]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const data = await api<{ user: Me }>("/auth/login/", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      router.push(homeForRole(data.user.role));
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not sign in.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block space-y-1.5">
        <span className="text-sm text-stone-600">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 outline-none focus:border-stone-800"
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm text-stone-600">Password</span>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 outline-none focus:border-stone-800"
        />
      </label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-stone-900 px-4 py-2.5 text-white hover:bg-stone-800 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

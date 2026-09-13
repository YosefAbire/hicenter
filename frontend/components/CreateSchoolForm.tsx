"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { api, ApiError, type SchoolSummary } from "@/lib/api";

type Invitation = { email: string; token: string; role: string };

export default function CreateSchoolForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [invitation, setInvitation] = useState<Invitation | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setInvitation(null);
    const form = new FormData(event.currentTarget);
    setPending(true);
    try {
      const school = await api<SchoolSummary>("/schools/", {
        method: "POST",
        body: JSON.stringify({
          name: form.get("name"),
          code: form.get("code"),
        }),
      });
      const adminEmail = String(form.get("admin_email") || "");
      if (adminEmail) {
        const created = await api<{ invitation: Invitation }>(`/schools/${school.id}/admins/`, {
          method: "POST",
          body: JSON.stringify({
            email: adminEmail,
            first_name: form.get("admin_first_name") || "School",
            last_name: form.get("admin_last_name") || "Admin",
          }),
        });
        setInvitation(created.invitation);
      }
      event.currentTarget.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create school.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-stone-200 bg-white p-6">
      <h2 className="font-medium">Add a school</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm">
          <span className="text-stone-600">School name</span>
          <input name="name" required className="w-full rounded-lg border border-stone-300 px-3 py-2" />
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="text-stone-600">Code</span>
          <input name="code" required className="w-full rounded-lg border border-stone-300 px-3 py-2" />
        </label>
        <label className="space-y-1.5 text-sm sm:col-span-2">
          <span className="text-stone-600">First school admin email</span>
          <input name="admin_email" type="email" className="w-full rounded-lg border border-stone-300 px-3 py-2" />
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="text-stone-600">Admin first name</span>
          <input name="admin_first_name" className="w-full rounded-lg border border-stone-300 px-3 py-2" />
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="text-stone-600">Admin last name</span>
          <input name="admin_last_name" className="w-full rounded-lg border border-stone-300 px-3 py-2" />
        </label>
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {invitation ? (
        <p className="rounded-md bg-stone-50 px-3 py-2 font-mono text-xs">
          Activation link: /activate/{invitation.token}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-stone-900 px-4 py-2 text-white hover:bg-stone-800 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Create school"}
      </button>
    </form>
  );
}

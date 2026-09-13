"use client";

import { useState } from "react";

import { api, ApiError } from "@/lib/api";

type Invitation = { email: string; token: string; role: string };

export default function RosterForm({ schoolId }: { schoolId: number }) {
  const [result, setResult] = useState<{ created: number; invitations: Invitation[] } | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);
    const file = new FormData(event.currentTarget).get("file");
    if (!(file instanceof File) || file.size === 0) {
      setError("Choose a CSV file first.");
      return;
    }
    const body = new FormData();
    body.append("file", file);
    setPending(true);
    try {
      const data = await api<{ created: number; invitations: Invitation[] }>(
        `/schools/${schoolId}/roster/`,
        { method: "POST", body },
      );
      setResult(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-stone-200 bg-white p-6">
        <p className="text-sm text-stone-600">
          Columns: email, first_name, last_name, grade, stream (optional: natural/social),
          enrollment_year.
        </p>
        <input type="file" name="file" accept=".csv,text/csv" required className="block text-sm" />
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-stone-900 px-4 py-2 text-white hover:bg-stone-800 disabled:opacity-60"
        >
          {pending ? "Uploading…" : "Upload roster"}
        </button>
      </form>
      {result ? (
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="font-medium">Created {result.created} student accounts</h2>
          <p className="mt-1 text-sm text-stone-600">
            Share each activation link. Email delivery is not in this slice.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {result.invitations.map((item) => (
              <li key={item.token} className="rounded-md bg-stone-50 px-3 py-2 font-mono text-xs">
                {item.email} — /activate/{item.token}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

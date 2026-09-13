"use client";

import { api } from "@/lib/api";

export default function LogoutButton() {
  async function handleLogout() {
    try {
      await api("/auth/logout/", { method: "POST" });
    } finally {
      window.location.href = "/login";
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-md border border-stone-300 px-3 py-1 text-stone-700 hover:bg-stone-50"
    >
      Log out
    </button>
  );
}

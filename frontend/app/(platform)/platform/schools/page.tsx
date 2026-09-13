import CreateSchoolForm from "@/components/CreateSchoolForm";
import { cookies } from "next/headers";
import { requireUser } from "@/lib/server-auth";
import type { SchoolSummary } from "@/lib/api";

async function loadSchools(): Promise<SchoolSummary[]> {
  const cookieStore = await cookies();
  const access = cookieStore.get("access_token")?.value;
  const origin = process.env.DJANGO_ORIGIN || "http://127.0.0.1:8000";
  const response = await fetch(`${origin}/api/schools/`, {
    headers: { Cookie: `access_token=${access || ""}` },
    cache: "no-store",
  });
  if (!response.ok) return [];
  return response.json();
}

export default async function SchoolsPage() {
  await requireUser("platform_admin");
  const schools = await loadSchools();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Schools</h1>
        <p className="mt-2 max-w-xl text-stone-600">
          Platform admins create schools and the first school admin. Access is never public.
        </p>
      </div>
      <CreateSchoolForm />
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {schools.map((school) => (
              <tr key={school.id} className="border-t border-stone-100">
                <td className="px-4 py-3">{school.name}</td>
                <td className="px-4 py-3 font-mono text-xs">{school.code}</td>
                <td className="px-4 py-3">{school.is_active ? "Active" : "Inactive"}</td>
              </tr>
            ))}
            {schools.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-stone-500" colSpan={3}>
                  No schools yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

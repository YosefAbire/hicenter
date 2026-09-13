import { cookies } from "next/headers";
import { requireUser } from "@/lib/server-auth";
import type { Me } from "@/lib/api";

async function loadStudents(schoolId: number): Promise<Me[]> {
  const cookieStore = await cookies();
  const access = cookieStore.get("access_token")?.value;
  const origin = process.env.DJANGO_ORIGIN || "http://127.0.0.1:8000";
  const response = await fetch(`${origin}/api/schools/${schoolId}/students/`, {
    headers: { Cookie: `access_token=${access || ""}` },
    cache: "no-store",
  });
  if (!response.ok) return [];
  return response.json();
}

export default async function StudentsPage() {
  const me = await requireUser("school_admin");
  if (!me.school) {
    return <p>This admin account is not attached to a school.</p>;
  }
  const students = await loadStudents(me.school.id);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-stone-500">{me.school.name}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Students</h1>
      </div>
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-500">
            <tr>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Grade</th>
              <th className="px-4 py-3 font-medium">Stream</th>
              <th className="px-4 py-3 font-medium">Active</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-t border-stone-100">
                <td className="px-4 py-3">{student.email}</td>
                <td className="px-4 py-3">
                  {student.first_name} {student.last_name}
                </td>
                <td className="px-4 py-3">{student.student_profile?.grade ?? "—"}</td>
                <td className="px-4 py-3">{student.student_profile?.stream || "—"}</td>
                <td className="px-4 py-3">{student.is_active ? "Yes" : "Pending"}</td>
              </tr>
            ))}
            {students.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-stone-500" colSpan={5}>
                  No students yet. Upload a roster to create Grade 11 and 12 accounts.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { requireUser } from "@/lib/server-auth";

export default async function DashboardPage() {
  const me = await requireUser("student");
  const name = me.first_name || me.email;
  const grade = me.student_profile?.grade;
  const stream = me.student_profile?.stream;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-stone-500">
          {me.school?.name}
          {grade ? ` · Grade ${grade}` : ""}
          {stream ? ` · ${stream}` : ""}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Today, {name}</h1>
        <p className="mt-2 max-w-xl text-stone-600">
          HiCenter is your daily academic center. HiTime and HiSchool will fill this dashboard in
          later slices. Your grade and school are locked to this account.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="font-medium">HiTime</h2>
          <p className="mt-2 text-sm text-stone-600">Tasks, routines, and focus timers come next.</p>
        </section>
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="font-medium">HiSchool</h2>
          <p className="mt-2 text-sm text-stone-600">Notes, quizzes, and pathways come next.</p>
        </section>
      </div>
    </div>
  );
}

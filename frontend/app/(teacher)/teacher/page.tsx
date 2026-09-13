import { requireUser } from "@/lib/server-auth";

export default async function TeacherHomePage() {
  const me = await requireUser("teacher");
  return (
    <div className="space-y-3">
      <h1 className="text-3xl font-semibold tracking-tight">Teacher</h1>
      <p className="max-w-xl text-stone-600">
        Content verification belongs to HiSchool and will land in a later slice. You are signed in
        as {me.email}
        {me.teacher_profile?.subjects ? ` covering ${me.teacher_profile.subjects}` : ""}.
      </p>
    </div>
  );
}

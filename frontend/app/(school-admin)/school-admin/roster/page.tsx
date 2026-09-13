import RosterForm from "@/components/RosterForm";
import { requireUser } from "@/lib/server-auth";

export default async function RosterPage() {
  const me = await requireUser("school_admin");
  if (!me.school) {
    return <p>This admin account is not attached to a school.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-stone-500">{me.school.name}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Student roster</h1>
        <p className="mt-2 max-w-xl text-stone-600">
          Upload a CSV to create Grade 11 and 12 accounts. Students activate with a one-time link.
          There is no public signup.
        </p>
      </div>
      <RosterForm schoolId={me.school.id} />
    </div>
  );
}

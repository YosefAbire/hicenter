import { requireUser } from "@/lib/server-auth";

export default async function GraduateHomePage() {
  const me = await requireUser("graduate");
  const verified = me.graduate_profile?.is_verified;
  return (
    <div className="space-y-3">
      <h1 className="text-3xl font-semibold tracking-tight">Graduate pathways</h1>
      <p className="max-w-xl text-stone-600">
        {verified
          ? "Your profile is verified. Pathway stories will be editable here in HiSchool."
          : "Your account is active. A school or platform admin still needs to verify you before pathway stories are public."}
      </p>
    </div>
  );
}

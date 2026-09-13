import ActivateForm from "@/components/ActivateForm";

export default async function ActivatePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <div className="flex min-h-full items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-stone-500">HiCenter</p>
          <h1 className="text-3xl font-semibold tracking-tight">Activate your account</h1>
          <p className="text-stone-600">
            Set a password to finish school-based onboarding. This link can only be used once.
          </p>
        </div>
        <ActivateForm token={token} />
      </div>
    </div>
  );
}

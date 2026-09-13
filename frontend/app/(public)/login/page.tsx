import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-full items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-stone-500">HiCenter</p>
          <h1 className="text-3xl font-semibold tracking-tight">Sign in to your school</h1>
          <p className="text-stone-600">
            There is no public signup. Use the email your school issued and the password you set
            during activation.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

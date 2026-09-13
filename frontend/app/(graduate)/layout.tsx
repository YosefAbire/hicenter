import AppShell from "@/components/AppShell";
import { requireUser } from "@/lib/server-auth";

export default async function GraduateLayout({ children }: { children: React.ReactNode }) {
  const me = await requireUser("graduate");
  return <AppShell me={me}>{children}</AppShell>;
}

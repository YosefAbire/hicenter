import AppShell from "@/components/AppShell";
import { requireUser } from "@/lib/server-auth";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const me = await requireUser("student");
  return <AppShell me={me}>{children}</AppShell>;
}

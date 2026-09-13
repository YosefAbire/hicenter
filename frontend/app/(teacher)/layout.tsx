import AppShell from "@/components/AppShell";
import { requireUser } from "@/lib/server-auth";

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const me = await requireUser("teacher");
  return <AppShell me={me}>{children}</AppShell>;
}

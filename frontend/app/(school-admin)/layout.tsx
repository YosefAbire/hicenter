import AppShell from "@/components/AppShell";
import { requireUser } from "@/lib/server-auth";

export default async function SchoolAdminLayout({ children }: { children: React.ReactNode }) {
  const me = await requireUser("school_admin");
  return <AppShell me={me}>{children}</AppShell>;
}

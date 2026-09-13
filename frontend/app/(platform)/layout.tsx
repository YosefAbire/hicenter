import AppShell from "@/components/AppShell";
import { requireUser } from "@/lib/server-auth";

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  const me = await requireUser("platform_admin");
  return <AppShell me={me}>{children}</AppShell>;
}

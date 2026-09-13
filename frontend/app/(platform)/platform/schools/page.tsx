import AppShell from "@/components/AppShell";
import PlatformAdminSchoolsView from "@/components/PlatformAdminSchoolsView";

export default function SchoolsPage() {
  return (
    <AppShell currentRole="platform_admin">
      <PlatformAdminSchoolsView />
    </AppShell>
  );
}

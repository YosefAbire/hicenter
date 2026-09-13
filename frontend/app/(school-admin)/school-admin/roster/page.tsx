import AppShell from "@/components/AppShell";
import SchoolAdminRosterView from "@/components/SchoolAdminRosterView";

export default function RosterPage() {
  return (
    <AppShell currentRole="school_admin">
      <SchoolAdminRosterView />
    </AppShell>
  );
}

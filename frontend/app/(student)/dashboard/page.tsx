import AppShell from "@/components/AppShell";
import StudentDashboardView from "@/components/StudentDashboardView";

export default function DashboardPage() {
  return (
    <AppShell currentRole="student">
      <StudentDashboardView />
    </AppShell>
  );
}

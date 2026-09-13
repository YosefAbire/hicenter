import AppShell from "@/components/AppShell";
import HiSchoolView from "@/components/HiSchoolView";

export default function HiSchoolPage() {
  return (
    <AppShell currentRole="student">
      <HiSchoolView />
    </AppShell>
  );
}

import AppShell from "@/components/AppShell";
import HiTimeView from "@/components/HiTimeView";

export default function HiTimePage() {
  return (
    <AppShell currentRole="student">
      <HiTimeView />
    </AppShell>
  );
}

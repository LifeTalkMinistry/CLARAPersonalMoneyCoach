import ClaraPageShell from "../components/shared/layout/ClaraPageShell";

export default function Dashboard() {
  return (
    <ClaraPageShell compactHeader>
      <div className="min-h-[100dvh] overflow-x-hidden overflow-y-auto pb-[calc(70px+env(safe-area-inset-bottom))] sm:pb-[calc(88px+env(safe-area-inset-bottom))]" />
    </ClaraPageShell>
  );
}

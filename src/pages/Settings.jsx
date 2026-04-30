import ClaraPageShell from "../components/shared/layout/ClaraPageShell";

export default function Settings() {
  return (
    <ClaraPageShell>
      <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <h1 className="text-lg font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-white/55">
          Account and CLARA preferences will appear here.
        </p>
      </section>
    </ClaraPageShell>
  );
}
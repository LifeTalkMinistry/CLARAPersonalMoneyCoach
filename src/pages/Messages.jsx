import ClaraPageShell from "../components/shared/layout/ClaraPageShell";

export default function Messages() {
  return (
    <ClaraPageShell>
      <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <h1 className="text-lg font-semibold">Messages</h1>
        <p className="mt-1 text-sm text-white/55">
          CLARA partner messages will appear here.
        </p>
      </section>
    </ClaraPageShell>
  );
}
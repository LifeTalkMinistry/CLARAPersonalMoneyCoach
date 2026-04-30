import TopNavigationBar from "../navigation/TopNavigationBar";

export default function ClaraPageShell({ children, floatingAction = null, compactHeader = false }) {
  return (
    <main
      className="min-h-screen text-white flex justify-center"
      style={{ background: "var(--clara-bg)" }}
    >
      <div className="w-full max-w-sm px-4 pt-2 pb-6 space-y-4">
        <TopNavigationBar compact={compactHeader} />
        {children}
      </div>

      {floatingAction}
    </main>
  );
}

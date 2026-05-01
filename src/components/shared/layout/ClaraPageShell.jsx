import TopNavigationBar from "../navigation/TopNavigationBar";

export default function ClaraPageShell({
  children,
  floatingAction = null,
  compactHeader = true,
  hideTopNav = false,
}) {
  return (
    <main
      className="min-h-screen text-white flex justify-center"
      style={{ background: "var(--clara-bg)" }}
    >
      <div className="flex w-full max-w-sm flex-col gap-4 px-4 pt-2 pb-6">
        {!hideTopNav && <TopNavigationBar compact={compactHeader} />}
        {children}
      </div>

      {floatingAction}
    </main>
  );
}

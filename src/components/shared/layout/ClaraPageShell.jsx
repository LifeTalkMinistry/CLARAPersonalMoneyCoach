import TopNavigationBar from "../navigation/TopNavigationBar";

export default function ClaraPageShell({
  children,
  floatingAction = null,
  compactHeader = true,
  hideTopNav = false,
}) {
  return (
    <main
      className="relative min-h-[100dvh] w-full overflow-x-hidden overscroll-y-none"
      style={{
        backgroundImage: "var(--clara-bg)",
        backgroundColor: "var(--clara-bg-base)",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        color: "var(--clara-text)",
        WebkitOverflowScrolling: "touch",
        overscrollBehaviorY: "none",
      }}
    >
      <div className="relative z-10 flex min-h-[100dvh] w-full flex-col gap-3 px-3 pb-4 pt-3">
        {!hideTopNav && <TopNavigationBar compact={compactHeader} />}
        {children}
      </div>

      {floatingAction}
    </main>
  );
}

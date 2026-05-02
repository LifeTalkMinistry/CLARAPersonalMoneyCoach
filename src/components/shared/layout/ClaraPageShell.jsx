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
        background: "var(--clara-bg)",
        backgroundColor: "var(--clara-bg-base)",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        color: "var(--clara-text)",
        WebkitOverflowScrolling: "touch",
        overscrollBehaviorY: "none",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 52% -4%, rgba(239,203,71,0.18), transparent 18%), radial-gradient(circle at 100% 100%, rgba(39,92,177,0.14), transparent 26%), linear-gradient(180deg, rgba(255,255,255,0.035), transparent 16%, rgba(3,7,11,0.10) 100%)",
        }}
      />

      <div className="relative z-10 flex min-h-[100dvh] w-full flex-col gap-3 px-3 pb-4 pt-3">
        {!hideTopNav && <TopNavigationBar compact={compactHeader} />}
        {children}
      </div>

      {floatingAction}
    </main>
  );
}

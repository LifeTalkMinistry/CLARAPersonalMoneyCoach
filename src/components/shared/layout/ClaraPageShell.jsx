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
        backgroundColor: "#020617",
        backgroundImage: `
          radial-gradient(circle at 70% 40%, rgba(168, 85, 247, 0.18), transparent 40%),
          radial-gradient(circle at 30% 20%, rgba(250, 204, 21, 0.25), transparent 45%),
          radial-gradient(circle at 50% 80%, rgba(34, 197, 94, 0.18), transparent 50%),
          linear-gradient(180deg, #0b1220 0%, #052e2b 40%, #021018 100%)
        `,
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

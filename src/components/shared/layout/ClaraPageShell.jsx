import TopNavigationBar from "../navigation/TopNavigationBar";

export default function ClaraPageShell({
  children,
  floatingAction = null,
  compactHeader = true,
  hideTopNav = false,
}) {
  return (
    <main
      className="relative min-h-screen w-full overflow-x-hidden text-white"
      style={{
        background: "var(--clara-bg)",
        backgroundColor: "var(--clara-bg-base)",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        color: "var(--clara-text)",
        transition: "background var(--clara-theme-transition)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.035), transparent 18%), radial-gradient(circle at 50% 118%, rgba(28,78,138,0.18), transparent 42%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[430px] flex-col gap-4 px-3 pb-6 pt-2 sm:px-4">
        {!hideTopNav && <TopNavigationBar compact={compactHeader} />}
        {children}
      </div>

      {floatingAction}
    </main>
  );
}

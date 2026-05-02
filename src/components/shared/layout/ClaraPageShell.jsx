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
      }}
    >
      {/* ✅ REMOVE HEAVY OVERLAY (this was killing your gradient) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.02), transparent 20%)",
        }}
      />

      <div className="relative z-10 flex min-h-screen w-full flex-col gap-4 px-3 pb-6 pt-3">
        {!hideTopNav && <TopNavigationBar compact={compactHeader} />}
        {children}
      </div>

      {floatingAction}
    </main>
  );
}

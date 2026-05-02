import TopNavigationBar from "../navigation/TopNavigationBar";

export default function ClaraPageShell({
  children,
  floatingAction = null,
  compactHeader = true,
  hideTopNav = false,
}) {
  return (
    <main
      className="relative min-h-[100dvh] w-full overflow-x-hidden"
      style={{
        backgroundColor: "#020617",
        backgroundImage: `
          radial-gradient(circle at 80% 20%, rgba(56,189,248,0.18), transparent 40%),
          radial-gradient(circle at 20% 60%, rgba(34,211,238,0.12), transparent 45%),
          linear-gradient(180deg, #071426 0%, #06182e 40%, #020617 100%)
        `,
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        color: "#E6FAFF",
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

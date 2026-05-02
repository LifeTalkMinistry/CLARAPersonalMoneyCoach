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
        background:
          "radial-gradient(circle at 10% -4%, rgba(225,199,34,0.34), transparent 30%), radial-gradient(circle at 0% 18%, rgba(98,147,50,0.28), transparent 32%), radial-gradient(circle at 105% 88%, rgba(0,92,190,0.24), transparent 42%), linear-gradient(180deg, #08110b 0%, #071811 34%, #061a1b 62%, #061426 100%)",
        color: "var(--clara-text)",
        transition: "background var(--clara-theme-transition)",
      }}
    >
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(236,255,91,0.045), transparent 18%, transparent 82%, rgba(16,95,164,0.08)), linear-gradient(180deg, rgba(236,255,91,0.05), transparent 24%, rgba(0,0,0,0.18) 100%)",
        }}
      />

      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-48"
        style={{
          background:
            "linear-gradient(to top, rgba(4,12,22,0.92), rgba(4,12,22,0.42), transparent)",
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

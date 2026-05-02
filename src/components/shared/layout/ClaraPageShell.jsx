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
        backgroundColor: "#02090C",
        backgroundImage: `
          radial-gradient(circle at 12% 5%, rgba(166,232,18,0.16), transparent 30%),
          radial-gradient(circle at 92% 42%, rgba(54,128,255,0.14), transparent 38%),
          radial-gradient(circle at 30% 86%, rgba(4,155,104,0.16), transparent 42%),
          linear-gradient(180deg, #061116 0%, #031014 44%, #02070A 100%)
        `,
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        color: "#F6FFF1",
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

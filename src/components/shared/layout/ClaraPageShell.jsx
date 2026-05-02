import TopNavigationBar from "../navigation/TopNavigationBar";

export default function ClaraPageShell({
  children,
  floatingAction = null,
  compactHeader = true,
  hideTopNav = false,
}) {
  return (
    <main
      className="relative min-h-[100svh] w-full overflow-x-hidden"
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
      <div
        className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[430px] flex-col"
        style={{
          gap: "clamp(0.5rem, 1.2svh, 0.75rem)",
          paddingLeft: "clamp(0.625rem, 3.2vw, 0.875rem)",
          paddingRight: "clamp(0.625rem, 3.2vw, 0.875rem)",
          paddingTop: "max(env(safe-area-inset-top), clamp(0.5rem, 1.2svh, 0.75rem))",
          paddingBottom: "max(env(safe-area-inset-bottom), clamp(0.75rem, 1.8svh, 1rem))",
        }}
      >
        {!hideTopNav && <TopNavigationBar compact={compactHeader} />}
        {children}
      </div>

      {floatingAction}
    </main>
  );
}

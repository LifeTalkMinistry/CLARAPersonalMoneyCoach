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
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[430px] flex-col gap-4 px-3 pb-6 pt-2 sm:px-4">
        {!hideTopNav && <TopNavigationBar compact={compactHeader} />}
        {children}
      </div>

      {floatingAction}
    </main>
  );
}

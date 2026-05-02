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
          "radial-gradient(circle at 12% -6%, rgba(225,199,34,0.13), transparent 34%), radial-gradient(circle at 0% 16%, rgba(98,147,50,0.12), transparent 34%), radial-gradient(circle at 110% 92%, rgba(0,92,190,0.12), transparent 46%), linear-gradient(180deg, #020617 0%, #03100b 36%, #031211 66%, #020817 100%)",
        color: "var(--clara-text)",
        transition: "background var(--clara-theme-transition)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-black/[0.18]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[430px] flex-col gap-4 px-3 pb-6 pt-2 sm:px-4">
        {!hideTopNav && <TopNavigationBar compact={compactHeader} />}
        {children}
      </div>

      {floatingAction}
    </main>
  );
}

import TopNavigationBar from "../navigation/TopNavigationBar";

export default function ClaraPageShell({ children, floatingAction = null }) {
  return (
    <main className="min-h-screen bg-[#070b10] text-white flex justify-center">
      <div className="w-full max-w-sm px-4 pt-2 pb-6 space-y-3">
        <TopNavigationBar />
        {children}
      </div>

      {floatingAction}
    </main>
  );
}
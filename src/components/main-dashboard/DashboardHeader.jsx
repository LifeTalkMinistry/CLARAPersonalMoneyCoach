import { Bell, Settings } from "lucide-react";

export default function DashboardHeader() {
  return (
    <header className="rounded-3xl border border-white/15 bg-white/[0.06] p-4 backdrop-blur-xl shadow-[0_0_20px_rgba(0,0,0,0.4)]">
      
      <div className="flex items-center justify-between">
        
        {/* LEFT */}
        <div>
          <p className="text-[10px] tracking-[0.25em] text-white/50">
            CLARA
          </p>

          <h1 className="text-lg font-semibold text-white">
            Dashboard
          </h1>

          <p className="text-xs text-white/60">
            Your daily financial control center
          </p>
        </div>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-3">
          
          {/* Bell */}
          <button className="relative h-11 w-11 flex items-center justify-center rounded-2xl border border-white/20 bg-white/[0.10] shadow-[0_0_15px_rgba(255,255,255,0.08)] hover:bg-white/[0.18] transition">
            <Bell className="h-5 w-5 text-white" />
          </button>

          {/* Settings */}
          <button className="h-11 w-11 flex items-center justify-center rounded-2xl border border-white/20 bg-white/[0.10] shadow-[0_0_15px_rgba(255,255,255,0.08)] hover:bg-white/[0.18] transition">
            <Settings className="h-5 w-5 text-white" />
          </button>

        </div>

      </div>
    </header>
  );
}
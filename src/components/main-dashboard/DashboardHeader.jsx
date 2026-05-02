import { Bell, Settings } from "lucide-react";

export default function DashboardHeader() {
  return (
    <header
      className="rounded-3xl border p-4 backdrop-blur-xl"
      style={{
        borderColor: "var(--clara-border)",
        background: "var(--clara-glass)",
        boxShadow: "var(--clara-shadow-soft)",
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] tracking-[0.25em]" style={{ color: "var(--clara-accent-text)" }}>
            CLARA
          </p>

          <h1 className="text-lg font-semibold text-white">
            Dashboard
          </h1>

          <p className="text-xs" style={{ color: "var(--clara-text-soft)" }}>
            Your daily financial control center
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="clara-button-secondary relative flex h-11 w-11 items-center justify-center rounded-2xl transition">
            <Bell className="h-5 w-5 text-white" />
          </button>

          <button className="clara-button-secondary flex h-11 w-11 items-center justify-center rounded-2xl transition">
            <Settings className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </header>
  );
}

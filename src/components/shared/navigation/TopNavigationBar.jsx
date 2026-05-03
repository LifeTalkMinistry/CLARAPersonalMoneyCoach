import { useLocation, useNavigate } from "react-router-dom";
import { topNavItems } from "./navConfig";

export default function TopNavigationBar({ compact = false }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header style={{ marginBottom: "clamp(0.25rem, 1svh, 0.5rem)" }}>
      <div
        className="relative overflow-hidden rounded-[28px] border px-3 py-3 backdrop-blur-[24px]"
        style={{
          background: "rgba(255,255,255,0.06)",
          borderColor: "rgba(255,255,255,0.08)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
        }}
      >
        <nav className="relative flex items-center justify-between gap-2">
          {topNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className="flex min-h-[64px] flex-1 items-center justify-center rounded-2xl border-0 bg-transparent transition-all duration-300 active:scale-[0.97]"
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className="flex h-full w-full flex-col items-center justify-center gap-1.5 rounded-2xl transition-all duration-300"
                  style={
                    isActive
                      ? {
                          padding: compact ? "0.65rem 0.75rem" : "0.75rem 1rem",
                          color: "#8FE388",
                          background: "rgba(255,255,255,0.12)",
                          boxShadow: "inset 0 0 10px rgba(143,227,136,0.15)",
                        }
                      : {
                          padding: compact ? "0.65rem 0.75rem" : "0.75rem 1rem",
                          color: "rgba(255,255,255,0.50)",
                          background: "transparent",
                          boxShadow: "none",
                        }
                  }
                >
                  <Icon size={20} strokeWidth={2.1} />

                  <span
                    className="text-[11px] font-medium leading-none tracking-[-0.01em]"
                    style={{
                      color: isActive ? "#8FE388" : "rgba(255,255,255,0.50)",
                    }}
                  >
                    {item.label}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

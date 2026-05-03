import { useLocation, useNavigate } from "react-router-dom";
import { topNavItems } from "./navConfig";

export default function TopNavigationBar({ compact = false }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header style={{ marginBottom: "clamp(0.25rem, 1svh, 0.5rem)" }}>
      <div
        className="rounded-[28px] border px-3 py-3 backdrop-blur-[24px]"
        style={{
          background: "rgba(255, 255, 255, 0.06)",
          borderColor: "rgba(255, 255, 255, 0.08)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
        }}
      >
        <nav className="flex min-h-[64px] items-center justify-between gap-2">
          {topNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className="flex flex-1 items-center justify-center border-0 bg-transparent p-0 outline-none transition-transform duration-200 active:scale-[0.97]"
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className="flex flex-col items-center justify-center gap-1.5 rounded-2xl transition-colors duration-200"
                  style={{
                    minHeight: compact ? "54px" : "58px",
                    padding: compact ? "0.65rem 0.85rem" : "0.75rem 1rem",
                    color: isActive ? "#8FE388" : "rgba(255, 255, 255, 0.5)",
                    background: isActive ? "rgba(255, 255, 255, 0.12)" : "transparent",
                    border: "0",
                    boxShadow: isActive
                      ? "inset 0 0 10px rgba(143, 227, 136, 0.15)"
                      : "none",
                  }}
                >
                  <Icon size={20} strokeWidth={2.1} />

                  <span
                    className="text-[11px] font-medium leading-none tracking-[-0.01em]"
                    style={{
                      color: isActive ? "#8FE388" : "rgba(255, 255, 255, 0.5)",
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

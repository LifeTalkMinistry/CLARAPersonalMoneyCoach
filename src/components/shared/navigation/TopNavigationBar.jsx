import { useLocation, useNavigate } from "react-router-dom";
import { topNavItems } from "./navConfig";

export default function TopNavigationBar({ compact = false }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header style={{ marginBottom: "clamp(0.25rem, 1svh, 0.5rem)" }}>
      <div
        className="rounded-[28px] px-3 py-3 backdrop-blur-[28px]"
        style={{
          background: "rgba(255, 255, 255, 0.06)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow:
            "0 14px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        <nav className="flex min-h-[66px] items-center justify-between gap-2">
          {topNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className="flex flex-1 items-center justify-center bg-transparent p-0 transition-transform duration-200 active:scale-[0.96]"
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className="flex flex-col items-center justify-center gap-1.5 rounded-2xl transition-all duration-200"
                  style={{
                    minHeight: compact ? "56px" : "60px",
                    padding: compact ? "0.6rem 0.8rem" : "0.7rem 0.95rem",
                    color: isActive
                      ? "#8FE388"
                      : "rgba(255,255,255,0.5)",
                    background: isActive
                      ? "rgba(255,255,255,0.12)"
                      : "transparent",
                    boxShadow: isActive
                      ? "inset 0 0 12px rgba(143,227,136,0.18), inset 0 1px 2px rgba(255,255,255,0.08)"
                      : "none",
                  }}
                >
                  <Icon size={20} strokeWidth={2} />

                  <span
                    className="text-[11px] font-medium leading-none tracking-[-0.01em]"
                    style={{
                      color: isActive
                        ? "#8FE388"
                        : "rgba(255,255,255,0.5)",
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

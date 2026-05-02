import { useLocation, useNavigate } from "react-router-dom";
import { topNavItems } from "./navConfig";

export default function TopNavigationBar({ compact = false }) {
  const location = useLocation();
  const navigate = useNavigate();

  const activeIndex = Math.max(
    0,
    topNavItems.findIndex((item) => item.path === location.pathname)
  );

  return (
    <header style={{ marginBottom: "clamp(0.25rem, 1svh, 0.5rem)" }}>
      <div
        className="relative overflow-hidden rounded-[28px] border"
        style={{
          padding: "clamp(6px, 1.4svh, 10px)",
          background:
            "linear-gradient(180deg, rgba(10,40,34,0.95), rgba(4,18,22,0.96))",
          borderColor: "rgba(166,232,18,0.45)",
        }}
      >
        <nav className="relative grid grid-cols-4" style={{ gap: "clamp(4px, 1vw, 8px)" }}>
          <div
            className="pointer-events-none absolute bottom-0 top-0 rounded-[22px]"
            style={{
              width: "calc((100% - 0.75rem) / 4)",
              transform: `translateX(calc(${activeIndex} * (100% + 0.25rem)))`,
              background:
                "linear-gradient(180deg, rgba(166,232,18,0.45), rgba(255,255,255,0.06))",
              border: "1px solid rgba(166,232,18,0.55)",
            }}
          />

          {topNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center rounded-[22px]"
                style={{
                  paddingTop: "clamp(6px, 1.5svh, 10px)",
                  paddingBottom: "clamp(6px, 1.5svh, 10px)",
                }}
              >
                <span
                  className="flex items-center justify-center rounded-full border"
                  style={{
                    height: "clamp(30px, 4.5svh, 36px)",
                    width: "clamp(30px, 4.5svh, 36px)",
                    color: isActive ? "#F5FF9C" : "rgba(255,255,255,0.55)",
                    borderColor: isActive ? "rgba(166,232,18,0.6)" : "rgba(255,255,255,0.08)",
                    background: isActive ? "rgba(166,232,18,0.22)" : "transparent",
                  }}
                >
                  <Icon size={16} />
                </span>

                <span
                  style={{
                    fontSize: "clamp(8px, 1.2svh, 10px)",
                    opacity: isActive ? 1 : 0.5,
                    color: isActive ? "#F0FFAA" : "rgba(255,255,255,0.55)",
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

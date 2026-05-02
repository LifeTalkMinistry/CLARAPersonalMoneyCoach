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
    <header className={compact ? "px-0 pt-1" : "px-4 pt-3"}>
      <div
        className={`relative overflow-hidden rounded-[28px] border ${
          compact ? "p-1.5" : "p-2"
        }`}
        style={{
          background:
            "linear-gradient(180deg, rgba(10,40,34,0.95), rgba(4,18,22,0.96))",
          borderColor: "rgba(166,232,18,0.35)",
          boxShadow: "0 0 0 1px rgba(166,232,18,0.15) inset",
        }}
      >
        <nav className="relative grid grid-cols-4 gap-1.5">
          <div
            className="pointer-events-none absolute bottom-0 top-0 rounded-[22px]"
            style={{
              width: "calc((100% - 1.125rem) / 4)",
              transform: `translateX(calc(${activeIndex} * (100% + 0.375rem)))`,
              background:
                "linear-gradient(180deg, rgba(166,232,18,0.28), rgba(255,255,255,0.05))",
              border: "1px solid rgba(166,232,18,0.35)",
            }}
          />

          {topNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center gap-1 rounded-[22px] py-2"
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full border"
                  style={{
                    color: isActive ? "#DFFF7A" : "rgba(255,255,255,0.55)",
                    borderColor: isActive ? "rgba(166,232,18,0.35)" : "rgba(255,255,255,0.08)",
                    background: isActive ? "rgba(166,232,18,0.12)" : "transparent",
                  }}
                >
                  <Icon size={18} />
                </span>

                <span
                  style={{
                    fontSize: "9px",
                    opacity: isActive ? 0.95 : 0.5,
                    color: isActive ? "#EFFF9F" : "rgba(255,255,255,0.55)",
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

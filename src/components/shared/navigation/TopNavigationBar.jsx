import { useLocation, useNavigate } from "react-router-dom";
import { topNavItems } from "./navConfig";

export default function TopNavigationBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeIndex = Math.max(
    0,
    topNavItems.findIndex((item) => item.path === location.pathname)
  );

  return (
    <header className="px-4 pt-4">
      <div className="relative overflow-hidden rounded-[28px] border border-amber-400/30 bg-gradient-to-br from-white/10 via-slate-900/80 to-amber-950/30 p-1.5 backdrop-blur-2xl shadow-[0_0_35px_rgba(245,158,11,0.15)]">
        <nav className="relative grid grid-cols-4 gap-2">
          <div
            className="absolute bottom-0 top-0 rounded-[22px] bg-white/15 shadow-[inset_0_0_20px_rgba(255,255,255,0.12),0_0_20px_rgba(251,191,36,0.15)] transition-all duration-300 ease-out"
            style={{
              width: "calc((100% - 1.5rem) / 4)",
              transform: `translateX(calc(${activeIndex} * (100% + 0.5rem)))`,
            }}
          />

          {topNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className="group relative z-10 flex flex-col items-center justify-center gap-1.5 py-3 text-[11px] font-semibold transition-all duration-200 active:scale-95"
              >
                {item.badge && (
                  <span className="absolute right-4 top-2">
                    {item.badge === "dot" ? (
                      <span className="block h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.9)]" />
                    ) : (
                      <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-sky-400 px-1 text-[9px] font-bold text-slate-950 shadow-[0_0_10px_rgba(56,189,248,0.9)]">
                        {item.badge}
                      </span>
                    )}
                  </span>
                )}

                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 ${
                    isActive
                      ? "scale-105 border-amber-200/70 bg-amber-300/15 text-amber-100 shadow-[0_0_12px_rgba(251,191,36,0.25)]"
                      : "border-white/30 bg-white/10 text-white group-hover:scale-105"
                  }`}
                >
                  <Icon size={18} strokeWidth={1.8} />
                </span>

                <span
                  className={`transition-all duration-300 ${
                    isActive
                      ? "text-white"
                      : "text-white/70 group-hover:text-white"
                  }`}
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
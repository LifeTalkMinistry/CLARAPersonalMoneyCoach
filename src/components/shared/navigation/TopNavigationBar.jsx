import { useLocation, useNavigate } from "react-router-dom";
import Avatar from "../Avatar";
import { useAvatar } from "../../../context/AvatarContext";
import { topNavItems } from "./navConfig";

const PROFILE_PLAN = "Free";

export default function TopNavigationBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { avatar, hydrated } = useAvatar();

  const profileName = avatar?.name || "CLARA User";
  const firstName = profileName.split(" ").filter(Boolean)[0] || "CLARA";

  const activeIndex = Math.max(
    0,
    topNavItems.findIndex((item) => item.path === location.pathname)
  );

  return (
    <header className="px-4 pt-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="group flex min-w-0 items-center gap-3 text-left active:scale-[0.98]"
          aria-label="Go to dashboard"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-amber-300/25 bg-gradient-to-br from-white/12 via-white/[0.06] to-amber-400/10 text-sm font-black tracking-tight text-amber-50 shadow-[0_0_22px_rgba(245,158,11,0.12)] transition group-hover:scale-105">
            C
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight text-white">CLARA</p>
            <p className="truncate text-[10px] font-medium uppercase tracking-[0.18em] text-white/40">
              Personal Money Coach
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate("/settings")}
          className="group relative flex shrink-0 items-center gap-2 rounded-[22px] border border-white/10 bg-white/[0.055] px-2.5 py-2 text-left backdrop-blur-xl transition hover:bg-white/[0.08] active:scale-95"
          aria-label="Open profile settings"
        >
          <span className="relative block h-10 w-10">
            <Avatar
              size={40}
              className={`rounded-2xl border-amber-200/35 bg-gradient-to-br from-amber-200/25 via-white/10 to-slate-900/60 text-[13px] font-black shadow-[0_0_22px_rgba(245,158,11,0.16)] transition group-hover:scale-105 ${
                hydrated ? "opacity-100" : "opacity-70"
              }`}
            />
            <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#070b10] bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
          </span>

          <span className="hidden min-w-0 sm:block">
            <span className="block max-w-[84px] truncate text-xs font-semibold text-white/85">
              {firstName}
            </span>
            <span className="mt-0.5 inline-flex rounded-full border border-amber-300/25 bg-amber-300/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-amber-100">
              {PROFILE_PLAN}
            </span>
          </span>
        </button>
      </div>

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
                    isActive ? "text-white" : "text-white/70 group-hover:text-white"
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

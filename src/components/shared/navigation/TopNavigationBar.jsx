import { useLocation, useNavigate } from "react-router-dom";
import Avatar from "../Avatar";
import { useAvatar } from "../../../context/AvatarContext";
import { topNavItems } from "./navConfig";

const PROFILE_PLAN = "Free";

export default function TopNavigationBar({ compact = false }) {
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
    <header className={compact ? "px-0 pt-1" : "px-4 pt-3"}>
      {!compact && (
        <div className="mb-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="group flex min-w-0 items-center gap-3 text-left transition duration-300 ease-out active:scale-[0.97]"
            aria-label="Go to dashboard"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border text-sm font-black tracking-tight transition duration-300 ease-out group-hover:scale-[1.03]"
              style={{
                borderColor: "rgba(98,217,255,0.18)",
                background: "linear-gradient(180deg, rgba(20,62,92,0.78), rgba(8,24,45,0.82))",
                color: "rgba(214,247,255,0.92)",
                boxShadow: "0 12px 26px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.10)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
            >
              C
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold leading-tight text-white/90">
                CLARA
              </p>
              <p className="truncate text-[10px] font-medium uppercase tracking-[0.18em] text-white/40">
                Personal Money Coach
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate("/settings")}
            className="group relative flex shrink-0 items-center gap-2 rounded-full border px-2.5 py-2 text-left transition duration-300 ease-out active:scale-[0.94]"
            style={{
              borderColor: "rgba(98,217,255,0.14)",
              background: "linear-gradient(180deg, rgba(16,45,74,0.70), rgba(7,20,39,0.78))",
              boxShadow: "0 12px 26px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.09)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }}
            aria-label="Open profile settings"
          >
            <span className="relative block h-10 w-10">
              <Avatar
                size={40}
                className={`rounded-2xl text-[13px] font-black transition duration-300 ease-out group-hover:scale-[1.03] ${
                  hydrated ? "opacity-100" : "opacity-70"
                }`}
                style={{
                  borderColor: "rgba(98,217,255,0.16)",
                  background: "rgba(255,255,255,0.05)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
                }}
              />
              <span
                className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 opacity-80 transition duration-300 ease-out"
                style={{
                  borderColor: "#071427",
                  background: "#37e6b0",
                  boxShadow: "0 0 10px rgba(55,230,176,0.22)",
                }}
              />
            </span>

            <span className="hidden min-w-0 sm:block">
              <span className="block max-w-[84px] truncate text-xs font-semibold text-white/70">
                {firstName}
              </span>
              <span
                className="mt-0.5 inline-flex rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em]"
                style={{
                  borderColor: "rgba(98,217,255,0.16)",
                  background: "rgba(255,255,255,0.05)",
                  color: "rgba(214,247,255,0.78)",
                }}
              >
                {PROFILE_PLAN}
              </span>
            </span>
          </button>
        </div>
      )}

      <div
        className={`relative overflow-hidden rounded-[28px] border transition-all duration-300 ease-out ${
          compact ? "p-1.5" : "p-2"
        }`}
        style={{
          background:
            "linear-gradient(180deg, rgba(19,48,88,0.86), rgba(8,25,51,0.92))",
          borderColor: "rgba(77,203,255,0.42)",
          boxShadow:
            "0 16px 36px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(77,203,255,0.10)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <nav className="relative grid grid-cols-4 gap-1.5">
          <div
            className="pointer-events-none absolute bottom-0 top-0 overflow-hidden rounded-[22px]"
            style={{
              width: "calc((100% - 1.125rem) / 4)",
              transform: `translateX(calc(${activeIndex} * (100% + 0.375rem)))`,
              background:
                "linear-gradient(180deg, rgba(86,214,255,0.24), rgba(255,255,255,0.06))",
              border: "1px solid rgba(154,235,255,0.24)",
              boxShadow:
                "0 10px 22px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.14)",
              transition: "all 340ms cubic-bezier(0.2, 0.8, 0.2, 1)",
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
                className="group relative z-10 flex min-h-[68px] flex-col items-center justify-center gap-1 rounded-[22px] px-1 py-2 text-[10px] font-semibold transition-all duration-300 ease-out active:scale-[0.94]"
              >
                {item.badge && (
                  <span className="absolute right-4 top-2.5">
                    {item.badge === "dot" ? (
                      <span
                        className="block h-1.5 w-1.5 rounded-full"
                        style={{
                          background: "#37d7ff",
                          boxShadow: "0 0 8px rgba(55,215,255,0.36)",
                        }}
                      />
                    ) : (
                      <span
                        className="flex h-3.5 min-w-3.5 items-center justify-center rounded-full px-1 text-[8px] font-bold"
                        style={{
                          background: "#37e6b0",
                          color: "#06111f",
                          boxShadow: "0 0 8px rgba(55,230,176,0.24)",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </span>
                )}

                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 ease-out group-active:scale-[0.92]"
                  style={{
                    opacity: isActive ? 1 : 0.72,
                    color: isActive ? "rgba(226,250,255,0.96)" : "rgba(226,250,255,0.62)",
                    background: isActive ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.025)",
                    borderColor: isActive ? "rgba(154,235,255,0.26)" : "rgba(255,255,255,0.08)",
                    boxShadow: isActive ? "inset 0 1px 0 rgba(255,255,255,0.10)" : "none",
                    transform: isActive ? "translateY(-1px) scale(1.02)" : "scale(1)",
                  }}
                >
                  <Icon size={17} strokeWidth={1.85} />
                </span>

                <span
                  className="transition-all duration-300 ease-out group-active:scale-[0.98]"
                  style={{
                    opacity: isActive ? 0.95 : 0.58,
                    color: isActive ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.58)",
                    transform: isActive ? "translateY(-1px)" : "translateY(0)",
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

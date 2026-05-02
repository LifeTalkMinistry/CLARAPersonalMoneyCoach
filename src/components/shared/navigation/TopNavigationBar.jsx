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
    <header className={compact ? "px-0 pt-2" : "px-4 pt-4"}>
      {!compact && (
        <div className="mb-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="group flex min-w-0 items-center gap-3 text-left transition duration-200 active:scale-[0.98]"
            aria-label="Go to dashboard"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border text-sm font-black tracking-tight transition group-hover:scale-105"
              style={{
                borderColor: "var(--clara-accent-border)",
                background: "var(--clara-accent-soft)",
                color: "var(--clara-accent-text)",
                boxShadow: "var(--clara-glow-premium)",
              }}
            >
              C
            </div>

            <div className="min-w-0">
              <p
                className="truncate text-sm font-semibold leading-tight"
                style={{ color: "var(--clara-text)" }}
              >
                CLARA
              </p>
              <p
                className="truncate text-[10px] font-medium uppercase tracking-[0.18em]"
                style={{ color: "var(--clara-text-muted)" }}
              >
                Personal Money Coach
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate("/settings")}
            className="group relative flex shrink-0 items-center gap-2 rounded-[22px] border px-2.5 py-2 text-left backdrop-blur-xl transition duration-200 active:scale-95"
            style={{
              borderColor: "var(--clara-border)",
              background: "var(--clara-glass)",
            }}
            aria-label="Open profile settings"
          >
            <span className="relative block h-10 w-10">
              <Avatar
                size={40}
                className={`rounded-2xl text-[13px] font-black transition group-hover:scale-105 ${
                  hydrated ? "opacity-100" : "opacity-70"
                }`}
                style={{
                  borderColor: "var(--clara-accent-border)",
                  background: "var(--clara-accent-soft)",
                  boxShadow: "var(--clara-glow-premium)",
                }}
              />
              <span
                className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2"
                style={{
                  borderColor: "var(--clara-bg)",
                  background: "var(--clara-accent)",
                  boxShadow: "0 0 10px var(--clara-glow)",
                }}
              />
            </span>

            <span className="hidden min-w-0 sm:block">
              <span
                className="block max-w-[84px] truncate text-xs font-semibold"
                style={{ color: "var(--clara-text-soft)" }}
              >
                {firstName}
              </span>
              <span
                className="mt-0.5 inline-flex rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em]"
                style={{
                  borderColor: "var(--clara-accent-border)",
                  background: "var(--clara-accent-soft)",
                  color: "var(--clara-accent-text)",
                }}
              >
                {PROFILE_PLAN}
              </span>
            </span>
          </button>
        </div>
      )}

      <div
        className={`clara-pill-panel relative overflow-hidden rounded-[28px] backdrop-blur-2xl transition-all duration-300 ${
          compact ? "p-1" : "p-1.5"
        }`}
      >
        <nav className="relative grid grid-cols-4 gap-1.5">
          <div
            className="absolute bottom-0 top-0 overflow-hidden rounded-[22px] transition-all duration-500 ease-out"
            style={{
              width: "calc((100% - 1.125rem) / 4)",
              transform: `translateX(calc(${activeIndex} * (100% + 0.375rem)))`,
              background: "linear-gradient(145deg, rgba(98,146,49,0.48), rgba(34,82,45,0.44) 56%, rgba(13,48,76,0.36))",
              boxShadow: "0 14px 28px rgba(0,0,0,0.18), 0 0 18px var(--clara-glow-soft), inset 0 1px 0 rgba(255,255,255,0.12)",
            }}
          >
            <span
              className="pointer-events-none absolute inset-y-0 -left-1/3 w-[135%] rounded-[22px]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, var(--clara-accent-soft), transparent)",
              }}
            />
            <span
              className="pointer-events-none absolute inset-x-3 top-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, var(--clara-accent-border), transparent)",
              }}
            />
            <span
              className="pointer-events-none absolute inset-0 rounded-[22px]"
              style={{ background: "var(--clara-surface-glow)" }}
            />
          </div>

          {topNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className="group relative z-10 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold transition-all duration-200 active:scale-95"
              >
                {item.badge && (
                  <span className="absolute right-4 top-2">
                    {item.badge === "dot" ? (
                      <span
                        className="block h-2 w-2 rounded-full"
                        style={{
                          background: "var(--clara-accent)",
                          boxShadow: "0 0 10px var(--clara-glow)",
                        }}
                      />
                    ) : (
                      <span
                        className="flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold"
                        style={{
                          background: "var(--clara-accent)",
                          color: "var(--clara-bg)",
                          boxShadow: "0 0 10px var(--clara-glow)",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </span>
                )}

                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300"
                  style={{
                    borderColor: isActive
                      ? "var(--clara-accent-border)"
                      : "var(--clara-border)",
                    background: isActive
                      ? "linear-gradient(145deg, rgba(191,215,74,0.16), rgba(16,39,28,0.22))"
                      : "var(--clara-panel)",
                    color: isActive
                      ? "var(--clara-accent-text)"
                      : "var(--clara-text-soft)",
                    boxShadow: isActive ? "0 0 18px var(--clara-glow-soft), inset 0 1px 0 rgba(255,255,255,0.10)" : "inset 0 1px 0 rgba(255,255,255,0.05)",
                  }}
                >
                  <Icon size={16} strokeWidth={1.8} />
                </span>

                <span
                  className="transition-all duration-300"
                  style={{
                    color: isActive ? "var(--clara-text)" : "var(--clara-text-muted)",
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

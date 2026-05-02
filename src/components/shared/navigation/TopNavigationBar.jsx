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
                borderColor: "rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.045)",
                color: "var(--clara-accent-text)",
                boxShadow: "0 10px 24px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.10)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
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
            className="group relative flex shrink-0 items-center gap-2 rounded-full border px-2.5 py-2 text-left transition duration-300 ease-out active:scale-[0.94]"
            style={{
              borderColor: "rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)",
              boxShadow: "0 10px 24px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.08)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
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
                  borderColor: "rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.05)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
                }}
              />
              <span
                className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 opacity-80 transition duration-300 ease-out"
                style={{
                  borderColor: "var(--clara-bg)",
                  background: "var(--clara-accent)",
                  boxShadow: "0 3px 8px rgba(199,226,58,0.18)",
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
                  borderColor: "rgba(199,226,58,0.18)",
                  background: "rgba(199,226,58,0.08)",
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
        className={`relative overflow-hidden rounded-full border transition-all duration-300 ease-out ${
          compact ? "p-1" : "p-1.5"
        }`}
        style={{
          background: "rgba(255,255,255,0.04)",
          borderColor: "rgba(255,255,255,0.08)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <nav className="relative grid grid-cols-4 gap-1">
          <div
            className="pointer-events-none absolute bottom-0 top-0 overflow-hidden rounded-full"
            style={{
              width: "calc((100% - 0.75rem) / 4)",
              transform: `translateX(calc(${activeIndex} * (100% + 0.25rem)))`,
              background: "rgba(199,226,58,0.14)",
              boxShadow: "0 8px 18px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.14)",
              transition: "all 300ms cubic-bezier(0.2, 0.8, 0.2, 1)",
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
                className="group relative z-10 flex flex-col items-center justify-center gap-[1px] rounded-full py-1.5 pt-2 text-[8px] font-medium transition-all duration-300 ease-out active:scale-[0.92]"
              >
                {isActive && (
                  <span
                    className="absolute top-1 h-[3px] w-[3px] rounded-full opacity-55 transition-all duration-300 ease-out"
                    style={{
                      background: "var(--clara-accent)",
                    }}
                  />
                )}

                {item.badge && (
                  <span className="absolute right-3 top-1.5">
                    {item.badge === "dot" ? (
                      <span
                        className="block h-1.5 w-1.5 rounded-full opacity-70"
                        style={{
                          background: "var(--clara-accent)",
                          boxShadow: "0 3px 8px rgba(199,226,58,0.12)",
                        }}
                      />
                    ) : (
                      <span
                        className="flex h-3.5 min-w-3.5 items-center justify-center rounded-full px-1 text-[8px] font-bold"
                        style={{
                          background: "var(--clara-accent)",
                          color: "var(--clara-bg)",
                          boxShadow: "0 3px 8px rgba(199,226,58,0.12)",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </span>
                )}

                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300 ease-out group-active:scale-[0.92]"
                  style={{
                    opacity: isActive ? 0.95 : 0.62,
                    color: isActive ? "var(--clara-text)" : "var(--clara-text-muted)",
                    transform: isActive ? "scale(1.06)" : "scale(1)",
                    filter: isActive ? "brightness(1.04)" : "none",
                  }}
                >
                  <Icon size={16} strokeWidth={1.8} />
                </span>

                <span
                  className="transition-all duration-300 ease-out group-active:scale-[0.98]"
                  style={{
                    opacity: isActive ? 0.85 : 0.45,
                    color: isActive ? "var(--clara-text)" : "var(--clara-text-muted)",
                    transform: isActive ? "scale(1.01)" : "scale(1)",
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

import { useLocation, useNavigate } from "react-router-dom";
import { topNavItems } from "./navConfig";

export default function TopNavigationBar({ compact = false }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header
      className="w-full px-4 pt-4"
      style={{ marginBottom: "clamp(0.35rem, 1.2svh, 0.75rem)" }}
    >
      <div
        className="relative mx-auto w-full max-w-[340px] overflow-hidden rounded-[30px] border px-3 py-2.5 backdrop-blur-[26px]"
        style={{
          background: "rgba(255,255,255,0.07)",
          borderColor: "rgba(255,255,255,0.10)",
          boxShadow:
            "0 12px 32px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(255,255,255,0.035)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-[30px]"
          style={{
            background:
              "radial-gradient(circle at 16% 18%, rgba(255,255,255,0.13), transparent 30%), radial-gradient(circle at 82% 0%, rgba(130,170,255,0.07), transparent 38%)",
          }}
        />

        <div
          className="pointer-events-none absolute inset-[1px] rounded-[29px]"
          style={{
            border: "1px solid rgba(255,255,255,0.045)",
          }}
        />

        <nav className="relative z-10 flex min-h-[58px] items-center justify-between gap-1">
          {topNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className="m-0 flex min-w-0 flex-1 appearance-none items-center justify-center rounded-[24px] border-0 bg-transparent p-0 outline-none ring-0 transition-transform duration-200 ease-out active:scale-[0.96] focus:outline-none focus:ring-0"
                style={{
                  WebkitTapHighlightColor: "transparent",
                  boxShadow: "none",
                }}
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className="flex w-full flex-col items-center justify-center gap-1.5 rounded-[24px] transition-all duration-200 ease-out"
                  style={{
                    minHeight: compact ? "50px" : "54px",
                    padding: compact ? "0.48rem 0.35rem" : "0.58rem 0.38rem",
                    color: isActive
                      ? "rgba(164,242,157,0.96)"
                      : "rgba(255,255,255,0.46)",
                    background: isActive
                      ? "rgba(255,255,255,0.105)"
                      : "transparent",
                    border: isActive
                      ? "1px solid rgba(255,255,255,0.085)"
                      : "1px solid transparent",
                    boxShadow: isActive
                      ? "inset 0 1px 0 rgba(255,255,255,0.11), inset 0 -1px 0 rgba(255,255,255,0.035), 0 8px 18px rgba(0,0,0,0.18), 0 0 16px rgba(74,222,128,0.075)"
                      : "none",
                    transform: isActive ? "scale(1.025)" : "scale(1)",
                  }}
                >
                  <Icon size={18.5} strokeWidth={2} />

                  <span
                    className="text-[10px] font-medium leading-none tracking-[-0.01em] transition-colors duration-200 ease-out"
                    style={{
                      color: isActive
                        ? "rgba(175,246,168,0.92)"
                        : "rgba(255,255,255,0.38)",
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

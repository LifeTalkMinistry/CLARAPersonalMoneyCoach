import { useLocation, useNavigate } from "react-router-dom";
import { topNavItems } from "./navConfig";

export default function TopNavigationBar({ compact = false }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header
      className="w-full px-2 pt-3"
      style={{ marginBottom: "clamp(0.25rem, 1svh, 0.5rem)" }}
    >
      <div
        className="relative mx-auto max-w-[360px] overflow-hidden rounded-[30px] border px-3 py-3 backdrop-blur-[24px]"
        style={{
          background: "rgba(255,255,255,0.065)",
          borderColor: "rgba(255,255,255,0.09)",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-[30px]"
          style={{
            background:
              "radial-gradient(circle at 18% 18%, rgba(255,255,255,0.09), transparent 32%), radial-gradient(circle at 82% 0%, rgba(120,165,255,0.055), transparent 38%)",
          }}
        />

        <nav className="relative z-10 flex min-h-[58px] items-center justify-between gap-1.5">
          {topNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className="m-0 flex min-w-0 flex-1 appearance-none items-center justify-center rounded-[22px] border-0 bg-transparent p-0 outline-none ring-0 transition-transform duration-200 ease-out active:scale-[0.96] focus:outline-none focus:ring-0"
                style={{
                  WebkitTapHighlightColor: "transparent",
                  boxShadow: "none",
                }}
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className="flex w-full flex-col items-center justify-center gap-1.5 rounded-[22px] transition-all duration-200 ease-out"
                  style={{
                    minHeight: compact ? "52px" : "56px",
                    padding: compact ? "0.55rem 0.45rem" : "0.62rem 0.5rem",
                    color: isActive
                      ? "rgba(152,235,146,0.95)"
                      : "rgba(255,255,255,0.50)",
                    background: isActive
                      ? "rgba(255,255,255,0.09)"
                      : "transparent",
                    border: isActive
                      ? "1px solid rgba(255,255,255,0.075)"
                      : "1px solid transparent",
                    boxShadow: isActive
                      ? "inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 18px rgba(0,0,0,0.16), 0 0 14px rgba(74,222,128,0.08)"
                      : "none",
                    transform: isActive ? "scale(1.03)" : "scale(1)",
                  }}
                >
                  <Icon size={19} strokeWidth={2} />

                  <span
                    className="text-[10.5px] font-medium leading-none tracking-[-0.01em] transition-colors duration-200 ease-out"
                    style={{
                      color: isActive
                        ? "rgba(166,242,158,0.92)"
                        : "rgba(255,255,255,0.42)",
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

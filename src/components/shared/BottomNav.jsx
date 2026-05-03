import { Home, Rss, MessageCircle, Settings } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Rss, label: "Feed", path: "/feed" },
    { icon: MessageCircle, label: "Message", path: "/messages" },
    { icon: Settings, label: "Setting", path: "/settings" },
  ];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 w-full px-4 sm:bottom-5 sm:px-6">
      <nav
        aria-label="Primary navigation"
        className="pointer-events-auto relative mx-auto max-w-[390px] overflow-hidden rounded-[32px] border px-3 py-3 backdrop-blur-[28px] supports-[backdrop-filter]:backdrop-saturate-150"
        style={{
          borderColor: "rgba(255,255,255,0.08)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.045))",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-[32px]"
          style={{
            background:
              "radial-gradient(circle at 18% 14%, rgba(255,255,255,0.10), transparent 30%), radial-gradient(circle at 78% 0%, rgba(120,160,255,0.07), transparent 34%)",
          }}
        />

        <div className="relative z-10 flex items-center justify-between gap-1.5">
          {navItems.map(({ icon: Icon, label, path }) => {
            const isActive = pathname === path;

            return (
              <button
                key={path}
                type="button"
                onClick={() => navigate(path)}
                className="relative flex min-h-[58px] flex-1 items-center justify-center rounded-[24px] border-0 bg-transparent outline-none transition-all duration-200 ease-out active:scale-[0.96]"
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className={`relative z-10 flex h-full w-full flex-col items-center justify-center gap-1.5 rounded-[24px] transition-all duration-200 ease-out ${
                    isActive ? "scale-[1.05]" : "scale-100"
                  }`}
                >
                  <span
                    className="grid h-9 w-9 place-items-center rounded-full transition-all duration-200 ease-out"
                    style={
                      isActive
                        ? {
                            color: "rgba(152,235,146,0.95)",
                            background: "rgba(74,222,128,0.11)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            boxShadow:
                              "0 8px 18px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.10), 0 0 14px rgba(74,222,128,0.10)",
                          }
                        : {
                            color: "rgba(255,255,255,0.50)",
                            background: "transparent",
                            border: "1px solid transparent",
                            boxShadow: "none",
                          }
                    }
                  >
                    <Icon className="h-[19px] w-[19px]" strokeWidth={2} />
                  </span>

                  <span
                    className="text-[10.5px] font-medium leading-none tracking-[-0.01em] transition-colors duration-200 ease-out"
                    style={{
                      color: isActive
                        ? "rgba(166,242,158,0.92)"
                        : "rgba(255,255,255,0.40)",
                    }}
                  >
                    {label}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

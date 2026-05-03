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
    <div className="w-full mt-1 px-1">
      <nav
        aria-label="Primary navigation"
        className="relative overflow-hidden rounded-[28px] border px-3 py-3 backdrop-blur-[24px]"
        style={{
          borderColor: "rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.06)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
        }}
      >
        <div className="relative z-10 flex items-center justify-between gap-2">
          {navItems.map(({ icon: Icon, label, path }) => {
            const isActive = pathname === path;

            return (
              <button
                key={path}
                type="button"
                onClick={() => navigate(path)}
                className="relative flex min-h-[64px] flex-1 items-center justify-center rounded-2xl border-0 bg-transparent transition-all duration-300 active:scale-[0.97]"
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-1.5 rounded-2xl transition-all duration-300"
                  style={
                    isActive
                      ? {
                          padding: "0.75rem 1rem",
                          color: "#8FE388",
                          background: "rgba(255,255,255,0.12)",
                          boxShadow: "inset 0 0 10px rgba(143,227,136,0.15)",
                        }
                      : {
                          color: "rgba(255,255,255,0.50)",
                          background: "transparent",
                          boxShadow: "none",
                        }
                  }
                >
                  <Icon className="h-[20px] w-[20px]" strokeWidth={2.1} />

                  <span
                    className="text-[11px] font-medium leading-none tracking-[-0.01em]"
                    style={{
                      color: isActive ? "#8FE388" : "rgba(255,255,255,0.50)",
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

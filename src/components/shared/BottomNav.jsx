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
        className="relative overflow-hidden rounded-[32px] border px-2.5 py-2.5 backdrop-blur-xl"
        style={{
          borderColor: "rgba(255,255,255,0.10)",
          background:
            "linear-gradient(135deg, rgba(24,72,38,0.86) 0%, rgba(14,57,43,0.84) 48%, rgba(8,39,62,0.88) 100%)",
          boxShadow:
            "0 20px 55px rgba(0,0,0,0.42), 0 10px 28px rgba(8,39,62,0.22), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-x-7 top-0 h-px opacity-70"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(236,255,91,0.38), rgba(255,255,255,0.16), transparent)",
          }}
        />

        <div className="relative z-10 flex items-center justify-between gap-1">
          {navItems.map(({ icon: Icon, label, path }) => {
            const isActive = pathname === path;

            return (
              <button
                key={path}
                type="button"
                onClick={() => navigate(path)}
                className="relative flex min-h-[72px] flex-1 items-center justify-center rounded-[24px] transition-all duration-300 active:scale-[0.97]"
                aria-current={isActive ? "page" : undefined}
              >
                {isActive && (
                  <span
                    className="absolute inset-0 rounded-[24px]"
                    style={{
                      border: "1px solid rgba(236,255,91,0.14)",
                      background:
                        "linear-gradient(145deg, rgba(97,144,52,0.46), rgba(39,91,49,0.42) 58%, rgba(19,65,51,0.34))",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -18px 30px rgba(0,0,0,0.12), 0 12px 28px rgba(0,0,0,0.20)",
                    }}
                  />
                )}

                <span
                  className={`relative z-10 flex flex-col items-center justify-center gap-2 transition-colors duration-300 ${
                    isActive ? "text-[#e6ff48]" : "text-white/58 hover:text-white/82"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${
                      isActive ? "border-[#e6ff48]/28 bg-black/18" : "border-white/8 bg-black/12"
                    }`}
                    style={
                      isActive
                        ? {
                            boxShadow:
                              "0 0 0 1px rgba(230,255,72,0.04), inset 0 1px 0 rgba(255,255,255,0.10)",
                          }
                        : {
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                          }
                    }
                  >
                    <Icon className="h-[20px] w-[20px]" strokeWidth={2.1} />
                  </span>

                  <span
                    className={`text-[11px] font-semibold leading-none tracking-[-0.01em] ${
                      isActive ? "text-white" : "text-white/58"
                    }`}
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

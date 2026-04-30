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
    <div className="w-full mt-1">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.10] via-white/[0.05] to-transparent backdrop-blur-2xl px-3 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.7)]">
        
        <div className="flex items-center justify-between">
          {navItems.map(({ icon: Icon, label, path }) => {
            const isActive = pathname === path;

            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="flex flex-col items-center justify-center flex-1 relative"
              >
                {/* ACTIVE GLOW BACKGROUND */}
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400/20 via-yellow-300/10 to-purple-500/20 blur-lg" />
                )}

                <div
                  className={`relative z-10 flex flex-col items-center transition-all duration-300 ${
                    isActive
                      ? "text-amber-300"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px] mt-1 tracking-wide">
                    {label}
                  </span>
                </div>

                {/* ACTIVE DOT */}
                {isActive && (
                  <div className="mt-1 h-[4px] w-[4px] rounded-full bg-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
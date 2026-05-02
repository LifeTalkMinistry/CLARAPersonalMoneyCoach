import { useLocation, useNavigate } from "react-router-dom";
import Avatar from "../Avatar";
import { useAvatar } from "../../../context/AvatarContext";
import { topNavItems } from "./navConfig";

const PROFILE_PLAN = "Free";

export default function TopNavigationBar({ compact = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { avatar } = useAvatar();

  const activeIndex = Math.max(
    0,
    topNavItems.findIndex((item) => item.path === location.pathname)
  );

  return (
    <header className={compact ? "px-0 pt-1" : "px-4 pt-3"}>
      <div
        className={`relative overflow-hidden rounded-[28px] border ${
          compact ? "p-1.5" : "p-2"
        }`}
        style={{
          background:
            "linear-gradient(180deg, rgba(19,48,88,0.86), rgba(8,25,51,0.92))",
          borderColor: "rgba(77,203,255,0.42)",
        }}
      >
        <nav className="relative grid grid-cols-4 gap-1.5">
          <div
            className="pointer-events-none absolute bottom-0 top-0 rounded-[22px]"
            style={{
              width: "calc((100% - 1.125rem) / 4)",
              transform: `translateX(calc(${activeIndex} * (100% + 0.375rem)))`,
              background:
                "linear-gradient(180deg, rgba(86,214,255,0.24), rgba(255,255,255,0.06))",
              border: "1px solid rgba(154,235,255,0.24)",
            }}
          />

          {topNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center gap-1 rounded-[22px] py-2"
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full border"
                  style={{
                    color: isActive ? "#E6FAFF" : "rgba(255,255,255,0.6)",
                    borderColor: isActive ? "rgba(154,235,255,0.26)" : "rgba(255,255,255,0.08)",
                  }}
                >
                  <Icon size={18} />
                </span>

                <span
                  style={{
                    fontSize: "9px",
                    opacity: isActive ? 0.9 : 0.55,
                    color: isActive ? "#ffffff" : "rgba(255,255,255,0.6)",
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

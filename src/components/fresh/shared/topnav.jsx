import { Home, MessageCircle, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "flex flex-col items-center gap-1 rounded-[18px] px-2 py-2 text-xs font-bold transition active:scale-[0.98]",
          isActive ? "bg-cyan-400/15 text-white" : "text-white/80 hover:bg-white/[0.04]",
        ].join(" ")
      }
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-200/30 bg-cyan-300/15 text-cyan-100">
        {icon}
      </span>
      <span>{label}</span>
    </NavLink>
  );
}

export default function TopNav() {
  return (
    <section className="rounded-[26px] border border-cyan-400/60 bg-white/[0.06] p-2 shadow-[0_0_35px_rgba(34,211,238,0.25)] backdrop-blur-xl">
      <div className="grid grid-cols-4 gap-2">
        <NavItem to="/" icon={<Home />} label="Home" />
        <NavItem to="/feed" icon={<Home />} label="Feed" />
        <NavItem to="/messages" icon={<MessageCircle />} label="Message" />
        <NavItem to="/settings" icon={<Settings />} label="Setting" />
      </div>
    </section>
  );
}

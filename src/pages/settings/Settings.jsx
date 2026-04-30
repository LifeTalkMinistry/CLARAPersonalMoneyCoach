import { ChevronRight, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ClaraPageShell from "../../components/shared/layout/ClaraPageShell";
import Item from "./components/Item";
import Section from "./components/Section";
import ToggleSwitch from "./components/ToggleSwitch";

function Pill({ children, active = false, danger = false }) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-[10px] font-black ${
        danger
          ? "border-red-400/25 bg-red-500/10 text-red-300"
          : active
            ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300"
            : "border-white/10 bg-white/[0.08] text-white/55"
      }`}
    >
      {children}
    </span>
  );
}

export default function Settings() {
  const navigate = useNavigate();

  const handleOpenTheme = () => {
    navigate("/settings/theme");
  };

  const handleLogout = () => {
    window.location.href = "/login";
  };

  return (
    <ClaraPageShell>
      <div className="space-y-5 pb-6">
        <div className="px-1 pt-1">
          <p className="text-[11px] font-black uppercase tracking-[0.26em] text-emerald-300/45">
            CLARA
          </p>

          <h1 className="mt-1 text-[30px] font-black tracking-[-0.04em] text-white">
            Settings
          </h1>

          <p className="mt-1 text-sm leading-5 text-white/45">
            Manage your account, access, and app preferences.
          </p>
        </div>

        <Section title="ACCOUNT">
          <Item
            title="Profile information"
            description="Name, email, account identity"
            icon={<span>🏠</span>}
            right={
              <div className="flex items-center gap-2">
                <Pill>Edit</Pill>
                <ChevronRight size={16} className="text-white/25" />
              </div>
            }
          />

          <Item
            title="Security & privacy"
            description="Session status and safe preferences"
            icon={<span>🛡️</span>}
            right={
              <div className="flex items-center gap-2">
                <Pill>Safe</Pill>
                <ChevronRight size={16} className="text-white/25" />
              </div>
            }
          />
        </Section>

        <Section title="PREFERENCES">
          <Item
            title="Theme & appearance"
            description="Colors, visual style, and dashboard look"
            icon={<span>🎨</span>}
            onClick={handleOpenTheme}
            right={
              <div className="flex items-center gap-2">
                <Pill>Customize</Pill>
                <ChevronRight size={16} className="text-white/25" />
              </div>
            }
          />

          <Item
            title="Performance Mode"
            description="Static visuals with no animation"
            icon={<span>🚀</span>}
            right={<ToggleSwitch checked={false} />}
          />

          <Item
            title="Notifications"
            description="Reminders, alerts, and program updates"
            icon={<span>🔔</span>}
            right={<ToggleSwitch checked />}
          />
        </Section>

        <Section title="PROGRAM">
          <Item
            title="Plan & billing"
            description="Enrollment, payment, and access"
            icon={<span>📄</span>}
            right={
              <div className="flex items-center gap-2">
                <Pill active>Pro 99</Pill>
                <ChevronRight size={16} className="text-white/25" />
              </div>
            }
          />

          <Item
            title="Help & support"
            description="Message support or report an issue"
            icon={<span>💬</span>}
            right={
              <div className="flex items-center gap-2">
                <Pill>Help</Pill>
                <ChevronRight size={16} className="text-white/25" />
              </div>
            }
          />

          <Item
            title="About CLARA"
            description="Mission, vision, app info, and legal"
            icon={<span>📘</span>}
            right={
              <div className="flex items-center gap-2">
                <Pill>Info</Pill>
                <ChevronRight size={16} className="text-white/25" />
              </div>
            }
          />

          <Item
            title="Admin Panel"
            description="Manage users, access, and CLARA system"
            icon={<span>🛡️</span>}
            right={
              <div className="flex items-center gap-2">
                <Pill>Admin</Pill>
                <ChevronRight size={16} className="text-white/25" />
              </div>
            }
          />
        </Section>

        <section className="space-y-2">
          <p className="px-3 text-[10px] font-black uppercase tracking-[0.24em] text-white/25">
            SESSION
          </p>

          <div className="overflow-hidden rounded-[28px] border border-red-400/15 bg-red-500/[0.055] shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
            <button
              type="button"
              onClick={handleLogout}
              className="group flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-red-500/[0.06] active:bg-red-500/[0.09]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-red-400/20 bg-red-500/10 text-red-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition group-active:scale-95">
                <LogOut size={17} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-red-300">
                  Log out
                </h3>
                <p className="mt-0.5 text-[12px] leading-5 text-red-200/45">
                  End your current session
                </p>
              </div>

              <ChevronRight size={16} className="text-red-200/25" />
            </button>
          </div>
        </section>
      </div>
    </ClaraPageShell>
  );
}

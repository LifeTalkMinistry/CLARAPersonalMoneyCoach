import { ChevronRight, LogOut } from "lucide-react";
import ClaraPageShell from "../../components/shared/layout/ClaraPageShell";
import Item from "./components/Item";
import Section from "./components/Section";

function Pill({ children, active = false }) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-[10px] font-bold ${
        active
          ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300"
          : "border-white/10 bg-white/10 text-white/60"
      }`}
    >
      {children}
    </span>
  );
}

export default function Settings() {
  return (
    <ClaraPageShell>
      <div className="space-y-4">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="mt-1 text-sm text-white/50">
            Manage your account and preferences
          </p>
        </div>

        {/* PROFILE CARD */}
        <section className="rounded-[24px] border border-white/10 bg-white/[0.045] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-lg font-bold">
              JM
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-bold">Jerome Mirabuenos</h2>
              <p className="truncate text-xs text-white/45">
                maxemorej62@gmail.com
              </p>
            </div>

            <Pill active>Pro 99</Pill>
          </div>
        </section>

        {/* ACCOUNT */}
        <Section title="ACCOUNT">
          <Item
            title="Profile information"
            description="Name, email, account identity"
            icon={<span>🏠</span>}
            right={
              <div className="flex items-center gap-2">
                <Pill>Edit</Pill>
                <ChevronRight size={16} className="text-white/30" />
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
                <ChevronRight size={16} className="text-white/30" />
              </div>
            }
          />
        </Section>

        {/* PREFERENCES */}
        <Section title="PREFERENCES">
          <Item
            title="Theme & appearance"
            description="Colors, visual style, and dashboard look"
            icon={<span>🎨</span>}
            right={
              <div className="flex items-center gap-2">
                <Pill>Customize</Pill>
                <ChevronRight size={16} className="text-white/30" />
              </div>
            }
          />

          <Item
            title="Performance Mode"
            description="Static visuals with no animation"
            icon={<span>🚀</span>}
            right={
              <div className="flex items-center gap-2">
                <Pill>Off</Pill>
                <ChevronRight size={16} className="text-white/30" />
              </div>
            }
          />

          <Item
            title="Notifications"
            description="Reminders, alerts, and program updates"
            icon={<span>🔔</span>}
            right={
              <div className="flex items-center gap-2">
                <Pill>On</Pill>
                <ChevronRight size={16} className="text-white/30" />
              </div>
            }
          />
        </Section>

        {/* PROGRAM */}
        <Section title="PROGRAM">
          <Item
            title="Plan & billing"
            description="Enrollment, payment, and access"
            icon={<span>📄</span>}
            right={
              <div className="flex items-center gap-2">
                <Pill active>Pro 99</Pill>
                <ChevronRight size={16} className="text-white/30" />
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
                <ChevronRight size={16} className="text-white/30" />
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
                <ChevronRight size={16} className="text-white/30" />
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
                <ChevronRight size={16} className="text-white/30" />
              </div>
            }
          />
        </Section>

        {/* LOGOUT DESIGN ONLY */}
        <section className="rounded-[24px] border border-red-400/20 bg-red-500/[0.055] p-4">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300 transition hover:bg-red-500/15 active:scale-[0.99]"
          >
            <span>Log out</span>
            <LogOut size={17} />
          </button>

          <p className="mt-3 text-center text-[11px] text-white/35">
            Logout function will be connected later.
          </p>
        </section>
      </div>
    </ClaraPageShell>
  );
}

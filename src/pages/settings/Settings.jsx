import ClaraPageShell from "../../components/shared/layout/ClaraPageShell";
import Item from "./components/Item";
import Section from "./components/Section";
import { ChevronRight } from "lucide-react";

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
            description="Name, email, and account identity"
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
      </div>
    </ClaraPageShell>
  );
}

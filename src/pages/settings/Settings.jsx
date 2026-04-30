import ClaraPageShell from "../../components/shared/layout/ClaraPageShell";
import Item from "./components/Item";
import { ChevronRight } from "lucide-react";

export default function Settings() {
  return (
    <ClaraPageShell>
      <div className="space-y-4">
        
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Settings
          </h1>

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
              <h2 className="truncate text-sm font-bold">
                Jerome Mirabuenos
              </h2>
              <p className="truncate text-xs text-white/45">
                maxemorej62@gmail.com
              </p>
            </div>

            <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-bold text-emerald-300">
              Pro 99
            </span>

          </div>
        </section>

        {/* SETTINGS ITEMS */}
        <div className="space-y-3">

          <Item
            title="Profile information"
            description="Name, email, account identity"
            icon={<span>👤</span>}
            right={<ChevronRight size={18} className="text-white/40" />}
          />

          <Item
            title="Security & privacy"
            description="Session status and safe preferences"
            icon={<span>🔒</span>}
            right={
              <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                Safe
              </span>
            }
          />

        </div>

      </div>
    </ClaraPageShell>
  );
}

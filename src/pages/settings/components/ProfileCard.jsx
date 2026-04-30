import { ChevronRight } from "lucide-react";

export default function ProfileCard() {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.055] p-4 shadow-[0_22px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-10 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] border border-white/15 bg-white/[0.09] text-xl font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]">
          JM
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[16px] font-black tracking-[-0.02em] text-white">
            Jerome Mirabuenos
          </h2>

          <p className="mt-0.5 truncate text-xs text-white/45">
            maxemorej62@gmail.com
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[10px] font-black text-emerald-300">
              Pro 99
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-[10px] font-black text-white/55">
              Active
            </span>
          </div>
        </div>

        <ChevronRight size={18} className="text-white/25" />
      </div>
    </section>
  );
}

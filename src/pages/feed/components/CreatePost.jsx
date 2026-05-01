import { PenLine } from "lucide-react";

export default function CreatePost() {
  return (
    <button
      type="button"
      className="group w-full overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] text-left shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl transition duration-300 hover:border-white/15 hover:bg-white/[0.055] hover:shadow-[0_0_28px_rgba(255,255,255,0.045)]"
    >
      <div className="relative p-4">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.075] via-white/[0.025] to-transparent opacity-70" />
        <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition group-hover:text-white/70">
            <PenLine size={17} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm leading-5 text-white/58">
              What financial decision did you reflect on today?
            </p>

            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
              Reflection post
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}

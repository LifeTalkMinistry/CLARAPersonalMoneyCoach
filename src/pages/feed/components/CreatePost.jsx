import { PenLine } from "lucide-react";

export default function CreatePost() {
  return (
    <button
      type="button"
      className="w-full rounded-[24px] border border-white/10 bg-white/[0.04] p-4 text-left backdrop-blur-xl transition hover:border-white/15 hover:bg-white/[0.055]"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white/60">
          <PenLine size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm text-white/55">
            What financial decision did you reflect on today?
          </p>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/30">
            Reflection post
          </p>
        </div>
      </div>
    </button>
  );
}

import { Plus, Sparkles } from "lucide-react";

export default function DashboardQuickOrb({
  onTap,
  onDoubleTap,
  onLongPressStart,
  onLongPressEnd,
}) {
  return (
    <button
      type="button"
      onClick={onTap}
      onDoubleClick={onDoubleTap}
      onPointerDown={onLongPressStart}
      onPointerUp={onLongPressEnd}
      onPointerLeave={onLongPressEnd}
      className="group fixed bottom-6 left-1/2 z-50 flex h-[68px] w-[68px] -translate-x-1/2 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] text-white shadow-[0_18px_55px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-all duration-300 ease-out active:scale-95"
      aria-label="CLARA quick action"
    >
      <span className="absolute -inset-3 rounded-full bg-cyan-300/10 blur-2xl transition duration-500 group-active:bg-cyan-300/20" />
      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/18 via-white/[0.06] to-cyan-400/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]" />
      <span className="absolute inset-[5px] rounded-full border border-white/12 bg-[#07131a]/65" />

      <span className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full bg-gradient-to-br from-cyan-200 via-emerald-300 to-sky-400 text-[#041018] shadow-[0_0_28px_rgba(45,212,191,0.28),inset_0_1px_0_rgba(255,255,255,0.55)] transition duration-300 group-active:scale-95">
        <Plus className="h-5 w-5 stroke-[2.4]" />
        <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
      </span>
    </button>
  );
}
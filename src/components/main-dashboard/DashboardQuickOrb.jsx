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
      className="fixed bottom-6 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-400/20 text-white shadow-[0_0_35px_rgba(16,185,129,0.35)] backdrop-blur-2xl active:scale-95"
      aria-label="CLARA quick action"
    >
      <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl" />

      <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 to-cyan-400 text-[#041018]">
        <Plus className="h-5 w-5" />
        <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-white" />
      </div>
    </button>
  );
}
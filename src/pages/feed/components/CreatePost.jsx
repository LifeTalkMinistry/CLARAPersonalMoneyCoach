export default function CreatePost({ onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-[22px] border border-white/10 bg-white/[0.035] p-2.5 text-left backdrop-blur-2xl transition hover:bg-white/[0.05] active:scale-[0.99]"
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-[11px] font-semibold text-white/60">
          JM
        </div>

        <div className="min-h-9 flex-1 rounded-2xl border border-white/10 bg-white/[0.045] px-3.5 text-[13px] font-medium leading-9 text-white/55">
          What do you want to share?
        </div>
      </div>
    </button>
  );
}

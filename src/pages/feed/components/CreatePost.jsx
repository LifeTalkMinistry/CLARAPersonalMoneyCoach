export default function CreatePost({ onOpen }) {
  return (
    <section className="rounded-[22px] border border-white/10 bg-white/[0.035] p-2.5 backdrop-blur-2xl">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-[11px] font-semibold text-white/60">
          JM
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="min-h-9 flex-1 rounded-2xl border border-white/10 bg-white/[0.045] px-3.5 text-left text-[13px] font-medium text-white/55 transition hover:bg-white/[0.065] hover:text-white/78"
        >
          What do you want to share?
        </button>
      </div>
    </section>
  );
}

const categories = [
  "Insight",
  "Success",
  "Testimony",
  "Q&A",
  "Budget Win",
  "Spending Reflection",
];

export default function CreatePost({ onOpen }) {
  return (
    <section className="rounded-[24px] border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-2xl shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] text-xs font-semibold text-white/70">
          JM
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="min-h-10 flex-1 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-2 text-left text-[13px] font-medium leading-5 text-white/68 transition hover:bg-white/[0.065] hover:text-white/85"
        >
          What financial lesson do you want to share?
        </button>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={onOpen}
            className="shrink-0 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[10px] font-semibold text-white/42 transition hover:bg-white/[0.06] hover:text-white/70"
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  );
}

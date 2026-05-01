const POST_CATEGORIES = [
  "Insight",
  "Success",
  "Testimony",
  "Q&A",
  "Budget Win",
  "Spending Reflection",
];

export default function CreatePost({ onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-[22px] border border-[var(--clara-border)] bg-[var(--clara-card)] p-2.5 text-left text-[var(--clara-text)] shadow-[var(--clara-glow-premium)] backdrop-blur-2xl transition hover:bg-[var(--clara-card-strong)] active:scale-[0.99]"
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-[var(--clara-border)] bg-[var(--clara-panel-strong)] text-[11px] font-semibold text-[var(--clara-text-soft)]">
          JM
        </div>

        <div className="min-h-9 flex-1 rounded-2xl border border-[var(--clara-border)] bg-[var(--clara-glass)] px-3.5 text-[13px] font-medium leading-9 text-[var(--clara-text-muted)]">
          What financial lesson do you want to share?
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5 pl-[46px]">
        {POST_CATEGORIES.map((category) => (
          <span
            key={category}
            className="rounded-full border border-[var(--clara-accent-border)] bg-[var(--clara-accent-soft)] px-2.5 py-1 text-[10px] font-bold text-[var(--clara-accent-text)]"
          >
            {category}
          </span>
        ))}
      </div>
    </button>
  );
}

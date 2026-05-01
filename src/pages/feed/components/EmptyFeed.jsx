export default function EmptyFeed() {
  return (
    <section className="rounded-[24px] border border-dashed border-[var(--clara-border)] bg-[var(--clara-card)] px-5 py-8 text-center backdrop-blur-xl">
      <h2 className="text-[15px] font-semibold text-[var(--clara-text-soft)]">
        Your feed is quiet right now.
      </h2>

      <p className="mx-auto mt-2 max-w-[240px] text-xs leading-5 text-[var(--clara-text-muted)]">
        Start by sharing an insight, success, testimony, question, or money lesson.
      </p>
    </section>
  );
}

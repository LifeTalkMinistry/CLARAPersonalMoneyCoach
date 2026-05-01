export default function EmptyFeed() {
  return (
    <section className="rounded-[26px] border border-dashed border-white/10 bg-white/[0.03] px-5 py-10 text-center backdrop-blur-2xl">
      <h2 className="text-base font-semibold text-white/80">
        Your feed is quiet right now.
      </h2>

      <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-white/45">
        Start by sharing an insight, success, testimony, question, or money
        lesson.
      </p>
    </section>
  );
}

export default function EmptyFeed() {
  return (
    <section className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] px-5 py-8 text-center backdrop-blur-xl">
      <h2 className="text-[15px] font-semibold text-white/75">
        Your feed is quiet right now.
      </h2>

      <p className="mx-auto mt-2 max-w-[240px] text-xs leading-5 text-white/40">
        Start by sharing a lesson, win, or reflection.
      </p>
    </section>
  );
}

const categories = ["Insight","Success","Testimony","Q&A","Budget Win","Spending Reflection"];

export default function CreatePost({ onOpen }) {
  return (
    <section className="rounded-[26px] border border-white/10 bg-white/[0.045] p-4 backdrop-blur-2xl">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-sm font-semibold text-white/80">JM</div>
        <button type="button" onClick={onOpen} className="flex-1 rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-2 text-left text-sm text-white/45">What financial lesson do you want to share?</button>
      </div>
    </section>
  );
}

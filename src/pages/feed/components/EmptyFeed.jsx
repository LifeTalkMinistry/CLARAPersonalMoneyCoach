import { Sparkles } from "lucide-react";

export default function EmptyFeed() {
  return (
    <section className="rounded-[24px] border border-white/10 bg-white/[0.04] p-6 text-center backdrop-blur-xl">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white/55">
        <Sparkles size={18} />
      </div>

      <h3 className="mt-4 text-base font-semibold text-white">
        Your financial journey starts here.
      </h3>

      <p className="mx-auto mt-2 max-w-[280px] text-sm leading-6 text-white/55">
        Reflect on your spending, learn from others, and build better habits.
      </p>

      <button
        type="button"
        className="mt-5 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/[0.09] hover:text-white"
      >
        Create your first reflection
      </button>
    </section>
  );
}

import { Sparkles } from "lucide-react";

export default function EmptyFeed() {
  return (
    <section className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] p-6 text-center shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.07] via-white/[0.02] to-transparent opacity-75" />
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <Sparkles size={18} />
        </div>

        <h3 className="mt-4 text-base font-semibold text-white/90">
          Your financial journey starts here.
        </h3>

        <p className="mx-auto mt-2 max-w-[280px] text-sm leading-6 text-white/55">
          Reflect on your spending, learn from others, and build better habits.
        </p>

        <button
          type="button"
          className="mt-5 rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-xs font-semibold text-white/65 transition hover:border-white/15 hover:bg-white/[0.08] hover:text-white/85"
        >
          Create your first reflection
        </button>
      </div>
    </section>
  );
}

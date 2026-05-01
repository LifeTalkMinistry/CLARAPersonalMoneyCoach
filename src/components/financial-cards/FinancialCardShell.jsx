export default function FinancialCardShell({
  eyebrow,
  title,
  badge,
  badgeClassName = "text-emerald-200 bg-emerald-400/10 border-emerald-300/20",
  accentClassName = "from-emerald-300/30 via-sky-300/10 to-transparent",
  icon,
  hero,
  heroSubtext,
  progress = 0,
  progressClassName = "from-emerald-300 to-emerald-500",
  insight,
  children,
}) {
  const safeProgress = Math.min(Math.max(Number(progress) || 0, 0), 100);

  return (
    <article className="group relative flex h-full max-h-full min-h-0 w-full flex-col overflow-hidden rounded-[26px] border border-white/[0.10] bg-[#0b1118]/88 px-4 pb-4 pt-4 text-white shadow-[0_18px_45px_rgba(0,0,0,0.32)] backdrop-blur-2xl transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_30px_70px_rgba(0,0,0,0.5)] active:scale-[0.985]">
      {/* Glass overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-[26px] bg-[linear-gradient(145deg,rgba(255,255,255,0.10),rgba(255,255,255,0.03)_40%,rgba(255,255,255,0.015))]" />

      {/* Accent glow (controlled) */}
      <div className={`pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gradient-to-br ${accentClassName} opacity-70 blur-3xl transition duration-500 group-hover:scale-110 group-hover:opacity-90`} />

      {/* Base ambient glow */}
      <div className="pointer-events-none absolute -bottom-24 left-10 h-44 w-44 rounded-full bg-white/[0.025] blur-3xl" />

      {/* Top highlight line */}
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-60 group-hover:opacity-90" />

      {/* Bottom subtle separator */}
      <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      <div className="relative z-10 flex h-full min-h-0 flex-1 flex-col gap-3">
        {/* HEADER */}
        <header className="flex h-[48px] shrink-0 items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] transition-all duration-300 group-hover:bg-white/[0.14] group-active:scale-95">
              {icon}
            </div>

            <div className="flex min-w-0 flex-col gap-2 pt-0.5">
              <p className="truncate text-[10px] font-bold uppercase leading-none tracking-[0.22em] text-white/40">
                {eyebrow}
              </p>
              <h2 className="truncate text-[15px] font-semibold leading-none tracking-[-0.01em] text-white/95">
                {title}
              </h2>
            </div>
          </div>

          {badge && (
            <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase leading-none tracking-[0.12em] transition-all duration-300 group-hover:scale-105 ${badgeClassName}`}>
              {badge}
            </span>
          )}
        </header>

        {/* HERO */}
        <section className="flex h-[56px] shrink-0 flex-col gap-2">
          <p className="truncate text-[30px] font-semibold leading-none tracking-[-0.045em] text-white sm:text-[32px]">
            {hero}
          </p>

          {heroSubtext && (
            <p className="truncate text-[12px] font-medium leading-none text-white/50">
              {heroSubtext}
            </p>
          )}
        </section>

        {/* PROGRESS + INSIGHT */}
        <section className="flex min-h-0 flex-1 flex-col gap-3">
          <div className="h-2 overflow-hidden rounded-full border border-white/[0.05] bg-white/[0.06] shadow-[inset_0_1px_2px_rgba(0,0,0,0.28)]">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${progressClassName} shadow-[0_0_18px_rgba(255,255,255,0.20)] transition-all duration-700 ease-out`}
              style={{ width: `${safeProgress}%` }}
            />
          </div>

          {insight && (
            <p className="line-clamp-2 min-h-[38px] text-[12px] leading-[1.55] text-white/60 transition-all duration-300 group-hover:text-white/75">
              {insight}
            </p>
          )}
        </section>

        {/* ACTION */}
        {children && (
          <div className="relative z-10 shrink-0 transition-transform duration-300 group-active:scale-[0.98]">
            {children}
          </div>
        )}
      </div>
    </article>
  );
}

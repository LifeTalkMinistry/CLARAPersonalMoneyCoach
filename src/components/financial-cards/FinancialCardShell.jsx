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
    <article className="group relative min-h-[236px] overflow-hidden rounded-[30px] border border-white/[0.12] bg-[#0b1118]/82 p-5 text-white shadow-[0_22px_55px_rgba(0,0,0,0.34)] backdrop-blur-2xl transition duration-300 active:scale-[0.992]">
      <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-[linear-gradient(145deg,rgba(255,255,255,0.12),rgba(255,255,255,0.035)_38%,rgba(255,255,255,0.02))]" />
      <div className={`pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br ${accentClassName} blur-2xl transition duration-500 group-active:scale-105`} />
      <div className="pointer-events-none absolute -bottom-24 left-8 h-40 w-40 rounded-full bg-white/[0.035] blur-3xl" />
      <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
      <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 flex h-full flex-col">
        <header className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.075] text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
              {icon}
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/38">
                {eyebrow}
              </p>
              <h2 className="mt-0.5 truncate text-[15px] font-semibold tracking-[-0.01em] text-white">
                {title}
              </h2>
            </div>
          </div>

          {badge && (
            <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${badgeClassName}`}>
              {badge}
            </span>
          )}
        </header>

        <section className="mt-6">
          <p className="text-[30px] font-semibold leading-none tracking-[-0.045em] text-white sm:text-[32px]">
            {hero}
          </p>

          {heroSubtext && (
            <p className="mt-2 text-[12px] font-medium text-white/45">
              {heroSubtext}
            </p>
          )}
        </section>

        <section className="mt-5">
          <div className="h-2 overflow-hidden rounded-full border border-white/[0.06] bg-white/[0.07] shadow-[inset_0_1px_2px_rgba(0,0,0,0.24)]">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${progressClassName} shadow-[0_0_16px_rgba(255,255,255,0.18)] transition-all duration-700 ease-out`}
              style={{ width: `${safeProgress}%` }}
            />
          </div>

          {insight && (
            <p className="mt-3 min-h-[34px] text-[12px] leading-relaxed text-white/58">
              {insight}
            </p>
          )}
        </section>

        {children && <div className="relative z-10 mt-auto pt-4">{children}</div>}
      </div>
    </article>
  );
}

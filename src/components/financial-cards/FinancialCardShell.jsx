export default function FinancialCardShell({
  eyebrow,
  title,
  badge,
  badgeClassName = "",
  accentClassName = "",
  icon,
  hero,
  heroSubtext,
  progress = 0,
  progressClassName = "",
  insight,
  children,
}) {
  const safeProgress = Math.min(Math.max(Number(progress) || 0, 0), 100);

  return (
    <article
      className="group relative flex h-full max-h-full min-h-0 w-full flex-col overflow-hidden rounded-[26px] px-4 pb-4 pt-4 transition-all duration-300 hover:scale-[1.01] active:scale-[0.985]"
      style={{
        border: "1px solid var(--clara-border)",
        background: "var(--clara-card)",
        color: "var(--clara-text)",
        boxShadow:
          "0 18px 42px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Top highlight line */}
      <div
        className="pointer-events-none absolute inset-x-6 top-0 h-px opacity-70"
        style={{ background: "linear-gradient(90deg, transparent, var(--clara-border-strong), transparent)" }}
      />

      <div className="relative z-10 flex h-full min-h-0 flex-1 flex-col gap-3">
        <header className="flex h-[48px] shrink-0 items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold transition-all duration-300 group-active:scale-95"
              style={{
                border: "1px solid var(--clara-accent-border)",
                background: "var(--clara-accent-soft)",
                color: "var(--clara-accent-text)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
              }}
            >
              {icon}
            </div>

            <div className="flex min-w-0 flex-col gap-2 pt-0.5">
              <p className="truncate text-[10px] font-bold uppercase leading-none tracking-[0.22em] text-white/40">
                {eyebrow}
              </p>
              <h2 className="truncate text-[15px] font-semibold leading-none tracking-[-0.01em] text-white">
                {title}
              </h2>
            </div>
          </div>

          {badge && (
            <span
              className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase leading-none tracking-[0.12em] ${badgeClassName}`}
              style={{
                borderColor: "var(--clara-accent-border)",
                background: "var(--clara-accent-soft)",
                color: "var(--clara-accent-text)",
              }}
            >
              {badge}
            </span>
          )}
        </header>

        <section className="flex h-[56px] shrink-0 flex-col gap-2">
          <p className="truncate text-[30px] font-semibold leading-none tracking-[-0.045em] text-white sm:text-[32px]">
            {hero}
          </p>

          {heroSubtext && (
            <p className="truncate text-[12px] font-medium leading-none text-white/70">
              {heroSubtext}
            </p>
          )}
        </section>

        <section className="flex min-h-0 flex-1 flex-col gap-3">
          <div
            className="h-2 overflow-hidden rounded-full"
            style={{ border: "1px solid var(--clara-border)", background: "rgba(255,255,255,0.045)" }}
          >
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${progressClassName}`}
              style={{
                width: `${safeProgress}%`,
                background: "linear-gradient(90deg, var(--clara-accent-text), var(--clara-accent))",
              }}
            />
          </div>

          {insight && (
            <p className="line-clamp-2 min-h-[38px] text-[12px] leading-[1.55] text-white/60">
              {insight}
            </p>
          )}
        </section>

        {children && (
          <div className="relative z-10 shrink-0 transition-transform duration-300 group-active:scale-[0.98]">
            {children}
          </div>
        )}
      </div>
    </article>
  );
}

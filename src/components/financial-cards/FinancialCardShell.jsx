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
      className="group relative flex h-full max-h-full min-h-0 w-full flex-col overflow-hidden rounded-[26px] px-4 pb-4 pt-4 backdrop-blur-2xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.985]"
      style={{
        border: "1px solid var(--clara-border)",
        background: "var(--clara-card)",
        color: "var(--clara-text)",
        boxShadow:
          "0 18px 45px rgba(0,0,0,0.34), 0 0 38px var(--clara-glow-soft), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      {/* Theme base glass */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[26px]"
        style={{ background: "var(--clara-glass)" }}
      />

      {/* Atmospheric card glow - the first-draft feeling */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[26px] opacity-95 transition duration-500 group-hover:opacity-100"
        style={{ background: "var(--clara-surface-glow)" }}
      />

      {/* Main accent bloom */}
      <div
        className={`pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-70 blur-3xl transition duration-500 group-hover:scale-110 group-hover:opacity-90 ${accentClassName}`}
        style={{ background: "var(--clara-accent-soft)" }}
      />

      {/* Secondary background bloom */}
      <div
        className="pointer-events-none absolute -bottom-24 -left-14 h-56 w-56 rounded-full opacity-55 blur-3xl transition duration-500 group-hover:opacity-75"
        style={{ background: "var(--clara-glow-soft)" }}
      />

      {/* Inner depth vignette */}
      <div className="pointer-events-none absolute inset-0 rounded-[26px] bg-[radial-gradient(circle_at_50%_110%,rgba(0,0,0,0.30),transparent_46%)]" />

      {/* Premium glass sheen */}
      <div className="pointer-events-none absolute inset-0 rounded-[26px] bg-[linear-gradient(145deg,rgba(255,255,255,0.10),rgba(255,255,255,0.025)_38%,rgba(255,255,255,0.01)_68%,rgba(0,0,0,0.10))]" />

      {/* Top highlight line */}
      <div
        className="pointer-events-none absolute inset-x-6 top-0 h-px opacity-75 group-hover:opacity-100"
        style={{ background: "linear-gradient(90deg, transparent, var(--clara-border-strong), transparent)" }}
      />

      {/* Bottom subtle separator */}
      <div
        className="pointer-events-none absolute inset-x-6 bottom-0 h-px opacity-70"
        style={{ background: "linear-gradient(90deg, transparent, var(--clara-border), transparent)" }}
      />

      <div className="relative z-10 flex h-full min-h-0 flex-1 flex-col gap-3">
        {/* HEADER */}
        <header className="flex h-[48px] shrink-0 items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold transition-all duration-300 group-active:scale-95"
              style={{
                border: "1px solid var(--clara-accent-border)",
                background: "var(--clara-accent-soft)",
                color: "var(--clara-accent-text)",
                boxShadow:
                  "0 0 18px var(--clara-glow-soft), inset 0 1px 0 rgba(255,255,255,0.12)",
              }}
            >
              {icon}
            </div>

            <div className="flex min-w-0 flex-col gap-2 pt-0.5">
              <p
                className="truncate text-[10px] font-bold uppercase leading-none tracking-[0.22em]"
                style={{ color: "var(--clara-text-faint)" }}
              >
                {eyebrow}
              </p>
              <h2
                className="truncate text-[15px] font-semibold leading-none tracking-[-0.01em]"
                style={{ color: "var(--clara-text)" }}
              >
                {title}
              </h2>
            </div>
          </div>

          {badge && (
            <span
              className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase leading-none tracking-[0.12em] transition-all duration-300 group-hover:scale-105 ${badgeClassName}`}
              style={{
                borderColor: "var(--clara-accent-border)",
                background: "var(--clara-accent-soft)",
                color: "var(--clara-accent-text)",
                boxShadow: "0 0 16px var(--clara-glow-soft)",
              }}
            >
              {badge}
            </span>
          )}
        </header>

        {/* HERO */}
        <section className="flex h-[56px] shrink-0 flex-col gap-2">
          <p
            className="truncate text-[30px] font-semibold leading-none tracking-[-0.045em] sm:text-[32px]"
            style={{ color: "var(--clara-text)" }}
          >
            {hero}
          </p>

          {heroSubtext && (
            <p
              className="truncate text-[12px] font-medium leading-none"
              style={{ color: "var(--clara-accent-text)" }}
            >
              {heroSubtext}
            </p>
          )}
        </section>

        {/* PROGRESS + INSIGHT */}
        <section className="flex min-h-0 flex-1 flex-col gap-3">
          <div
            className="h-2 overflow-hidden rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.28)]"
            style={{ border: "1px solid var(--clara-border)", background: "rgba(255,255,255,0.045)" }}
          >
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${progressClassName}`}
              style={{
                width: `${safeProgress}%`,
                background: "linear-gradient(90deg, var(--clara-accent-text), var(--clara-accent))",
                boxShadow: "0 0 18px var(--clara-glow)",
              }}
            />
          </div>

          {insight && (
            <p
              className="line-clamp-2 min-h-[38px] text-[12px] leading-[1.55] transition-all duration-300"
              style={{ color: "var(--clara-text-soft)" }}
            >
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

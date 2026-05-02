export default function FinancialCardShell({
  eyebrow,
  title,
  badge,
  badgeClassName = "",
  icon,
  hero,
  heroSubtext,
  progress = 0,
  progressClassName = "",
  insight,
  children,
}) {
  const safeProgress = Math.min(Math.max(Number(progress) || 0, 0), 100);
  const normalizedBadge = String(badge || "").toLowerCase();
  const isWarningBadge =
    normalizedBadge.includes("critical") ||
    normalizedBadge.includes("caution") ||
    normalizedBadge.includes("risk") ||
    normalizedBadge.includes("priority");

  const badgeStyle = {
    borderColor: isWarningBadge ? "rgba(199,226,58,0.28)" : "rgba(255,255,255,0.09)",
    background: isWarningBadge ? "rgba(199,226,58,0.105)" : "rgba(255,255,255,0.045)",
    color: isWarningBadge ? "var(--clara-accent-text)" : "rgba(255,255,255,0.64)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.055)",
  };

  const cardStyle = {
    color: "var(--clara-text)",
    borderColor: "var(--clara-border)",
    background: "var(--clara-card)",
    boxShadow: "var(--clara-shadow-soft), inset 0 1px 0 rgba(255,255,255,0.055)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
  };

  return (
    <article
      className="group relative flex h-full max-h-full min-h-0 w-full flex-col overflow-hidden rounded-[28px] border px-5 pb-5 pt-5 transition-all duration-300 active:scale-[0.985]"
      style={cardStyle}
    >
      <div className="pointer-events-none absolute inset-0" style={{ background: "var(--clara-surface-glow)" }} />
      <div className="relative z-10 flex h-full min-h-0 flex-1 flex-col gap-3.5">
        <header className="flex h-[54px] shrink-0 items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] border text-sm font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.075),0_12px_24px_rgba(0,0,0,0.22)] transition-all duration-300 group-active:scale-95" style={{ borderColor: "var(--clara-accent-border)", background: "rgba(215,239,89,0.10)", color: "var(--clara-accent-text)" }}>
              {icon}
            </div>

            <div className="flex min-w-0 flex-col gap-2 pt-1">
              <p className="truncate text-[10px] font-black uppercase leading-none tracking-[0.24em]" style={{ color: "var(--clara-accent-text)" }}>
                {eyebrow}
              </p>
              <h2 className="truncate text-[17px] font-semibold leading-none tracking-[-0.02em]" style={{ color: "var(--clara-text)" }}>
                {title}
              </h2>
            </div>
          </div>

          {badge && (
            <span
              className={`mt-1 shrink-0 rounded-full border px-3.5 py-2 text-[11px] font-extrabold uppercase leading-none tracking-[0.08em] ${badgeClassName}`}
              style={badgeStyle}
            >
              {badge}
            </span>
          )}
        </header>

        <section className="flex h-[62px] shrink-0 flex-col gap-2">
            <p className="truncate text-[34px] font-semibold leading-none tracking-[-0.055em] text-white sm:text-[36px]">
              {hero}
            </p>

          {heroSubtext && (
            <p className="truncate text-[13px] font-semibold leading-none" style={{ color: "var(--clara-text-soft)" }}>
              {heroSubtext}
            </p>
          )}
        </section>

        <section className="flex min-h-0 flex-1 flex-col gap-3.5">
          <div className="h-[3px] overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${progressClassName}`}
              style={{
                width: `${safeProgress}%`,
                background:
                  progressClassName
                    ? undefined
                    : "linear-gradient(90deg, rgba(199,226,58,0.72), rgba(214,184,79,0.82))",
              }}
            />
          </div>

          {insight && (
            <p className="line-clamp-2 min-h-[42px] text-[13px] font-medium leading-[1.6]" style={{ color: "var(--clara-text-soft)" }}>
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

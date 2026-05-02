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
    borderColor: "rgba(236,255,91,0.18)",
    background: isWarningBadge ? "rgba(236,255,91,0.10)" : "rgba(255,255,255,0.045)",
    color: "var(--clara-accent-text)",
    boxShadow: "none",
  };

  return (
    <article
      className="group relative flex h-full max-h-full min-h-0 w-full flex-col overflow-hidden rounded-[32px] border px-5 pb-5 pt-5 transition-all duration-300 active:scale-[0.985]"
      style={{
        borderColor: "rgba(255,255,255,0.085)",
        background:
          "linear-gradient(180deg, rgba(9,22,17,0.96) 0%, rgba(5,14,13,0.98) 58%, rgba(4,10,15,0.98) 100%)",
        color: "var(--clara-text)",
        boxShadow:
          "0 18px 42px rgba(0,0,0,0.46), inset 0 1px 0 rgba(255,255,255,0.07)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-7 top-0 h-px opacity-50"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)",
        }}
      />

      <div className="relative z-10 flex h-full min-h-0 flex-1 flex-col gap-3.5">
        <header className="flex h-[54px] shrink-0 items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3.5">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[22px] border text-sm font-bold transition-all duration-300 group-active:scale-95"
              style={{
                borderColor: "rgba(236,255,91,0.16)",
                background: "rgba(255,255,255,0.045)",
                color: "var(--clara-accent-text)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              {icon}
            </div>

            <div className="flex min-w-0 flex-col gap-2 pt-1">
              <p className="truncate text-[10px] font-bold uppercase leading-none tracking-[0.28em] text-white/48">
                {eyebrow}
              </p>
              <h2 className="truncate text-[17px] font-semibold leading-none tracking-[-0.02em] text-white/88">
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
            <p className="truncate text-[13px] font-semibold leading-none text-white/52">
              {heroSubtext}
            </p>
          )}
        </section>

        <section className="flex min-h-0 flex-1 flex-col gap-3.5">
          <div className="h-[3px] overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${progressClassName}`}
              style={{
                width: `${safeProgress}%`,
                background: "rgba(236,255,91,0.88)",
              }}
            />
          </div>

          {insight && (
            <p className="line-clamp-2 min-h-[42px] text-[13px] font-medium leading-[1.6] text-white/56">
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

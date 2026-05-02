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
    borderColor: "rgba(236,255,91,0.26)",
    background: isWarningBadge
      ? "rgba(236,255,91,0.13)"
      : "rgba(236,255,91,0.10)",
    color: "rgba(236,255,91,0.96)",
  };

  return (
    <article
      className="group relative flex h-full max-h-full min-h-0 w-full flex-col overflow-hidden rounded-[32px] px-5 pb-5 pt-5 transition-all duration-300 active:scale-[0.985]"
      style={{
        border: "1px solid rgba(255,255,255,0.08)",
        background:
          "linear-gradient(145deg, rgba(33,88,45,0.96) 0%, rgba(15,73,55,0.97) 48%, rgba(8,55,76,0.97) 100%)",
        color: "var(--clara-text)",
        boxShadow:
          "0 22px 44px rgba(0,0,0,0.42), 0 38px 80px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.10)",
      }}
    >
      <div className="relative z-10 flex h-full min-h-0 flex-1 flex-col gap-3.5">
        <header className="flex h-[54px] shrink-0 items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3.5">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[22px] text-sm font-bold transition-all duration-300 group-active:scale-95"
              style={{
                border: "1px solid rgba(236,255,91,0.22)",
                background: "rgba(236,255,91,0.10)",
                color: "rgba(236,255,91,0.95)",
                boxShadow: "0 10px 24px rgba(0,0,0,0.22)",
              }}
            >
              {icon}
            </div>

            <div className="flex min-w-0 flex-col gap-2 pt-1">
              <p className="truncate text-[10px] font-bold uppercase leading-none tracking-[0.28em] text-[#e6ff48]/86">
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
            <p className="truncate text-[13px] font-semibold leading-none text-white/62">
              {heroSubtext}
            </p>
          )}
        </section>

        <section className="flex min-h-0 flex-1 flex-col gap-3.5">
          <div
            className="h-[3px] overflow-hidden rounded-full"
            style={{ background: "rgba(236,255,91,0.18)" }}
          >
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${progressClassName}`}
              style={{
                width: `${safeProgress}%`,
                background:
                  "linear-gradient(90deg, rgba(236,255,91,0.78), rgba(236,255,91,0.96))",
              }}
            />
          </div>

          {insight && (
            <p className="line-clamp-2 min-h-[42px] text-[13px] font-medium leading-[1.6] text-white/64">
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

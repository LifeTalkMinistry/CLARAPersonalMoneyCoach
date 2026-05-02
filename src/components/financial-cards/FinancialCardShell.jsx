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

  return (
    <article
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-[28px] border px-5 pb-5 pt-5 text-white transition-all duration-300 ease-out active:scale-[0.975]"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
        boxShadow: "0 14px 34px rgba(0,0,0,0.35)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-[16px] font-semibold text-[#FFD34D] transition-transform group-active:scale-95"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {icon}
            </div>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-white/50">
                {eyebrow}
              </p>
              <h2 className="mt-0.5 text-[17px] font-semibold text-white/80">{title}</h2>
            </div>
          </div>

          {badge && (
            <span
              className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${badgeClassName}`}
              style={{
                background: "rgba(255,255,255,0.05)",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              {badge}
            </span>
          )}
        </div>

        <div>
          <p className="text-[34px] font-semibold tracking-[-0.04em] text-white">{hero}</p>
          {heroSubtext && (
            <p className="mt-1 text-[13px] text-white/40">{heroSubtext}</p>
          )}
        </div>

        <div className="h-[3px] overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
          <div
            className={`h-full rounded-full transition-all duration-700 ${progressClassName}`}
            style={{
              width: `${safeProgress}%`,
              background: progressClassName ? undefined : "#FFD34D",
            }}
          />
        </div>

        {insight && <p className="text-[13px] leading-relaxed text-white/40">{insight}</p>}

        {children && (
          <div className="transition-transform group-active:scale-[0.98]">
            {children}
          </div>
        )}
      </div>
    </article>
  );
}

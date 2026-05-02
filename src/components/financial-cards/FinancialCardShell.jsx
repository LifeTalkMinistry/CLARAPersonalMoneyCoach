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
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-[24px] border px-4 pb-4 pt-4 text-white transition-all duration-300 ease-out active:scale-[0.975]"
      style={{
        borderColor: "rgba(255,255,255,0.10)",
        background:
          "linear-gradient(180deg, rgba(9,30,35,0.94), rgba(4,16,21,0.98))",
        boxShadow:
          "0 14px 34px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.05)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 0% 0%, rgba(166,232,18,0.08), transparent 34%), radial-gradient(circle at 100% 45%, rgba(39,93,255,0.06), transparent 38%)",
        }}
      />

      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-[14px] font-semibold text-[#B9F632] transition-transform group-active:scale-95"
              style={{
                background: "rgba(166,232,18,0.08)",
                border: "1px solid rgba(166,232,18,0.25)",
              }}
            >
              {icon}
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.26em] text-[#B9F632]/90">
                {eyebrow}
              </p>
              <h2 className="mt-0.5 text-[15px] font-semibold text-white/85">{title}</h2>
            </div>
          </div>

          {badge && (
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${badgeClassName}`}
              style={{
                background: "rgba(255,255,255,0.05)",
                borderColor: "rgba(255,255,255,0.10)",
                color: "#DFFF7A",
              }}
            >
              {badge}
            </span>
          )}
        </div>

        <div className="pt-2">
          <p className="text-[34px] font-black tracking-[-0.04em] text-white">{hero}</p>
          {heroSubtext && (
            <p className="mt-1 text-[13px] font-medium text-white/45">{heroSubtext}</p>
          )}
        </div>

        <div className="mt-1 h-[4px] overflow-hidden rounded-full bg-[rgba(166,232,18,0.12)]">
          <div
            className={`h-full rounded-full transition-all duration-700 ${progressClassName}`}
            style={{
              width: `${safeProgress}%`,
              background: progressClassName ? undefined : "#B9F632",
            }}
          />
        </div>

        {insight && <p className="text-[13px] leading-6 text-white/55">{insight}</p>}

        {children && (
          <div className="pt-0.5 transition-transform group-active:scale-[0.98]">
            {children}
          </div>
        )}
      </div>
    </article>
  );
}

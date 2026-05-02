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
        borderColor: "rgba(255,255,255,0.10)",
        background:
          "linear-gradient(180deg, rgba(9,30,35,0.94), rgba(4,16,21,0.98))",
        boxShadow:
          "0 18px 46px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.05)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(circle at 0% 0%, rgba(166,232,18,0.10), transparent 34%), radial-gradient(circle at 100% 45%, rgba(39,93,255,0.08), transparent 38%)",
        }}
      />

      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-[16px] font-semibold text-[#B9F632] transition-transform group-active:scale-95"
              style={{
                background: "rgba(166,232,18,0.08)",
                border: "1px solid rgba(166,232,18,0.28)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              {icon}
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#B9F632]/90">
                {eyebrow}
              </p>
              <h2 className="mt-1 text-[17px] font-semibold text-white/90">{title}</h2>
            </div>
          </div>

          {badge && (
            <span
              className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${badgeClassName}`}
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

        <div className="pt-4">
          <p className="text-[40px] font-black tracking-[-0.05em] text-white">{hero}</p>
          {heroSubtext && (
            <p className="mt-2 text-[16px] font-medium text-white/42">{heroSubtext}</p>
          )}
        </div>

        <div className="mt-2 h-[5px] overflow-hidden rounded-full bg-[rgba(166,232,18,0.14)]">
          <div
            className={`h-full rounded-full transition-all duration-700 ${progressClassName}`}
            style={{
              width: `${safeProgress}%`,
              background: progressClassName ? undefined : "#B9F632",
            }}
          />
        </div>

        {insight && <p className="text-[15px] leading-7 text-white/55">{insight}</p>}

        {children && (
          <div className="pt-1 transition-transform group-active:scale-[0.98]">
            {children}
          </div>
        )}
      </div>
    </article>
  );
}

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
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-[28px] border px-5 pb-5 pt-5 transition-all duration-300 ease-out active:scale-[0.975]"
      style={{
        borderColor: "rgba(255,255,255,0.10)",
        background:
          "linear-gradient(150deg, rgba(85,128,53,0.14), rgba(8,30,26,0.92))",
        boxShadow:
          "0 18px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
        backdropFilter: "blur(14px)",
      }}
    >
      {/* PRESS LIGHT */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-active:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 20% 10%, rgba(215,239,89,0.12), transparent 30%)",
        }}
      />

      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div
              className="h-12 w-12 rounded-[16px] flex items-center justify-center font-bold transition-transform group-active:scale-95"
              style={{
                background:
                  "linear-gradient(145deg, rgba(215,239,89,0.12), rgba(255,255,255,0.03))",
                border: "1px solid rgba(199,226,58,0.22)",
              }}
            >
              {icon}
            </div>

            <div>
              <p className="text-[10px] tracking-[0.24em] uppercase text-[var(--clara-accent-text)]">
                {eyebrow}
              </p>
              <h2 className="text-[17px] font-semibold">{title}</h2>
            </div>
          </div>

          {badge && (
            <span className="px-3 py-1 rounded-full text-[11px] font-bold">
              {badge}
            </span>
          )}
        </div>

        <div>
          <p className="text-[34px] font-semibold text-white">{hero}</p>
          {heroSubtext && (
            <p className="text-[13px] text-white/60">{heroSubtext}</p>
          )}
        </div>

        <div className="h-[3px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${safeProgress}%`,
              background:
                "linear-gradient(90deg, rgba(215,239,89,0.9), rgba(214,184,79,0.7))",
            }}
          />
        </div>

        {insight && <p className="text-[13px] text-white/60">{insight}</p>}

        {children && (
          <div className="transition-transform group-active:scale-[0.98]">
            {children}
          </div>
        )}
      </div>
    </article>
  );
}

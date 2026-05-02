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
  const normalizedBadge = String(badge || "").toLowerCase();
  const isWarningBadge =
    normalizedBadge.includes("critical") ||
    normalizedBadge.includes("caution") ||
    normalizedBadge.includes("risk") ||
    normalizedBadge.includes("priority");

  const badgeStyle = isWarningBadge
    ? {
        borderColor: "rgba(236, 255, 91, 0.22)",
        background: "linear-gradient(135deg, rgba(236,255,91,0.14), rgba(73,104,36,0.20))",
        color: "rgba(236,255,91,0.94)",
      }
    : {
        borderColor: "rgba(236, 255, 91, 0.22)",
        background: "linear-gradient(135deg, rgba(236,255,91,0.13), rgba(58,111,51,0.22))",
        color: "rgba(236,255,91,0.94)",
      };

  return (
    <article
      className="group relative flex h-full max-h-full min-h-0 w-full flex-col overflow-hidden rounded-[32px] px-5 pb-5 pt-5 transition-all duration-300 hover:scale-[1.003] active:scale-[0.985]"
      style={{
        border: "1px solid rgba(255,255,255,0.10)",
        background:
          "radial-gradient(circle at 15% 10%, rgba(123,178,54,0.30), transparent 30%), radial-gradient(circle at 100% 100%, rgba(18,72,122,0.28), transparent 34%), linear-gradient(145deg, rgba(43,91,45,0.92) 0%, rgba(20,76,49,0.90) 42%, rgba(9,57,55,0.92) 70%, rgba(8,42,71,0.92) 100%)",
        color: "var(--clara-text)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow:
          "0 26px 58px rgba(0,0,0,0.42), 0 12px 34px rgba(5,43,79,0.24), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[32px] opacity-90"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.11), transparent 33%, rgba(255,255,255,0.025) 62%, rgba(236,255,91,0.035))",
        }}
      />

      <div
        className="pointer-events-none absolute inset-x-8 top-0 h-px opacity-75"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(236,255,91,0.44), rgba(255,255,255,0.18), transparent)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-y-8 right-0 w-px opacity-45"
        style={{
          background:
            "linear-gradient(180deg, transparent, rgba(94,155,210,0.42), transparent)",
        }}
      />

      <div className="relative z-10 flex h-full min-h-0 flex-1 flex-col gap-3.5">
        <header className="flex h-[54px] shrink-0 items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3.5">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[22px] text-sm font-bold transition-all duration-300 group-active:scale-95"
              style={{
                border: "1px solid rgba(236,255,91,0.20)",
                background:
                  "linear-gradient(145deg, rgba(236,255,91,0.13), rgba(34,82,42,0.34))",
                color: "rgba(236,255,91,0.94)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.13), 0 10px 22px rgba(0,0,0,0.18)",
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
                background: "linear-gradient(90deg, rgba(236,255,91,0.78), rgba(236,255,91,0.96))",
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

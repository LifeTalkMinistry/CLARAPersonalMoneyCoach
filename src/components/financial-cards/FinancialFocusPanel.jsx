import { createPortal } from "react-dom";

export default function FinancialFocusPanel({
  open = false,
  onClose,
  eyebrow,
  title,
  primaryLabel,
  primaryValue,
  badge,
  badgeClassName = "text-emerald-400",
  progress = 0,
  progressClassName = "bg-emerald-400",
  insight,
  actions = [],
  details = [],
  footer,
}) {
  const safeProgress = Math.min(Math.max(Number(progress) || 0, 0), 100);

  const panel = (
    <div
      className={`fixed inset-0 z-[9999] flex items-end justify-center px-3 pb-3 pt-10 sm:items-center sm:p-5 transition-opacity duration-300 ${
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <button
        type="button"
        aria-label={`Close ${title} panel`}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
      />

      <div
        className={`relative flex h-[86vh] w-full max-w-md flex-col overflow-hidden rounded-[30px] border border-white/10 bg-[#08111c]/95 shadow-[0_24px_90px_rgba(0,0,0,0.75)] backdrop-blur-2xl transform transition-transform duration-300 ${
          open ? "translate-y-0 scale-100" : "translate-y-10 scale-95"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(45,212,191,0.18),transparent_34%),radial-gradient(circle_at_85%_18%,rgba(59,130,246,0.16),transparent_32%),radial-gradient(circle_at_80%_90%,rgba(244,63,94,0.14),transparent_35%)]" />

        <div className="relative border-b border-white/10 px-5 pb-4 pt-3">
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20" />

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                {eyebrow}
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-white">{title}</h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/[0.1] hover:text-white"
            >
              Close
            </button>
          </div>
        </div>

        <div className="relative flex-1 overflow-y-auto px-5 py-5">
          <div className="rounded-[26px] border border-white/10 bg-white/[0.055] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs text-white/45">{primaryLabel}</p>
                <h3 className="mt-1 text-3xl font-bold text-white">
                  {primaryValue}
                </h3>
              </div>

              {badge && (
                <span className={`text-sm font-semibold ${badgeClassName}`}>
                  {badge}
                </span>
              )}
            </div>

            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full ${progressClassName} transition-all duration-500`}
                style={{ width: `${safeProgress}%` }}
              />
            </div>

            {insight && (
              <p className="mt-3 text-sm leading-relaxed text-white/60">{insight}</p>
            )}
          </div>

          {actions.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {actions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={action.onClick}
                  className="rounded-[22px] border border-white/10 bg-white/[0.065] p-4 text-left transition hover:bg-white/[0.1]"
                >
                  <p className="text-sm font-semibold text-white">{action.label}</p>
                  {action.description && (
                    <p className="mt-1 text-xs text-white/45">{action.description}</p>
                  )}
                </button>
              ))}
            </div>
          )}

          {details.length > 0 && (
            <div className="mt-4 space-y-2 rounded-[24px] border border-white/10 bg-black/15 p-4 text-sm">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="font-semibold text-white/85">Breakdown</p>
                {badge && (
                  <span className={`text-xs font-semibold ${badgeClassName}`}>{badge}</span>
                )}
              </div>

              {details.map((detail, index) => (
                <div
                  key={detail.label}
                  className={`flex items-center justify-between gap-4 ${
                    index === 0 ? "border-t border-white/10 pt-3" : ""
                  }`}
                >
                  <span className="text-white/45">{detail.label}</span>
                  <span className="font-medium text-white">{detail.value}</span>
                </div>
              ))}
            </div>
          )}

          {footer && (
            <p className="mt-4 rounded-[22px] border border-white/10 bg-white/[0.035] p-4 text-xs leading-relaxed text-white/45">
              {footer}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(panel, document.body) : panel;
}

import { createPortal } from "react-dom";

export default function FinancialFocusPanel({
  open = false,
  onClose,
  eyebrow,
  title,
  primaryLabel,
  primaryValue,
  badge,
  badgeClassName = "text-[var(--clara-accent-text)]",
  progress = 0,
  progressClassName = "bg-[var(--clara-accent)]",
  insight,
  actions = [],
  details = [],
  footer,
  footerAction,
}) {
  const safeProgress = Math.min(Math.max(Number(progress) || 0, 0), 100);

  const panel = (
    <div
      className={`fixed inset-0 z-[9999] flex items-end justify-center px-3 pb-3 pt-10 transition-opacity duration-300 sm:items-center sm:p-5 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <button
        type="button"
        aria-label={`Close ${title} panel`}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
      />

      <div
        className={`relative flex h-[86vh] w-full max-w-md flex-col overflow-hidden rounded-[30px] border border-[var(--clara-border)] bg-[var(--clara-panel)] text-[var(--clara-text)] shadow-[var(--clara-glow-premium)] backdrop-blur-2xl transition-transform duration-300 ${
          open ? "translate-y-0 scale-100" : "translate-y-10 scale-95"
        }`}
        style={{ transitionTimingFunction: "var(--clara-theme-transition)" }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[var(--clara-surface-glow)]" />

        <div className="relative border-b border-[var(--clara-border)] px-5 pb-4 pt-3">
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[var(--clara-border-strong)]" />

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--clara-text-faint)]">
                {eyebrow}
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-[var(--clara-text)]">{title}</h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[var(--clara-border)] bg-[var(--clara-glass)] px-3 py-1.5 text-xs font-semibold text-[var(--clara-text-soft)] transition hover:bg-[var(--clara-card-strong)] hover:text-[var(--clara-text)]"
            >
              Close
            </button>
          </div>
        </div>

        <div className="relative flex-1 overflow-y-auto px-5 py-5">
          <div className="rounded-[26px] border border-[var(--clara-border)] bg-[var(--clara-card)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs text-[var(--clara-text-muted)]">{primaryLabel}</p>
                <h3 className="mt-1 text-3xl font-bold text-[var(--clara-text)]">
                  {primaryValue}
                </h3>
              </div>

              {badge && (
                <span className={`text-sm font-semibold ${badgeClassName}`}>
                  {badge}
                </span>
              )}
            </div>

            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-[var(--clara-glass)]">
              <div
                className={`h-full ${progressClassName} transition-all duration-500`}
                style={{ width: `${safeProgress}%` }}
              />
            </div>

            {insight && (
              <p className="mt-3 text-sm leading-relaxed text-[var(--clara-text-soft)]">{insight}</p>
            )}
          </div>

          {actions.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {actions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={action.onClick}
                  className="rounded-[22px] border border-[var(--clara-border)] bg-[var(--clara-card)] p-4 text-left transition hover:bg-[var(--clara-card-strong)]"
                >
                  <p className="text-sm font-semibold text-[var(--clara-text)]">{action.label}</p>
                  {action.description && (
                    <p className="mt-1 text-xs text-[var(--clara-text-muted)]">{action.description}</p>
                  )}
                </button>
              ))}
            </div>
          )}

          {details.length > 0 && (
            <div className="mt-4 space-y-2 rounded-[24px] border border-[var(--clara-border)] bg-[var(--clara-glass)] p-4 text-sm">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="font-semibold text-[var(--clara-text-soft)]">Breakdown</p>
                {badge && (
                  <span className={`text-xs font-semibold ${badgeClassName}`}>{badge}</span>
                )}
              </div>

              {details.map((detail, index) => (
                <div
                  key={detail.label}
                  className={`flex items-center justify-between gap-4 ${
                    index === 0 ? "border-t border-[var(--clara-border)] pt-3" : ""
                  }`}
                >
                  <span className="text-[var(--clara-text-muted)]">{detail.label}</span>
                  <span className="font-medium text-[var(--clara-text)]">{detail.value}</span>
                </div>
              ))}
            </div>
          )}

          {footerAction && (
            <button
              type="button"
              onClick={footerAction.onClick}
              className="mt-4 w-full rounded-[22px] border border-[var(--clara-accent-border)] bg-[var(--clara-accent-soft)] px-4 py-4 text-left transition hover:bg-[var(--clara-card-strong)]"
            >
              <p className="text-sm font-semibold text-[var(--clara-accent-text)]">
                {footerAction.label}
              </p>
              {footerAction.description && (
                <p className="mt-1 text-xs leading-relaxed text-[var(--clara-text-muted)]">
                  {footerAction.description}
                </p>
              )}
            </button>
          )}

          {footer && (
            <p className="mt-4 rounded-[22px] border border-[var(--clara-border)] bg-[var(--clara-card)] p-4 text-xs leading-relaxed text-[var(--clara-text-muted)]">
              {footer}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(panel, document.body) : panel;
}

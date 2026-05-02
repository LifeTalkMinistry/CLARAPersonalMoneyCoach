import { useMemo, useState } from "react";
import FinancialFocusPanel from "./FinancialFocusPanel";

function money(value) {
  return `₱${Number(value || 0).toLocaleString()}`;
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function getMonthLabel(source) {
  const raw = source?.monthKey || source?.month || source?.period;
  if (typeof raw === "string" && raw.trim()) return raw;
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function BudgetCard({ data, onAdjustBudget, onCreateBudget, onManageBudget }) {
  const [panelOpen, setPanelOpen] = useState(false);

  const source = data || {};
  const total = toNumber(source.total);
  const spent = toNumber(source.spent);
  const totalExpenses = toNumber(source.totalExpenses ?? spent);
  const unplanned = toNumber(source.unplannedSpent);
  const categories = Array.isArray(source.categories) ? source.categories : [];
  const monthLabel = getMonthLabel(source);

  const allocated = categories.reduce(
    (sum, item) => sum + toNumber(item?.allocated ?? item?.allocated_amount ?? item?.amount),
    0
  );

  const unallocated = Math.max(total - allocated, 0);
  const remaining = Math.max(total - spent, 0);
  const undocumented = Math.max(totalExpenses - spent - unplanned, 0);

  const progress = useMemo(() => {
    if (!total) return 0;
    return Math.min((spent / total) * 100, 100);
  }, [spent, total]);

  const status = !total ? "No Plan" : progress < 50 ? "Active" : progress < 80 ? "Caution" : "Critical";
  const badgeClassName =
    progress < 50
      ? "text-[var(--clara-status-good)]"
      : progress < 80
      ? "text-[var(--clara-status-caution)]"
      : "text-[var(--clara-status-risk)]";

  const summary =
    total === 0
      ? "Create your monthly spending plan to start tracking your budget."
      : remaining > 0
      ? "You still have strong room left this month."
      : "Your monthly budget is fully used for this month.";

  const helperText =
    total === 0
      ? "Set a target amount and assign categories for planned expense logging."
      : unplanned > 0
      ? `${money(unplanned)} is currently marked as unplanned spending.`
      : "Your monthly budget is assigned and ready for planned expense logging.";

  const openBudget = () => {
    if (!total && onCreateBudget) {
      onCreateBudget();
      return;
    }
    if (total && onManageBudget) {
      onManageBudget();
      return;
    }
    onAdjustBudget?.();
  };

  const progressColor =
    progress < 50
      ? "var(--clara-status-good)"
      : progress < 80
      ? "var(--clara-status-caution)"
      : "var(--clara-status-risk)";

  return (
    <>
      <style>{`
        .budget-card-text {
          --bc-pad: clamp(16px, 4vw, 22px);
          --bc-gap: clamp(10px, 2.5vw, 15px);
          --bc-hero: clamp(30px, 7vw, 40px);
          --bc-title: clamp(15px, 3.4vw, 18px);
          --bc-small: clamp(11px, 2.5vw, 13px);
        }

        @media (max-height: 700px), (max-width: 360px) {
          .budget-card-text {
            --bc-pad: 14px;
            --bc-gap: 8px;
          }
          .budget-card-text .budget-helper {
            display: none;
          }
        }
      `}</style>

      <div
        onClick={!total ? openBudget : undefined}
        role={!total ? "button" : undefined}
        tabIndex={!total ? 0 : undefined}
        onKeyDown={(event) => {
          if (!total && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            openBudget();
          }
        }}
        className={`h-full w-full min-h-0 ${!total ? "cursor-pointer" : ""} ${
          panelOpen ? "scale-[0.98] opacity-80 transition duration-300" : "transition duration-300"
        }`}
      >
        <article
          className="budget-card-text relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[24px] border text-white transition-all duration-300 ease-out active:scale-[0.975]"
          style={{
            padding: "var(--bc-pad)",
            gap: "var(--bc-gap)",
            borderColor: "rgba(185,246,50,0.18)",
            background:
              "radial-gradient(circle at 88% 18%, rgba(28,185,125,0.16), transparent 36%), radial-gradient(circle at 14% 4%, rgba(185,246,50,0.10), transparent 30%), linear-gradient(180deg, rgba(6,42,38,0.96), rgba(3,17,26,0.98))",
            boxShadow:
              "0 18px 42px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -10px 30px rgba(0,0,0,0.25)",
          }}
        >
          <div className="pointer-events-none absolute inset-0 rounded-[24px]" style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)" }} />

          <div className="relative z-10 flex shrink-0 items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate font-extrabold leading-tight text-white" style={{ fontSize: "var(--bc-title)", textShadow: "0 6px 16px rgba(0,0,0,0.35)" }}>
                Budget
              </h2>
              <p className="mt-1 truncate text-[11px] font-bold leading-tight text-white/80">
                Monthly spending plan • {monthLabel}
              </p>
            </div>

            <span className="inline-flex shrink-0 items-center rounded-full border border-[#B9F632]/20 bg-[#B9F632]/10 px-3 py-1.5 text-[11px] font-bold text-[#B9F632] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              {status}
            </span>
          </div>

          <div className="relative z-10 shrink-0">
            <p className="font-black leading-none tracking-[-0.055em] text-[#62F7A1]" style={{ fontSize: "var(--bc-hero)", textShadow: "0 10px 26px rgba(0,0,0,0.45)" }}>
              {money(total)}
            </p>
            <p className="mt-2 font-extrabold text-[#B9F632]" style={{ fontSize: "var(--bc-small)" }}>
              {money(remaining)} left
            </p>
          </div>

          <div className="relative z-10 min-h-0 flex-1 overflow-hidden">
            <p className="text-[13px] font-extrabold leading-snug text-white/95">
              {summary}
            </p>
            <p className="budget-helper mt-2 line-clamp-2 text-[12px] font-semibold leading-snug text-white/55">
              {helperText}
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <div className="mb-2 flex items-center justify-between gap-3 text-[12px] font-extrabold text-white/75">
              <span>Monthly progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-[8px] overflow-hidden rounded-full border border-white/5 bg-white/[0.10] shadow-[inset_0_1px_6px_rgba(0,0,0,0.45)]">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progress}%`,
                  background: progressColor,
                  boxShadow: "0 0 12px rgba(185,246,50,0.35), 0 0 24px rgba(185,246,50,0.18)",
                }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between gap-3 text-[11px] font-bold text-white/55">
              <span>{money(0)}</span>
              <span>{money(total)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setPanelOpen(true);
            }}
            className="relative z-10 mt-auto flex shrink-0 items-center justify-between rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3 text-left transition duration-300 active:scale-[0.97]"
            style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 6px 18px rgba(0,0,0,0.25)" }}
          >
            <span className="truncate text-sm font-extrabold text-white">Show details</span>
            <span className="shrink-0 text-lg leading-none text-white/70" aria-hidden>
              ⌄
            </span>
          </button>
        </article>
      </div>

      <FinancialFocusPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        eyebrow="Budget"
        title="Monthly Plan"
        primaryLabel={total ? "Remaining" : "No Plan"}
        primaryValue={money(remaining)}
        badge={status}
        badgeClassName={badgeClassName}
        progress={progress}
        progressClassName={
          progress < 50
            ? "bg-[var(--clara-status-good)]"
            : progress < 80
            ? "bg-[var(--clara-status-caution)]"
            : "bg-[var(--clara-status-risk)]"
        }
        insight={helperText}
        actions={[]}
        details={[
          { label: "Declared", value: money(total) },
          { label: "Spent", value: money(spent) },
          { label: "Remaining", value: money(remaining) },
          { label: "Categories", value: String(categories.length) },
          { label: "Unallocated", value: money(unallocated) },
          { label: "Allocated", value: money(allocated) },
          { label: "Unplanned", value: money(unplanned) },
          { label: "Undocumented", value: money(undocumented) },
        ]}
        footerAction={{
          label: total ? "Manage Budget" : "Start Budgeting",
          description: total ? "Edit your monthly spending plan" : "Create this month's spending plan",
          onClick: openBudget,
        }}
      />
    </>
  );
}

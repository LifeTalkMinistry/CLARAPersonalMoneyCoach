import { useMemo, useState } from "react";
import FinancialFocusPanel from "./FinancialFocusPanel";

function money(value) {
  return `₱${Number(value || 0).toLocaleString()}`;
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export default function BudgetCard({ data, onAdjustBudget, onCreateBudget, onManageBudget }) {
  const [panelOpen, setPanelOpen] = useState(false);

  const source = data || {};
  const total = toNumber(source.total);
  const spent = toNumber(source.spent);
  const totalExpenses = toNumber(source.totalExpenses ?? spent);
  const unplanned = toNumber(source.unplannedSpent);
  const categories = Array.isArray(source.categories) ? source.categories : [];

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

  const status = progress < 50 ? "On Track" : progress < 80 ? "Caution" : "Critical";
  const badgeClassName =
    progress < 50
      ? "text-[var(--clara-status-good)]"
      : progress < 80
      ? "text-[var(--clara-status-caution)]"
      : "text-[var(--clara-status-risk)]";

  const insight =
    total === 0
      ? "No plan yet."
      : unplanned > 0
      ? `${money(unplanned)} unplanned`
      : progress < 50
      ? "Healthy range."
      : progress < 80
      ? "Approaching limit."
      : "Budget is tight.";

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

  const usedLabel = total ? `${Math.round(progress)}% used` : "0% used";
  const progressColor =
    progress < 50
      ? "var(--clara-status-good)"
      : progress < 80
      ? "var(--clara-status-caution)"
      : "var(--clara-status-risk)";

  return (
    <>
      <style>{`
        .budget-card-fixed {
          --bc-pad: clamp(16px, 4vw, 22px);
          --bc-gap: clamp(10px, 2.5vw, 16px);
          --bc-hero: clamp(28px, 6vw, 40px);
          --bc-title: clamp(14px, 3vw, 18px);
          --bc-small: clamp(11px, 2.5vw, 13px);
        }

        @media (max-height: 700px), (max-width: 360px) {
          .budget-card-fixed {
            --bc-pad: 14px;
            --bc-gap: 8px;
          }
          .budget-card-fixed .budget-extra {
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
          className="budget-card-fixed relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[24px] border text-white transition-all duration-300 ease-out active:scale-[0.975]"
          style={{
            padding: "var(--bc-pad)",
            gap: "var(--bc-gap)",
            borderColor: "rgba(185,246,50,0.18)",
            background:
              "radial-gradient(circle at 100% 10%, rgba(28,185,125,0.16), transparent 34%), linear-gradient(180deg, rgba(6,42,38,0.96), rgba(3,17,26,0.98))",
            boxShadow:
              "0 16px 38px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <div className="pointer-events-none absolute -right-14 top-16 h-44 w-44 rounded-full border border-[#B9F632]/10 bg-[#00FF88]/[0.02]" />

          <div className="relative z-10 flex shrink-0 items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[15px] border border-[#B9F632]/30 bg-[#B9F632]/10 text-lg font-black text-[#B9F632]">
                ₱
              </div>
              <div className="min-w-0">
                <p className="truncate text-[9px] font-black uppercase tracking-[0.32em] text-[#B9F632]">Budget</p>
                <h2 className="mt-1 truncate font-extrabold leading-none text-white" style={{ fontSize: "var(--bc-title)" }}>
                  Monthly Plan
                </h2>
              </div>
            </div>

            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[10px] font-bold text-[#DFFF5F]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B9F632]" />
              {total ? status : "No Plan"}
            </span>
          </div>

          <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-center overflow-hidden">
            <p className="truncate font-black leading-none tracking-[-0.055em] text-white" style={{ fontSize: "var(--bc-hero)" }}>
              {money(total)}
            </p>
            <p className="mt-2 truncate font-bold text-white/55" style={{ fontSize: "var(--bc-small)" }}>
              {total ? `${money(remaining)} left` : "No plan"}
            </p>
            <p className="budget-extra mt-2 truncate font-semibold text-white/45" style={{ fontSize: "var(--bc-small)" }}>
              {insight}
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <div className="h-[9px] overflow-hidden rounded-full bg-white/[0.14] p-[2px]">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${progress}%`, background: progressColor }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 text-[11px] font-bold text-white/55">
              <span className="truncate">
                <span className="text-[#B9F632]">{usedLabel.split(" ")[0]}</span> used
              </span>
              <span className="truncate text-right">{money(unplanned)} unplanned</span>
            </div>
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setPanelOpen(true);
            }}
            className="relative z-10 mt-auto flex shrink-0 items-center justify-between rounded-[20px] border border-[#B9F632]/15 bg-white/[0.045] px-4 py-3 text-left transition duration-300 active:scale-[0.985]"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[13px] border border-[#B9F632]/15 bg-[#B9F632]/[0.07] text-xs text-[#B9F632]">
                ▥
              </span>
              <span className="truncate text-sm font-extrabold text-white">Show details</span>
            </span>
            <span className="shrink-0 text-xl leading-none text-[#B9F632]" aria-hidden>
              ›
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
        badge={total ? status : "No Plan"}
        badgeClassName={badgeClassName}
        progress={progress}
        progressClassName={
          progress < 50
            ? "bg-[var(--clara-status-good)]"
            : progress < 80
            ? "bg-[var(--clara-status-caution)]"
            : "bg-[var(--clara-status-risk)]"
        }
        insight={insight}
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

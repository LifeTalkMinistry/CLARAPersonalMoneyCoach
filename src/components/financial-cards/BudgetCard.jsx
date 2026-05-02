import { useMemo, useState } from "react";
import FinancialCardShell from "./FinancialCardShell";
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
    progress < 50 ? "text-emerald-400" : progress < 80 ? "text-amber-400" : "text-rose-400";

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

  return (
    <>
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
        className={`h-full w-full ${!total ? "cursor-pointer" : ""} ${
          panelOpen ? "scale-[0.98] opacity-80 transition duration-300" : "transition duration-300"
        }`}
      >
        <FinancialCardShell
          eyebrow="Budget"
          title="Monthly Plan"
          icon="₱"
          badge={total ? status : "No Plan"}
          hero={money(total)}
          heroSubtext={total ? `${money(remaining)} left` : "No plan"}
          progress={progress}
          progressClassName="bg-emerald-400"
          insight={insight}
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setPanelOpen(true);
            }}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm text-white/70 transition duration-300 hover:bg-white/[0.06] hover:text-white"
          >
            <span className="font-medium">Show details</span>
            <span className="text-lg leading-none text-white/60" aria-hidden>
              ⌄
            </span>
          </button>
        </FinancialCardShell>
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
        progressClassName={progress < 50 ? "bg-emerald-400" : progress < 80 ? "bg-amber-400" : "bg-rose-400"}
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

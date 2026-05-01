import { useMemo, useState } from "react";
import FinancialCardShell from "./FinancialCardShell";
import FinancialFocusPanel from "./FinancialFocusPanel";

function money(v) {
  return `₱${Number(v || 0).toLocaleString()}`;
}

export default function BudgetCard({ data, onAdjustBudget, onReallocate }) {
  const [panelOpen, setPanelOpen] = useState(false);

  const total = data?.total || 0; // Declared
  const spent = data?.spent || 0; // Budgeted (planned) spend
  const totalExpenses = data?.totalExpenses ?? spent; // All expenses
  const unplanned = data?.unplannedSpent || 0; // No matching category
  const categories = Array.isArray(data?.categories) ? data.categories : [];

  const allocated = categories.reduce(
    (s, c) => s + Number(c?.allocated ?? c?.allocated_amount ?? 0),
    0
  );

  const unallocated = Math.max(total - allocated, 0);
  const remaining = Math.max(total - spent, 0);

  const undocumented = Math.max(totalExpenses - spent - unplanned, 0);

  const progress = useMemo(() => {
    if (!total) return 0;
    return Math.min((spent / total) * 100, 100);
  }, [total, spent]);

  const status = progress < 50 ? "On Track" : progress < 80 ? "Caution" : "Critical";

  const progressClassName =
    progress < 50
      ? "from-emerald-300 to-emerald-500"
      : progress < 80
      ? "from-amber-300 to-amber-500"
      : "from-rose-300 to-rose-500";

  const panelProgressClassName =
    progress < 50
      ? "bg-emerald-400"
      : progress < 80
      ? "bg-amber-400"
      : "bg-rose-400";

  const badgeClassName =
    progress < 50
      ? "text-emerald-400"
      : progress < 80
      ? "text-amber-400"
      : "text-rose-400";

  const insight =
    total === 0
      ? "Declare this month's spending amount first."
      : unplanned > 0
      ? `${money(unplanned)} is unplanned. Consider adding categories.`
      : progress < 50
      ? "You're within a healthy range."
      : progress < 80
      ? "You're approaching your limit."
      : "Budget is tight. Adjustments recommended.";

  return (
    <>
      <div
        className={`h-full w-full ${
          panelOpen ? "scale-[0.98] opacity-80 transition duration-300" : "transition duration-300"
        }`}
      >
        <FinancialCardShell
          eyebrow="Budget"
          title="Monthly Plan"
          icon="₱"
          badge={total ? status : "No Plan"}
          hero={money(total)}
          heroSubtext={
            total
              ? `${money(remaining)} left`
              : "No plan"
          }
          progress={progress}
          progressClassName={progressClassName}
          insight={insight}
        >
          <button
            type="button"
            onClick={() => setPanelOpen(true)}
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
        badge={status}
        badgeClassName={badgeClassName}
        progress={progress}
        progressClassName={panelProgressClassName}
        insight={insight}
        actions={[
          {
            label: total ? "Manage Budget" : "Start",
            description: total
              ? "Adjust or reallocate your plan"
              : "Create this month's spending plan",
            onClick: onAdjustBudget,
          },
          {
            label: "Reallocate",
            description: "Move money between categories",
            onClick: onReallocate,
          },
        ]}
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
        footer="Budget updates are derived from your logged expenses so this works even offline."
      />
    </>
  );
}

import { useMemo, useState } from "react";
import FinancialCardShell from "./FinancialCardShell";
import FinancialFocusPanel from "./FinancialFocusPanel";

export default function BudgetCard({ data, onAdjustBudget, onReallocate }) {
  const [panelOpen, setPanelOpen] = useState(false);

  const total = data?.total || 0;
  const spent = data?.spent || 0;
  const remaining = Math.max(total - spent, 0);

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
    progress < 50
      ? "You're spending within a healthy range."
      : progress < 80
      ? "You're approaching your budget limit."
      : "Budget is tight. Adjustments recommended.";

  return (
    <>
      <div className={panelOpen ? "scale-[0.98] opacity-80 transition duration-300" : "transition duration-300"}>
        <FinancialCardShell
          eyebrow="Budget"
          title="Monthly Plan"
          icon="₱"
          badge={status}
          hero={`₱${total.toLocaleString()}`}
          heroSubtext={`₱${spent.toLocaleString()} spent`}
          progress={progress}
          progressClassName={progressClassName}
          insight={insight}
        >
          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm text-white/70 transition duration-300 hover:bg-white/[0.06] hover:text-white"
          >
            <span className="font-medium">Show more</span>
            <span className="text-lg leading-none text-white/60" aria-hidden="true">⌄</span>
          </button>
        </FinancialCardShell>
      </div>

      <FinancialFocusPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        eyebrow="Budget"
        title="Monthly Plan"
        primaryLabel="Monthly budget"
        primaryValue={`₱${total.toLocaleString()}`}
        badge={status}
        badgeClassName={badgeClassName}
        progress={progress}
        progressClassName={panelProgressClassName}
        insight={insight}
        actions={[
          {
            label: "Adjust",
            description: "Update your budget plan",
            onClick: onAdjustBudget,
          },
          {
            label: "Reallocate",
            description: "Move money between categories",
            onClick: onReallocate,
          },
        ]}
        details={[
          { label: "Total budget", value: `₱${total.toLocaleString()}` },
          { label: "Spent", value: `₱${spent.toLocaleString()}` },
          { label: "Remaining", value: `₱${remaining.toLocaleString()}` },
        ]}
        footer="This is your budget control layer. Keep the dashboard clean, then open this panel when you need to adjust or reallocate."
      />
    </>
  );
}

import { useMemo } from "react";
import FinancialCardShell from "./FinancialCardShell";

export default function BudgetCard({ data, onAdjustBudget, onReallocate }) {
  const total = data?.total || 0;
  const spent = data?.spent || 0;

  const progress = useMemo(() => {
    if (!total) return 0;
    return Math.min((spent / total) * 100, 100);
  }, [total, spent]);

  const status = progress < 50 ? "On Track" : progress < 80 ? "Caution" : "Critical";

  return (
    <FinancialCardShell
      eyebrow="Budget"
      title="Monthly Plan"
      icon="₱"
      badge={status}
      hero={`₱${total.toLocaleString()}`}
      heroSubtext={`₱${spent.toLocaleString()} spent`}
      progress={progress}
      progressClassName={
        progress < 50
          ? "from-emerald-300 to-emerald-500"
          : progress < 80
          ? "from-amber-300 to-amber-500"
          : "from-rose-300 to-rose-500"
      }
      insight={
        progress < 50
          ? "You're spending within a healthy range."
          : progress < 80
          ? "You're approaching your budget limit."
          : "Budget is tight. Adjustments recommended."
      }
    >
      <div className="flex gap-2">
        <button
          onClick={onAdjustBudget}
          className="flex-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm py-2 transition"
        >
          Adjust
        </button>
        <button
          onClick={onReallocate}
          className="flex-1 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-sm py-2 transition"
        >
          Reallocate
        </button>
      </div>
    </FinancialCardShell>
  );
}

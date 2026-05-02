import { useMemo, useState } from "react";
import FinancialFocusPanel from "./FinancialFocusPanel";
import { Wallet } from "lucide-react";

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
      <div className={`h-full w-full ${panelOpen ? "scale-[0.98] opacity-80" : ""}`}>
        <article className="relative flex h-full w-full flex-col rounded-[24px] border text-white p-4 gap-3">

          {/* HEADER WITH ICON */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#B9F632]/20 bg-[#B9F632]/10">
                <Wallet size={18} className="text-[#B9F632]" />
              </div>

              <div>
                <h2 className="font-black text-white text-[18px]">Budget</h2>
                <p className="text-[11px] text-white/60">Monthly spending plan • {monthLabel}</p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full border border-[#B9F632]/20 bg-[#B9F632]/10 text-[11px] text-[#B9F632]">
              {status}
            </span>
          </div>

          {/* VALUE */}
          <div>
            <p className="text-[40px] font-black text-[#62F7A1]">{money(total)}</p>
            <p className="text-[#B9F632] text-sm font-bold">{money(remaining)} left</p>
          </div>

        </article>
      </div>
    </>
  );
}

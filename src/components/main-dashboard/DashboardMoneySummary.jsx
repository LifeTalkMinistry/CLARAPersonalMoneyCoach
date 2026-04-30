import { Eye, EyeOff } from "lucide-react";
import { formatMoney } from "../../lib/dashboard/financeUtils";

export default function DashboardMoneySummary({
  moneyLeft = 0,
  totalExpenses = 0,
  moneyVisible = true,
  onToggleMoneyVisible,
}) {
  const total = moneyLeft + totalExpenses;

  const expenseRatio = total > 0 ? totalExpenses / total : 0;

  let status = "Healthy";
  let statusColor = "text-emerald-300";
  let statusDot = "bg-emerald-400";

  if (expenseRatio >= 0.5 && expenseRatio < 0.8) {
    status = "Watch";
    statusColor = "text-amber-300";
    statusDot = "bg-amber-400";
  } else if (expenseRatio >= 0.8) {
    status = "Critical";
    statusColor = "text-rose-300";
    statusDot = "bg-rose-400";
  }

  return (
    <section className="overflow-hidden rounded-[26px] border border-white/15 bg-white/[0.045] backdrop-blur-2xl">
      
      {/* STATUS BAR */}
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${statusDot}`} />
          <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${statusColor}`}>
            {status} Spending
          </p>
        </div>

        <p className="text-[10px] text-white/40">
          CLARA Insight
        </p>
      </div>

      <div className="grid grid-cols-2 divide-x divide-white/10 mt-2">
        
        {/* LEFT: MONEY LEFT */}
        <div className="min-h-[110px] p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/45">
              Money Left
            </p>

            <button
              type="button"
              onClick={onToggleMoneyVisible}
              className="rounded-full border border-white/10 bg-white/[0.055] p-2 text-white/70 hover:text-white transition"
            >
              {moneyVisible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          <p className="mt-2.5 text-[clamp(32px,8.4vw,37px)] font-black tracking-tight text-white">
            {moneyVisible ? formatMoney(moneyLeft) : "₱••••"}
          </p>

          <p className="mt-3 text-sm text-white/55">
            Available across your wallets.
          </p>
        </div>

        {/* RIGHT: TOTAL EXPENSES */}
        <div className="min-h-[110px] p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/45">
            Total Expenses
          </p>

          <p className="mt-2.5 text-[clamp(32px,8.4vw,37px)] font-black tracking-tight text-white">
            {moneyVisible ? formatMoney(totalExpenses) : "₱••••"}
          </p>

          <p className="mt-3 text-sm text-white/55">
            Tracked spending this month.
          </p>
        </div>

      </div>
    </section>
  );
}
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
    <section className="overflow-hidden rounded-[26px] border border-white/[0.10] bg-[#0b1118]/88 shadow-[0_18px_45px_rgba(0,0,0,0.32)] backdrop-blur-2xl transition-all duration-300 hover:shadow-[0_30px_70px_rgba(0,0,0,0.5)]">

      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-60" />
      
      {/* STATUS BAR */}
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${statusDot}`} />
          <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${statusColor}`}>
            {status} Spending
          </p>
        </div>

        <p className="text-[10px] text-white/45">
          CLARA Insight
        </p>
      </div>

      <div className="grid grid-cols-2 divide-x divide-white/[0.08] mt-2">
        
        {/* LEFT */}
        <div className="min-h-[110px] p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/45">
              Money Left
            </p>

            <button
              type="button"
              onClick={onToggleMoneyVisible}
              className="rounded-full border border-white/10 bg-white/[0.06] p-2 text-white/70 transition-all duration-300 hover:text-white hover:bg-white/[0.12] active:scale-95"
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

          <p className="mt-3 text-sm text-white/60">
            Available across your wallets.
          </p>
        </div>

        {/* RIGHT */}
        <div className="min-h-[110px] p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/45">
            Total Expenses
          </p>

          <p className="mt-2.5 text-[clamp(32px,8.4vw,37px)] font-black tracking-tight text-white">
            {moneyVisible ? formatMoney(totalExpenses) : "₱••••"}
          </p>

          <p className="mt-3 text-sm text-white/60">
            Tracked spending this month.
          </p>
        </div>

      </div>
    </section>
  );
}

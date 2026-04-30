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

  let status = "WATCH";
  let statusColor = "text-amber-300";
  let statusDot = "bg-amber-400";

  if (expenseRatio < 0.5) {
    status = "OK";
    statusColor = "text-emerald-300";
    statusDot = "bg-emerald-400";
  } else if (expenseRatio >= 0.8) {
    status = "HIGH";
    statusColor = "text-rose-300";
    statusDot = "bg-rose-400";
  }

  return (
    <section className="relative overflow-hidden rounded-[26px] border border-white/[0.10] bg-[#0b1118]/88 shadow-[0_18px_45px_rgba(0,0,0,0.32)] backdrop-blur-2xl">

      {/* minimal glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.05),transparent_40%)]" />

      {/* STATUS */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${statusDot}`} />
          <p className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${statusColor}`}>
            {status}
          </p>
        </div>

        <p className="text-[9px] text-white/40">Insight</p>
      </div>

      <div className="grid grid-cols-2 divide-x divide-white/[0.08]">

        {/* TOTAL MONEY */}
        <div className="min-h-[90px] px-4 pb-3 pt-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
              Total Money
            </p>

            <button
              type="button"
              onClick={onToggleMoneyVisible}
              className="rounded-full border border-white/10 bg-white/[0.05] p-1.5 text-white/60 transition hover:text-white hover:bg-white/[0.10]"
            >
              {moneyVisible ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          <p className="mt-1.5 text-[24px] font-black tracking-tight text-white">
            {moneyVisible ? formatMoney(moneyLeft) : "₱••••"}
          </p>

          <p className="mt-1 text-[11px] text-white/50">Available</p>
        </div>

        {/* TOTAL EXPENSE */}
        <div className="min-h-[90px] px-4 pb-3 pt-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
            Total Expense
          </p>

          <p className="mt-1.5 text-[24px] font-black tracking-tight text-white">
            {moneyVisible ? formatMoney(totalExpenses) : "₱••••"}
          </p>

          <p className="mt-1 text-[11px] text-white/50">This month</p>
        </div>

      </div>
    </section>
  );
}

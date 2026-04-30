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
    status = "HEALTHY";
    statusColor = "text-emerald-300";
    statusDot = "bg-emerald-400";
  } else if (expenseRatio >= 0.8) {
    status = "CRITICAL";
    statusColor = "text-rose-300";
    statusDot = "bg-rose-400";
  }

  return (
    <section className="relative overflow-hidden rounded-[26px] border border-white/[0.10] bg-[#0b1118]/88 shadow-[0_18px_45px_rgba(0,0,0,0.32)] backdrop-blur-2xl">

      {/* subtle glow */}
      <div className="pointer-events-none absolute -top-10 -left-10 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-white/5 blur-2xl" />

      {/* STATUS */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${statusDot} shadow-[0_0_8px_rgba(255,255,255,0.6)]`} />
          <p className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${statusColor}`}>
            {status}
          </p>
        </div>

        <p className="text-[9px] text-white/45">Insight</p>
      </div>

      <div className="grid grid-cols-2 divide-x divide-white/[0.08]">

        {/* LEFT */}
        <div className="relative min-h-[90px] px-4 pb-3 pt-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
              Money Left
            </p>

            <button
              type="button"
              onClick={onToggleMoneyVisible}
              className="rounded-full border border-white/10 bg-white/[0.06] p-1.5 text-white/70 transition-all duration-300 hover:text-white hover:bg-white/[0.12] active:scale-95"
            >
              {moneyVisible ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          <p className="mt-1.5 text-[24px] font-black tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]">
            {moneyVisible ? formatMoney(moneyLeft) : "₱••••"}
          </p>

          <p className="mt-1 text-[11px] text-white/55">Available</p>
        </div>

        {/* RIGHT */}
        <div className="relative min-h-[90px] px-4 pb-3 pt-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
            Expenses
          </p>

          <p className="mt-1.5 text-[24px] font-black tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]">
            {moneyVisible ? formatMoney(totalExpenses) : "₱••••"}
          </p>

          <p className="mt-1 text-[11px] text-white/55">This month</p>
        </div>

      </div>
    </section>
  );
}

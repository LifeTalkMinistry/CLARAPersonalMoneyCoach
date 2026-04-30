import { useMemo } from "react";
import { formatMoney } from "../../lib/dashboard/financeUtils";

export default function ObligationDebtCard({
  data,
  onPayDebt,
  onSchedulePayment,
}) {
  const total = data?.total || 0;

  const statusColor = useMemo(() => {
    if (total < 5000) return "text-amber-400";
    if (total < 20000) return "text-rose-400";
    return "text-red-400";
  }, [total]);

  const barColor = useMemo(() => {
    if (total < 5000) return "bg-amber-400";
    if (total < 20000) return "bg-rose-400";
    return "bg-red-400";
  }, [total]);

  const progress = useMemo(() => {
    // visual scale only (not real financial logic)
    return Math.min((total / 50000) * 100, 100);
  }, [total]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 shadow-[0_0_30px_rgba(0,0,0,0.3)]">

      {/* HEADER */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-white/50">Obligations</p>
          <h2 className="text-lg font-semibold text-white">
            Debt Overview
          </h2>
        </div>

        <p className={`text-xs font-semibold ${statusColor}`}>
          Active
        </p>
      </div>

      {/* AMOUNT */}
      <h1 className="text-2xl font-bold text-white">
        {formatMoney(total)}
      </h1>

      <p className="text-sm text-white/50 mt-1">
        Total Outstanding Debt
      </p>

      {/* PROGRESS BAR (VISUAL LOAD) */}
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-4">
        <div
          className={`h-full ${barColor} transition-all duration-500`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* INSIGHT */}
      <p className="text-xs text-white/60 mt-3">
        {total < 5000
          ? "Manageable debt level."
          : total < 20000
          ? "Focus on reducing obligations."
          : "High debt exposure. Prioritize payments."}
      </p>

      {/* ACTIONS */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={onPayDebt}
          className="flex-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm py-2 transition"
        >
          Pay Debt
        </button>

        <button
          onClick={onSchedulePayment}
          className="flex-1 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-sm py-2 transition"
        >
          Schedule
        </button>
      </div>

    </div>
  );
}
import { useMemo } from "react";

export default function InvestmentCard({
  data,
  onAddInvestment,
  onRebalance,
}) {
  const value = data?.value || 0;

  const statusColor = useMemo(() => {
    if (value < 10000) return "text-amber-400";
    if (value < 50000) return "text-emerald-400";
    return "text-cyan-400";
  }, [value]);

  const barColor = useMemo(() => {
    if (value < 10000) return "bg-amber-400";
    if (value < 50000) return "bg-emerald-400";
    return "bg-cyan-400";
  }, [value]);

  const progress = useMemo(() => {
    // soft normalized visual scale (not financial logic)
    return Math.min((value / 100000) * 100, 100);
  }, [value]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 shadow-[0_0_30px_rgba(0,0,0,0.3)]">

      {/* HEADER */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-white/50">Investments</p>
          <h2 className="text-lg font-semibold text-white">
            Portfolio Growth
          </h2>
        </div>

        <p className={`text-xs font-semibold ${statusColor}`}>
          Active
        </p>
      </div>

      {/* VALUE */}
      <h1 className="text-2xl font-bold text-white">
        ₱{value.toLocaleString()}
      </h1>

      <p className="text-sm text-white/50 mt-1">
        Total Portfolio Value
      </p>

      {/* PROGRESS (VISUAL ONLY) */}
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-4">
        <div
          className={`h-full ${barColor} transition-all duration-500`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* INSIGHT */}
      <p className="text-xs text-white/60 mt-3">
        {value < 10000
          ? "Start building your investment base."
          : value < 50000
          ? "Your portfolio is growing steadily."
          : "Strong portfolio position. Keep compounding."}
      </p>

      {/* ACTIONS */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={onAddInvestment}
          className="flex-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm py-2 transition"
        >
          Add Investment
        </button>

        <button
          onClick={onRebalance}
          className="flex-1 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-sm py-2 transition"
        >
          Rebalance
        </button>
      </div>

    </div>
  );
}
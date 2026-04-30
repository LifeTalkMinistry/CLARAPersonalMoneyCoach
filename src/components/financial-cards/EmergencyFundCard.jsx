import { useMemo } from "react";

export default function EmergencyFundCard({
  currentAmount = 0,
  targetAmount = 0,
  onAddFunds,
  onSetTarget,
}) {
  const progress = useMemo(() => {
    if (!targetAmount) return 0;
    return Math.min((currentAmount / targetAmount) * 100, 100);
  }, [currentAmount, targetAmount]);

  const statusColor =
    progress < 40
      ? "text-rose-400"
      : progress < 75
      ? "text-amber-400"
      : "text-emerald-400";

  const barColor =
    progress < 40
      ? "bg-rose-400"
      : progress < 75
      ? "bg-amber-400"
      : "bg-emerald-400";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 shadow-[0_0_30px_rgba(0,0,0,0.3)]">

      {/* HEADER */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-white/50">Emergency Fund</p>
          <h2 className="text-lg font-semibold text-white">Safety Net</h2>
        </div>

        <p className={`text-xs font-semibold ${statusColor}`}>
          {progress.toFixed(0)}%
        </p>
      </div>

      {/* AMOUNT */}
      <h1 className="text-2xl font-bold text-white">
        ₱{currentAmount.toLocaleString()}
      </h1>

      <p className="text-sm text-white/50 mt-1">
        Target: ₱{targetAmount.toLocaleString()}
      </p>

      {/* PROGRESS */}
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-4">
        <div
          className={`h-full ${barColor} transition-all duration-500`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* INSIGHT */}
      <p className="text-xs text-white/60 mt-3">
        {progress < 40
          ? "You're still building your safety net. Focus on consistency."
          : progress < 75
          ? "Good progress. Keep pushing toward full protection."
          : "Strong position. You're close to full emergency readiness."}
      </p>

      {/* ACTIONS */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={onAddFunds}
          className="flex-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm py-2 transition"
        >
          Add Funds
        </button>

        <button
          onClick={onSetTarget}
          className="flex-1 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-sm py-2 transition"
        >
          Set Target
        </button>
      </div>

    </div>
  );
}
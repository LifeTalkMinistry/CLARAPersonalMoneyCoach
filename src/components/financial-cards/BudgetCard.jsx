import { useMemo, useState } from "react";

export default function BudgetCard({
  data,
  onShowMore,
  onAdjustBudget,
  onReallocate,
}) {
  const [expanded, setExpanded] = useState(false);

  const total = data?.total || 0;
  const spent = data?.spent || 0;

  const progress = useMemo(() => {
    if (!total) return 0;
    return Math.min((spent / total) * 100, 100);
  }, [total, spent]);

  const statusColor =
    progress < 50
      ? "text-emerald-400"
      : progress < 80
      ? "text-amber-400"
      : "text-rose-400";

  const barColor =
    progress < 50
      ? "bg-emerald-400"
      : progress < 80
      ? "bg-amber-400"
      : "bg-rose-400";

  const toggleExpand = () => {
    setExpanded((prev) => !prev);
    onShowMore?.(!expanded);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 shadow-[0_0_30px_rgba(0,0,0,0.3)]">

      {/* HEADER */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-white/50">Budget</p>
          <h2 className="text-lg font-semibold text-white">Monthly Plan</h2>
        </div>

        <p className={`text-xs font-semibold ${statusColor}`}>
          {progress.toFixed(0)}%
        </p>
      </div>

      {/* AMOUNT */}
      <h1 className="text-2xl font-bold text-white">
        ₱{total.toLocaleString()}
      </h1>

      <p className="text-sm text-white/50 mt-1">
        ₱{spent.toLocaleString()} spent
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
        {progress < 50
          ? "You're spending within a healthy range."
          : progress < 80
          ? "You're approaching your budget limit."
          : "Budget is tight. Adjustments recommended."}
      </p>

      {/* SHOW MORE BUTTON */}
      <button
        onClick={toggleExpand}
        className="w-full mt-4 rounded-xl border border-white/10 bg-white/[0.03] py-2 text-xs text-white/60 hover:text-white hover:bg-white/10 transition"
      >
        {expanded ? "Show less" : "Show more"}
      </button>

      {/* EXPANDED ACTIONS */}
      {expanded && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={onAdjustBudget}
            className="flex-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm py-2 transition"
          >
            Adjust Budget
          </button>

          <button
            onClick={onReallocate}
            className="flex-1 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-sm py-2 transition"
          >
            Reallocate
          </button>
        </div>
      )}

    </div>
  );
}
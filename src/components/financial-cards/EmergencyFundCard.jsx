import { useMemo, useState } from "react";

export default function EmergencyFundCard({
  currentAmount = 0,
  targetAmount = 0,
  onAddFunds,
  onSetTarget,
}) {
  const [expanded, setExpanded] = useState(false);

  const progress = useMemo(() => {
    if (!targetAmount) return 0;
    return Math.min((currentAmount / targetAmount) * 100, 100);
  }, [currentAmount, targetAmount]);

  const remainingAmount = Math.max(targetAmount - currentAmount, 0);

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

  const detailTone =
    progress < 40
      ? "Building phase"
      : progress < 75
      ? "Steady phase"
      : "Protection phase";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_0_30px_rgba(0,0,0,0.3)] backdrop-blur-xl">
      {/* HEADER */}
      <div className="mb-3 flex items-start justify-between">
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

      <p className="mt-1 text-sm text-white/50">
        Target: ₱{targetAmount.toLocaleString()}
      </p>

      {/* PROGRESS */}
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full ${barColor} transition-all duration-500`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* INSIGHT */}
      <p className="mt-3 text-xs text-white/60">
        {progress < 40
          ? "You're still building your safety net. Focus on consistency."
          : progress < 75
          ? "Good progress. Keep pushing toward full protection."
          : "Strong position. You're close to full emergency readiness."}
      </p>

      {/* DETAILS EXPANDER */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition duration-300 ${
            expanded
              ? "border-white/15 bg-white/[0.065] text-white ring-1 ring-white/10"
              : "border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.06] hover:text-white"
          }`}
        >
          <span className="font-medium">
            {expanded ? "Hide details" : "Show details"}
          </span>

          <span
            className={`text-lg leading-none text-white/60 transition-transform duration-300 ${
              expanded ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          >
            ⌄
          </span>
        </button>

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            expanded ? "mt-3 max-h-[260px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs text-white/60">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="font-semibold text-white/80">Emergency details</p>
              <span className={`font-semibold ${statusColor}`}>{detailTone}</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <span className="text-white/45">Saved amount</span>
                <span className="font-medium text-white">
                  ₱{currentAmount.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-white/45">Target amount</span>
                <span className="font-medium text-white">
                  ₱{targetAmount.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-white/45">Remaining</span>
                <span className="font-medium text-white">
                  ₱{remainingAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="mt-3 border-t border-white/10 pt-3 leading-relaxed text-white/45">
              Keep building this fund until it can protect you from urgent expenses
              without touching your daily budget.
            </p>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onAddFunds}
          className="flex-1 rounded-xl bg-white/10 py-2 text-sm text-white transition hover:bg-white/20"
        >
          Add Funds
        </button>

        <button
          type="button"
          onClick={onSetTarget}
          className="flex-1 rounded-xl bg-white/5 py-2 text-sm text-white/70 transition hover:bg-white/10"
        >
          Set Target
        </button>
      </div>
    </div>
  );
}

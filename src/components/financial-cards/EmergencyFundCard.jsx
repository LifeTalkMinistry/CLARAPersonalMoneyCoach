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
      {/* OVERVIEW */}
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="text-xs text-white/50">Emergency Fund</p>
          <h2 className="text-lg font-semibold text-white">Safety Net</h2>
        </div>

        <p className={`text-xs font-semibold ${statusColor}`}>
          {progress.toFixed(0)}%
        </p>
      </div>

      <h1 className="text-2xl font-bold text-white">
        ₱{currentAmount.toLocaleString()}
      </h1>

      <p className="mt-1 text-sm text-white/50">
        Target: ₱{targetAmount.toLocaleString()}
      </p>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full ${barColor} transition-all duration-500`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-white/40">
        <span>₱0</span>
        <span>₱{targetAmount.toLocaleString()}</span>
      </div>

      <p className="mt-3 text-xs text-white/60">
        {progress < 40
          ? "You're still building your safety net. Focus on consistency."
          : progress < 75
          ? "Good progress. Keep pushing toward full protection."
          : "Strong position. You're close to full emergency readiness."}
      </p>

      {/* SHOW MORE / TOOLS */}
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
            {expanded ? "Hide tools" : "Show more"}
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
            expanded ? "mt-3 max-h-[360px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs text-white/60">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-white/80">Emergency tools</p>
              <span className={`font-semibold ${statusColor}`}>{detailTone}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onAddFunds}
                className="rounded-2xl border border-white/10 bg-white/[0.075] px-3 py-3 text-left transition hover:bg-white/[0.11]"
              >
                <p className="font-semibold text-white">Add money</p>
                <p className="mt-1 text-[11px] text-white/45">Increase saved fund</p>
              </button>

              <button
                type="button"
                onClick={onSetTarget}
                className="rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-3 text-left transition hover:bg-white/[0.08]"
              >
                <p className="font-semibold text-white">Edit target</p>
                <p className="mt-1 text-[11px] text-white/45">Adjust goal amount</p>
              </button>
            </div>

            <div className="space-y-2 rounded-2xl border border-white/10 bg-black/10 p-3">
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

            <p className="leading-relaxed text-white/45">
              Use these tools when you want to update the fund. The main card stays
              clean and shows only your overview.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

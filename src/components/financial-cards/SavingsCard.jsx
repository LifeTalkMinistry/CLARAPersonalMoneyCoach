import { useMemo, useState } from "react";
import FinancialFocusPanel from "./FinancialFocusPanel";

export default function SavingsCard({
  savedAmount = 0,
  targetAmount = 0,
  onAddSavings,
  onSetGoal,
}) {
  const [panelOpen, setPanelOpen] = useState(false);

  const progress = useMemo(() => {
    if (!targetAmount) return 0;
    return Math.min((savedAmount / targetAmount) * 100, 100);
  }, [savedAmount, targetAmount]);

  const remainingAmount = Math.max(targetAmount - savedAmount, 0);

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

  const status = progress < 40 ? "Building" : progress < 75 ? "Growing" : "Strong";

  const insight =
    progress < 40
      ? "Start building your savings habit consistently."
      : progress < 75
      ? "You're growing steadily. Keep going."
      : "Strong savings progress. You're doing great.";

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_0_30px_rgba(0,0,0,0.3)] backdrop-blur-xl transition duration-300 ${
          panelOpen ? "scale-[0.98] opacity-80" : "scale-100 opacity-100"
        }`}
      >
        {/* OVERVIEW */}
        <div className="mb-3 flex items-start justify-between">
          <div>
            <p className="text-xs text-white/50">Savings</p>
            <h2 className="text-lg font-semibold text-white">Growth Fund</h2>
          </div>

          <p className={`text-xs font-semibold ${statusColor}`}>
            {progress.toFixed(0)}%
          </p>
        </div>

        <h1 className="text-2xl font-bold text-white">
          ₱{savedAmount.toLocaleString()}
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

        <p className="mt-3 text-xs text-white/60">{insight}</p>

        <div className="mt-4">
          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm text-white/70 transition duration-300 hover:bg-white/[0.06] hover:text-white"
          >
            <span className="font-medium">Show more</span>
            <span className="text-lg leading-none text-white/60" aria-hidden="true">
              ⌄
            </span>
          </button>
        </div>
      </div>

      <FinancialFocusPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        eyebrow="Savings"
        title="Growth Fund"
        primaryLabel="Saved amount"
        primaryValue={`₱${savedAmount.toLocaleString()}`}
        badge={status}
        badgeClassName={statusColor}
        progress={progress}
        progressClassName={barColor}
        insight={insight}
        actions={[
          {
            label: "Add savings",
            description: "Increase saved amount",
            onClick: onAddSavings,
          },
          {
            label: "Set goal",
            description: "Adjust savings target",
            onClick: onSetGoal,
          },
        ]}
        details={[
          { label: "Saved amount", value: `₱${savedAmount.toLocaleString()}` },
          { label: "Target amount", value: `₱${targetAmount.toLocaleString()}` },
          { label: "Remaining", value: `₱${remainingAmount.toLocaleString()}` },
        ]}
        footer="This is your savings action layer. Keep the card simple for progress, then open this panel when you need to add savings or update your goal."
      />
    </>
  );
}

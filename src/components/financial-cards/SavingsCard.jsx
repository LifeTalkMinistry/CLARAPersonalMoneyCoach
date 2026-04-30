import { useMemo, useState } from "react";
import FinancialCardShell from "./FinancialCardShell";
import FinancialFocusPanel from "./FinancialFocusPanel";

export default function SavingsCard({
  data,
  savedAmount,
  targetAmount,
  onAddSavings,
  onSetGoal,
}) {
  const [panelOpen, setPanelOpen] = useState(false);

  const saved = savedAmount ?? data?.saved ?? data?.savedAmount ?? 0;
  const target = targetAmount ?? data?.target ?? data?.targetAmount ?? 0;

  const progress = useMemo(() => {
    if (!target) return 0;
    return Math.min((saved / target) * 100, 100);
  }, [saved, target]);

  const remainingAmount = Math.max(target - saved, 0);

  const status = progress < 40 ? "Building" : progress < 75 ? "Growing" : "Strong";

  const badgeClassName =
    progress < 40
      ? "text-rose-300 bg-rose-400/10 border-rose-300/20"
      : progress < 75
      ? "text-amber-300 bg-amber-400/10 border-amber-300/20"
      : "text-emerald-300 bg-emerald-400/10 border-emerald-300/20";

  const panelBadgeClassName =
    progress < 40
      ? "text-rose-400"
      : progress < 75
      ? "text-amber-400"
      : "text-emerald-400";

  const progressClassName =
    progress < 40
      ? "from-rose-300 to-rose-500"
      : progress < 75
      ? "from-amber-300 to-amber-500"
      : "from-emerald-300 to-emerald-500";

  const panelProgressClassName =
    progress < 40
      ? "bg-rose-400"
      : progress < 75
      ? "bg-amber-400"
      : "bg-emerald-400";

  const insight =
    progress < 40
      ? "Start building your savings habit consistently."
      : progress < 75
      ? "You're growing steadily. Keep going."
      : "Strong savings progress. You're doing great.";

  return (
    <>
      <div
        className={`h-full w-full ${
          panelOpen ? "scale-[0.98] opacity-80 transition duration-300" : "transition duration-300"
        }`}
      >
        <FinancialCardShell
          eyebrow="Savings"
          title="Growth Fund"
          icon="₱"
          badge={status}
          badgeClassName={badgeClassName}
          accentClassName="from-emerald-300/28 via-teal-300/10 to-transparent"
          hero={`₱${saved.toLocaleString()}`}
          heroSubtext={`Target: ₱${target.toLocaleString()}`}
          progress={progress}
          progressClassName={progressClassName}
          insight={insight}
        >
          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm text-white/70 transition duration-300 hover:bg-white/[0.06] hover:text-white"
          >
            <span className="font-medium">Show more</span>
            <span className="text-lg leading-none text-white/60" aria-hidden="true">⌄</span>
          </button>
        </FinancialCardShell>
      </div>

      <FinancialFocusPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        eyebrow="Savings"
        title="Growth Fund"
        primaryLabel="Saved amount"
        primaryValue={`₱${saved.toLocaleString()}`}
        badge={status}
        badgeClassName={panelBadgeClassName}
        progress={progress}
        progressClassName={panelProgressClassName}
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
          { label: "Saved amount", value: `₱${saved.toLocaleString()}` },
          { label: "Target amount", value: `₱${target.toLocaleString()}` },
          { label: "Remaining", value: `₱${remainingAmount.toLocaleString()}` },
        ]}
        footer="This is your savings action layer. Keep the card simple for progress, then open this panel when you need to add savings or update your goal."
      />
    </>
  );
}

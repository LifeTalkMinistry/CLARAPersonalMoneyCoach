import { useMemo, useState } from "react";
import FinancialCardShell from "./FinancialCardShell";
import FinancialFocusPanel from "./FinancialFocusPanel";

export default function EmergencyFundCard({
  data,
  currentAmount = 0,
  targetAmount = 0,
  onAddFunds,
  onSetTarget,
}) {
  const [panelOpen, setPanelOpen] = useState(false);

  const current = data?.saved ?? data?.current ?? data?.currentAmount ?? currentAmount;
  const target = data?.target ?? data?.targetAmount ?? targetAmount;

  const progress = useMemo(() => {
    if (!target) return 0;
    return Math.min((current / target) * 100, 100);
  }, [current, target]);

  const remaining = Math.max(target - current, 0);
  const status = progress < 40 ? "Building" : progress < 75 ? "Growing" : "Strong";

  const badgeClassName =
    progress < 40
      ? "text-[var(--clara-status-risk)] bg-[rgba(215,138,108,0.12)] border-[rgba(215,138,108,0.22)]"
      : progress < 75
      ? "text-[var(--clara-status-caution)] bg-[rgba(230,197,72,0.12)] border-[rgba(230,197,72,0.22)]"
      : "text-[var(--clara-status-good)] bg-[rgba(215,239,89,0.12)] border-[rgba(215,239,89,0.22)]";

  const panelBadgeClassName =
    progress < 40 ? "text-[var(--clara-status-risk)]" : progress < 75 ? "text-[var(--clara-status-caution)]" : "text-[var(--clara-status-good)]";

  const panelProgressClassName =
    progress < 40 ? "bg-[var(--clara-status-risk)]" : progress < 75 ? "bg-[var(--clara-status-caution)]" : "bg-[var(--clara-status-good)]";

  const insight =
    progress < 40
      ? "You're still building your safety net. Focus on consistency."
      : progress < 75
      ? "Good progress. Keep pushing toward full protection."
      : "Strong position. You're close to full emergency readiness.";

  return (
    <>
      <div
        className={`h-full w-full ${
          panelOpen ? "scale-[0.98] opacity-80 transition duration-300" : "transition duration-300"
        }`}
      >
        <FinancialCardShell
          eyebrow="Emergency Fund"
          title="Safety Net"
          icon="₱"
          badge={`${progress.toFixed(0)}%`}
          badgeClassName={badgeClassName}
          accentClassName="from-teal-300/28 via-emerald-300/10 to-transparent"
          hero={`₱${current.toLocaleString()}`}
          heroSubtext={`Target: ₱${target.toLocaleString()}`}
          progress={progress}
          progressClassName={panelProgressClassName}
          insight={insight}
        >
          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="clara-button-secondary flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition duration-300"
          >
            <span className="font-medium">Show more</span>
            <span className="text-lg leading-none text-white/60" aria-hidden="true">⌄</span>
          </button>
        </FinancialCardShell>
      </div>

      <FinancialFocusPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        eyebrow="Emergency Fund"
        title="Safety Net"
        primaryLabel="Saved amount"
        primaryValue={`₱${current.toLocaleString()}`}
        badge={status}
        badgeClassName={panelBadgeClassName}
        progress={progress}
        progressClassName={panelProgressClassName}
        insight={insight}
        actions={[
          { label: "Add money", description: "Increase saved fund", onClick: onAddFunds },
          { label: "Edit target", description: "Adjust goal amount", onClick: onSetTarget },
        ]}
        details={[
          { label: "Saved amount", value: `₱${current.toLocaleString()}` },
          { label: "Target amount", value: `₱${target.toLocaleString()}` },
          { label: "Remaining", value: `₱${remaining.toLocaleString()}` },
        ]}
        footer="This is your emergency fund action layer. Keep the card simple, then open this panel when you need to add funds or update your target."
      />
    </>
  );
}

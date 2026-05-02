import { useMemo, useState } from "react";
import FinancialCardShell from "./FinancialCardShell";
import FinancialFocusPanel from "./FinancialFocusPanel";

export default function InvestmentCard({
  data,
  onAddInvestment,
  onRebalance,
}) {
  const [panelOpen, setPanelOpen] = useState(false);

  const value = data?.value || 0;

  const progress = useMemo(() => {
    return Math.min((value / 100000) * 100, 100);
  }, [value]);

  const status =
    value < 10000 ? "Starting" : value < 50000 ? "Growing" : "Strong";

  const badgeClassName =
    value < 10000
      ? "text-[var(--clara-status-caution)] bg-[rgba(230,197,72,0.12)] border-[rgba(230,197,72,0.22)]"
      : value < 50000
      ? "text-[var(--clara-status-good)] bg-[rgba(215,239,89,0.12)] border-[rgba(215,239,89,0.22)]"
      : "text-[var(--clara-text)] bg-[rgba(31,79,138,0.18)] border-[rgba(31,79,138,0.22)]";

  const panelBadgeClassName =
    value < 10000
      ? "text-[var(--clara-status-caution)]"
      : value < 50000
      ? "text-[var(--clara-status-good)]"
      : "text-[var(--clara-text)]";

  const panelProgressClassName =
    value < 10000
      ? "bg-[var(--clara-status-caution)]"
      : value < 50000
      ? "bg-[var(--clara-status-good)]"
      : "bg-[var(--clara-highlight)]";

  const insight =
    value < 10000
      ? "Start building your investment base."
      : value < 50000
      ? "Your portfolio is growing steadily."
      : "Strong portfolio position. Keep compounding.";

  return (
    <>
      <div
        className={`h-full w-full ${
          panelOpen
            ? "scale-[0.98] opacity-80 transition duration-300"
            : "transition duration-300"
        }`}
      >
        <FinancialCardShell
          eyebrow="Investments"
          title="Portfolio Growth"
          icon="₱"
          badge={status}
          badgeClassName={badgeClassName}
          accentClassName="from-cyan-300/28 via-emerald-300/10 to-transparent"
          hero={`₱${value.toLocaleString()}`}
          heroSubtext="Total Portfolio Value"
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
            <span className="text-lg leading-none text-white/60">⌄</span>
          </button>
        </FinancialCardShell>
      </div>

      <FinancialFocusPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        eyebrow="Investments"
        title="Portfolio Growth"
        primaryLabel="Portfolio value"
        primaryValue={`₱${value.toLocaleString()}`}
        badge={status}
        badgeClassName={panelBadgeClassName}
        progress={progress}
        progressClassName={panelProgressClassName}
        insight={insight}
        actions={[
          {
            label: "Add investment",
            description: "Increase portfolio value",
            onClick: onAddInvestment,
          },
          {
            label: "Rebalance",
            description: "Adjust allocation",
            onClick: onRebalance,
          },
        ]}
        details={[
          { label: "Portfolio value", value: `₱${value.toLocaleString()}` },
          { label: "Visual progress", value: `${progress.toFixed(0)}%` },
        ]}
        footer="This is your investment control layer. Use this panel when you want to grow or rebalance your portfolio."
      />
    </>
  );
}

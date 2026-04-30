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
      ? "text-amber-300 bg-amber-400/10 border-amber-300/20"
      : value < 50000
      ? "text-emerald-300 bg-emerald-400/10 border-emerald-300/20"
      : "text-cyan-300 bg-cyan-400/10 border-cyan-300/20";

  const panelBadgeClassName =
    value < 10000
      ? "text-amber-400"
      : value < 50000
      ? "text-emerald-400"
      : "text-cyan-400";

  const progressClassName =
    value < 10000
      ? "from-amber-300 to-amber-500"
      : value < 50000
      ? "from-emerald-300 to-emerald-500"
      : "from-cyan-300 to-cyan-500";

  const panelProgressClassName =
    value < 10000
      ? "bg-amber-400"
      : value < 50000
      ? "bg-emerald-400"
      : "bg-cyan-400";

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
          progressClassName={progressClassName}
          insight={insight}
        >
          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm text-white/70 transition duration-300 hover:bg-white/[0.06] hover:text-white"
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

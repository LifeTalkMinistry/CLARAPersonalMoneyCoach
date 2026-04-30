import { useMemo, useState } from "react";
import FinancialFocusPanel from "./FinancialFocusPanel";

export default function InvestmentCard({
  data,
  onAddInvestment,
  onRebalance,
}) {
  const [panelOpen, setPanelOpen] = useState(false);

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
    return Math.min((value / 100000) * 100, 100);
  }, [value]);

  const status =
    value < 10000 ? "Starting" : value < 50000 ? "Growing" : "Strong";

  const insight =
    value < 10000
      ? "Start building your investment base."
      : value < 50000
      ? "Your portfolio is growing steadily."
      : "Strong portfolio position. Keep compounding.";

  return (
    <>
      <div
        className={`relative flex h-full min-h-[236px] flex-col overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_0_30px_rgba(0,0,0,0.3)] backdrop-blur-xl transition duration-300 ${
          panelOpen ? "scale-[0.98] opacity-80" : "scale-100 opacity-100"
        }`}
      >
        {/* OVERVIEW */}
        <div className="mb-3 flex items-start justify-between">
          <div>
            <p className="text-xs text-white/50">Investments</p>
            <h2 className="text-lg font-semibold text-white">
              Portfolio Growth
            </h2>
          </div>

          <p className={`text-xs font-semibold ${statusColor}`}>
            {status}
          </p>
        </div>

        <h1 className="text-2xl font-bold text-white">
          ₱{value.toLocaleString()}
        </h1>

        <p className="mt-1 text-sm text-white/50">
          Total Portfolio Value
        </p>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full ${barColor} transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-3 min-h-[34px] text-xs leading-relaxed text-white/60">{insight}</p>

        <div className="mt-auto pt-4">
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
        eyebrow="Investments"
        title="Portfolio Growth"
        primaryLabel="Portfolio value"
        primaryValue={`₱${value.toLocaleString()}`}
        badge={status}
        badgeClassName={statusColor}
        progress={progress}
        progressClassName={barColor}
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

import { useMemo, useState } from "react";
import FinancialFocusPanel from "./FinancialFocusPanel";
import { formatMoney } from "../../lib/dashboard/financeUtils";

export default function ObligationDebtCard({
  data,
  onPayDebt,
  onSchedulePayment,
}) {
  const [panelOpen, setPanelOpen] = useState(false);
  const total = data?.total || 0;

  const statusColor = useMemo(() => {
    if (total < 5000) return "text-amber-400";
    if (total < 20000) return "text-rose-400";
    return "text-red-400";
  }, [total]);

  const barColor = useMemo(() => {
    if (total < 5000) return "bg-amber-400";
    if (total < 20000) return "bg-rose-400";
    return "bg-red-400";
  }, [total]);

  const progress = useMemo(() => {
    return Math.min((total / 50000) * 100, 100);
  }, [total]);

  const status =
    total < 5000 ? "Manageable" : total < 20000 ? "Reduce" : "Priority";

  const insight =
    total < 5000
      ? "Manageable debt level."
      : total < 20000
      ? "Focus on reducing obligations."
      : "High debt exposure. Prioritize payments.";

  return (
    <>
      <div
        className={`relative flex h-full w-full min-h-[236px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_0_30px_rgba(0,0,0,0.3)] backdrop-blur-xl transition duration-300 ${
          panelOpen ? "scale-[0.98] opacity-80" : "scale-100 opacity-100"
        }`}
      >
        <div className="mb-3 flex items-start justify-between">
          <div>
            <p className="text-xs text-white/50">Obligations</p>
            <h2 className="text-lg font-semibold text-white">
              Debt Overview
            </h2>
          </div>

          <p className={`text-xs font-semibold ${statusColor}`}>
            {status}
          </p>
        </div>

        <h1 className="text-2xl font-bold text-white">
          {formatMoney(total)}
        </h1>

        <p className="mt-1 text-sm text-white/50">
          Total Outstanding Debt
        </p>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full ${barColor} transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-3 text-xs text-white/60">{insight}</p>

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
        eyebrow="Obligations"
        title="Debt Overview"
        primaryLabel="Outstanding debt"
        primaryValue={formatMoney(total)}
        badge={status}
        badgeClassName={statusColor}
        progress={progress}
        progressClassName={barColor}
        insight={insight}
        actions={[
          {
            label: "Pay debt",
            description: "Record or reduce balance",
            onClick: onPayDebt,
          },
          {
            label: "Schedule",
            description: "Plan a payment date",
            onClick: onSchedulePayment,
          },
        ]}
        details={[
          { label: "Outstanding debt", value: formatMoney(total) },
          { label: "Visual load", value: `${progress.toFixed(0)}%` },
          { label: "Current status", value: status },
        ]}
        footer="This is your debt control layer. Keep the dashboard calm, then open this panel when you need to pay, schedule, or review obligations."
      />
    </>
  );
}

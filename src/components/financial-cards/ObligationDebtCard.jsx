import { useMemo, useState } from "react";
import FinancialCardShell from "./FinancialCardShell";
import FinancialFocusPanel from "./FinancialFocusPanel";
import { formatMoney } from "../../lib/dashboard/financeUtils";

export default function ObligationDebtCard({
  data,
  onPayDebt,
  onSchedulePayment,
}) {
  const [panelOpen, setPanelOpen] = useState(false);
  const total = data?.total || 0;

  const progress = useMemo(() => {
    return Math.min((total / 50000) * 100, 100);
  }, [total]);

  const status =
    total < 5000 ? "Manageable" : total < 20000 ? "Reduce" : "Priority";

  const badgeClassName =
    total < 5000
      ? "text-amber-300 bg-amber-400/10 border-amber-300/20"
      : total < 20000
      ? "text-rose-300 bg-rose-400/10 border-rose-300/20"
      : "text-red-300 bg-red-400/10 border-red-300/20";

  const panelBadgeClassName =
    total < 5000
      ? "text-amber-400"
      : total < 20000
      ? "text-rose-400"
      : "text-red-400";

  const progressClassName =
    total < 5000
      ? "from-amber-300 to-amber-500"
      : total < 20000
      ? "from-rose-300 to-rose-500"
      : "from-red-300 to-red-500";

  const panelProgressClassName =
    total < 5000
      ? "bg-amber-400"
      : total < 20000
      ? "bg-rose-400"
      : "bg-red-400";

  const insight =
    total < 5000
      ? "Manageable debt level."
      : total < 20000
      ? "Focus on reducing obligations."
      : "High debt exposure. Prioritize payments.";

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
          eyebrow="Obligations"
          title="Debt Overview"
          icon="₱"
          badge={status}
          badgeClassName={badgeClassName}
          accentClassName="from-rose-300/26 via-amber-300/10 to-transparent"
          hero={formatMoney(total)}
          heroSubtext="Total Outstanding Debt"
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
        eyebrow="Obligations"
        title="Debt Overview"
        primaryLabel="Outstanding debt"
        primaryValue={formatMoney(total)}
        badge={status}
        badgeClassName={panelBadgeClassName}
        progress={progress}
        progressClassName={panelProgressClassName}
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

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
      ? "text-[var(--clara-status-caution)] bg-[rgba(230,197,72,0.12)] border-[rgba(230,197,72,0.22)]"
      : total < 20000
      ? "text-[var(--clara-status-risk)] bg-[rgba(215,138,108,0.12)] border-[rgba(215,138,108,0.22)]"
      : "text-[var(--clara-status-risk)] bg-[rgba(215,138,108,0.16)] border-[rgba(215,138,108,0.26)]";

  const panelBadgeClassName =
    total < 5000
      ? "text-[var(--clara-status-caution)]"
      : total < 20000
      ? "text-[var(--clara-status-risk)]"
      : "text-[var(--clara-status-risk)]";

  const panelProgressClassName =
    total < 5000
      ? "bg-[var(--clara-status-caution)]"
      : total < 20000
      ? "bg-[var(--clara-status-risk)]"
      : "bg-[var(--clara-status-risk)]";

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

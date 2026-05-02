import { useMemo, useState } from "react";
import FinancialCardShell from "./FinancialCardShell";
import FinancialFocusPanel from "./FinancialFocusPanel";

export default function SavingsCard({
  data,
  savedAmount,
  targetAmount,
  onAddSavings,
  onSetGoal,
  onDeleteGoal,
}) {
  const [panelOpen, setPanelOpen] = useState(false);

  const saved = Number(savedAmount ?? data?.saved ?? data?.savedAmount ?? 0);
  const target = Number(targetAmount ?? data?.target ?? data?.targetAmount ?? 0);
  const goalName = data?.goalName ?? data?.name ?? "";
  const hasGoal = Boolean(goalName) && target > 0;
  const goalCount = Array.isArray(data?.goals) ? data.goals.length : hasGoal ? 1 : 0;

  const progress = useMemo(() => {
    if (!target) return 0;
    return Math.min(Math.max((saved / target) * 100, 0), 100);
  }, [saved, target]);

  const status = !hasGoal
    ? "Unassigned"
    : progress < 40
      ? "Building"
      : progress < 75
        ? "Growing"
        : "On Track";

  const insight = !hasGoal
    ? "Assign a goal to give this savings a purpose."
    : `For: ${goalName}`;

  return (
    <>
      <div className={`h-full w-full ${panelOpen ? "scale-[0.98] opacity-80" : ""}`}>
        <FinancialCardShell
          eyebrow="Savings"
          title="Growth Fund"
          icon="PHP"
          badge={status}
          hero={`PHP ${saved.toLocaleString()}`}
          heroSubtext={
            hasGoal
              ? `PHP ${saved.toLocaleString()} / PHP ${target.toLocaleString()}`
              : "No goal yet"
          }
          progress={progress}
          insight={insight}
        >
          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm text-white/70 hover:text-white"
          >
            <span className="font-medium">Show more</span>
            <span className="text-lg text-white/60">v</span>
          </button>
        </FinancialCardShell>
      </div>

      <FinancialFocusPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        eyebrow="Savings"
        title="Growth Fund"
        primaryLabel="Saved amount"
        primaryValue={`PHP ${saved.toLocaleString()}`}
        badge={status}
        progress={progress}
        insight={insight}
        actions={[
          {
            label: "Add savings",
            description: "Increase saved amount",
            onClick: onAddSavings,
          },
          {
            label: hasGoal ? "Update goal" : "Set goal",
            description: "Give this savings a purpose",
            onClick: onSetGoal,
          },
          ...(hasGoal
            ? [
                {
                  label: "Delete goal",
                  description: "Remove the active goal",
                  onClick: onDeleteGoal,
                },
              ]
            : []),
        ]}
        details={[
          { label: "Saved", value: `PHP ${saved.toLocaleString()}` },
          { label: "Target", value: `PHP ${target.toLocaleString()}` },
          { label: "Goals", value: String(goalCount) },
          { label: "Goal", value: goalName || "Not set" },
        ]}
      />
    </>
  );
}

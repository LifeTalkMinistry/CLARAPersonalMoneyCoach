import { useMemo, useState } from "react";
import FinancialFocusPanel from "./FinancialFocusPanel";

export default function SavingsCard({
  data,
  savedAmount,
  targetAmount,
  onAddSavings,
  onSetGoal,
}) {
  const [panelOpen, setPanelOpen] = useState(false);

  const saved = Number(savedAmount ?? data?.saved ?? data?.savedAmount ?? 0);
  const target = Number(targetAmount ?? data?.target ?? data?.targetAmount ?? 0);

  const goalName =
    data?.goalName ??
    data?.name ??
    data?.title ??
    data?.purpose ??
    data?.primaryGoal?.name ??
    "";

  const hasGoal = Boolean(goalName) && target > 0;

  const progress = useMemo(() => {
    if (!target) return 0;
    return Math.min(Math.max((saved / target) * 100, 0), 100);
  }, [saved, target]);

  const remainingAmount = Math.max(target - saved, 0);

  const status = !hasGoal
    ? "Unassigned"
    : progress < 40
    ? "Building"
    : progress < 75
    ? "Growing"
    : "On Track";

  const insight = !hasGoal
    ? "Assign a goal to give this savings a purpose."
    : progress >= 100
    ? "Goal reached. Your savings now has completed purpose."
    : `For: ${goalName}`;

  return (
    <>
      <div
        className={`h-full w-full ${
          panelOpen
            ? "scale-[0.98] opacity-80 transition duration-300"
            : "transition duration-300"
        }`}
      >
        <article
          className="group relative flex h-full max-h-full min-h-0 w-full flex-col overflow-hidden rounded-[26px] border px-4 pb-4 pt-4 text-white backdrop-blur-2xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.985]"
          style={{
            borderColor: "var(--clara-border)",
            background: "var(--clara-glass)",
            boxShadow:
              "var(--clara-glow-premium), 0 18px 45px rgba(0,0,0,0.32)",
          }}
        >
          <div className="pointer-events-none absolute inset-0 rounded-[26px] bg-[linear-gradient(145deg,rgba(255,255,255,0.10),rgba(255,255,255,0.03)_40%,rgba(255,255,255,0.015))]" />
          <div
            className="pointer-events-none absolute inset-0 opacity-90 transition duration-500 group-hover:opacity-100"
            style={{ background: "var(--clara-surface-glow)" }}
          />
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full opacity-70 blur-3xl transition duration-500 group-hover:scale-110 group-hover:opacity-90"
            style={{ background: "var(--clara-glow-soft)" }}
          />
          <div className="pointer-events-none absolute -bottom-24 left-10 h-44 w-44 rounded-full bg-white/[0.025] blur-3xl" />
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-60 group-hover:opacity-90" />

          <div className="relative z-10 flex h-full min-h-0 flex-1 flex-col">
            <header className="flex h-[48px] shrink-0 items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-sm font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] transition-all duration-300 group-hover:bg-white/[0.14] group-active:scale-95"
                  style={{
                    borderColor: "var(--clara-accent-border)",
                    background: "var(--clara-accent-soft)",
                    color: "var(--clara-accent-text)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.10), 0 0 18px var(--clara-glow-soft)",
                  }}
                >
                  ₱
                </div>

                <div className="min-w-0 pt-0.5">
                  <p className="truncate text-[10px] font-bold uppercase leading-none tracking-[0.22em] text-white/40">
                    Savings
                  </p>
                  <h2 className="mt-2 truncate text-[15px] font-semibold leading-none tracking-[-0.01em] text-white/95">
                    Growth Fund
                  </h2>
                </div>
              </div>

              <span
                className="mt-0.5 shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase leading-none tracking-[0.12em] transition-all duration-300 group-hover:scale-105"
                style={{
                  borderColor: "var(--clara-accent-border)",
                  background: "var(--clara-accent-soft)",
                  color: "var(--clara-accent-text)",
                  boxShadow: "0 0 18px var(--clara-glow-soft)",
                }}
              >
                {status}
              </span>
            </header>

            <section className="mt-4 shrink-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
                Saved Money
              </p>

              <p className="mt-2 truncate text-[34px] font-semibold leading-none tracking-[-0.055em] text-white sm:text-[36px]">
                ₱{saved.toLocaleString()}
              </p>
            </section>

            <section
              className="mt-4 min-h-0 flex-1 rounded-[22px] border p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
              style={{
                borderColor: "var(--clara-border)",
                background: "var(--clara-panel)",
              }}
            >
              {hasGoal ? (
                <>
                  <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                        Goal
                      </p>
                      <p className="mt-1 truncate text-sm font-semibold text-white/90">
                        For: {goalName}
                      </p>
                    </div>

                    <p className="shrink-0 text-right text-[11px] font-medium text-white/50">
                      ₱{saved.toLocaleString()} / ₱{target.toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full border border-white/[0.05] bg-white/[0.06] shadow-[inset_0_1px_2px_rgba(0,0,0,0.28)]">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${progress}%`,
                        background:
                          "linear-gradient(90deg, var(--clara-accent-text), var(--clara-accent), var(--clara-accent-text))",
                        boxShadow: "0 0 16px var(--clara-glow)",
                      }}
                    />
                  </div>
                </>
              ) : (
                <p className="text-[12px] leading-[1.55] text-white/48">
                  Assign a goal to give this savings a purpose.
                </p>
              )}
            </section>

            <div className="relative z-10 mt-auto flex shrink-0 items-center gap-2 pt-3">
              <button
                type="button"
                onClick={() => setPanelOpen(true)}
                className="flex flex-1 items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm text-white/70 transition duration-300 hover:text-white"
                style={{
                  borderColor: "var(--clara-border)",
                  background: "var(--clara-panel)",
                }}
              >
                <span className="font-medium">Show more</span>
                <span className="text-lg leading-none text-white/60" aria-hidden="true">
                  ⌄
                </span>
              </button>

              <button
                type="button"
                onClick={onAddSavings}
                aria-label="Add savings"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-xl font-semibold backdrop-blur-xl transition duration-300 hover:scale-105 active:scale-95"
                style={{
                  borderColor: "var(--clara-accent-border)",
                  background: "var(--clara-accent-soft)",
                  color: "var(--clara-accent-text)",
                  boxShadow: "0 0 22px var(--clara-glow-soft)",
                }}
              >
                +
              </button>
            </div>
          </div>
        </article>
      </div>

      <FinancialFocusPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        eyebrow="Savings"
        title="Growth Fund"
        primaryLabel="Saved amount"
        primaryValue={`₱${saved.toLocaleString()}`}
        badge={status}
        badgeClassName="text-[var(--clara-accent-text)]"
        progress={progress}
        progressClassName="bg-[var(--clara-accent)]"
        insight={insight}
        actions={[
          {
            label: "Add savings",
            description: "Increase saved amount",
            onClick: onAddSavings,
          },
          {
            label: hasGoal ? "Update goal" : "Set goal",
            description: "Give this savings a clear purpose",
            onClick: onSetGoal,
          },
        ]}
        details={[
          { label: "Saved amount", value: `₱${saved.toLocaleString()}` },
          { label: "Goal", value: hasGoal ? goalName : "Not assigned" },
          { label: "Target amount", value: `₱${target.toLocaleString()}` },
          { label: "Remaining", value: `₱${remainingAmount.toLocaleString()}` },
        ]}
        footer="Savings is stored money. A goal gives it purpose, and progress keeps the user motivated."
      />
    </>
  );
}

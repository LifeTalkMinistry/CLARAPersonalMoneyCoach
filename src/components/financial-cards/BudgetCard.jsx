import { useMemo, useState } from "react";
import FinancialFocusPanel from "./FinancialFocusPanel";

function money(value) {
  return `₱${Number(value || 0).toLocaleString()}`;
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function MiniWalletVisual({ hiddenOnCompact = false }) {
  return (
    <div
      aria-hidden="true"
      className={`budget-wallet-visual pointer-events-none relative min-h-0 flex-1 items-center justify-center overflow-hidden ${
        hiddenOnCompact ? "compact-hide" : "flex"
      }`}
    >
      <div className="absolute h-[112px] w-[112px] rounded-full border border-[#A8FF2B]/10 bg-[#0BFF7A]/[0.03]" />
      <div className="absolute h-[82px] w-[150px] rotate-[-24deg] rounded-[999px] bg-[#6CFF3F]/[0.07] blur-xl" />

      <div className="relative h-[92px] w-[128px] rotate-[8deg] rounded-[24px] border border-white/10 bg-gradient-to-br from-[#123B2D] via-[#092A25] to-[#04161C] shadow-[0_18px_38px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.12)]">
        <div className="absolute -top-7 left-10 h-[64px] w-[76px] rotate-[8deg] rounded-[14px] border border-[#A8FF2B]/25 bg-gradient-to-br from-[#39F16F] to-[#087A46] shadow-[0_12px_28px_rgba(40,255,120,0.18)]" />
        <div className="absolute -top-5 left-[74px] h-[64px] w-[54px] rotate-[13deg] rounded-[14px] border border-[#9BFF27]/15 bg-gradient-to-br from-[#105F48] to-[#06281F]" />
        <div className="absolute inset-x-4 top-5 border-t border-dashed border-[#A8FF2B]/40" />
        <div className="absolute right-[-10px] top-[34px] flex h-[42px] w-[52px] items-center justify-center rounded-l-[22px] rounded-r-[16px] border border-white/10 bg-gradient-to-br from-[#173F32] to-[#071A1F] shadow-[0_10px_24px_rgba(0,0,0,0.24)]">
          <div className="h-5 w-5 rounded-full bg-[#B9F632] shadow-[0_0_18px_rgba(185,246,50,0.42)]" />
        </div>
        <div className="absolute left-5 top-5 text-[20px] font-black text-[#B9F632]/75">₱</div>
      </div>
    </div>
  );
}

export default function BudgetCard({ data, onAdjustBudget, onCreateBudget, onManageBudget }) {
  const [panelOpen, setPanelOpen] = useState(false);

  const source = data || {};
  const total = toNumber(source.total);
  const spent = toNumber(source.spent);
  const totalExpenses = toNumber(source.totalExpenses ?? spent);
  const unplanned = toNumber(source.unplannedSpent);
  const categories = Array.isArray(source.categories) ? source.categories : [];

  const allocated = categories.reduce(
    (sum, item) => sum + toNumber(item?.allocated ?? item?.allocated_amount ?? item?.amount),
    0
  );

  const unallocated = Math.max(total - allocated, 0);
  const remaining = Math.max(total - spent, 0);
  const undocumented = Math.max(totalExpenses - spent - unplanned, 0);

  const progress = useMemo(() => {
    if (!total) return 0;
    return Math.min((spent / total) * 100, 100);
  }, [spent, total]);

  const status = progress < 50 ? "On Track" : progress < 80 ? "Caution" : "Critical";
  const statusTone = progress < 50 ? "good" : progress < 80 ? "caution" : "risk";
  const badgeClassName =
    progress < 50
      ? "text-[var(--clara-status-good)]"
      : progress < 80
      ? "text-[var(--clara-status-caution)]"
      : "text-[var(--clara-status-risk)]";

  const insight =
    total === 0
      ? "No plan yet."
      : unplanned > 0
      ? `${money(unplanned)} unplanned`
      : progress < 50
      ? "Healthy range."
      : progress < 80
      ? "Approaching limit."
      : "Budget is tight.";

  const openBudget = () => {
    if (!total && onCreateBudget) {
      onCreateBudget();
      return;
    }
    if (total && onManageBudget) {
      onManageBudget();
      return;
    }
    onAdjustBudget?.();
  };

  const usedLabel = total ? `${Math.round(progress)}% used` : "0% used";
  const progressGradient =
    statusTone === "good"
      ? "linear-gradient(90deg, #52F766, #B9F632)"
      : statusTone === "caution"
      ? "linear-gradient(90deg, #B9F632, #FFD84A)"
      : "linear-gradient(90deg, #8DFF2A, #F2FF38)";

  return (
    <>
      <style>{`
        .budget-card-adaptive {
          --budget-pad: clamp(16px, 4.4vw, 26px);
          --budget-gap: clamp(10px, 2.8vw, 18px);
          --budget-radius: clamp(22px, 6vw, 30px);
          --budget-title: clamp(14px, 3vw, 18px);
          --budget-hero: clamp(28px, 6vw, 40px);
          --budget-support: clamp(11px, 2.5vw, 13px);
        }

        @media (max-height: 700px), (max-width: 360px) {
          .budget-card-adaptive {
            --budget-pad: 14px;
            --budget-gap: 8px;
          }
          .budget-card-adaptive .compact-hide {
            display: none;
          }
          .budget-card-adaptive .compact-tight {
            padding-block: 10px;
          }
          .budget-card-adaptive .compact-soft-hide {
            display: none;
          }
        }

        @media (min-height: 820px) and (min-width: 390px) {
          .budget-card-adaptive {
            --budget-pad: clamp(22px, 5vw, 30px);
            --budget-gap: clamp(14px, 3.6vw, 22px);
          }
        }
      `}</style>

      <div
        onClick={!total ? openBudget : undefined}
        role={!total ? "button" : undefined}
        tabIndex={!total ? 0 : undefined}
        onKeyDown={(event) => {
          if (!total && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            openBudget();
          }
        }}
        className={`h-full w-full min-h-0 ${!total ? "cursor-pointer" : ""} ${
          panelOpen ? "scale-[0.98] opacity-80 transition duration-300" : "transition duration-300"
        }`}
      >
        <article
          className="budget-card-adaptive group relative flex h-full min-h-0 w-full flex-col overflow-hidden border text-white transition-all duration-300 ease-out active:scale-[0.975]"
          style={{
            padding: "var(--budget-pad)",
            gap: "var(--budget-gap)",
            borderRadius: "var(--budget-radius)",
            borderColor: "rgba(185,246,50,0.18)",
            background:
              "radial-gradient(circle at 18% 10%, rgba(185,246,50,0.13), transparent 30%), radial-gradient(circle at 88% 18%, rgba(0,184,148,0.16), transparent 35%), linear-gradient(145deg, rgba(5,43,38,0.98), rgba(2,17,27,0.98) 62%, rgba(3,13,20,0.98))",
            boxShadow:
              "0 20px 46px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.03)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
          }}
        >
          <div className="pointer-events-none absolute inset-0 opacity-80">
            <div className="absolute -right-12 top-20 h-48 w-48 rounded-full border border-[#B9F632]/10" />
            <div className="absolute bottom-20 left-1/3 h-24 w-56 rotate-[-25deg] rounded-full bg-[#12E676]/[0.06] blur-2xl" />
          </div>

          <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-between overflow-hidden" style={{ gap: "var(--budget-gap)" }}>
            <div className="flex shrink-0 items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[17px] border border-[#A8FF2B]/35 bg-[#A8FF2B]/10 text-[22px] font-black text-[#B9F632] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                  ₱
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[10px] font-black uppercase tracking-[0.34em] text-[#B9F632]">Budget</p>
                  <h2 className="mt-1 truncate font-black tracking-[-0.03em] text-white" style={{ fontSize: "var(--budget-title)" }}>
                    Monthly Plan
                  </h2>
                </div>
              </div>

              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] font-extrabold text-[#DFFF5F] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B9F632]" />
                {total ? status : "No Plan"}
              </span>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 overflow-hidden min-[430px]:grid-cols-[1fr_0.72fr] min-[430px]:items-center">
              <div className="flex min-h-0 flex-col justify-center overflow-hidden">
                <p className="truncate font-black leading-none tracking-[-0.06em] text-white drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)]" style={{ fontSize: "var(--budget-hero)" }}>
                  {money(total)}
                </p>
                <p className="mt-2 truncate font-bold text-white/55" style={{ fontSize: "var(--budget-support)" }}>
                  {total ? `${money(remaining)} left` : "No plan"}
                </p>
                <p className="compact-soft-hide mt-2 line-clamp-2 text-white/45" style={{ fontSize: "var(--budget-support)" }}>
                  {insight}
                </p>
              </div>

              <MiniWalletVisual hiddenOnCompact />
            </div>

            <div className="shrink-0" style={{ display: "flex", flexDirection: "column", gap: "calc(var(--budget-gap) * 0.8)" }}>
              <div className="h-[13px] overflow-hidden rounded-full border border-white/5 bg-white/[0.14] p-[2px] shadow-[inset_0_1px_6px_rgba(0,0,0,0.36)]">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${progress}%`,
                    background: progressGradient,
                    boxShadow: "0 0 16px rgba(185,246,50,0.38)",
                  }}
                />
              </div>

              <div className="flex items-center justify-between gap-3 text-[12px] font-bold text-white/58">
                <span className="truncate">
                  <span className="text-[#B9F632]">{usedLabel.split(" ")[0]}</span> used
                </span>
                <span className="truncate text-right">{money(unplanned)} unplanned</span>
              </div>
            </div>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setPanelOpen(true);
              }}
              className="compact-tight flex shrink-0 items-center justify-between rounded-[22px] border border-[#B9F632]/15 bg-white/[0.045] px-4 py-3 text-left transition duration-300 hover:bg-white/[0.07] active:scale-[0.985]"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px] border border-[#B9F632]/15 bg-[#B9F632]/[0.07] text-[#B9F632]">
                  <span className="text-base leading-none">▥</span>
                </span>
                <span className="truncate text-sm font-black text-white">Show details</span>
              </span>
              <span className="shrink-0 text-2xl leading-none text-[#B9F632]" aria-hidden>
                ›
              </span>
            </button>
          </div>
        </article>
      </div>

      <FinancialFocusPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        eyebrow="Budget"
        title="Monthly Plan"
        primaryLabel={total ? "Remaining" : "No Plan"}
        primaryValue={money(remaining)}
        badge={total ? status : "No Plan"}
        badgeClassName={badgeClassName}
        progress={progress}
        progressClassName={
          progress < 50
            ? "bg-[var(--clara-status-good)]"
            : progress < 80
            ? "bg-[var(--clara-status-caution)]"
            : "bg-[var(--clara-status-risk)]"
        }
        insight={insight}
        actions={[]}
        details={[
          { label: "Declared", value: money(total) },
          { label: "Spent", value: money(spent) },
          { label: "Remaining", value: money(remaining) },
          { label: "Categories", value: String(categories.length) },
          { label: "Unallocated", value: money(unallocated) },
          { label: "Allocated", value: money(allocated) },
          { label: "Unplanned", value: money(unplanned) },
          { label: "Undocumented", value: money(undocumented) },
        ]}
        footerAction={{
          label: total ? "Manage Budget" : "Start Budgeting",
          description: total ? "Edit your monthly spending plan" : "Create this month's spending plan",
          onClick: openBudget,
        }}
      />
    </>
  );
}

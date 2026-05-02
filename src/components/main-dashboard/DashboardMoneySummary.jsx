import { Eye, EyeOff, Plus } from "lucide-react";
import { useState } from "react";

import { formatMoney } from "../../lib/dashboard/financeUtils";

export default function DashboardMoneySummary({
  moneyLeft = 0,
  totalExpenses = 0,
  moneyVisible = true,
  onToggleMoneyVisible,
  handleQuickExpense,
  onQuickExpense,
}) {
  const [showExpense, setShowExpense] = useState(false);
  const [amount, setAmount] = useState("");

  const saveExpense = handleQuickExpense || onQuickExpense;

  const handleSaveExpense = () => {
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) return;

    saveExpense?.({
      amount: value,
      category: "Unplanned",
      budgetStatus: "unplanned",
      created_at: new Date().toISOString(),
    });

    setShowExpense(false);
    setAmount("");
  };

  return (
    <>
      {showExpense && (
        <div className="clara-modal-backdrop fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0" onClick={() => setShowExpense(false)} />

          <div className="clara-modal-surface relative w-full max-w-sm rounded-t-[28px] p-5">
            <p
              className="text-[10px] font-black uppercase tracking-[0.24em]"
              style={{ color: "var(--clara-text-faint)" }}
            >
              Quick Expense
            </p>

            <input
              autoFocus
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="mt-4 w-full rounded-[18px] bg-transparent text-3xl font-black outline-none"
              style={{
                border: "none",
                boxShadow: "none",
                color: "var(--clara-text)",
              }}
            />

            <button
              onClick={handleSaveExpense}
              className="clara-button-primary mt-4 w-full rounded-[18px] py-3 text-sm font-bold"
            >
              Save
            </button>
          </div>
        </div>
      )}

      <section
        className="relative isolate overflow-hidden rounded-[24px] border px-4 py-4 backdrop-blur-2xl bg-clip-padding transform-gpu"
        style={{
          borderColor: "rgba(255,255,255,0.10)",
          background:
            "linear-gradient(135deg, rgba(101,148,54,0.30) 0%, rgba(15,52,35,0.86) 44%, rgba(15,54,84,0.88) 100%)",
          boxShadow:
            "0 14px 34px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(255,255,255,0.04)",
          clipPath: "inset(0 round 24px)",
          WebkitMaskImage: "-webkit-radial-gradient(white, black)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-[24px]"
          style={{ background: "var(--clara-surface-glow)" }}
        />

        <div
          className="pointer-events-none absolute inset-px rounded-[23px]"
          style={{
            boxShadow:
              "inset 0 0 0 1px rgba(255,255,255,0.035), inset 0 -18px 34px rgba(0,0,0,0.12)",
          }}
        />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p
                className="text-[10px] font-black uppercase tracking-[0.22em]"
                style={{ color: "var(--clara-accent-text)" }}
              >
                Money Left
              </p>

              <button
                onClick={onToggleMoneyVisible}
                className="clara-button-secondary rounded-full p-1"
                style={{ color: "var(--clara-text-soft)" }}
              >
                {moneyVisible ? <Eye size={12} /> : <EyeOff size={12} />}
              </button>
            </div>

            <p className="mt-2 text-2xl font-extrabold text-white">
              {moneyVisible ? formatMoney(moneyLeft) : "••••"}
            </p>

            <p
              className="mt-1 text-[11px] font-medium"
              style={{ color: "var(--clara-text-soft)" }}
            >
              This month expenses: {moneyVisible ? formatMoney(totalExpenses) : "••••"}
            </p>
          </div>

          <button
            onClick={() => setShowExpense(true)}
            className="relative flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full border text-white"
            style={{
              borderColor: "rgba(214,197,72,0.22)",
              background:
                "radial-gradient(circle at 32% 24%, rgba(230,197,72,0.22), rgba(19,47,45,0.26) 48%, rgba(13,47,89,0.58) 100%)",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.26), inset 0 1px 0 rgba(255,255,255,0.10)",
            }}
          >
            <Plus size={20} />
          </button>
        </div>
      </section>
    </>
  );
}

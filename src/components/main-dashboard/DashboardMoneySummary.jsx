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
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div className="absolute inset-0" onClick={() => setShowExpense(false)} />

          <div className="relative w-full max-w-sm rounded-t-[28px] bg-[#071426] p-5">
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">
              Quick Expense
            </p>

            <input
              autoFocus
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="mt-4 w-full bg-transparent text-3xl font-bold text-white outline-none"
            />

            <button
              onClick={handleSaveExpense}
              className="mt-4 w-full rounded-[18px] bg-white/10 py-3 text-sm font-semibold text-white"
            >
              Save
            </button>
          </div>
        </div>
      )}

      <section
        className="relative overflow-hidden rounded-[24px] border px-4 py-4"
        style={{
          borderColor: "rgba(255,255,255,0.08)",
          background:
            "linear-gradient(180deg, rgba(19,48,88,0.85), rgba(8,25,51,0.92))",
          boxShadow: "0 14px 34px rgba(0,0,0,0.35)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/50">
                Money Left
              </p>

              <button
                onClick={onToggleMoneyVisible}
                className="rounded-full p-1 text-white/50"
              >
                {moneyVisible ? <Eye size={12} /> : <EyeOff size={12} />}
              </button>
            </div>

            <p className="mt-2 text-2xl font-semibold text-white">
              {moneyVisible ? formatMoney(moneyLeft) : "••••"}
            </p>

            <p className="mt-1 text-[11px] text-white/40">
              This month expenses: {moneyVisible ? formatMoney(totalExpenses) : "••••"}
            </p>
          </div>

          <button
            onClick={() => setShowExpense(true)}
            className="flex h-[52px] w-[52px] items-center justify-center rounded-full border"
            style={{
              borderColor: "rgba(154,235,255,0.22)",
              background: "rgba(255,255,255,0.05)",
            }}
          >
            <Plus size={18} />
          </button>
        </div>
      </section>
    </>
  );
}

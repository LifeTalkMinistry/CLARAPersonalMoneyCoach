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
        className="relative overflow-hidden rounded-[26px] border px-5 py-5"
        style={{
          borderColor: "rgba(166,232,18,0.35)",
          background:
            "linear-gradient(135deg, rgba(166,232,18,0.18), rgba(4,155,104,0.28) 42%, rgba(4,18,22,0.96) 100%)",
          boxShadow:
            "0 18px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
          backdropFilter: "blur(18px)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(circle at 10% 20%, rgba(166,232,18,0.35), transparent 35%), radial-gradient(circle at 90% 80%, rgba(39,93,255,0.18), transparent 40%)",
          }}
        />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#B9F632]">
                Money Left
              </p>

              <button
                onClick={onToggleMoneyVisible}
                className="rounded-full p-1 text-[#B9F632]/70"
              >
                {moneyVisible ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
            </div>

            <p className="mt-3 text-[36px] font-black tracking-[-0.04em] text-[#DFFF7A]">
              {moneyVisible ? formatMoney(moneyLeft) : "••••"}
            </p>

            <p className="mt-1 text-[13px] text-white/60">
              This month expenses: {moneyVisible ? formatMoney(totalExpenses) : "••••"}
            </p>
          </div>

          <button
            onClick={() => setShowExpense(true)}
            className="flex h-[56px] w-[56px] items-center justify-center rounded-full border"
            style={{
              borderColor: "rgba(166,232,18,0.5)",
              background: "rgba(166,232,18,0.12)",
              boxShadow: "0 0 18px rgba(166,232,18,0.35)",
            }}
          >
            <Plus size={20} />
          </button>
        </div>
      </section>
    </>
  );
}

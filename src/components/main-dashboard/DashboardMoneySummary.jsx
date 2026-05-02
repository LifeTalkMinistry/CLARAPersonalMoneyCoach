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
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-md">
          <div className="absolute inset-0" onClick={() => setShowExpense(false)} />

          <div className="relative w-full max-w-sm rounded-t-[28px] border border-white/10 bg-white/[0.06] p-5 text-white shadow-[0_-20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
              Quick Expense
            </p>

            <input
              autoFocus
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="mt-4 w-full bg-transparent text-3xl font-black text-white outline-none"
            />

            <button
              onClick={handleSaveExpense}
              className="mt-4 w-full rounded-[18px] border border-white/10 bg-white/[0.08] py-3 text-sm font-bold"
            >
              Save
            </button>
          </div>
        </div>
      )}

      <section className="rounded-[24px] border border-white/10 bg-white/[0.055] px-4 py-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                Money Left
              </p>

              <button
                onClick={onToggleMoneyVisible}
                className="rounded-full border border-white/10 bg-white/[0.08] p-1 text-white/45"
              >
                {moneyVisible ? <Eye size={12} /> : <EyeOff size={12} />}
              </button>
            </div>

            <p className="mt-2 text-2xl font-extrabold text-white">
              {moneyVisible ? formatMoney(moneyLeft) : "••••"}
            </p>

            <p className="mt-1 text-[11px] font-medium text-white/40">
              This month expenses: {moneyVisible ? formatMoney(totalExpenses) : "••••"}
            </p>
          </div>

          <button
            onClick={() => setShowExpense(true)}
            className="flex h-[56px] w-[56px] items-center justify-center rounded-full border border-white/10 bg-white/[0.08] text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
          >
            <Plus size={20} />
          </button>
        </div>
      </section>
    </>
  );
}

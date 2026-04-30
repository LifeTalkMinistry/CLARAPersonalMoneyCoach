import { Eye, EyeOff } from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { formatMoney } from "../../lib/dashboard/financeUtils";

export default function DashboardMoneySummary({
  moneyLeft = 0,
  totalExpenses = 0,
  moneyVisible = true,
  onToggleMoneyVisible,
}) {
  const navigate = useNavigate();
  const lastTap = useRef(0);

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      navigate("/transactions"); // make sure route exists
    }
    lastTap.current = now;
  };

  return (
    <section
      onClick={handleTap}
      className="relative overflow-hidden rounded-[26px] border border-white/[0.10] bg-[#0b1118]/88 shadow-[0_18px_45px_rgba(0,0,0,0.32)] backdrop-blur-2xl active:scale-[0.99] transition"
    >
      {/* subtle minimal glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.05),transparent_40%)]" />

      <div className="grid grid-cols-2 divide-x divide-white/[0.08]">

        {/* TOTAL MONEY */}
        <div className="min-h-[90px] px-4 pb-3 pt-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
              Total Money
            </p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // prevent double tap trigger
                onToggleMoneyVisible?.();
              }}
              className="rounded-full border border-white/10 bg-white/[0.05] p-1.5 text-white/60 transition hover:text-white hover:bg-white/[0.10]"
            >
              {moneyVisible ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          <p className="mt-1.5 text-[24px] font-black tracking-tight text-white">
            {moneyVisible ? formatMoney(moneyLeft) : "₱••••"}
          </p>

          <p className="mt-1 text-[11px] text-white/50">Available</p>
        </div>

        {/* TOTAL EXPENSE */}
        <div className="min-h-[90px] px-4 pb-3 pt-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
            Total Expense
          </p>

          <p className="mt-1.5 text-[24px] font-black tracking-tight text-white">
            {moneyVisible ? formatMoney(totalExpenses) : "₱••••"}
          </p>

          <p className="mt-1 text-[11px] text-white/50">This month</p>
        </div>

      </div>
    </section>
  );
}

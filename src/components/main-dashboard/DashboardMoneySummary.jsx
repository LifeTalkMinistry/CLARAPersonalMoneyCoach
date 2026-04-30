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
      navigate("/transactions");
    }
    lastTap.current = now;
  };

  const handleVisibilityToggle = (event) => {
    event.stopPropagation();
    onToggleMoneyVisible?.();
  };

  const amountClass = moneyVisible
    ? "opacity-100 translate-y-0"
    : "opacity-80 translate-y-[1px]";

  return (
    <section
      onClick={handleTap}
      className="group relative overflow-hidden rounded-[26px] border border-white/[0.10] bg-[#0b1118]/88 shadow-[0_18px_45px_rgba(0,0,0,0.32)] backdrop-blur-2xl transition duration-300 active:scale-[0.99]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.055),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-white/[0.025] opacity-0 transition duration-300 group-active:opacity-100" />

      <div className="relative grid grid-cols-2 divide-x divide-white/[0.08]">
        <div className="min-h-[90px] px-4 pb-3 pt-4">
          <p className="h-4 whitespace-nowrap text-[10px] font-black uppercase leading-4 tracking-[0.22em] text-white/45">
            Total Money
          </p>

          <p className={`mt-2 text-[24px] font-black leading-none tracking-tight text-white transition-all duration-300 ${amountClass}`}>
            {moneyVisible ? formatMoney(moneyLeft) : "₱••••"}
          </p>

          <p className="mt-2 text-[11px] leading-none text-white/50">Available</p>
        </div>

        <div className="min-h-[90px] px-4 pb-3 pt-4">
          <div className="flex h-4 items-center justify-between gap-2">
            <p className="whitespace-nowrap text-[10px] font-black uppercase leading-4 tracking-[0.22em] text-white/45">
              Total Expense
            </p>

            <button
              type="button"
              onClick={handleVisibilityToggle}
              className="-mt-0.5 shrink-0 rounded-full border border-white/10 bg-white/[0.05] p-1.5 text-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition duration-300 hover:bg-white/[0.10] hover:text-white active:scale-95"
            >
              {moneyVisible ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          <p className={`mt-2 text-[24px] font-black leading-none tracking-tight text-white transition-all duration-300 ${amountClass}`}>
            {moneyVisible ? formatMoney(totalExpenses) : "₱••••"}
          </p>

          <p className="mt-2 text-[11px] leading-none text-white/50">This month</p>
        </div>
      </div>
    </section>
  );
}

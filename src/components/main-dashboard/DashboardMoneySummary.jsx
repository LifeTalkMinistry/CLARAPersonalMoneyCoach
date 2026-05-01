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

  return (
    <section
      onClick={handleTap}
      className="relative overflow-hidden rounded-[26px] border border-white/[0.10] bg-[#0b1118]/88 shadow-[0_18px_45px_rgba(0,0,0,0.32)] backdrop-blur-2xl transition active:scale-[0.99]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.05),transparent_40%)]" />

      <div className="relative flex items-center justify-between gap-4 px-4 py-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
            Money Left
          </p>

          <p className="mt-2 truncate text-[clamp(1.35rem,6vw,1.8rem)] font-extrabold leading-none tracking-tight text-white">
            {moneyVisible ? formatMoney(moneyLeft) : "••••"}
          </p>
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleMoneyVisible?.();
          }}
          className="shrink-0 rounded-full border border-white/10 bg-white/[0.05] p-1.5 text-white/60 transition hover:bg-white/[0.10] hover:text-white"
        >
          {moneyVisible ? <Eye size={13} /> : <EyeOff size={13} />}
        </button>
      </div>
    </section>
  );
}

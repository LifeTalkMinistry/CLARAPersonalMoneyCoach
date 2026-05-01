import { Eye, EyeOff, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatMoney } from "../../lib/dashboard/financeUtils";

export default function DashboardMoneySummary({
  moneyLeft = 0,
  totalExpenses = 0,
  moneyVisible = true,
  onToggleMoneyVisible,
  handleQuickExpense,
  onQuickExpense,
  startClaraAiLongPress,
  endClaraAiLongPress,
}) {
  const navigate = useNavigate();

  const lastTap = useRef(0);
  const orbPressTimer = useRef(null);
  const orbStartPoint = useRef(null);
  const didLongPress = useRef(false);
  const didSwipe = useRef(false);

  const [isPressingOrb, setIsPressingOrb] = useState(false);

  const triggerQuickExpense = handleQuickExpense || onQuickExpense;

  const handleTap = () => {
    const now = Date.now();

    if (now - lastTap.current < 300) {
      navigate("/transactions");
    }

    lastTap.current = now;
  };

  const clearOrbTimer = () => {
    if (orbPressTimer.current) {
      clearTimeout(orbPressTimer.current);
      orbPressTimer.current = null;
    }
  };

  const handleOrbPointerDown = (event) => {
    event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);

    didLongPress.current = false;
    didSwipe.current = false;
    setIsPressingOrb(true);

    orbStartPoint.current = {
      x: event.clientX,
      y: event.clientY,
    };

    clearOrbTimer();

    orbPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      setIsPressingOrb(false);
      startClaraAiLongPress?.();
    }, 420);
  };

  const handleOrbPointerMove = (event) => {
    if (!orbStartPoint.current) return;

    const diffX = event.clientX - orbStartPoint.current.x;
    const diffY = event.clientY - orbStartPoint.current.y;

    if (diffX < -35 && Math.abs(diffY) < 28) {
      didSwipe.current = true;
      clearOrbTimer();
      setIsPressingOrb(false);
    }

    if (Math.abs(diffX) > 10 || Math.abs(diffY) > 10) {
      clearOrbTimer();
    }
  };

  const handleOrbPointerEnd = (event) => {
    event.stopPropagation();
    event.currentTarget.releasePointerCapture?.(event.pointerId);

    clearOrbTimer();
    setIsPressingOrb(false);

    if (didLongPress.current) {
      endClaraAiLongPress?.();
      orbStartPoint.current = null;
      return;
    }

    if (didSwipe.current) {
      navigate("/transactions");
      orbStartPoint.current = null;
      return;
    }

    triggerQuickExpense?.();

    orbStartPoint.current = null;
  };

  return (
    <section
      onClick={handleTap}
      className="relative overflow-hidden rounded-[26px] border border-white/[0.10] bg-[#0b1118]/88 shadow-[0_18px_45px_rgba(0,0,0,0.32)] backdrop-blur-2xl transition active:scale-[0.99]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.05),transparent_40%)]" />

      <div className="relative flex min-h-[92px] items-center justify-between gap-4 px-4 py-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
              Money Left
            </p>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onToggleMoneyVisible?.();
              }}
              className="rounded-full border border-white/10 bg-white/[0.05] p-1.5 text-white/45 transition hover:bg-white/[0.10] hover:text-white"
              aria-label={moneyVisible ? "Hide money" : "Show money"}
            >
              {moneyVisible ? <Eye size={12} /> : <EyeOff size={12} />}
            </button>
          </div>

          <p className="mt-2 truncate text-[clamp(1.35rem,6vw,1.8rem)] font-extrabold leading-none tracking-tight text-white">
            {moneyVisible ? formatMoney(moneyLeft) : "••••"}
          </p>
        </div>

        <button
          type="button"
          onClick={(event) => event.stopPropagation()}
          onPointerDown={handleOrbPointerDown}
          onPointerMove={handleOrbPointerMove}
          onPointerUp={handleOrbPointerEnd}
          onPointerCancel={handleOrbPointerEnd}
          className={`group relative flex h-[60px] w-[60px] shrink-0 touch-none select-none items-center justify-center rounded-full border border-white/[0.13] bg-[#080d12]/82 text-white shadow-[0_14px_34px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.13),inset_0_-18px_32px_rgba(0,0,0,0.22)] backdrop-blur-2xl transition-all duration-300 ease-out ${
            isPressingOrb ? "scale-[0.97]" : "active:scale-95"
          }`}
          aria-label="CLARA quick action"
        >
          <span className="pointer-events-none absolute -inset-[10px] rounded-full bg-lime-200/[0.055] blur-2xl" />
          <span className="pointer-events-none absolute -inset-[3px] rounded-full border border-white/[0.055]" />
          <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_24%,rgba(255,255,255,0.22),rgba(255,255,255,0.055)_34%,rgba(132,204,22,0.055)_58%,rgba(0,0,0,0.16)_100%)]" />
          <span className="pointer-events-none absolute inset-[5px] rounded-full border border-white/[0.085] bg-[#071008]/72 shadow-inner shadow-black/40" />
          <span className="pointer-events-none absolute inset-[13px] rounded-full bg-[radial-gradient(circle_at_35%_28%,rgba(255,255,255,0.18),rgba(163,230,53,0.12)_42%,rgba(4,9,8,0.88)_100%)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.14),inset_0_-10px_18px_rgba(0,0,0,0.34)]" />

          <span
            className={`pointer-events-none absolute -inset-[5px] rounded-full border transition-all duration-300 ${
              isPressingOrb
                ? "scale-110 border-lime-100/18 opacity-100"
                : "scale-100 border-white/[0.045] opacity-65"
            }`}
          />

          <span className="relative flex h-[42px] w-[42px] items-center justify-center rounded-full text-white/82 transition duration-300 group-hover:text-white">
            <Plus className="h-5 w-5 stroke-[2.3] drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]" />
          </span>
        </button>
      </div>
    </section>
  );
}

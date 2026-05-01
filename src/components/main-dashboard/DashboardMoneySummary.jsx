import { Check, Eye, EyeOff, Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatMoney } from "../../lib/dashboard/financeUtils";

const SWIPE_RESISTANCE = 0.55;
const MAX_SLIDE = 68;
const SWIPE_THRESHOLD = 46;
const COMPLETE_SLIDE = 92;
const TAP_MOVE_TOLERANCE = 8;
const INTENT_LOCK_DISTANCE = 12;
const VERTICAL_CANCEL_DISTANCE = 10;
const VERTICAL_CANCEL_RATIO = 1.15;
const PREMIUM_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export default function DashboardMoneySummary({
  moneyLeft = 0,
  moneyVisible = true,
  onToggleMoneyVisible,
  handleQuickExpense,
  onQuickExpense,
  startClaraAiLongPress,
  endClaraAiLongPress,
}) {
  const navigate = useNavigate();

  const pressTimer = useRef(null);
  const startPoint = useRef(null);
  const didLongPress = useRef(false);
  const didSwipe = useRef(false);
  const didMove = useRef(false);
  const gestureLock = useRef(null);
  const didVibrate = useRef(false);

  const [isPressing, setIsPressing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [slideX, setSlideX] = useState(0);
  const [showExpense, setShowExpense] = useState(false);
  const [amount, setAmount] = useState("");

  const saveExpense = handleQuickExpense || onQuickExpense;
  const swipeProgress = Math.min(Math.abs(slideX) / MAX_SLIDE, 1);

  const clearTimer = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const closeExpense = () => {
    setShowExpense(false);
    setAmount("");
  };

  const handleSaveExpense = () => {
    const cleanAmount = Number(amount);
    if (!Number.isFinite(cleanAmount) || cleanAmount <= 0) return;

    saveExpense?.({
      amount: cleanAmount,
      category: "Unplanned",
      budgetStatus: "unplanned",
      created_at: new Date().toISOString(),
    });

    closeExpense();
  };

  const resetGesture = () => {
    startPoint.current = null;
    gestureLock.current = null;
    didVibrate.current = false;
  };

  const handlePointerDown = (event) => {
    event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);

    didLongPress.current = false;
    didSwipe.current = false;
    didMove.current = false;
    gestureLock.current = null;
    didVibrate.current = false;

    setIsPressing(true);
    setIsDragging(false);
    setIsSliding(false);
    setSlideX(0);

    startPoint.current = {
      x: event.clientX,
      y: event.clientY,
    };

    clearTimer();

    pressTimer.current = setTimeout(() => {
      if (gestureLock.current === "vertical") return;

      didLongPress.current = true;
      setIsPressing(false);
      setIsDragging(false);
      startClaraAiLongPress?.();
    }, 420);
  };

  const handlePointerMove = (event) => {
    if (!startPoint.current) return;

    const diffX = event.clientX - startPoint.current.x;
    const diffY = event.clientY - startPoint.current.y;
    const absX = Math.abs(diffX);
    const absY = Math.abs(diffY);

    if (absX > TAP_MOVE_TOLERANCE || absY > TAP_MOVE_TOLERANCE) {
      didMove.current = true;
      clearTimer();
    }

    if (!gestureLock.current) {
      const clearVerticalIntent =
        absY >= VERTICAL_CANCEL_DISTANCE &&
        absY > absX * VERTICAL_CANCEL_RATIO;

      const clearHorizontalIntent =
        diffX < 0 &&
        absX >= INTENT_LOCK_DISTANCE &&
        absX > absY * 1.35;

      if (clearVerticalIntent) {
        gestureLock.current = "vertical";
        didSwipe.current = false;
        setIsDragging(false);
        setSlideX(0);
        clearTimer();
        return;
      }

      if (clearHorizontalIntent) {
        gestureLock.current = "horizontal";
        setIsDragging(true);
      } else {
        return;
      }
    }

    if (gestureLock.current === "vertical") {
      setIsDragging(false);
      setSlideX(0);
      return;
    }

    if (gestureLock.current !== "horizontal") return;

    const resistedSlide = Math.max(diffX * SWIPE_RESISTANCE, -MAX_SLIDE);

    if (resistedSlide >= 0) {
      setSlideX(0);
      return;
    }

    setIsDragging(true);
    setSlideX(resistedSlide);

    if (Math.abs(resistedSlide) >= SWIPE_THRESHOLD) {
      if (!didSwipe.current) {
        navigator?.vibrate?.(8);
      }

      didSwipe.current = true;
      didVibrate.current = true;
      clearTimer();
      setIsPressing(false);
    }
  };

  const handlePointerEnd = (event) => {
    event.stopPropagation();
    event.currentTarget.releasePointerCapture?.(event.pointerId);

    clearTimer();
    setIsPressing(false);
    setIsDragging(false);

    if (didLongPress.current) {
      endClaraAiLongPress?.();
      setSlideX(0);
      resetGesture();
      return;
    }

    if (gestureLock.current === "vertical") {
      setSlideX(0);
      resetGesture();
      return;
    }

    if (didSwipe.current) {
      setIsSliding(true);
      setSlideX(-COMPLETE_SLIDE);

      window.setTimeout(() => {
        navigate("/transactions");
      }, 160);

      window.setTimeout(() => {
        setIsSliding(false);
        setSlideX(0);
      }, 260);

      resetGesture();
      return;
    }

    setSlideX(0);

    if (!didMove.current) {
      setShowExpense(true);
    }

    resetGesture();
  };

  return (
    <>
      {showExpense && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 backdrop-blur-md">
          <button
            type="button"
            onClick={closeExpense}
            className="absolute inset-0"
            aria-label="Close quick expense"
          />

          <section
            className="relative w-full max-w-sm animate-[slideUp_0.22s_ease-out] rounded-t-[32px] border px-5 pb-5 pt-4 text-white shadow-[0_-30px_90px_rgba(0,0,0,0.72)] backdrop-blur-2xl"
            style={{
              borderColor: "var(--clara-border)",
              background: "var(--clara-glass)",
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 rounded-t-[32px]"
              style={{ background: "var(--clara-surface-glow)" }}
            />

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.26em] text-white/38">
                  Quick Expense
                </p>
                <h3 className="mt-1 text-lg font-black tracking-[-0.03em]">
                  Log spending
                </h3>
              </div>

              <button
                type="button"
                onClick={closeExpense}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border text-white/65 transition active:scale-95"
                style={{
                  borderColor: "var(--clara-border)",
                  background: "var(--clara-panel)",
                }}
                aria-label="Close quick expense"
              >
                <X size={17} />
              </button>
            </div>

            <div
              className="relative mt-5 rounded-[26px] border px-4 py-4"
              style={{
                borderColor: "var(--clara-border)",
                background: "var(--clara-panel)",
              }}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.20em] text-white/35">
                Amount
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="text-3xl font-black text-white/45">₱</span>
                <input
                  autoFocus
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  inputMode="decimal"
                  placeholder="0.00"
                  className="min-w-0 flex-1 bg-transparent text-4xl font-black tracking-[-0.05em] text-white outline-none placeholder:text-white/18"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveExpense}
              className="relative mt-4 flex w-full items-center justify-center gap-2 rounded-[22px] border py-3.5 text-sm font-bold transition active:scale-[0.98]"
              style={{
                borderColor: "var(--clara-accent-border)",
                background: "var(--clara-accent-soft)",
                color: "var(--clara-accent-text)",
                boxShadow: "0 0 24px var(--clara-glow-soft)",
              }}
            >
              <Check size={17} />
              Save expense
            </button>
          </section>
        </div>
      )}

      <section
        className="relative overflow-hidden rounded-[26px] border backdrop-blur-2xl"
        style={{
          borderColor: "var(--clara-border)",
          background: "var(--clara-glass)",
          boxShadow: "0 18px 45px rgba(0,0,0,0.32), var(--clara-glow-premium)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{ background: "var(--clara-surface-glow)" }}
        />
        <div
          className="pointer-events-none absolute -right-14 -top-16 h-36 w-36 rounded-full opacity-55 blur-3xl"
          style={{ background: "var(--clara-glow-soft)" }}
        />

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
                className="rounded-full border p-1.5 text-white/45 transition active:scale-95"
                style={{
                  borderColor: "var(--clara-border)",
                  background: "var(--clara-panel)",
                }}
                aria-label={moneyVisible ? "Hide money" : "Show money"}
              >
                {moneyVisible ? <Eye size={12} /> : <EyeOff size={12} />}
              </button>
            </div>

            <p className="mt-2 truncate text-[clamp(1.35rem,6vw,1.8rem)] font-extrabold leading-none tracking-tight text-white">
              {moneyVisible ? formatMoney(moneyLeft) : "••••"}
            </p>
          </div>

          <div className="relative shrink-0">
            <div className="pointer-events-none absolute inset-y-0 -left-16 flex items-center">
              <div
                className="rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white/35"
                style={{
                  borderColor: "var(--clara-border)",
                  background: "var(--clara-panel)",
                  opacity: swipeProgress,
                  transform: `translateX(${14 - swipeProgress * 14}px)`,
                  transition: isDragging
                    ? "none"
                    : `opacity 260ms ${PREMIUM_EASE}, transform 260ms ${PREMIUM_EASE}`,
                }}
              >
                Transactions
              </div>
            </div>

            <button
              type="button"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              className={`group relative flex h-[60px] w-[60px] touch-none select-none items-center justify-center rounded-full border text-white backdrop-blur-2xl ${
                isPressing ? "scale-[0.97]" : "active:scale-95"
              }`}
              style={{
                borderColor: "var(--clara-accent-border)",
                background: "var(--clara-panel)",
                opacity: 1 - swipeProgress * 0.22,
                filter: `blur(${swipeProgress * 0.7}px)`,
                transform: `translateX(${slideX}px) scale(${isPressing ? 0.97 : 1})`,
                transition: isDragging
                  ? "none"
                  : `transform 360ms ${PREMIUM_EASE}, opacity 220ms ${PREMIUM_EASE}, filter 220ms ${PREMIUM_EASE}, box-shadow 220ms ${PREMIUM_EASE}`,
                boxShadow:
                  isDragging || isSliding
                    ? "0 18px 42px rgba(0,0,0,0.52), 0 0 26px var(--clara-glow), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -18px 32px rgba(0,0,0,0.24)"
                    : "0 14px 34px rgba(0,0,0,0.48), 0 0 22px var(--clara-glow-soft), inset 0 1px 0 rgba(255,255,255,0.13), inset 0 -18px 32px rgba(0,0,0,0.22)",
              }}
              aria-label="CLARA quick action"
            >
              <span
                className="pointer-events-none absolute -inset-[10px] rounded-full blur-2xl"
                style={{
                  background: "var(--clara-accent-soft)",
                  opacity: 0.65 + swipeProgress * 0.35,
                }}
              />
              <span
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{ background: "var(--clara-surface-glow)" }}
              />
              <span
                className="pointer-events-none absolute inset-[5px] rounded-full border shadow-inner shadow-black/40"
                style={{
                  borderColor: "var(--clara-border)",
                  background: "var(--clara-glass)",
                }}
              />
              <span
                className="pointer-events-none absolute inset-[13px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 35% 28%, rgba(255,255,255,0.18), var(--clara-accent-soft) 42%, rgba(4,9,8,0.88) 100%)",
                }}
              />

              <span
                className="relative flex h-[42px] w-[42px] items-center justify-center"
                style={{ color: "var(--clara-accent-text)" }}
              >
                <Plus className="h-5 w-5 stroke-[2.3]" />
              </span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

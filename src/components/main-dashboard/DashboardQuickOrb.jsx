import { Check, ChevronDown, Plus, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const ORB_SIZE = 60;
const EDGE_PADDING = 18;
const TOP_SAFE = 24;
const BOTTOM_SAFE = 24;

export default function DashboardQuickOrb({
  onLongPressStart,
  onLongPressEnd,
  onQuickExpense,
  budgetCategories = [],
  state = "idle",
}) {
  const [position, setPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const [showExpense, setShowExpense] = useState(false);
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const dragData = useRef(null);
  const longPressTimer = useRef(null);
  const didLongPress = useRef(false);
  const dragging = useRef(false);

  const safeBudgetCategories = useMemo(() => {
    if (!Array.isArray(budgetCategories)) return [];

    return budgetCategories
      .filter((item) => item?.category)
      .map((item) => ({
        ...item,
        type: "budget",
        label: item.category,
        value: item.category,
        budgetStatus: "planned",
      }));
  }, [budgetCategories]);

  const categoryOptions = useMemo(
    () => [
      {
        type: "unplanned",
        label: "Unplanned Expense",
        value: "Unplanned",
        budgetStatus: "unplanned",
      },
      {
        type: "undocumented",
        label: "Undocumented Expense",
        value: "",
        budgetStatus: "undocumented",
      },
      ...safeBudgetCategories,
    ],
    [safeBudgetCategories]
  );

  const resetExpenseForm = () => {
    setAmount("");
    setSelectedCategory(null);
    setCategoryOpen(false);
  };

  const closeExpenseModal = () => {
    setShowExpense(false);
    resetExpenseForm();
  };

  const handleSaveExpense = () => {
    const cleanAmount = Number(amount);

    if (!Number.isFinite(cleanAmount) || cleanAmount <= 0) return;

    const fallbackCategory = {
      type: "undocumented",
      label: "Undocumented Expense",
      value: "",
      budgetStatus: "undocumented",
    };

    const finalCategory = selectedCategory || fallbackCategory;

    const quickExpense = {
      amount: cleanAmount,
      category: finalCategory.value,
      budgetStatus: finalCategory.budgetStatus,
      created_at: new Date().toISOString(),
    };

    onQuickExpense?.(quickExpense);
    closeExpenseModal();
  };

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const getSafePosition = (x, y) => ({
    x: clamp(x, EDGE_PADDING, window.innerWidth - ORB_SIZE - EDGE_PADDING),
    y: clamp(y, TOP_SAFE, window.innerHeight - ORB_SIZE - BOTTOM_SAFE),
  });

  const snapToEdge = (pos) => {
    const shouldDockLeft = pos.x + ORB_SIZE / 2 < window.innerWidth / 2;

    return getSafePosition(
      shouldDockLeft ? EDGE_PADDING : window.innerWidth - ORB_SIZE - EDGE_PADDING,
      pos.y
    );
  };

  useEffect(() => {
    setPosition(
      getSafePosition(
        window.innerWidth - ORB_SIZE - EDGE_PADDING,
        window.innerHeight - ORB_SIZE - 110
      )
    );
  }, []);

  const clearTimer = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleDown = (event) => {
    event.currentTarget.setPointerCapture?.(event.pointerId);

    didLongPress.current = false;
    dragging.current = false;
    setIsDragging(false);
    setIsPressing(true);

    const rect = event.currentTarget.getBoundingClientRect();

    dragData.current = {
      startX: event.clientX,
      startY: event.clientY,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      last: position,
    };

    clearTimer();

    longPressTimer.current = setTimeout(() => {
      if (dragging.current) return;

      didLongPress.current = true;
      setIsPressing(false);
      onLongPressStart?.();
    }, 420);
  };

  const handleMove = (event) => {
    if (!dragData.current) return;

    const moved =
      Math.abs(event.clientX - dragData.current.startX) > 7 ||
      Math.abs(event.clientY - dragData.current.startY) > 7;

    if (moved) {
      dragging.current = true;
      setIsDragging(true);
      setIsPressing(false);
      clearTimer();
    }

    if (!dragging.current) return;

    const next = getSafePosition(
      event.clientX - dragData.current.offsetX,
      event.clientY - dragData.current.offsetY
    );

    dragData.current.last = next;
    setPosition(next);
  };

  const handleEnd = (event) => {
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    clearTimer();
    setIsPressing(false);

    if (dragging.current && dragData.current?.last) {
      setPosition(snapToEdge(dragData.current.last));
    }

    if (didLongPress.current) {
      onLongPressEnd?.();
    }

    setTimeout(() => {
      dragging.current = false;
      dragData.current = null;
      setIsDragging(false);
    }, 200);
  };

  const handleTap = () => {
    if (didLongPress.current || dragging.current || isDragging) return;
    setShowExpense(true);
  };

  const stateClass =
    {
      idle: "",
      thinking: "animate-pulse",
      attention: "ring-1 ring-amber-300/25",
      response: "animate-[pulse_1.2s_ease-out]",
    }[state] || "";

  return (
    <>
      {showExpense && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/55 backdrop-blur-md">
          <button
            type="button"
            aria-label="Close quick expense"
            onClick={closeExpenseModal}
            className="absolute inset-0"
          />

          <section className="relative w-full max-w-sm overflow-hidden rounded-t-[32px] border border-white/[0.10] bg-[#080d12]/95 px-5 pb-5 pt-4 text-white shadow-[0_-30px_90px_rgba(0,0,0,0.72)] backdrop-blur-2xl">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/28 to-transparent" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-lime-300/[0.07] blur-3xl" />
            <div className="pointer-events-none absolute -left-20 bottom-0 h-44 w-44 rounded-full bg-sky-300/[0.055] blur-3xl" />

            <div className="relative flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.26em] text-white/38">
                  Quick Expense
                </p>
                <h3 className="mt-1 text-lg font-black tracking-[-0.03em] text-white">
                  Log spending
                </h3>
              </div>

              <button
                type="button"
                onClick={closeExpenseModal}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.10] bg-white/[0.055] text-white/65 transition active:scale-95"
                aria-label="Close quick expense"
              >
                <X size={17} strokeWidth={2} />
              </button>
            </div>

            <div className="relative mt-5 rounded-[26px] border border-white/[0.09] bg-white/[0.045] px-4 py-4 shadow-inner shadow-white/[0.015]">
              <p className="text-[10px] font-bold uppercase tracking-[0.20em] text-white/35">
                Amount
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="text-3xl font-black tracking-[-0.04em] text-white/45">
                  ₱
                </span>
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

            <div className="relative mt-3">
              <button
                type="button"
                onClick={() => setCategoryOpen((current) => !current)}
                className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-xs font-semibold transition active:scale-[0.99] ${
                  selectedCategory
                    ? "border-lime-200/[0.20] bg-lime-300/[0.10] text-lime-50"
                    : "border-white/[0.08] bg-white/[0.045] text-white/58"
                }`}
              >
                <span>
                  {selectedCategory?.label || "Select category"}
                </span>
                <ChevronDown
                  size={16}
                  strokeWidth={2.2}
                  className={`shrink-0 transition ${
                    categoryOpen ? "rotate-180 text-white/80" : "text-white/45"
                  }`}
                />
              </button>

              {categoryOpen && (
                <div className="mt-2 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b1117]/95 shadow-[0_18px_40px_rgba(0,0,0,0.34)]">
                  {categoryOptions.slice(0, 2).map((item) => {
                    const active =
                      selectedCategory?.type === item.type &&
                      selectedCategory?.value === item.value;

                    return (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(item);
                          setCategoryOpen(false);
                        }}
                        className={`flex w-full items-center justify-between px-4 py-3 text-left text-xs font-semibold transition ${
                          active
                            ? "bg-lime-300/[0.12] text-lime-50"
                            : "text-white/62 hover:bg-white/[0.055]"
                        }`}
                      >
                        {item.label}
                        {active && <Check size={15} strokeWidth={2.2} />}
                      </button>
                    );
                  })}

                  {safeBudgetCategories.length > 0 && (
                    <>
                      <div className="mx-4 h-px bg-white/[0.08]" />

                      {safeBudgetCategories.map((item) => {
                        const active =
                          selectedCategory?.type === "budget" &&
                          selectedCategory?.value === item.value;

                        return (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(item);
                              setCategoryOpen(false);
                            }}
                            className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-xs font-semibold transition ${
                              active
                                ? "bg-lime-300/[0.12] text-lime-50"
                                : "text-white/62 hover:bg-white/[0.055]"
                            }`}
                          >
                            <span className="min-w-0 truncate">{item.label}</span>
                            {active && <Check size={15} strokeWidth={2.2} />}
                          </button>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleSaveExpense}
              className="relative mt-4 flex w-full items-center justify-center gap-2 rounded-[22px] border border-lime-200/[0.14] bg-lime-300/[0.12] py-3.5 text-sm font-bold text-lime-50 shadow-[0_14px_34px_rgba(132,204,22,0.10)] transition active:scale-[0.98]"
            >
              <Check size={17} strokeWidth={2.2} />
              Save expense
            </button>
          </section>
        </div>
      )}

      <div
        className={`fixed z-50 ${
          isDragging
            ? "transition-none"
            : "transition-[left,top] duration-300 ease-out"
        }`}
        style={position ? { left: position.x, top: position.y } : undefined}
      >
        <button
          type="button"
          onClick={handleTap}
          onPointerDown={handleDown}
          onPointerMove={handleMove}
          onPointerUp={handleEnd}
          onPointerCancel={handleEnd}
          className={`touch-none select-none group relative flex h-[60px] w-[60px] items-center justify-center rounded-full border border-white/[0.13] bg-[#080d12]/82 text-white shadow-[0_14px_34px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.13),inset_0_-18px_32px_rgba(0,0,0,0.22)] backdrop-blur-2xl transition-all duration-300 ease-out ${stateClass} ${
            isDragging
              ? "scale-95 cursor-grabbing"
              : isPressing
              ? "scale-[0.97] cursor-grab"
              : "cursor-grab active:scale-95"
          }`}
          aria-label="CLARA quick expense"
        >
          <span className="pointer-events-none absolute -inset-[10px] rounded-full bg-lime-200/[0.055] blur-2xl transition duration-500 group-hover:bg-lime-200/[0.075]" />
          <span className="pointer-events-none absolute -inset-[3px] rounded-full border border-white/[0.055]" />
          <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_24%,rgba(255,255,255,0.22),rgba(255,255,255,0.055)_34%,rgba(132,204,22,0.055)_58%,rgba(0,0,0,0.16)_100%)]" />
          <span className="pointer-events-none absolute inset-[5px] rounded-full border border-white/[0.085] bg-[#071008]/72 shadow-inner shadow-black/40" />
          <span className="pointer-events-none absolute inset-[13px] rounded-full bg-[radial-gradient(circle_at_35%_28%,rgba(255,255,255,0.18),rgba(163,230,53,0.12)_42%,rgba(4,9,8,0.88)_100%)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.14),inset_0_-10px_18px_rgba(0,0,0,0.34)]" />
          <span
            className={`pointer-events-none absolute -inset-[5px] rounded-full border transition-all duration-300 ${
              isPressing
                ? "scale-110 border-lime-100/18 opacity-100"
                : "scale-100 border-white/[0.045] opacity-65"
            }`}
          />

          <span className="relative flex h-[42px] w-[42px] items-center justify-center rounded-full text-white/82 transition duration-300 group-hover:text-white">
            <Plus className="h-5 w-5 stroke-[2.3] drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]" />
          </span>
        </button>
      </div>
    </>
  );
}

import { useRef, useState } from "react";

import BudgetCard from "../financial-cards/BudgetCard";
import EmergencyFundCard from "../financial-cards/EmergencyFundCard";
import SavingsGoalCard from "../financial-cards/SavingsCard";
import InvestmentFundCard from "../financial-cards/InvestmentCard";
import DebtObligationCard from "../financial-cards/ObligationDebtCard";

export default function DashboardFinancialCarousel({
  budgetData,
  emergencyFundData,
  savingsData,
  investmentData,
  debtData,
}) {
  const carouselRef = useRef(null);
  const dragRef = useRef({
    startX: 0,
    startScrollLeft: 0,
    startTime: 0,
    isPointerDown: false,
  });

  const [activeSlide, setActiveSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const items = [
    { label: "Budget", content: <BudgetCard data={budgetData} /> },
    { label: "Emergency Fund", content: <EmergencyFundCard data={emergencyFundData} /> },
    { label: "Savings Goal", content: <SavingsGoalCard data={savingsData} /> },
    { label: "Investment Fund", content: <InvestmentFundCard data={investmentData} /> },
    { label: "Debt / Obligation", content: <DebtObligationCard data={debtData} /> },
  ];

  const clampSlide = (index) => Math.min(Math.max(index, 0), items.length - 1);

  const getSlideWidth = () => {
    const el = carouselRef.current;
    if (!el) return 1;
    return el.offsetWidth;
  };

  const scrollToSlide = (index) => {
    const el = carouselRef.current;
    if (!el) return;

    const nextIndex = clampSlide(index);
    setActiveSlide(nextIndex);
    el.scrollTo({
      left: nextIndex * getSlideWidth(),
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const el = carouselRef.current;
    if (!el) return;

    const index = Math.round(el.scrollLeft / getSlideWidth());
    setActiveSlide(clampSlide(index));
  };

  const settleToNearestSlide = () => {
    const el = carouselRef.current;
    if (!el) return;

    const drag = dragRef.current;
    const width = getSlideWidth();
    const elapsed = Math.max(Date.now() - drag.startTime, 1);
    const draggedDistance = el.scrollLeft - drag.startScrollLeft;
    const velocity = draggedDistance / elapsed;

    let nextIndex = Math.round(el.scrollLeft / width);

    if (Math.abs(velocity) > 0.55 || Math.abs(draggedDistance) > width * 0.18) {
      nextIndex = activeSlide + (draggedDistance > 0 ? 1 : -1);
    }

    scrollToSlide(clampSlide(nextIndex));
  };

  const handlePointerDown = (event) => {
    if (event.pointerType === "touch") return;

    const el = carouselRef.current;
    if (!el) return;

    dragRef.current = {
      startX: event.clientX,
      startScrollLeft: el.scrollLeft,
      startTime: Date.now(),
      isPointerDown: true,
    };

    setIsDragging(true);
    el.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const el = carouselRef.current;
    const drag = dragRef.current;

    if (!el || !drag.isPointerDown) return;

    const deltaX = event.clientX - drag.startX;
    el.scrollLeft = drag.startScrollLeft - deltaX;
  };

  const handlePointerUp = (event) => {
    const el = carouselRef.current;
    const drag = dragRef.current;

    if (!el || !drag.isPointerDown) return;

    dragRef.current.isPointerDown = false;
    setIsDragging(false);
    el.releasePointerCapture?.(event.pointerId);
    settleToNearestSlide();
  };

  const handleTouchEnd = () => {
    window.setTimeout(settleToNearestSlide, 80);
  };

  return (
    <div className="relative mt-2">
      <div className="pointer-events-none absolute -inset-x-2 -top-4 h-24 rounded-full bg-emerald-400/[0.06] blur-3xl" />

      <section
        ref={carouselRef}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTouchStart={() => {
          const el = carouselRef.current;
          if (!el) return;
          dragRef.current = {
            startX: 0,
            startScrollLeft: el.scrollLeft,
            startTime: Date.now(),
            isPointerDown: false,
          };
        }}
        onTouchEnd={handleTouchEnd}
        aria-label="Financial dashboard cards"
        style={{ WebkitOverflowScrolling: "touch" }}
        className={`relative -mx-1 flex gap-3 overflow-x-auto overscroll-x-contain scroll-smooth snap-x snap-mandatory px-1 pb-1 scrollbar-none touch-pan-y select-none ${
          isDragging ? "cursor-grabbing snap-none" : "cursor-grab"
        }`}
      >
        {items.map((item, index) => {
          const distance = Math.abs(activeSlide - index);
          const isActive = activeSlide === index;

          return (
            <div
              key={item.label}
              aria-label={item.label}
              className={`min-w-full flex-shrink-0 snap-center transition-all duration-500 ease-out will-change-transform ${
                isActive
                  ? "scale-100 opacity-100"
                  : distance === 1
                    ? "scale-[0.975] opacity-78"
                    : "scale-[0.955] opacity-60"
              }`}
            >
              {item.content}
            </div>
          );
        })}
      </section>

      <div className="mt-3 flex items-center justify-center gap-2">
        {items.map((item, index) => {
          const isActive = activeSlide === index;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => scrollToSlide(index)}
              aria-label={`Go to ${item.label}`}
              className={`h-2 rounded-full transition-all duration-300 active:scale-90 ${
                isActive
                  ? "w-7 bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.65)]"
                  : "w-2 bg-white/24 hover:bg-white/40"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

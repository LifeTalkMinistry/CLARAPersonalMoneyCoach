import { useRef, useState } from "react";

import BudgetCard from "../financial-cards/BudgetCard";
import EmergencyFundCard from "../financial-cards/EmergencyFundCard";
import SavingsGoalCard from "../financial-cards/SavingsCard";
import InvestmentFundCard from "../financial-cards/InvestmentCard";
import DebtObligationCard from "../financial-cards/ObligationDebtCard";

const SLIDE_WIDTH_RATIO = 1;
const SLIDE_GAP = 12;

export default function DashboardFinancialCarousel({
  budgetData,
  emergencyFundData,
  savingsData,
  investmentData,
  debtData,
}) {
  const carouselRef = useRef(null);
  const frameRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const items = [
    { label: "Budget", content: <BudgetCard data={budgetData} /> },
    { label: "Emergency Fund", content: <EmergencyFundCard data={emergencyFundData} /> },
    { label: "Savings Goal", content: <SavingsGoalCard data={savingsData} /> },
    { label: "Investment Fund", content: <InvestmentFundCard data={investmentData} /> },
    { label: "Debt / Obligation", content: <DebtObligationCard data={debtData} /> },
  ];

  const getSlideStep = () => {
    const el = carouselRef.current;
    if (!el) return 1;
    return el.offsetWidth * SLIDE_WIDTH_RATIO + SLIDE_GAP;
  };

  const scrollToSlide = (index) => {
    const el = carouselRef.current;
    if (!el) return;

    const nextIndex = Math.min(Math.max(index, 0), items.length - 1);
    setActiveSlide(nextIndex);
    setScrollProgress(nextIndex);

    el.scrollTo({
      left: nextIndex * getSlideStep(),
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const el = carouselRef.current;
    if (!el) return;

    if (frameRef.current) window.cancelAnimationFrame(frameRef.current);

    frameRef.current = window.requestAnimationFrame(() => {
      const step = getSlideStep();
      const progress = step ? el.scrollLeft / step : 0;
      const index = Math.round(progress);

      setScrollProgress(Math.min(Math.max(progress, 0), items.length - 1));
      setActiveSlide(Math.min(Math.max(index, 0), items.length - 1));
    });
  };

  return (
    <div className="relative w-full shrink-0 overflow-visible">
      <section
        ref={carouselRef}
        onScroll={handleScroll}
        aria-label="Financial dashboard cards"
        className="relative flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-visible scroll-smooth pb-1 scrollbar-none"
      >
        {items.map((item, index) => {
          const distance = index - scrollProgress;
          const absDistance = Math.min(Math.abs(distance), 2);
          const isActive = activeSlide === index;
          const scale = isActive ? 1 : 0.975;
          const opacity = isActive ? 1 : 0.82;
          const translateY = isActive ? 0 : absDistance * 5;
          const translateX = distance * -2;

          return (
            <div
              key={item.label}
              aria-label={item.label}
              style={{
                opacity,
                transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                zIndex: isActive ? 10 : Math.max(1, 8 - Math.round(absDistance * 3)),
                transition: "opacity 280ms ease, transform 280ms ease",
              }}
              className={`flex w-full min-w-full flex-shrink-0 snap-center transition-[opacity,transform] duration-300 ease-out will-change-transform ${
                index === items.length - 1 ? "mr-1" : ""
              }`}
            >
              <div className="flex w-full transition-transform duration-300 ease-out active:scale-[0.985]">
                {item.content}
              </div>
            </div>
          );
        })}
      </section>

      <div className="flex h-5 shrink-0 items-center justify-center gap-2 pt-2">
        {items.map((item, index) => {
          const isActive = activeSlide === index;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => scrollToSlide(index)}
              aria-label={`Go to ${item.label}`}
              className="h-2 rounded-full transition-all duration-300 active:scale-90"
              style={{
                width: isActive ? "1.05rem" : "0.5rem",
                background: isActive ? "rgba(230,255,72,0.88)" : "rgba(230,255,72,0.22)",
                opacity: isActive ? 1 : 0.55,
                boxShadow: isActive ? "0 4px 10px rgba(0,0,0,0.22)" : "none",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

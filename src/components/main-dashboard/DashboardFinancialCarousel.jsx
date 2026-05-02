import { useRef, useState } from "react";

import BudgetCard from "../financial-cards/BudgetCard";
import EmergencyFundCard from "../financial-cards/EmergencyFundCard";
import SavingsGoalCard from "../financial-cards/SavingsCard";
import InvestmentFundCard from "../financial-cards/InvestmentCard";
import DebtObligationCard from "../financial-cards/ObligationDebtCard";

const SLIDE_WIDTH_RATIO = 0.85;
const SLIDE_GAP = 16;

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

    if (frameRef.current) {
      window.cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = window.requestAnimationFrame(() => {
      const step = getSlideStep();
      const progress = step ? el.scrollLeft / step : 0;
      const index = Math.round(progress);

      setScrollProgress(Math.min(Math.max(progress, 0), items.length - 1));
      setActiveSlide(Math.min(Math.max(index, 0), items.length - 1));
    });
  };

  return (
    <div className="w-full px-4">
      <section
        ref={carouselRef}
        onScroll={handleScroll}
        aria-label="Financial dashboard cards"
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden scroll-smooth pb-2 scrollbar-none"
      >
        {items.map((item, index) => {
          const distance = index - scrollProgress;
          const absDistance = Math.min(Math.abs(distance), 2);
          const isActive = activeSlide === index;

          const scale = isActive ? 1.02 : 0.96;
          const opacity = isActive ? 1 : 0.75;
          const translateY = isActive ? -4 : absDistance * 8;

          return (
            <div
              key={item.label}
              aria-label={item.label}
              style={{
                opacity,
                transform: `translateY(${translateY}px) scale(${scale})`,
                zIndex: isActive ? 10 : 1,
                transition: "all 280ms ease",
              }}
              className="snap-center shrink-0 w-[85%]"
            >
              <div
                className="
                  rounded-[32px]
                  border border-white/5
                  bg-[rgba(10,15,12,0.96)]
                  shadow-[0_12px_30px_rgba(0,0,0,0.35),0_24px_60px_rgba(0,0,0,0.25)]
                  transition-transform duration-300 ease-out active:scale-[0.98]
                "
              >
                {item.content}
              </div>
            </div>
          );
        })}
      </section>

      <div className="flex h-5 items-center justify-center gap-2 pt-2">
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
                background: isActive
                  ? "rgba(230,255,72,0.9)"
                  : "rgba(230,255,72,0.25)",
                opacity: isActive ? 1 : 0.5,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

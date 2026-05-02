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
    <div className="relative flex h-[clamp(292px,40svh,322px)] shrink-0 flex-col overflow-hidden rounded-[30px] px-1 py-1">
      <section
        ref={carouselRef}
        onScroll={handleScroll}
        aria-label="Financial dashboard cards"
        className="relative flex h-[clamp(266px,36svh,292px)] snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden scroll-smooth px-1 py-1 scrollbar-none"
      >
        {items.map((item, index) => {
          const distance = index - scrollProgress;
          const absDistance = Math.min(Math.abs(distance), 2);
          const isActive = activeSlide === index;
          const scale = isActive ? 1 : 1 - absDistance * 0.035;
          const opacity = isActive ? 1 : Math.max(1 - absDistance * 0.18, 0.68);
          const translateY = isActive ? 0 : absDistance * 7;
          const rotate = Math.max(Math.min(distance * 0.45, 0.65), -0.65);
          const translateX = distance * -2;

          return (
            <div
              key={item.label}
              aria-label={item.label}
              style={{
                opacity,
                transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale}) rotate(${rotate}deg)`,
                zIndex: isActive ? 10 : Math.max(1, 8 - Math.round(absDistance * 3)),
                boxShadow: isActive
                  ? "0 22px 46px rgba(0,0,0,0.38)"
                  : "0 10px 24px rgba(0,0,0,0.22)",
                transition: "var(--clara-theme-transition)",
              }}
              className={`flex h-full w-full min-w-full flex-shrink-0 snap-center rounded-[26px] transition-[opacity,transform,box-shadow] duration-300 ease-out will-change-transform ${
                index === items.length - 1 ? "mr-1" : ""
              }`}
            >
              <div className="flex h-full w-full transition-transform duration-300 ease-out active:scale-[0.985]">
                {item.content}
              </div>
            </div>
          );
        })}
      </section>

      <div className="flex h-5 shrink-0 items-center justify-center gap-2 pt-1">
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
                width: isActive ? "1.75rem" : "0.5rem",
                background: isActive ? "var(--clara-accent)" : "var(--clara-border-strong)",
                boxShadow: "none",
                opacity: isActive ? 1 : 0.62,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

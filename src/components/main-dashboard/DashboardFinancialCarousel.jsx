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
      const boundedIndex = Math.min(Math.max(index, 0), items.length - 1);
      const boundedProgress = Math.min(Math.max(progress, 0), items.length - 1);

      setScrollProgress(boundedProgress);
      setActiveSlide(boundedIndex);
    });
  };

  return (
    <div className="relative mt-2 overflow-hidden rounded-[30px] py-1">
      <div
        className="pointer-events-none absolute -inset-x-8 top-4 h-32 rounded-full bg-emerald-400/[0.055] blur-3xl transition-transform duration-500 ease-out"
        style={{ transform: `translate3d(${(scrollProgress - activeSlide) * 16}px, 0, 0)` }}
      />
      <div
        className="pointer-events-none absolute -left-10 top-12 h-28 w-28 rounded-full bg-sky-400/[0.05] blur-3xl transition-transform duration-500 ease-out"
        style={{ transform: `translate3d(${scrollProgress * 8}px, 0, 0)` }}
      />
      <div
        className="pointer-events-none absolute -right-10 bottom-8 h-28 w-28 rounded-full bg-fuchsia-400/[0.045] blur-3xl transition-transform duration-500 ease-out"
        style={{ transform: `translate3d(${-scrollProgress * 8}px, 0, 0)` }}
      />

      <div className="pointer-events-none absolute -left-4 top-2 z-20 h-[calc(100%-34px)] w-8 bg-gradient-to-r from-[#070b10] via-[#070b10]/80 to-transparent" />
      <div className="pointer-events-none absolute -right-4 top-2 z-20 h-[calc(100%-34px)] w-8 bg-gradient-to-l from-[#070b10] via-[#070b10]/80 to-transparent" />

      <section
        ref={carouselRef}
        onScroll={handleScroll}
        aria-label="Financial dashboard cards"
        className="relative flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pl-4 pr-0 pb-2 pt-1 scrollbar-none"
      >
        {items.map((item, index) => {
          const distance = index - scrollProgress;
          const absDistance = Math.min(Math.abs(distance), 2);
          const isActive = activeSlide === index;
          const scale = isActive ? 1 : 1 - absDistance * 0.045;
          const opacity = isActive ? 1 : Math.max(1 - absDistance * 0.28, 0.5);
          const translateY = isActive ? 0 : absDistance * 12;
          const rotate = Math.max(Math.min(distance * 1.15, 1.4), -1.4);
          const translateX = distance * -3;
          const blur = isActive ? 0 : Math.min(absDistance * 0.35, 0.7);

          return (
            <div
              key={item.label}
              aria-label={item.label}
              style={{
                opacity,
                filter: `blur(${blur}px)`,
                transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale}) rotate(${rotate}deg)`,
                zIndex: isActive ? 10 : Math.max(1, 8 - Math.round(absDistance * 3)),
              }}
              className={`flex h-[306px] w-full min-w-full flex-shrink-0 snap-center transition-[opacity,transform,filter] duration-300 ease-out will-change-transform ${
                isActive
                  ? "drop-shadow-[0_24px_46px_rgba(0,0,0,0.42)]"
                  : "drop-shadow-[0_10px_22px_rgba(0,0,0,0.18)]"
              } ${index === items.length - 1 ? "mr-4" : ""}`}
            >
              <div className="flex h-full w-full transition-transform duration-300 ease-out active:scale-[0.985]">
                {item.content}
              </div>
            </div>
          );
        })}
      </section>

      <div className="mt-2 flex items-center justify-center gap-2">
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

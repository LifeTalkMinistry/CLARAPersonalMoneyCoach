import { useRef, useState } from "react";

import BudgetCard from "../financial-cards/BudgetCard";
import EmergencyFundCard from "../financial-cards/EmergencyFundCard";
import SavingsGoalCard from "../financial-cards/SavingsCard";
import InvestmentFundCard from "../financial-cards/InvestmentCard";
import DebtObligationCard from "../financial-cards/ObligationDebtCard";

const SLIDE_WIDTH_RATIO = 0.9;
const SLIDE_GAP = 12;

export default function DashboardFinancialCarousel({
  budgetData,
  emergencyFundData,
  savingsData,
  investmentData,
  debtData,
}) {
  const carouselRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

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
    el.scrollTo({
      left: nextIndex * getSlideStep(),
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const el = carouselRef.current;
    if (!el) return;

    const index = Math.round(el.scrollLeft / getSlideStep());
    setActiveSlide(Math.min(Math.max(index, 0), items.length - 1));
  };

  return (
    <div className="relative mt-2 overflow-hidden rounded-[30px] py-1">
      <div className="pointer-events-none absolute -inset-x-6 top-4 h-28 rounded-full bg-emerald-400/[0.055] blur-3xl" />
      <div className="pointer-events-none absolute -left-10 top-12 h-28 w-28 rounded-full bg-sky-400/[0.05] blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-8 h-28 w-28 rounded-full bg-fuchsia-400/[0.045] blur-3xl" />

      <div className="pointer-events-none absolute -left-4 top-2 z-20 h-[calc(100%-34px)] w-8 bg-gradient-to-r from-[#070b10] via-[#070b10]/80 to-transparent" />
      <div className="pointer-events-none absolute -right-4 top-2 z-20 h-[calc(100%-34px)] w-8 bg-gradient-to-l from-[#070b10] via-[#070b10]/80 to-transparent" />

      <section
        ref={carouselRef}
        onScroll={handleScroll}
        aria-label="Financial dashboard cards"
        className="relative -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-2 pt-1 scrollbar-none"
      >
        {items.map((item, index) => {
          const distance = Math.abs(activeSlide - index);
          const isActive = activeSlide === index;
          const translateY = isActive ? "translate-y-0" : "translate-y-2";
          const rotate =
            index < activeSlide
              ? "-rotate-[0.8deg]"
              : index > activeSlide
                ? "rotate-[0.8deg]"
                : "rotate-0";
          const depth = distance > 1 ? "scale-[0.94] opacity-55" : "scale-[0.972] opacity-72";

          return (
            <div
              key={item.label}
              aria-label={item.label}
              className={`w-[90%] min-w-[90%] flex-shrink-0 snap-center transition-all duration-300 ease-out will-change-transform ${
                isActive
                  ? "translate-y-0 scale-100 rotate-0 opacity-100 drop-shadow-[0_18px_34px_rgba(0,0,0,0.30)]"
                  : `${translateY} ${rotate} ${depth}`
              }`}
            >
              <div className="transition-transform duration-300 ease-out active:scale-[0.985]">
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

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
  const [activeSlide, setActiveSlide] = useState(0);

  const items = [
    { label: "Budget", content: <BudgetCard data={budgetData} /> },
    { label: "Emergency Fund", content: <EmergencyFundCard data={emergencyFundData} /> },
    { label: "Savings Goal", content: <SavingsGoalCard data={savingsData} /> },
    { label: "Investment Fund", content: <InvestmentFundCard data={investmentData} /> },
    { label: "Debt / Obligation", content: <DebtObligationCard data={debtData} /> },
  ];

  const scrollToSlide = (index) => {
    const el = carouselRef.current;
    if (!el) return;

    setActiveSlide(index);
    el.scrollTo({
      left: index * el.offsetWidth,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const el = carouselRef.current;
    if (!el) return;

    const index = Math.round(el.scrollLeft / el.offsetWidth);
    setActiveSlide(Math.min(Math.max(index, 0), items.length - 1));
  };

  return (
    <div className="relative mt-2">
      <div className="pointer-events-none absolute -inset-x-2 -top-4 h-24 rounded-full bg-emerald-400/[0.06] blur-3xl" />

      <section
        ref={carouselRef}
        onScroll={handleScroll}
        aria-label="Financial dashboard cards"
        className="relative -mx-1 flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory px-1 pb-1 scrollbar-none"
      >
        {items.map((item, index) => (
          <div
            key={item.label}
            aria-label={item.label}
            className={`min-w-full flex-shrink-0 snap-center transition duration-300 ${
              activeSlide === index ? "scale-100 opacity-100" : "scale-[0.985] opacity-75"
            }`}
          >
            {item.content}
          </div>
        ))}
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

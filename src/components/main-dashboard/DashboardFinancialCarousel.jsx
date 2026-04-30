import { useRef, useState, useEffect } from "react";

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
    <BudgetCard data={budgetData} />,
    <EmergencyFundCard data={emergencyFundData} />,
    <SavingsGoalCard data={savingsData} />,
    <InvestmentFundCard data={investmentData} />,
    <DebtObligationCard data={debtData} />,
  ];

  const handleScroll = () => {
    const el = carouselRef.current;
    if (!el) return;

    const index = Math.round(el.scrollLeft / el.offsetWidth);
    setActiveSlide(index);
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    el.scrollTo({
      left: activeSlide * el.offsetWidth,
      behavior: "smooth",
    });
  }, [activeSlide]);

  return (
    <div className="mt-2">

      {/* CAROUSEL */}
      <section
        ref={carouselRef}
        onScroll={handleScroll}
        className="
          flex
          overflow-x-auto
          snap-x snap-mandatory
          scrollbar-none
          scroll-smooth
        "
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="
              min-w-full
              flex-shrink-0
              snap-center
            "
          >
            {item}
          </div>
        ))}
      </section>

      {/* DOTS */}
      <div className="mt-3 flex justify-center gap-2">
        {items.map((_, index) => (
          <div
            key={index}
            className={`rounded-full transition-all duration-300 ${
              activeSlide === index
                ? "w-6 h-2 bg-emerald-400"
                : "w-2 h-2 bg-white/30"
            }`}
          />
        ))}
      </div>

    </div>
  );
}
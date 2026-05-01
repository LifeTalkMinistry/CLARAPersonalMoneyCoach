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
  onSaveBudget,
}) {
  const carouselRef = useRef(null);
  const frameRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const items = [
    { label: "Budget", content: <BudgetCard data={budgetData} onSaveBudget={onSaveBudget} /> },
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
    <div className="relative mt-1 overflow-hidden rounded-[30px] px-1 py-1 sm:mt-2">
      <section
        ref={carouselRef}
        onScroll={handleScroll}
        className="relative flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-1 pb-1 pt-1 scrollbar-none sm:pb-2"
      >
        {items.map((item, index) => (
          <div key={item.label} className="flex h-[300px] w-full min-w-full snap-center">
            {item.content}
          </div>
        ))}
      </section>
    </div>
  );
}

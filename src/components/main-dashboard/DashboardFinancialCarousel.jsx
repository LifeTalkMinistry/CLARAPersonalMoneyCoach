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
  onManageBudget,
  onAddSavings,
  onSetSavingsGoal,
  onDeleteSavingsGoal,
  onAddEmergencyFunds,
  onSetEmergencyTarget,
}) {
  const carouselRef = useRef(null);
  const frameRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const items = [
    {
      label: "Budget",
      content: (
        <BudgetCard
          data={budgetData}
          onCreateBudget={onManageBudget}
          onManageBudget={onManageBudget}
          onAdjustBudget={onManageBudget}
        />
      ),
    },
    {
      label: "Emergency Fund",
      content: (
        <EmergencyFundCard
          data={emergencyFundData}
          onAddFunds={onAddEmergencyFunds}
          onSetTarget={onSetEmergencyTarget}
        />
      ),
    },
    {
      label: "Savings Goal",
      content: (
        <SavingsGoalCard
          data={savingsData}
          onAddSavings={onAddSavings}
          onSetGoal={onSetSavingsGoal}
          onDeleteGoal={onDeleteSavingsGoal}
        />
      ),
    },
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

    if (frameRef.current) window.cancelAnimationFrame(frameRef.current);

    frameRef.current = window.requestAnimationFrame(() => {
      const step = getSlideStep();
      const progress = step ? el.scrollLeft / step : 0;
      const index = Math.round(progress);

      setActiveSlide(Math.min(Math.max(index, 0), items.length - 1));
    });
  };

  return (
    <div className="relative w-full shrink-0 overflow-visible">
      <section
        ref={carouselRef}
        onScroll={handleScroll}
        aria-label="Financial dashboard cards"
        className="relative flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-none"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {items.map((item, index) => {
          const isActive = activeSlide === index;

          return (
            <div
              key={item.label}
              aria-label={item.label}
              style={{
                opacity: isActive ? 1 : 0.86,
                zIndex: isActive ? 10 : 1,
                transition: "opacity 240ms ease",
              }}
              className="flex w-full min-w-full flex-shrink-0 snap-center transition-opacity duration-300 ease-out"
            >
              <div className="flex w-full overflow-hidden rounded-[28px]">
                {item.content}
              </div>
            </div>
          );
        })}
      </section>

      <div className="mt-2 flex h-2 shrink-0 items-center justify-center gap-2">
        {items.map((item, index) => {
          const isActive = activeSlide === index;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => scrollToSlide(index)}
              aria-label={`Go to ${item.label}`}
              className="h-1.5 rounded-full transition-all duration-300 active:scale-90"
              style={{
                width: isActive ? "0.95rem" : "0.36rem",
                background: isActive ? "#B9F632" : "rgba(255,255,255,0.20)",
                opacity: isActive ? 1 : 0.42,
                boxShadow: isActive ? "0 0 10px rgba(166,232,18,0.4)" : "none",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

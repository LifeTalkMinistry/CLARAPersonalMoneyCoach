import { useEffect, useState } from "react";

import ClaraPageShell from "../components/shared/layout/ClaraPageShell";

import DashboardBillboard from "../components/main-dashboard/DashboardBillboard";
import DashboardWalletDrawer from "../components/main-dashboard/DashboardWalletDrawer";
import DashboardFinancialCarousel from "../components/main-dashboard/DashboardFinancialCarousel";
import DashboardMoneySummary from "../components/main-dashboard/DashboardMoneySummary";

import useFinancialData from "../hooks/useFinancialData";

function getAdaptiveDashboardScale() {
  if (typeof window === "undefined") return 1;

  const height = window.innerHeight || 0;

  if (height > 0 && height <= 640) return 0.92;
  if (height > 0 && height <= 700) return 0.95;

  return 1;
}

export default function Dashboard() {
  const { wallets, expenses, budgets, savingsGoals, loading, saveBudget, addExpense } =
    useFinancialData();

  const [dashboardScale, setDashboardScale] = useState(getAdaptiveDashboardScale);

  useEffect(() => {
    const updateDashboardScale = () => {
      setDashboardScale(getAdaptiveDashboardScale());
    };

    updateDashboardScale();
    window.addEventListener("resize", updateDashboardScale);
    window.addEventListener("orientationchange", updateDashboardScale);

    return () => {
      window.removeEventListener("resize", updateDashboardScale);
      window.removeEventListener("orientationchange", updateDashboardScale);
    };
  }, []);

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const totalMoney = wallets?.reduce((sum, w) => sum + (w.balance || 0), 0) || 0;

  const totalExpenses =
    expenses
      ?.filter((e) => {
        const d = new Date(e.created_at);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        return key === monthKey;
      })
      .reduce((sum, e) => sum + (e.amount || 0), 0) || 0;

  const budget = budgets || {};

  const emergencyGoal =
    savingsGoals?.find((g) => g.title?.toLowerCase().includes("emergency")) || null;

  const savings = {
    saved: savingsGoals?.reduce((s, g) => s + (g.saved_amount || 0), 0) || 0,
    target: savingsGoals?.reduce((s, g) => s + (g.target_amount || 0), 0) || 0,
  };

  const investments = { value: 0 };
  const debts = { total: 0 };

  const startClaraAiLongPress = () => {
    console.log("CLARA AI long press started");
  };

  const endClaraAiLongPress = () => {
    console.log("CLARA AI long press ended");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#070b10] text-white flex items-center justify-center">
        <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/55 backdrop-blur-xl">
          Loading CLARA
        </div>
      </main>
    );
  }

  return (
    <ClaraPageShell compactHeader>
      <div className="dashboard-home-stack flex h-[calc(100svh-74px)] flex-col gap-4 overflow-hidden pb-[calc(70px+env(safe-area-inset-bottom))] sm:h-auto sm:gap-4 sm:overflow-y-auto sm:pb-[calc(88px+env(safe-area-inset-bottom))]">
        <div
          className="flex min-h-0 origin-top flex-col gap-4 sm:gap-4"
          style={{
            transform: `scale(${dashboardScale})`,
            transformOrigin: "top center",
            willChange: dashboardScale === 1 ? "auto" : "transform",
          }}
        >
          <section className="flex-shrink-0 transition duration-300 active:scale-[0.99]">
            <DashboardBillboard />
          </section>

          <div className="flex-shrink-0">
            <DashboardWalletDrawer wallets={wallets} />
          </div>

          <section className="min-h-0 flex-shrink transition duration-300 active:scale-[0.99]">
            <DashboardFinancialCarousel
              budgetData={budget}
              emergencyFundData={{
                saved: emergencyGoal?.saved_amount || 0,
                target: emergencyGoal?.target_amount || 0,
              }}
              savingsData={savings}
              investmentData={investments}
              debtData={debts}
              onSaveBudget={saveBudget}
            />
          </section>

          <section className="flex-shrink-0 transition duration-300 active:scale-[0.99]">
            <DashboardMoneySummary
              moneyLeft={totalMoney - totalExpenses}
              totalExpenses={totalExpenses}
              handleQuickExpense={addExpense}
              startClaraAiLongPress={startClaraAiLongPress}
              endClaraAiLongPress={endClaraAiLongPress}
            />
          </section>
        </div>
      </div>
    </ClaraPageShell>
  );
}

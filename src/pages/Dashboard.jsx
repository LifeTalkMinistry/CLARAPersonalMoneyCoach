import ClaraPageShell from "../components/shared/layout/ClaraPageShell";

import DashboardBillboard from "../components/main-dashboard/DashboardBillboard";
import DashboardFinancialCarousel from "../components/main-dashboard/DashboardFinancialCarousel";
import DashboardMoneySummary from "../components/main-dashboard/DashboardMoneySummary";
import DashboardQuickOrb from "../components/main-dashboard/DashboardQuickOrb";

import useFinancialData from "../hooks/useFinancialData";

export default function Dashboard() {
  const { wallets, expenses, budgets, savingsGoals, loading, saveBudget, addExpense } = useFinancialData();

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const totalMoney = wallets?.reduce((sum, w) => sum + (w.balance || 0), 0) || 0;

  const totalExpenses = expenses
    ?.filter((e) => {
      const d = new Date(e.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      return key === monthKey;
    })
    .reduce((sum, e) => sum + (e.amount || 0), 0) || 0;

  const budget = budgets || {};

  const emergencyGoal = savingsGoals?.find((g) => g.title?.toLowerCase().includes("emergency")) || null;

  const savings = {
    saved: savingsGoals?.reduce((s, g) => s + (g.saved_amount || 0), 0) || 0,
    target: savingsGoals?.reduce((s, g) => s + (g.target_amount || 0), 0) || 0,
  };

  const investments = { value: 0 };
  const debts = { total: 0 };

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
    <ClaraPageShell
      compactHeader
      floatingAction={
        <DashboardQuickOrb
          budgetCategories={budget?.categories || []}
          onQuickExpense={addExpense}
        />
      }
    >
      <div className="space-y-[10px] sm:space-y-3 overflow-hidden pb-[calc(88px+env(safe-area-inset-bottom))]">

        <section className="transition duration-300 active:scale-[0.99]">
          <DashboardBillboard />
        </section>

        <section className="transition duration-300 active:scale-[0.99]">
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

        <section className="mt-1 transition duration-300 active:scale-[0.99]">
          <DashboardMoneySummary
            moneyLeft={totalMoney - totalExpenses}
            totalExpenses={totalExpenses}
          />
        </section>

      </div>
    </ClaraPageShell>
  );
}

import ClaraPageShell from "../components/shared/layout/ClaraPageShell";

import DashboardBillboard from "../components/main-dashboard/DashboardBillboard";
import DashboardFinancialCarousel from "../components/main-dashboard/DashboardFinancialCarousel";
import DashboardMoneySummary from "../components/main-dashboard/DashboardMoneySummary";
import DashboardQuickOrb from "../components/main-dashboard/DashboardQuickOrb";

import useFinancialData from "../hooks/useFinancialData";

export default function Dashboard() {
  const { wallets, expenses, budgets, savingsGoals, loading } =
    useFinancialData();

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}`;

  const totalMoney =
    wallets?.reduce((sum, w) => sum + (w.balance || 0), 0) || 0;

  const totalExpenses =
    expenses
      ?.filter((e) => {
        const d = new Date(e.created_at);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
        return key === monthKey;
      })
      .reduce((sum, e) => sum + (e.amount || 0), 0) || 0;

  const budget = {
    total:
      budgets?.find((b) => b.month === monthKey)?.allocated_amount || 0,
    spent: totalExpenses,
  };

  const emergencyGoal =
    savingsGoals?.find((g) =>
      g.title?.toLowerCase().includes("emergency")
    ) || null;

  const savings = {
    saved:
      savingsGoals?.reduce((s, g) => s + (g.saved_amount || 0), 0) || 0,
    target:
      savingsGoals?.reduce((s, g) => s + (g.target_amount || 0), 0) || 0,
  };

  const investments = { value: 0 };
  const debts = { total: 0 };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#070b10] text-white flex items-center justify-center">
        Loading...
      </main>
    );
  }

  return (
    <ClaraPageShell compactHeader floatingAction={<DashboardQuickOrb />}>
      <div className="space-y-6">

        <div className="transition duration-200 active:scale-[0.99]">
          <DashboardBillboard />
        </div>

        <div className="transition duration-200 active:scale-[0.99]">
          <DashboardFinancialCarousel
            budgetData={budget}
            emergencyFundData={{
              saved: emergencyGoal?.saved_amount || 0,
              target: emergencyGoal?.target_amount || 0,
            }}
            savingsData={savings}
            investmentData={investments}
            debtData={debts}
          />
        </div>

        <div className="transition duration-200 active:scale-[0.99]">
          <DashboardMoneySummary
            moneyLeft={totalMoney - totalExpenses}
            totalExpenses={totalExpenses}
          />
        </div>

      </div>
    </ClaraPageShell>
  );
}

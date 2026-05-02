import { useMemo, useState } from "react";

import DashboardBillboard from "../components/main-dashboard/DashboardBillboard";
import DashboardFinancialCarousel from "../components/main-dashboard/DashboardFinancialCarousel";
import DashboardMoneySummary from "../components/main-dashboard/DashboardMoneySummary";
import DashboardWalletDrawer from "../components/main-dashboard/DashboardWalletDrawer";
import ClaraPageShell from "../components/shared/layout/ClaraPageShell";
import useFinancialData from "../hooks/useFinancialData";

function safeNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function getCurrentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function promptText(message, initialValue = "") {
  const nextValue = window.prompt(message, initialValue);
  if (nextValue == null) return null;
  return String(nextValue).trim();
}

function promptAmount(message, initialValue = "0") {
  const nextValue = promptText(message, initialValue);
  if (nextValue == null) return null;
  const amount = Number(nextValue);
  if (!Number.isFinite(amount) || amount < 0) return null;
  return amount;
}

export default function Dashboard() {
  const {
    wallets,
    budgets,
    savingsGoals,
    emergencyFund,
    currentMonthExpenses,
    moneyLeft,
    totalSavingsSaved,
    totalSavingsTarget,
    primarySavingsGoal,
    addExpense,
    addWallet,
    updateWallet,
    deleteWallet,
    saveBudgetCategory,
    deleteBudgetCategory,
    resetBudgetCategories,
    saveSavingsGoal,
    deleteSavingsGoal,
    addSavings,
    setEmergencyFundTarget,
    addEmergencyFund,
  } = useFinancialData();

  const [moneyVisible, setMoneyVisible] = useState(true);

  const budgetData = useMemo(() => {
    const categories = Array.isArray(budgets?.categories)
      ? budgets.categories
      : Array.isArray(budgets)
        ? budgets
        : [];

    return {
      total: safeNumber(budgets?.total),
      spent: safeNumber(budgets?.spent),
      totalExpenses: safeNumber(budgets?.totalExpenses),
      unplannedSpent: safeNumber(budgets?.unplannedSpent),
      categories,
    };
  }, [budgets]);

  const savingsData = useMemo(
    () => ({
      saved: safeNumber(totalSavingsSaved),
      target: safeNumber(totalSavingsTarget),
      goalName: primarySavingsGoal?.name || primarySavingsGoal?.goalName || "",
      goals: Array.isArray(savingsGoals) ? savingsGoals : [],
    }),
    [primarySavingsGoal, savingsGoals, totalSavingsSaved, totalSavingsTarget]
  );

  const emergencyFundData = useMemo(
    () => ({
      current: safeNumber(emergencyFund?.current),
      target: safeNumber(emergencyFund?.target),
    }),
    [emergencyFund]
  );

  return (
    <ClaraPageShell compactHeader>
      <div className="w-full overflow-x-hidden pb-[calc(18px+env(safe-area-inset-bottom))] pt-0">
        <div className="space-y-3">
          <DashboardBillboard />

          <DashboardFinancialCarousel
            budgetData={budgetData}
            emergencyFundData={emergencyFundData}
            savingsData={savingsData}
            investmentData={{ value: 0 }}
            debtData={{ total: 0 }}
            onManageBudget={handleManageBudget}
            onAddSavings={handleAddSavings}
            onSetSavingsGoal={handleSetSavingsGoal}
            onDeleteSavingsGoal={handleDeleteSavingsGoal}
            onAddEmergencyFunds={handleAddEmergencyFunds}
            onSetEmergencyTarget={handleSetEmergencyTarget}
          />

          <DashboardMoneySummary
            moneyLeft={safeNumber(moneyLeft)}
            totalExpenses={safeNumber(currentMonthExpenses)}
            moneyVisible={moneyVisible}
            onToggleMoneyVisible={() => setMoneyVisible((v) => !v)}
          />
        </div>
      </div>
    </ClaraPageShell>
  );
}

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

  const handleQuickExpense = async (expense) => {
    await addExpense({
      ...expense,
      amount: safeNumber(expense?.amount),
      created_at: expense?.created_at || new Date().toISOString(),
      category: expense?.category || "Unplanned",
    });
  };

  const handleAddWallet = async () => {
    const name = promptText("Wallet name");
    if (!name) return;
    const balance = promptAmount("Starting balance", "0");
    if (balance == null) return;

    await addWallet({
      name,
      balance,
      current_balance: balance,
    });
  };

  const handleEditWallet = async (wallet) => {
    if (!wallet) return;
    const name = promptText("Edit wallet name", wallet.name || wallet.wallet_name || "");
    if (!name) return;
    const balance = promptAmount(
      "Edit wallet balance",
      String(safeNumber(wallet.balance))
    );
    if (balance == null) return;

    await updateWallet(wallet.id, {
      name,
      balance,
      current_balance: balance,
    });
  };

  const handleDeleteWallet = async (wallet) => {
    if (!wallet?.id) return;
    if (!window.confirm(`Delete wallet "${wallet.name || "Wallet"}"?`)) return;
    await deleteWallet(wallet.id);
  };

  const handleManageBudget = async () => {
    const action = promptText(
      "Budget action: add, edit, delete, or reset",
      budgetData.total > 0 ? "edit" : "add"
    );
    if (!action) return;

    const normalizedAction = action.toLowerCase();
    const month = getCurrentMonthKey();

    if (normalizedAction === "reset") {
      if (!window.confirm("Reset all budget categories for this month?")) return;
      await resetBudgetCategories(month);
      return;
    }

    const category = promptText(
      "Budget category",
      budgetData.categories?.[0]?.category || ""
    );
    if (!category) return;

    if (normalizedAction === "delete") {
      if (!window.confirm(`Delete budget category "${category}"?`)) return;
      await deleteBudgetCategory({ month, category });
      return;
    }

    const amount = promptAmount(
      "Allocated amount",
      String(
        safeNumber(
          budgetData.categories?.find(
            (item) => String(item?.category || "").toLowerCase() === category.toLowerCase()
          )?.allocated_amount
        )
      )
    );
    if (amount == null) return;

    await saveBudgetCategory({
      month,
      category,
      allocated_amount: amount,
    });
  };

  const handleSetSavingsGoal = async () => {
    const goalName = promptText(
      "Savings goal name",
      primarySavingsGoal?.name || "Emergency Goal"
    );
    if (!goalName) return;

    const target = promptAmount(
      "Target amount",
      String(safeNumber(primarySavingsGoal?.target))
    );
    if (target == null) return;

    const saved = promptAmount(
      "Current saved amount",
      String(
        primarySavingsGoal &&
          String(primarySavingsGoal.name).toLowerCase() === goalName.toLowerCase()
          ? safeNumber(primarySavingsGoal.saved)
          : 0
      )
    );
    if (saved == null) return;

    const existingGoal = (Array.isArray(savingsGoals) ? savingsGoals : []).find(
      (goal) => String(goal.name || "").toLowerCase() === goalName.toLowerCase()
    );

    await saveSavingsGoal({
      id: existingGoal?.id,
      name: goalName,
      goalName,
      target,
      saved,
    });
  };

  const handleAddSavings = async () => {
    const goalName = promptText(
      "Add savings to which goal?",
      primarySavingsGoal?.name || ""
    );
    if (!goalName) return;

    const targetGoal = (Array.isArray(savingsGoals) ? savingsGoals : []).find(
      (goal) => String(goal.name || "").toLowerCase() === goalName.toLowerCase()
    );
    if (!targetGoal) return;

    const amount = promptAmount("Savings amount", "0");
    if (amount == null || amount <= 0) return;

    await addSavings(targetGoal.id, amount);
  };

  const handleDeleteSavingsGoal = async () => {
    const goalName = promptText(
      "Delete which savings goal?",
      primarySavingsGoal?.name || ""
    );
    if (!goalName) return;

    const targetGoal = (Array.isArray(savingsGoals) ? savingsGoals : []).find(
      (goal) => String(goal.name || "").toLowerCase() === goalName.toLowerCase()
    );
    if (!targetGoal) return;

    if (!window.confirm(`Delete savings goal "${targetGoal.name}"?`)) return;
    await deleteSavingsGoal(targetGoal.id);
  };

  const handleSetEmergencyTarget = async () => {
    const amount = promptAmount(
      "Emergency fund target",
      String(safeNumber(emergencyFund?.target))
    );
    if (amount == null) return;
    await setEmergencyFundTarget(amount);
  };

  const handleAddEmergencyFunds = async () => {
    const amount = promptAmount("Add emergency fund amount", "0");
    if (amount == null || amount <= 0) return;
    await addEmergencyFund(amount);
  };

  return (
    <ClaraPageShell compactHeader>
      <div className="w-full overflow-x-hidden pb-[calc(18px+env(safe-area-inset-bottom))] pt-0">
        <div className="space-y-3">
        </div>
      </div>
    </ClaraPageShell>
  );
}

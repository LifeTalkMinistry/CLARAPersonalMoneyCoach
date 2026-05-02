import { useEffect, useMemo, useState } from "react";

import DashboardBillboard from "../components/main-dashboard/DashboardBillboard";
import DashboardFinancialCarousel from "../components/main-dashboard/DashboardFinancialCarousel";
import DashboardMoneySummary from "../components/main-dashboard/DashboardMoneySummary";
import DashboardWalletDrawer from "../components/main-dashboard/DashboardWalletDrawer";
import ClaraPageShell from "../components/shared/layout/ClaraPageShell";
import useFinancialData from "../hooks/useFinancialData";
import { supabase } from "../lib/supabaseClient";

function safeNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function getCurrentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
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
  } = useFinancialData();

  const [moneyVisible, setMoneyVisible] = useState(true);
  const [activeBillboard, setActiveBillboard] = useState(null);

  useEffect(() => {
    fetchActiveBillboard();
  }, []);

  async function fetchActiveBillboard() {
    try {
      const { data } = await supabase
        .from("dashboard_billboards")
        .select("*")
        .eq("is_active", true)
        .limit(1)
        .single();

      if (data) setActiveBillboard(data);
    } catch (err) {
      console.warn("Billboard load failed", err);
    }
  }

  const budgetData = useMemo(() => ({
    total: safeNumber(budgets?.total),
    spent: safeNumber(budgets?.spent),
    totalExpenses: safeNumber(budgets?.totalExpenses),
    unplannedSpent: safeNumber(budgets?.unplannedSpent),
    categories: Array.isArray(budgets?.categories) ? budgets.categories : [],
  }), [budgets]);

  return (
    <ClaraPageShell compactHeader>
      <div className="space-y-3">
        <DashboardBillboard billboard={activeBillboard} />

        <DashboardFinancialCarousel
          budgetData={budgetData}
          emergencyFundData={{ current: 0, target: 0 }}
          savingsData={{ saved: 0, target: 0, goals: [] }}
          investmentData={{ value: 0 }}
          debtData={{ total: 0 }}
        />

        <DashboardMoneySummary
          moneyLeft={safeNumber(moneyLeft)}
          totalExpenses={safeNumber(currentMonthExpenses)}
          moneyVisible={moneyVisible}
          onToggleMoneyVisible={() => setMoneyVisible((v) => !v)}
        />
      </div>
    </ClaraPageShell>
  );
}

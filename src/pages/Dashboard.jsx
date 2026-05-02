import { useEffect, useMemo, useState } from "react";

import DashboardBillboard from "../components/main-dashboard/DashboardBillboard";
import DashboardFinancialCarousel from "../components/main-dashboard/DashboardFinancialCarousel";
import DashboardMoneySummary from "../components/main-dashboard/DashboardMoneySummary";
import ClaraPageShell from "../components/shared/layout/ClaraPageShell";
import useFinancialData from "../hooks/useFinancialData";
import { supabase } from "../lib/supabaseClient";

function safeNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

export default function Dashboard() {
  const { budgets, currentMonthExpenses, moneyLeft } = useFinancialData();

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

  const budgetData = useMemo(
    () => ({
      total: safeNumber(budgets?.total),
      spent: safeNumber(budgets?.spent),
      totalExpenses: safeNumber(budgets?.totalExpenses),
      unplannedSpent: safeNumber(budgets?.unplannedSpent),
      categories: Array.isArray(budgets?.categories) ? budgets.categories : [],
    }),
    [budgets]
  );

  return (
    <ClaraPageShell compactHeader>
      <div
        className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden"
        style={{
          justifyContent: "flex-start",
          gap: "clamp(0.65rem, 1.45svh, 0.9rem)",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="shrink-0">
          <DashboardBillboard billboard={activeBillboard} />
        </div>

        <div className="shrink-0">
          <DashboardFinancialCarousel
            budgetData={budgetData}
            emergencyFundData={{ current: 0, target: 0 }}
            savingsData={{ saved: 0, target: 0, goals: [] }}
            investmentData={{ value: 0 }}
            debtData={{ total: 0 }}
          />
        </div>

        <div className="shrink-0">
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

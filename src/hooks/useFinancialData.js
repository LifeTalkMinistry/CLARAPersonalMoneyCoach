import { useEffect, useState } from "react";

// ⚠️ Replace with your actual supabase import
// import { supabase } from "../lib/supabase";

export default function useFinancialData() {
  const [wallets, setWallets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // 🔥 TEMP MOCK (so UI works immediately)
        setWallets([{ balance: 13000 }]);

        setExpenses([
          { amount: 2000, created_at: new Date().toISOString() },
          { amount: 5000, created_at: new Date().toISOString() },
        ]);

        setBudgets([
          {
            month: new Date().toISOString().slice(0, 7),
            allocated_amount: 10000,
          },
        ]);

        setSavingsGoals([
          {
            title: "Emergency Fund",
            saved_amount: 3000,
            target_amount: 10000,
          },
          {
            title: "Travel",
            saved_amount: 2000,
            target_amount: 8000,
          },
        ]);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return {
    wallets,
    expenses,
    budgets,
    savingsGoals,
    loading,
  };
}
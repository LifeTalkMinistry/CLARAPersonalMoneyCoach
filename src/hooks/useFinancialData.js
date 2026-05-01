import { useEffect, useMemo, useState } from "react";

const FALLBACK_WALLETS = [];
const FALLBACK_EXPENSES = [];
const FALLBACK_BUDGETS = [];
const FALLBACK_SAVINGS_GOALS = [];

const FINANCE_DB_CANDIDATES = [
  "clara_finance_db",
  "CLARA_FINANCE_DB",
  "claraFinanceDB",
  "localFinanceDB",
  "financeDB",
  "clara-db",
];

const STORE_CANDIDATES = {
  wallets: ["wallets"],
  expenses: ["expenses"],
  budgets: ["budgets", "monthly_budgets", "budget_categories"],
  savingsGoals: ["savings_goals", "savingsGoals", "goals"],
};

function safeNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function getCurrentMonthKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function getDateMonthKey(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function getExpenseDate(expense) {
  return (
    expense?.created_at ||
    expense?.createdAt ||
    expense?.date ||
    expense?.expense_date ||
    expense?.transaction_date ||
    expense?.timestamp
  );
}

function getExpenseCategory(expense) {
  return (
    expense?.category ||
    expense?.category_name ||
    expense?.budget_category ||
    ""
  );
}

function getBudgetCategory(budget) {
  return (
    budget?.category ||
    budget?.category_name ||
    budget?.name ||
    budget?.title ||
    ""
  );
}

function getBudgetAllocated(budget) {
  return safeNumber(
    budget?.allocated ??
      budget?.allocated_amount ??
      budget?.amount ??
      budget?.limit
  );
}

function getExpenseAmount(expense) {
  return safeNumber(expense?.amount ?? expense?.value ?? expense?.total);
}

function isCurrentMonthExpense(expense, monthKey) {
  const expenseMonthKey = getDateMonthKey(getExpenseDate(expense));
  return expenseMonthKey === monthKey;
}

function isBudgetForCurrentMonth(budget, monthKey) {
  const directMonth = budget?.month || budget?.month_key || budget?.monthKey;

  if (directMonth) {
    return String(directMonth).slice(0, 7) === monthKey;
  }

  const datedMonth = getDateMonthKey(
    budget?.created_at ||
      budget?.createdAt ||
      budget?.date ||
      budget?.start_date ||
      budget?.updated_at
  );

  return !datedMonth || datedMonth === monthKey;
}

function buildBudgetFromExpenses(rawBudgets = [], rawExpenses = []) {
  const monthKey = getCurrentMonthKey();
  const budgetRows = Array.isArray(rawBudgets) ? rawBudgets : [];
  const expenseRows = Array.isArray(rawExpenses) ? rawExpenses : [];

  const currentMonthBudgets = budgetRows.filter((budget) =>
    isBudgetForCurrentMonth(budget, monthKey)
  );

  const currentMonthExpenses = expenseRows.filter((expense) =>
    isCurrentMonthExpense(expense, monthKey)
  );

  const categories = currentMonthBudgets.map((budget) => {
    const categoryName = getBudgetCategory(budget);
    const allocated = getBudgetAllocated(budget);

    return {
      ...budget,
      category: categoryName,
      category_name: budget?.category_name || categoryName,
      allocated,
      allocated_amount: budget?.allocated_amount ?? allocated,
      amount: budget?.amount ?? allocated,
      limit: budget?.limit ?? allocated,
      spent: 0,
      remaining: allocated,
    };
  });

  const categoryMap = new Map(
    categories
      .map((category) => [normalizeText(getBudgetCategory(category)), category])
      .filter(([key]) => Boolean(key))
  );

  let spent = 0;
  let unplannedSpent = 0;
  let undocumentedSpent = 0;

  currentMonthExpenses.forEach((expense) => {
    const amount = getExpenseAmount(expense);
    const expenseCategory = getExpenseCategory(expense);
    const normalizedExpenseCategory = normalizeText(expenseCategory);

    spent += amount;

    if (!normalizedExpenseCategory) {
      undocumentedSpent += amount;
      return;
    }

    const matchedCategory = categoryMap.get(normalizedExpenseCategory);

    if (!matchedCategory) {
      unplannedSpent += amount;
      return;
    }

    matchedCategory.spent = safeNumber(matchedCategory.spent) + amount;
    matchedCategory.remaining =
      getBudgetAllocated(matchedCategory) - safeNumber(matchedCategory.spent);
  });

  const total = categories.reduce(
    (sum, category) => sum + getBudgetAllocated(category),
    0
  );

  return {
    month: monthKey,
    monthKey,
    total,
    spent,
    totalExpenses: spent,
    unplannedSpent,
    undocumentedSpent,
    categories,
  };
}

function readObjectStore(db, storeName) {
  return new Promise((resolve) => {
    if (!db?.objectStoreNames?.contains(storeName)) {
      resolve([]);
      return;
    }

    try {
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(Array.isArray(request.result) ? request.result : []);
      };

      request.onerror = () => resolve([]);
      transaction.onerror = () => resolve([]);
    } catch (error) {
      console.warn(`CLARA finance store read skipped for ${storeName}:`, error);
      resolve([]);
    }
  });
}

function openIndexedDb(dbName) {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      resolve(null);
      return;
    }

    try {
      const request = window.indexedDB.open(dbName);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
      request.onblocked = () => resolve(null);
      request.onupgradeneeded = () => {
        request.transaction?.abort();
        resolve(null);
      };
    } catch (error) {
      console.warn(`CLARA IndexedDB open skipped for ${dbName}:`, error);
      resolve(null);
    }
  });
}

function pickExistingStoreName(db, candidates) {
  return candidates.find((storeName) => db?.objectStoreNames?.contains(storeName));
}

async function readFinanceDataFromIndexedDb() {
  if (typeof window === "undefined" || !window.indexedDB) {
    return null;
  }

  for (const dbName of FINANCE_DB_CANDIDATES) {
    const db = await openIndexedDb(dbName);

    if (!db) continue;

    try {
      const walletStore = pickExistingStoreName(db, STORE_CANDIDATES.wallets);
      const expenseStore = pickExistingStoreName(db, STORE_CANDIDATES.expenses);
      const budgetStore = pickExistingStoreName(db, STORE_CANDIDATES.budgets);
      const savingsGoalStore = pickExistingStoreName(
        db,
        STORE_CANDIDATES.savingsGoals
      );

      const [wallets, expenses, budgets, savingsGoals] = await Promise.all([
        walletStore ? readObjectStore(db, walletStore) : Promise.resolve([]),
        expenseStore ? readObjectStore(db, expenseStore) : Promise.resolve([]),
        budgetStore ? readObjectStore(db, budgetStore) : Promise.resolve([]),
        savingsGoalStore
          ? readObjectStore(db, savingsGoalStore)
          : Promise.resolve([]),
      ]);

      db.close?.();

      if (
        walletStore ||
        expenseStore ||
        budgetStore ||
        savingsGoalStore
      ) {
        return { wallets, expenses, budgets, savingsGoals };
      }
    } catch (error) {
      console.warn(`CLARA IndexedDB load skipped for ${dbName}:`, error);
      db.close?.();
    }
  }

  return null;
}

export default function useFinancialData() {
  const [wallets, setWallets] = useState(FALLBACK_WALLETS);
  const [expenses, setExpenses] = useState(FALLBACK_EXPENSES);
  const [rawBudgets, setRawBudgets] = useState(FALLBACK_BUDGETS);
  const [savingsGoals, setSavingsGoals] = useState(FALLBACK_SAVINGS_GOALS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const localData = await readFinanceDataFromIndexedDb();

        if (!mounted) return;

        setWallets(
          Array.isArray(localData?.wallets)
            ? localData.wallets
            : FALLBACK_WALLETS
        );

        setExpenses(
          Array.isArray(localData?.expenses)
            ? localData.expenses
            : FALLBACK_EXPENSES
        );

        setRawBudgets(
          Array.isArray(localData?.budgets)
            ? localData.budgets
            : FALLBACK_BUDGETS
        );

        setSavingsGoals(
          Array.isArray(localData?.savingsGoals)
            ? localData.savingsGoals
            : FALLBACK_SAVINGS_GOALS
        );
      } catch (error) {
        console.warn("CLARA finance data fallback used:", error);

        if (!mounted) return;

        setWallets(FALLBACK_WALLETS);
        setExpenses(FALLBACK_EXPENSES);
        setRawBudgets(FALLBACK_BUDGETS);
        setSavingsGoals(FALLBACK_SAVINGS_GOALS);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const budgets = useMemo(
    () => buildBudgetFromExpenses(rawBudgets, expenses),
    [rawBudgets, expenses]
  );

  return {
    wallets,
    expenses,
    budgets,
    savingsGoals,
    loading,
  };
}

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
  return String(value || "").trim().toLowerCase();
}

function getCurrentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function getDateMonthKey(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getExpenseDate(expense) {
  return expense?.created_at || expense?.createdAt || expense?.date || expense?.expense_date || expense?.transaction_date || expense?.timestamp;
}

function getExpenseCategory(expense) {
  return expense?.category || expense?.category_name || expense?.budget_category || "";
}

function getBudgetCategory(budget) {
  return budget?.category || budget?.category_name || budget?.name || budget?.title || "";
}

function getBudgetAllocated(budget) {
  return safeNumber(budget?.allocated ?? budget?.allocated_amount ?? budget?.amount ?? budget?.limit);
}

function getExpenseAmount(expense) {
  return safeNumber(expense?.amount ?? expense?.value ?? expense?.total);
}

function isBudgetForMonth(budget, monthKey) {
  const directMonth = budget?.month || budget?.month_key || budget?.monthKey;
  if (directMonth) return String(directMonth).slice(0, 7) === monthKey;
  const datedMonth = getDateMonthKey(budget?.created_at || budget?.createdAt || budget?.date || budget?.start_date || budget?.updated_at);
  return !datedMonth || datedMonth === monthKey;
}

function getUsagePercentage(spent, allocated) {
  const cleanSpent = safeNumber(spent);
  const cleanAllocated = safeNumber(allocated);
  if (cleanAllocated <= 0) return cleanSpent > 0 ? 1.01 : 0;
  return cleanSpent / cleanAllocated;
}

function getBudgetRiskLevel(usagePercentage) {
  if (usagePercentage > 1) return "overspent";
  if (usagePercentage >= 0.85) return "risk";
  if (usagePercentage >= 0.6) return "warning";
  return "safe";
}

function attachBudgetSummary(categories, summary) {
  const budgetArray = [...categories];
  budgetArray.month = summary.month;
  budgetArray.monthKey = summary.monthKey;
  budgetArray.total = summary.total;
  budgetArray.spent = summary.spent;
  budgetArray.totalExpenses = summary.totalExpenses;
  budgetArray.unplannedSpent = summary.unplannedSpent;
  budgetArray.undocumentedSpent = summary.undocumentedSpent;
  budgetArray.budgetRiskLevel = summary.budgetRiskLevel;
  budgetArray.highRiskCategories = summary.highRiskCategories;
  budgetArray.topSpendingCategory = summary.topSpendingCategory;
  budgetArray.categories = budgetArray;
  budgetArray.summary = summary;
  return budgetArray;
}

function buildBudgetFromExpenses(rawBudgets = [], rawExpenses = []) {
  const monthKey = getCurrentMonthKey();
  const currentMonthBudgets = (Array.isArray(rawBudgets) ? rawBudgets : []).filter((budget) => isBudgetForMonth(budget, monthKey));
  const currentMonthExpenses = (Array.isArray(rawExpenses) ? rawExpenses : []).filter((expense) => getDateMonthKey(getExpenseDate(expense)) === monthKey);

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
      usagePercentage: 0,
      riskLevel: "safe",
    };
  });

  const categoryMap = new Map(categories.map((category) => [normalizeText(getBudgetCategory(category)), category]).filter(([key]) => Boolean(key)));
  let spent = 0;
  let unplannedSpent = 0;
  let undocumentedSpent = 0;

  currentMonthExpenses.forEach((expense) => {
    const amount = getExpenseAmount(expense);
    const expenseCategory = getExpenseCategory(expense);
    const key = normalizeText(expenseCategory);
    spent += amount;
    if (!key) {
      undocumentedSpent += amount;
      return;
    }
    const matchedCategory = categoryMap.get(key);
    if (!matchedCategory) {
      unplannedSpent += amount;
      return;
    }
    matchedCategory.spent = safeNumber(matchedCategory.spent) + amount;
    matchedCategory.remaining = getBudgetAllocated(matchedCategory) - safeNumber(matchedCategory.spent);
  });

  const enrichedCategories = categories.map((category) => {
    const allocated = getBudgetAllocated(category);
    const categorySpent = safeNumber(category?.spent);
    const usagePercentage = getUsagePercentage(categorySpent, allocated);
    return {
      ...category,
      allocated,
      allocated_amount: category?.allocated_amount ?? allocated,
      amount: category?.amount ?? allocated,
      limit: category?.limit ?? allocated,
      spent: categorySpent,
      remaining: allocated - categorySpent,
      usagePercentage,
      riskLevel: getBudgetRiskLevel(usagePercentage),
    };
  });

  const total = enrichedCategories.reduce((sum, category) => sum + getBudgetAllocated(category), 0);
  const overallUsagePercentage = getUsagePercentage(spent, total);
  const summary = {
    month: monthKey,
    monthKey,
    total,
    spent,
    totalExpenses: spent,
    unplannedSpent,
    undocumentedSpent,
    budgetRiskLevel: getBudgetRiskLevel(overallUsagePercentage),
    highRiskCategories: enrichedCategories.filter((category) => category.riskLevel === "risk" || category.riskLevel === "overspent"),
    topSpendingCategory: enrichedCategories.length ? enrichedCategories.reduce((top, category) => safeNumber(category?.spent) > safeNumber(top?.spent) ? category : top) : null,
    categories: enrichedCategories,
  };

  return attachBudgetSummary(enrichedCategories, summary);
}

function openIndexedDb(dbName) {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.indexedDB) return resolve(null);
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
  if (!db?.objectStoreNames) return undefined;
  return candidates.find((storeName) => db.objectStoreNames.contains(storeName));
}

function readObjectStore(db, storeName) {
  return new Promise((resolve) => {
    if (!db?.objectStoreNames?.contains(storeName)) return resolve([]);
    try {
      const transaction = db.transaction(storeName, "readonly");
      const request = transaction.objectStore(storeName).getAll();
      request.onsuccess = () => resolve(Array.isArray(request.result) ? request.result : []);
      request.onerror = () => resolve([]);
      transaction.onerror = () => resolve([]);
    } catch (error) {
      console.warn(`CLARA finance store read skipped for ${storeName}:`, error);
      resolve([]);
    }
  });
}

function replaceMonthBudgets(db, storeName, monthKey, rows) {
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (!cursor) {
          rows.forEach((row) => store.put(row));
          return;
        }
        if (isBudgetForMonth(cursor.value, monthKey)) cursor.delete();
        cursor.continue();
      };

      request.onerror = () => reject(request.error || new Error("Unable to scan budgets"));
      transaction.oncomplete = () => resolve(rows);
      transaction.onerror = () => reject(transaction.error || new Error("Unable to save budgets"));
      transaction.onabort = () => reject(transaction.error || new Error("Budget save aborted"));
    } catch (error) {
      reject(error);
    }
  });
}

async function readFinanceDataFromIndexedDb() {
  if (typeof window === "undefined" || !window.indexedDB) return null;

  for (const dbName of FINANCE_DB_CANDIDATES) {
    const db = await openIndexedDb(dbName);
    if (!db) continue;

    try {
      const walletStore = pickExistingStoreName(db, STORE_CANDIDATES.wallets);
      const expenseStore = pickExistingStoreName(db, STORE_CANDIDATES.expenses);
      const budgetStore = pickExistingStoreName(db, STORE_CANDIDATES.budgets);
      const savingsGoalStore = pickExistingStoreName(db, STORE_CANDIDATES.savingsGoals);

      const [wallets, expenses, budgets, savingsGoals] = await Promise.all([
        walletStore ? readObjectStore(db, walletStore) : Promise.resolve([]),
        expenseStore ? readObjectStore(db, expenseStore) : Promise.resolve([]),
        budgetStore ? readObjectStore(db, budgetStore) : Promise.resolve([]),
        savingsGoalStore ? readObjectStore(db, savingsGoalStore) : Promise.resolve([]),
      ]);

      db.close?.();
      if (walletStore || expenseStore || budgetStore || savingsGoalStore) return { wallets, expenses, budgets, savingsGoals };
    } catch (error) {
      console.warn(`CLARA IndexedDB load skipped for ${dbName}:`, error);
      db.close?.();
    }
  }

  return null;
}

function buildBudgetRows({ month, categories }) {
  const monthKey = String(month || getCurrentMonthKey()).slice(0, 7);
  const now = new Date().toISOString();
  const cleanCategories = Array.isArray(categories) ? categories : [];

  return cleanCategories
    .map((item, index) => {
      const categoryName = getBudgetCategory(item);
      const amount = getBudgetAllocated(item);
      if (!categoryName || amount <= 0) return null;
      return {
        ...item,
        id: item?.id || `budget-${monthKey}-${normalizeText(categoryName).replace(/\s+/g, "-")}-${Date.now()}-${index}`,
        month: monthKey,
        month_key: item?.month_key || monthKey,
        monthKey: item?.monthKey || monthKey,
        category: categoryName,
        category_name: item?.category_name || categoryName,
        allocated_amount: amount,
        allocated: amount,
        amount,
        created_at: item?.created_at || now,
        updated_at: now,
      };
    })
    .filter(Boolean);
}

async function saveBudgetRowsToIndexedDb(monthKey, rows) {
  if (typeof window === "undefined" || !window.indexedDB) throw new Error("IndexedDB is not available");

  for (const dbName of FINANCE_DB_CANDIDATES) {
    const db = await openIndexedDb(dbName);
    if (!db) continue;

    try {
      const budgetStore = pickExistingStoreName(db, STORE_CANDIDATES.budgets);
      if (!budgetStore) {
        db.close?.();
        continue;
      }
      await replaceMonthBudgets(db, budgetStore, monthKey, rows);
      db.close?.();
      return rows;
    } catch (error) {
      console.warn(`CLARA budget save skipped for ${dbName}:`, error);
      db.close?.();
    }
  }

  throw new Error("No CLARA budget store found");
}

export default function useFinancialData() {
  const [wallets, setWallets] = useState(FALLBACK_WALLETS);
  const [expenses, setExpenses] = useState(FALLBACK_EXPENSES);
  const [rawBudgets, setRawBudgets] = useState(FALLBACK_BUDGETS);
  const [savingsGoals, setSavingsGoals] = useState(FALLBACK_SAVINGS_GOALS);
  const [loading, setLoading] = useState(true);

  async function applyFinanceSnapshot() {
    const localData = await readFinanceDataFromIndexedDb();
    setWallets(Array.isArray(localData?.wallets) ? localData.wallets : FALLBACK_WALLETS);
    setExpenses(Array.isArray(localData?.expenses) ? localData.expenses : FALLBACK_EXPENSES);
    setRawBudgets(Array.isArray(localData?.budgets) ? localData.budgets : FALLBACK_BUDGETS);
    setSavingsGoals(Array.isArray(localData?.savingsGoals) ? localData.savingsGoals : FALLBACK_SAVINGS_GOALS);
  }

  async function refreshFinanceData() {
    try {
      await applyFinanceSnapshot();
    } catch (error) {
      console.warn("CLARA finance data refresh skipped:", error);
    }
  }

  async function saveBudget({ month, total, categories }) {
    const monthKey = String(month || getCurrentMonthKey()).slice(0, 7);
    const rows = buildBudgetRows({ month: monthKey, total, categories });

    await saveBudgetRowsToIndexedDb(monthKey, rows);
    setRawBudgets((currentRows) => {
      const existingRows = Array.isArray(currentRows) ? currentRows : [];
      return [...existingRows.filter((budget) => !isBudgetForMonth(budget, monthKey)), ...rows];
    });
    await refreshFinanceData();
    return rows;
  }

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const localData = await readFinanceDataFromIndexedDb();
        if (!mounted) return;
        setWallets(Array.isArray(localData?.wallets) ? localData.wallets : FALLBACK_WALLETS);
        setExpenses(Array.isArray(localData?.expenses) ? localData.expenses : FALLBACK_EXPENSES);
        setRawBudgets(Array.isArray(localData?.budgets) ? localData.budgets : FALLBACK_BUDGETS);
        setSavingsGoals(Array.isArray(localData?.savingsGoals) ? localData.savingsGoals : FALLBACK_SAVINGS_GOALS);
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

  const budgets = useMemo(() => buildBudgetFromExpenses(rawBudgets, expenses), [rawBudgets, expenses]);

  return {
    wallets,
    expenses,
    budgets,
    savingsGoals,
    loading,
    refreshFinanceData,
    saveBudget,
  };
}

import { useEffect, useMemo, useState } from "react";

import { getMoneyLeft } from "../lib/dashboard/financeUtils";

const FALLBACK_WALLETS = [];
const FALLBACK_EXPENSES = [];
const FALLBACK_BUDGETS = [];
const FALLBACK_SAVINGS_GOALS = [];
const FALLBACK_EMERGENCY_FUND = {
  id: "emergency-fund",
  target: 0,
  current: 0,
  updated_at: "",
};
const PRIMARY_FINANCE_DB = "clara_finance_db";

const FINANCE_DB_CANDIDATES = [
  PRIMARY_FINANCE_DB,
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
  emergencyFund: ["emergency_fund", "emergencyFund"],
};

function safeNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeKey(value) {
  return normalizeText(value).replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
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
  return (
    expense?.created_at ||
    expense?.createdAt ||
    expense?.date ||
    expense?.expense_date ||
    expense?.transaction_date ||
    expense?.timestamp ||
    ""
  );
}

function getExpenseCategory(expense) {
  return expense?.category || expense?.category_name || expense?.budget_category || "";
}

function getBudgetCategory(budget) {
  return budget?.category || budget?.category_name || budget?.name || budget?.title || "";
}

function getBudgetAllocated(budget) {
  return safeNumber(
    budget?.allocated_amount ??
      budget?.allocated ??
      budget?.amount ??
      budget?.limit ??
      budget?.budget_amount
  );
}

function getExpenseAmount(expense) {
  return safeNumber(expense?.amount ?? expense?.value ?? expense?.total);
}

function getBudgetMonthKey(budget) {
  const directMonth = budget?.month || budget?.month_key || budget?.monthKey;
  if (directMonth) return String(directMonth).slice(0, 7);
  return getDateMonthKey(
    budget?.created_at ||
      budget?.createdAt ||
      budget?.date ||
      budget?.start_date ||
      budget?.updated_at
  );
}

function isBudgetForMonth(budget, monthKey) {
  return getBudgetMonthKey(budget) === monthKey;
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

function getWalletBalance(wallet) {
  return safeNumber(
    wallet?.balance ?? wallet?.current_balance ?? wallet?.amount ?? wallet?.available_balance
  );
}

function getWalletName(wallet, index = 0) {
  return wallet?.name || wallet?.wallet_name || wallet?.title || `Wallet ${index + 1}`;
}

function normalizeWalletRecord(wallet = {}, index = 0) {
  return {
    ...wallet,
    id: wallet?.id || makeId("wallet"),
    name: getWalletName(wallet, index),
    balance: getWalletBalance(wallet),
    updated_at: wallet?.updated_at || new Date().toISOString(),
  };
}

function normalizeSavingsGoal(goal = {}, index = 0) {
  const target = safeNumber(goal?.target ?? goal?.targetAmount ?? goal?.target_amount);
  const saved = safeNumber(goal?.saved ?? goal?.savedAmount ?? goal?.saved_amount);
  return {
    ...goal,
    id: goal?.id || makeId("savings-goal"),
    name: goal?.name || goal?.goalName || goal?.title || `Savings Goal ${index + 1}`,
    target,
    targetAmount: target,
    target_amount: target,
    saved,
    savedAmount: saved,
    saved_amount: saved,
    updated_at: goal?.updated_at || new Date().toISOString(),
  };
}

function normalizeEmergencyFund(record = {}) {
  return {
    id: record?.id || "emergency-fund",
    target: safeNumber(record?.target ?? record?.targetAmount),
    targetAmount: safeNumber(record?.target ?? record?.targetAmount),
    current: safeNumber(record?.current ?? record?.currentAmount ?? record?.saved),
    currentAmount: safeNumber(record?.current ?? record?.currentAmount ?? record?.saved),
    updated_at: record?.updated_at || "",
  };
}

function normalizeBudgetRecord(budget, fallbackMonth = getCurrentMonthKey()) {
  const category = String(getBudgetCategory(budget)).trim();
  const month = String(getBudgetMonthKey(budget) || fallbackMonth).slice(0, 7);
  const allocatedAmount = getBudgetAllocated(budget);

  if (!category || allocatedAmount < 0) return null;

  return {
    id: budget?.id || `budget-${month}-${normalizeKey(category)}`,
    month,
    category,
    allocated_amount: allocatedAmount,
    created_at: budget?.created_at || budget?.createdAt || new Date().toISOString(),
    updated_at: budget?.updated_at || new Date().toISOString(),
  };
}

function mergeBudgetRecords(records = [], monthKey = getCurrentMonthKey()) {
  const mergedMap = new Map();

  (Array.isArray(records) ? records : []).forEach((record) => {
    const normalized = normalizeBudgetRecord(record, monthKey);
    if (!normalized || normalized.month !== monthKey) return;

    const key = normalizeText(normalized.category);
    const existing = mergedMap.get(key);

    if (!existing) {
      mergedMap.set(key, normalized);
      return;
    }

    mergedMap.set(key, {
      ...existing,
      allocated_amount:
        safeNumber(existing.allocated_amount) + safeNumber(normalized.allocated_amount),
      created_at: existing.created_at || normalized.created_at,
      updated_at: normalized.updated_at || existing.updated_at,
    });
  });

  return Array.from(mergedMap.values()).map((record) => ({
    ...record,
    id: `budget-${record.month}-${normalizeKey(record.category)}`,
  }));
}

function normalizeExpenseRecord(expense = {}) {
  const now = new Date().toISOString();
  const createdAt = getExpenseDate(expense) || now;
  const amount = getExpenseAmount(expense);
  const category = String(getExpenseCategory(expense) || "").trim();

  return {
    ...expense,
    id: expense?.id || makeId("expense"),
    amount,
    category,
    created_at: createdAt,
  };
}

function attachBudgetSummary(categories, summary) {
  const budgetArray = [...categories];
  budgetArray.month = summary.month;
  budgetArray.monthKey = summary.monthKey;
  budgetArray.total = summary.total;
  budgetArray.spent = summary.spent;
  budgetArray.remaining = summary.remaining;
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
  const currentMonthBudgets = mergeBudgetRecords(rawBudgets, monthKey);
  const currentMonthExpenses = (Array.isArray(rawExpenses) ? rawExpenses : [])
    .map((expense) => normalizeExpenseRecord(expense))
    .filter((expense) => getDateMonthKey(getExpenseDate(expense)) === monthKey);

  const categories = currentMonthBudgets.map((budget) => ({
    ...budget,
    spent: 0,
    remaining: safeNumber(budget.allocated_amount),
    usagePercentage: 0,
    riskLevel: "safe",
  }));

  const categoryMap = new Map(
    categories
      .map((category) => [normalizeText(category.category), category])
      .filter(([key]) => Boolean(key))
  );

  let spent = 0;
  let unplannedSpent = 0;
  let undocumentedSpent = 0;

  currentMonthExpenses.forEach((expense) => {
    const amount = getExpenseAmount(expense);
    if (amount <= 0) return;

    const key = normalizeText(getExpenseCategory(expense));
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
    matchedCategory.remaining =
      safeNumber(matchedCategory.allocated_amount) - safeNumber(matchedCategory.spent);
  });

  const enrichedCategories = categories.map((category) => {
    const allocatedAmount = safeNumber(category.allocated_amount);
    const categorySpent = safeNumber(category.spent);
    const usagePercentage = getUsagePercentage(categorySpent, allocatedAmount);

    return {
      ...category,
      allocated_amount: allocatedAmount,
      spent: categorySpent,
      remaining: allocatedAmount - categorySpent,
      usagePercentage,
      riskLevel: getBudgetRiskLevel(usagePercentage),
    };
  });

  const total = enrichedCategories.reduce(
    (sum, category) => sum + safeNumber(category.allocated_amount),
    0
  );
  const remaining = total - spent;
  const overallUsagePercentage = getUsagePercentage(spent, total);

  const summary = {
    month: monthKey,
    monthKey,
    total,
    spent,
    remaining,
    totalExpenses: spent,
    unplannedSpent,
    undocumentedSpent,
    budgetRiskLevel: getBudgetRiskLevel(overallUsagePercentage),
    highRiskCategories: enrichedCategories.filter(
      (category) => category.riskLevel === "risk" || category.riskLevel === "overspent"
    ),
    topSpendingCategory: enrichedCategories.length
      ? enrichedCategories.reduce((top, category) =>
          safeNumber(category?.spent) > safeNumber(top?.spent) ? category : top
        )
      : null,
    categories: enrichedCategories,
  };

  return attachBudgetSummary(enrichedCategories, summary);
}

function openIndexedDb(dbName, version) {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.indexedDB) return resolve(null);
    try {
      const request = version
        ? window.indexedDB.open(dbName, version)
        : window.indexedDB.open(dbName);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
      request.onblocked = () => resolve(null);
      request.onupgradeneeded = () => {
        const db = request.result;
        Array.from(new Set(Object.values(STORE_CANDIDATES).flat())).forEach((storeName) => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: "id" });
          }
        });
      };
    } catch (error) {
      console.warn(`CLARA IndexedDB open skipped for ${dbName}:`, error);
      resolve(null);
    }
  });
}

function openDbWithStores(dbName, requiredStores = []) {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not available"));
      return;
    }

    const firstOpen = window.indexedDB.open(dbName);

    firstOpen.onerror = () =>
      reject(firstOpen.error || new Error("Unable to open finance DB"));
    firstOpen.onblocked = () => reject(new Error("Finance DB is blocked"));

    firstOpen.onsuccess = () => {
      const existingDb = firstOpen.result;
      const missingStores = requiredStores.filter(
        (storeName) => !existingDb.objectStoreNames.contains(storeName)
      );

      if (missingStores.length === 0) {
        resolve(existingDb);
        return;
      }

      const nextVersion = existingDb.version + 1;
      existingDb.close();

      const upgradeOpen = window.indexedDB.open(dbName, nextVersion);

      upgradeOpen.onupgradeneeded = () => {
        const upgradedDb = upgradeOpen.result;
        missingStores.forEach((storeName) => {
          if (!upgradedDb.objectStoreNames.contains(storeName)) {
            upgradedDb.createObjectStore(storeName, { keyPath: "id" });
          }
        });
      };

      upgradeOpen.onsuccess = () => resolve(upgradeOpen.result);
      upgradeOpen.onerror = () =>
        reject(upgradeOpen.error || new Error("Unable to create finance stores"));
      upgradeOpen.onblocked = () => reject(new Error("Finance store upgrade is blocked"));
    };
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
      request.onsuccess = () =>
        resolve(Array.isArray(request.result) ? request.result : []);
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
      transaction.onerror = () =>
        reject(transaction.error || new Error("Unable to save budgets"));
      transaction.onabort = () =>
        reject(transaction.error || new Error("Budget save aborted"));
    } catch (error) {
      reject(error);
    }
  });
}

function putRecords(db, storeName, records) {
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      (Array.isArray(records) ? records : [records]).forEach((record) => store.put(record));
      transaction.oncomplete = () => resolve(records);
      transaction.onerror = () =>
        reject(transaction.error || new Error(`Unable to save ${storeName}`));
      transaction.onabort = () =>
        reject(transaction.error || new Error(`${storeName} save aborted`));
    } catch (error) {
      reject(error);
    }
  });
}

function deleteRecord(db, storeName, id) {
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction(storeName, "readwrite");
      transaction.objectStore(storeName).delete(id);
      transaction.oncomplete = () => resolve(id);
      transaction.onerror = () =>
        reject(transaction.error || new Error(`Unable to delete ${storeName}`));
      transaction.onabort = () =>
        reject(transaction.error || new Error(`${storeName} delete aborted`));
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
      const emergencyFundStore = pickExistingStoreName(db, STORE_CANDIDATES.emergencyFund);

      const [wallets, expenses, budgets, savingsGoals, emergencyFundRecords] =
        await Promise.all([
          walletStore ? readObjectStore(db, walletStore) : Promise.resolve([]),
          expenseStore ? readObjectStore(db, expenseStore) : Promise.resolve([]),
          budgetStore ? readObjectStore(db, budgetStore) : Promise.resolve([]),
          savingsGoalStore ? readObjectStore(db, savingsGoalStore) : Promise.resolve([]),
          emergencyFundStore ? readObjectStore(db, emergencyFundStore) : Promise.resolve([]),
        ]);

      db.close?.();
      if (
        walletStore ||
        expenseStore ||
        budgetStore ||
        savingsGoalStore ||
        emergencyFundStore
      ) {
        return {
          wallets,
          expenses,
          budgets,
          savingsGoals,
          emergencyFund: Array.isArray(emergencyFundRecords)
            ? emergencyFundRecords[0] || null
            : null,
        };
      }
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

  return mergeBudgetRecords(
    cleanCategories.map((item) => ({
      id: item?.id,
      month: monthKey,
      category: getBudgetCategory(item),
      allocated_amount: getBudgetAllocated(item),
      created_at: item?.created_at || now,
      updated_at: now,
    })),
    monthKey
  );
}

async function saveBudgetRowsToIndexedDb(monthKey, rows) {
  const db = await openDbWithStores(PRIMARY_FINANCE_DB, ["budgets"]);
  try {
    await replaceMonthBudgets(db, "budgets", monthKey, rows);
    return rows;
  } finally {
    db.close?.();
  }
}

async function saveRecordsToStore(storeName, records) {
  const db = await openDbWithStores(PRIMARY_FINANCE_DB, [storeName]);
  try {
    await putRecords(db, storeName, records);
    return records;
  } finally {
    db.close?.();
  }
}

async function deleteRecordFromStore(storeName, id) {
  const db = await openDbWithStores(PRIMARY_FINANCE_DB, [storeName]);
  try {
    await deleteRecord(db, storeName, id);
    return id;
  } finally {
    db.close?.();
  }
}

export default function useFinancialData() {
  const [wallets, setWallets] = useState(FALLBACK_WALLETS);
  const [expenses, setExpenses] = useState(FALLBACK_EXPENSES);
  const [rawBudgets, setRawBudgets] = useState(FALLBACK_BUDGETS);
  const [savingsGoals, setSavingsGoals] = useState(FALLBACK_SAVINGS_GOALS);
  const [emergencyFund, setEmergencyFund] = useState(FALLBACK_EMERGENCY_FUND);
  const [loading, setLoading] = useState(true);

  async function applyFinanceSnapshot() {
    const localData = await readFinanceDataFromIndexedDb();
    setWallets(
      Array.isArray(localData?.wallets)
        ? localData.wallets.map((wallet, index) => normalizeWalletRecord(wallet, index))
        : FALLBACK_WALLETS
    );
    setExpenses(
      Array.isArray(localData?.expenses)
        ? localData.expenses.map((item) => normalizeExpenseRecord(item))
        : FALLBACK_EXPENSES
    );
    setRawBudgets(Array.isArray(localData?.budgets) ? localData.budgets : FALLBACK_BUDGETS);
    setSavingsGoals(
      Array.isArray(localData?.savingsGoals)
        ? localData.savingsGoals.map((goal, index) => normalizeSavingsGoal(goal, index))
        : FALLBACK_SAVINGS_GOALS
    );
    setEmergencyFund(
      localData?.emergencyFund
        ? normalizeEmergencyFund(localData.emergencyFund)
        : FALLBACK_EMERGENCY_FUND
    );
  }

  async function refreshFinanceData() {
    try {
      await applyFinanceSnapshot();
    } catch (error) {
      console.warn("CLARA finance data refresh skipped:", error);
    }
  }

  async function saveBudget({ month, categories }) {
    const monthKey = String(month || getCurrentMonthKey()).slice(0, 7);
    const rows = buildBudgetRows({ month: monthKey, categories });

    setRawBudgets((currentRows) => {
      const existingRows = Array.isArray(currentRows) ? currentRows : [];
      return [...existingRows.filter((budget) => !isBudgetForMonth(budget, monthKey)), ...rows];
    });

    await saveBudgetRowsToIndexedDb(monthKey, rows);
    return rows;
  }

  async function saveBudgetCategory({
    month = getCurrentMonthKey(),
    category,
    allocated_amount,
  }) {
    const monthKey = String(month || getCurrentMonthKey()).slice(0, 7);
    const nextCategory = String(category || "").trim();
    const nextAmount = Math.max(0, safeNumber(allocated_amount));

    const sourceRows = Array.isArray(rawBudgets) ? rawBudgets : [];
    const monthRows = mergeBudgetRecords(sourceRows, monthKey);
    const existing = monthRows.find(
      (budget) => normalizeText(budget.category) === normalizeText(nextCategory)
    );
    const remainingRows = monthRows.filter(
      (budget) => normalizeText(budget.category) !== normalizeText(nextCategory)
    );

    const nextRows =
      nextCategory && nextAmount > 0
        ? [
            ...remainingRows,
            {
              id: existing?.id || `budget-${monthKey}-${normalizeKey(nextCategory)}`,
              month: monthKey,
              category: nextCategory,
              allocated_amount: nextAmount,
              created_at: existing?.created_at || new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]
        : remainingRows;

    return saveBudget({ month: monthKey, categories: nextRows });
  }

  async function deleteBudgetCategory({
    month = getCurrentMonthKey(),
    category,
  }) {
    const monthKey = String(month || getCurrentMonthKey()).slice(0, 7);
    const monthRows = mergeBudgetRecords(rawBudgets, monthKey).filter(
      (budget) => normalizeText(budget.category) !== normalizeText(category)
    );
    return saveBudget({ month: monthKey, categories: monthRows });
  }

  async function resetBudgetCategories(month = getCurrentMonthKey()) {
    return saveBudget({ month, categories: [] });
  }

  async function addExpense(expense) {
    const normalizedExpense = normalizeExpenseRecord(expense);

    setExpenses((currentRows) => {
      const existingRows = Array.isArray(currentRows) ? currentRows : [];
      return [...existingRows, normalizedExpense];
    });

    await saveRecordsToStore("expenses", normalizedExpense);
    return normalizedExpense;
  }

  async function addWallet(wallet) {
    const nextWallet = normalizeWalletRecord(wallet, wallets.length);
    setWallets((current) => [...(Array.isArray(current) ? current : []), nextWallet]);
    await saveRecordsToStore("wallets", nextWallet);
    return nextWallet;
  }

  async function updateWallet(id, updates) {
    const sourceRows = Array.isArray(wallets) ? wallets : [];
    const nextRows = sourceRows.map((wallet, index) =>
      String(wallet.id) === String(id)
        ? normalizeWalletRecord({ ...wallet, ...updates, id }, index)
        : normalizeWalletRecord(wallet, index)
    );
    setWallets(nextRows);
    const nextWallet = nextRows.find((wallet) => String(wallet.id) === String(id));
    if (nextWallet) {
      await saveRecordsToStore("wallets", nextWallet);
    }
    return nextWallet;
  }

  async function deleteWallet(id) {
    setWallets((current) =>
      (Array.isArray(current) ? current : []).filter((wallet) => String(wallet.id) !== String(id))
    );
    await deleteRecordFromStore("wallets", id);
    return id;
  }

  async function saveSavingsGoal(goal) {
    const sourceRows = Array.isArray(savingsGoals) ? savingsGoals : [];
    const existingIndex = sourceRows.findIndex(
      (item) => String(item.id) === String(goal?.id || "")
    );
    const nextGoal = normalizeSavingsGoal(
      existingIndex >= 0 ? { ...sourceRows[existingIndex], ...goal } : goal,
      existingIndex >= 0 ? existingIndex : sourceRows.length
    );

    const nextRows =
      existingIndex >= 0
        ? sourceRows.map((item, index) =>
            index === existingIndex ? nextGoal : normalizeSavingsGoal(item, index)
          )
        : [...sourceRows, nextGoal];

    setSavingsGoals(nextRows);
    await saveRecordsToStore("savings_goals", nextGoal);
    return nextGoal;
  }

  async function deleteSavingsGoal(id) {
    setSavingsGoals((current) =>
      (Array.isArray(current) ? current : []).filter((goal) => String(goal.id) !== String(id))
    );
    await deleteRecordFromStore("savings_goals", id);
    return id;
  }

  async function addSavings(goalId, amount) {
    const sourceRows = Array.isArray(savingsGoals) ? savingsGoals : [];
    const match = sourceRows.find((goal) => String(goal.id) === String(goalId));
    if (!match) return null;

    const nextGoal = normalizeSavingsGoal({
      ...match,
      saved: safeNumber(match.saved) + Math.max(0, safeNumber(amount)),
      updated_at: new Date().toISOString(),
    });

    setSavingsGoals((current) =>
      (Array.isArray(current) ? current : []).map((goal, index) =>
        String(goal.id) === String(goalId) ? nextGoal : normalizeSavingsGoal(goal, index)
      )
    );
    await saveRecordsToStore("savings_goals", nextGoal);
    return nextGoal;
  }

  async function saveEmergencyFund(updates) {
    const nextFund = normalizeEmergencyFund({
      ...emergencyFund,
      ...updates,
      id: "emergency-fund",
      updated_at: new Date().toISOString(),
    });
    setEmergencyFund(nextFund);
    await saveRecordsToStore("emergency_fund", nextFund);
    return nextFund;
  }

  async function setEmergencyFundTarget(targetAmount) {
    return saveEmergencyFund({
      target: Math.max(0, safeNumber(targetAmount)),
      targetAmount: Math.max(0, safeNumber(targetAmount)),
    });
  }

  async function addEmergencyFund(amount) {
    return saveEmergencyFund({
      current: safeNumber(emergencyFund.current) + Math.max(0, safeNumber(amount)),
      currentAmount:
        safeNumber(emergencyFund.currentAmount) + Math.max(0, safeNumber(amount)),
    });
  }

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const localData = await readFinanceDataFromIndexedDb();
        if (!mounted) return;
        setWallets(
          Array.isArray(localData?.wallets)
            ? localData.wallets.map((wallet, index) => normalizeWalletRecord(wallet, index))
            : FALLBACK_WALLETS
        );
        setExpenses(
          Array.isArray(localData?.expenses)
            ? localData.expenses.map((item) => normalizeExpenseRecord(item))
            : FALLBACK_EXPENSES
        );
        setRawBudgets(Array.isArray(localData?.budgets) ? localData.budgets : FALLBACK_BUDGETS);
        setSavingsGoals(
          Array.isArray(localData?.savingsGoals)
            ? localData.savingsGoals.map((goal, index) => normalizeSavingsGoal(goal, index))
            : FALLBACK_SAVINGS_GOALS
        );
        setEmergencyFund(
          localData?.emergencyFund
            ? normalizeEmergencyFund(localData.emergencyFund)
            : FALLBACK_EMERGENCY_FUND
        );
      } catch (error) {
        console.warn("CLARA finance data fallback used:", error);
        if (!mounted) return;
        setWallets(FALLBACK_WALLETS);
        setExpenses(FALLBACK_EXPENSES);
        setRawBudgets(FALLBACK_BUDGETS);
        setSavingsGoals(FALLBACK_SAVINGS_GOALS);
        setEmergencyFund(FALLBACK_EMERGENCY_FUND);
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

  const totalWalletBalance = useMemo(
    () =>
      (Array.isArray(wallets) ? wallets : []).reduce(
        (sum, wallet) => sum + getWalletBalance(wallet),
        0
      ),
    [wallets]
  );

  const currentMonthExpenses = useMemo(() => {
    const monthKey = getCurrentMonthKey();
    return (Array.isArray(expenses) ? expenses : []).reduce((sum, expense) => {
      return getDateMonthKey(getExpenseDate(expense)) === monthKey
        ? sum + getExpenseAmount(expense)
        : sum;
    }, 0);
  }, [expenses]);

  const moneyLeft = useMemo(
    () => getMoneyLeft(totalWalletBalance, currentMonthExpenses),
    [currentMonthExpenses, totalWalletBalance]
  );

  const totalSavingsSaved = useMemo(
    () =>
      (Array.isArray(savingsGoals) ? savingsGoals : []).reduce(
        (sum, goal) => sum + safeNumber(goal.saved),
        0
      ),
    [savingsGoals]
  );

  const totalSavingsTarget = useMemo(
    () =>
      (Array.isArray(savingsGoals) ? savingsGoals : []).reduce(
        (sum, goal) => sum + safeNumber(goal.target),
        0
      ),
    [savingsGoals]
  );

  const primarySavingsGoal = useMemo(
    () => (Array.isArray(savingsGoals) ? savingsGoals[0] || null : null),
    [savingsGoals]
  );

  return {
    wallets,
    expenses,
    budgets,
    savingsGoals,
    emergencyFund,
    loading,
    totalWalletBalance,
    currentMonthExpenses,
    moneyLeft,
    totalSavingsSaved,
    totalSavingsTarget,
    primarySavingsGoal,
    refreshFinanceData,
    saveBudget,
    saveBudgetCategory,
    deleteBudgetCategory,
    resetBudgetCategories,
    addExpense,
    addWallet,
    updateWallet,
    deleteWallet,
    saveSavingsGoal,
    deleteSavingsGoal,
    addSavings,
    setEmergencyFundTarget,
    addEmergencyFund,
  };
}

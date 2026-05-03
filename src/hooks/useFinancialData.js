import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getWalletBalance } from "@/utils/financialEngine";

const toNumber = (value) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const cleaned = value.replace(/[₱,\s]/g, "");
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : 0;
  }
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const getSafeDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString();
  return date.toISOString();
};

const normalizeString = (value) => String(value ?? "").trim().toLowerCase();

const normalizePlanningStatus = (value) => {
  const normalized = String(value || "planned").trim().toLowerCase();
  return ["planned", "unplanned", "undocumented"].includes(normalized)
    ? normalized
    : "planned";
};

const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const getMonthKey = (value = new Date()) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const map = {};
  for (const part of parts) {
    if (part.type !== "literal") map[part.type] = part.value;
  }

  return `${map.year || "0000"}-${map.month || "00"}`;
};

const isOwnedByUser = (item, user) => {
  if (!user || !item) return false;

  const userId = String(user?.id ?? "").trim();
  const userEmail = normalizeString(user?.email);

  const itemIds = [item?.user_id, item?.owner_id, item?.profile_id]
    .map((v) => String(v ?? "").trim())
    .filter(Boolean);

  const itemEmails = [
    item?.created_by,
    item?.user_email,
    item?.owner_email,
    item?.email,
  ]
    .map(normalizeString)
    .filter(Boolean);

  if (userId && itemIds.includes(userId)) return true;
  if (userEmail && itemEmails.includes(userEmail)) return true;

  return false;
};

const safeSelect = async (table, user, options = {}) => {
  if (!user?.id && !user?.email) return [];

  let query = supabase.from(table).select("*");

  if (options.orderBy) {
    query = query.order(options.orderBy.column, {
      ascending: options.orderBy.ascending ?? true,
    });
  }

  const { data, error } = await query;

  if (error) {
    console.warn(`Failed loading ${table}`, error);
    return [];
  }

  return (data || []).filter((item) => isOwnedByUser(item, user));
};

const createEmptyFinancialCache = (key = null) => ({
  key,
  loaded: false,
  expenses: [],
  incomes: [],
  wallets: [],
  budgets: [],
  walletTransactions: [],
  transfers: [],
  savingsGoals: [],
  profile: null,
  survivalExpense: 0,
  retentionRate: 0,
});

let financialDataCache = createEmptyFinancialCache();
let financialDataInFlight = null;

export default function useFinancialData(user) {
  const userId = user?.id || null;
  const userEmail = user?.email || null;
  const cacheKey = userId || userEmail || null;
  const initialCache =
    financialDataCache.loaded && financialDataCache.key === cacheKey
      ? financialDataCache
      : createEmptyFinancialCache(cacheKey);

  const [expenses, setExpenses] = useState(initialCache.expenses);
  const [incomes, setIncomes] = useState(initialCache.incomes);
  const [wallets, setWallets] = useState(initialCache.wallets);
  const [budgets, setBudgets] = useState(initialCache.budgets);
  const [walletTransactions, setWalletTransactions] = useState(
    initialCache.walletTransactions
  );
  const [transfers, setTransfers] = useState(initialCache.transfers);
  const [savingsGoals, setSavingsGoals] = useState(initialCache.savingsGoals);
  const [profile, setProfile] = useState(initialCache.profile);
  const [survivalExpense, setSurvivalExpense] = useState(
    initialCache.survivalExpense
  );
  const [retentionRate, setRetentionRate] = useState(initialCache.retentionRate);
  const [loading, setLoading] = useState(!initialCache.loaded);
  const hasLoadedRef = useRef(false);
  const refreshTimeoutRef = useRef(null);

  const hydrateFromCache = useCallback((nextCache) => {
    setExpenses(nextCache.expenses);
    setIncomes(nextCache.incomes);
    setWallets(nextCache.wallets);
    setBudgets(nextCache.budgets);
    setWalletTransactions(nextCache.walletTransactions);
    setTransfers(nextCache.transfers);
    setSavingsGoals(nextCache.savingsGoals);
    setProfile(nextCache.profile);
    setSurvivalExpense(nextCache.survivalExpense);
    setRetentionRate(nextCache.retentionRate);
    hasLoadedRef.current = nextCache.loaded;
    setLoading(!nextCache.loaded);
  }, []);

  useEffect(() => {
    if (!cacheKey) {
      const emptyCache = createEmptyFinancialCache();
      financialDataCache = emptyCache;
      hydrateFromCache(emptyCache);
      return;
    }

    if (financialDataCache.loaded && financialDataCache.key === cacheKey) {
      hydrateFromCache(financialDataCache);
      return;
    }

    hasLoadedRef.current = false;
    setLoading(true);
  }, [cacheKey, hydrateFromCache]);

  const loadAll = useCallback(
    async ({ background = false } = {}) => {
      const currentUser = { id: userId, email: userEmail };

      if (!currentUser.id && !currentUser.email) {
        const emptyCache = createEmptyFinancialCache();
        financialDataCache = emptyCache;
        hydrateFromCache(emptyCache);
        return emptyCache;
      }

      if (financialDataInFlight?.key === cacheKey) {
        return financialDataInFlight.promise;
      }

      if (!hasLoadedRef.current && !background) {
        setLoading(true);
      }

      const promise = (async () => {
        const [
          nextExpenses,
          nextWallets,
          nextBudgets,
          nextWalletTransactions,
          nextTransfers,
          nextSavingsGoals,
          profiles,
        ] = await Promise.all([
          safeSelect("expenses", currentUser, {
            orderBy: { column: "created_at", ascending: false },
          }),
          safeSelect("wallets", currentUser),
          safeSelect("budgets", currentUser, {
            orderBy: { column: "created_at", ascending: false },
          }),
          safeSelect("wallet_transactions", currentUser, {
            orderBy: { column: "created_at", ascending: false },
          }),
          safeSelect("transfers", currentUser),
          safeSelect("savings_goals", currentUser, {
            orderBy: { column: "created_date", ascending: false },
          }),
          safeSelect("profiles", currentUser),
        ]);

        const nextProfile = profiles[0] || null;
        const hydratedWallets = (nextWallets || []).map((wallet) => {
          const balance = getWalletBalance(
            wallet,
            nextWalletTransactions || [],
            nextTransfers || []
          );

          return {
            ...wallet,
            balance,
            derived_balance: balance,
          };
        });

        const totalIncome = (nextWalletTransactions || [])
          .filter((transaction) => {
            const type = String(transaction?.type || "")
              .trim()
              .toLowerCase();
            return ["income", "add", "cash_in", "deposit", "credit"].includes(type);
          })
          .reduce((sum, transaction) => sum + toNumber(transaction?.amount), 0);

        const currentMonthKey = getMonthKey();
        const currentMonthExpenses = (nextExpenses || []).reduce((sum, expense) => {
          const date = expense?.date || expense?.created_at || expense?.updated_at;
          if (getMonthKey(date) !== currentMonthKey) return sum;
          return sum + toNumber(expense?.amount);
        }, 0);

        const remainingIncome = totalIncome - currentMonthExpenses;
        const nextRetentionRate =
          totalIncome > 0
            ? Math.max(0, Math.min((remainingIncome / totalIncome) * 100, 100))
            : 0;

        const nextCache = {
          key: cacheKey,
          loaded: true,
          expenses: nextExpenses || [],
          incomes: [],
          wallets: hydratedWallets,
          budgets: nextBudgets || [],
          walletTransactions: nextWalletTransactions || [],
          transfers: nextTransfers || [],
          savingsGoals: nextSavingsGoals || [],
          profile: nextProfile,
          survivalExpense: toNumber(
            nextProfile?.monthly_survival_expense ??
              nextProfile?.survival_expense ??
              nextProfile?.clara_survival_expense
          ),
          retentionRate: nextRetentionRate,
        };

        financialDataCache = nextCache;
        hydrateFromCache(nextCache);
        return nextCache;
      })()
        .catch((error) => {
          console.error("loadAll error:", error);
          throw error;
        })
        .finally(() => {
          if (financialDataInFlight?.key === cacheKey) {
            financialDataInFlight = null;
          }
          setLoading(false);
        });

      financialDataInFlight = {
        key: cacheKey,
        promise,
      };

      return promise;
    },
    [cacheKey, hydrateFromCache, userEmail, userId]
  );

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    if (!userId && !userEmail) return;

    const scheduleRefresh = () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      refreshTimeoutRef.current = setTimeout(() => {
        loadAll({ background: true });
      }, 150);
    };

    const channel = supabase
      .channel(`finance-${userId || userEmail}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "expenses" },
        scheduleRefresh
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wallets" },
        scheduleRefresh
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wallet_transactions" },
        scheduleRefresh
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transfers" },
        scheduleRefresh
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "budgets" },
        scheduleRefresh
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "savings_goals" },
        scheduleRefresh
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        scheduleRefresh
      )
      .subscribe();

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      supabase.removeChannel(channel);
    };
  }, [userEmail, userId, loadAll]);

  const refreshData = useCallback((options) => loadAll(options), [loadAll]);

  const updateWalletBalance = async (walletId, amountChange) => {
    const wallet = wallets.find((item) => String(item.id) === String(walletId));
    if (!wallet) return;

    const updated =
      toNumber(wallet?.derived_balance ?? wallet?.balance) + toNumber(amountChange);

    const { error } = await supabase
      .from("wallets")
      .update({ balance: updated, updated_at: new Date().toISOString() })
      .eq("id", walletId);

    if (error) throw error;
  };

  const insertWalletTransaction = async (payload) => {
    const now = new Date().toISOString();
    const { error } = await supabase.from("wallet_transactions").insert([
      {
        id: payload.id || generateId(),
        wallet_id: payload.wallet_id ? String(payload.wallet_id) : null,
        amount: toNumber(payload.amount),
        type: payload.type,
        category: payload.category || null,
        need_type: payload.need_type || null,
        planning_status: payload.planning_status || null,
        unplanned_reason: payload.unplanned_reason || null,
        expense_id: payload.expense_id || null,
        transfer_group_id: payload.transfer_group_id || null,
        related_wallet_id: payload.related_wallet_id || null,
        source_type: payload.source_type || null,
        tag: payload.tag || null,
        notes: payload.notes || "",
        created_at: payload.created_at || now,
        updated_at: now,
        user_id: user?.id || null,
        user_email: user?.email || null,
        created_by: user?.email || null,
      },
    ]);

    if (error) throw error;
  };

  const addExpense = async (expense) => {
    const amount = toNumber(expense.amount);
    const planningStatus = normalizePlanningStatus(expense.planning_status);

    if (
      planningStatus === "unplanned" &&
      !String(expense.unplanned_reason || "").trim()
    ) {
      throw new Error("Reason is required for unplanned expenses.");
    }

    const payload = {
      ...expense,
      id: expense.id || generateId(),
      user_id: user?.id || null,
      user_email: user?.email || null,
      created_by: user?.email || null,
      amount,
      date: getSafeDate(expense.date),
      planning_status: planningStatus,
      unplanned_reason:
        planningStatus === "unplanned"
          ? String(expense.unplanned_reason || "").trim()
          : null,
    };

    const { error } = await supabase.from("expenses").insert([payload]);
    if (error) throw error;

    if (expense.wallet_id) {
      await updateWalletBalance(expense.wallet_id, -amount);
      await insertWalletTransaction({
        wallet_id: expense.wallet_id,
        amount,
        type: "expense",
        category: expense.category,
        need_type: expense.need_type,
        planning_status: planningStatus,
        unplanned_reason: payload.unplanned_reason,
        expense_id: payload.id,
        notes: expense.notes,
        created_at: payload.date,
      });
    }

    await loadAll();
  };

  const updateExpense = async (id, updates) => {
    const oldExpense = expenses.find((expense) => String(expense.id) === String(id));
    const normalizedUpdates = { ...updates };

    if (updates.amount !== undefined) {
      normalizedUpdates.amount = toNumber(updates.amount);
    }

    if (updates.date !== undefined) {
      normalizedUpdates.date = getSafeDate(updates.date);
    }

    if (updates.planning_status !== undefined) {
      normalizedUpdates.planning_status = normalizePlanningStatus(
        updates.planning_status
      );
    }

    const nextPlanningStatus =
      normalizedUpdates.planning_status || oldExpense?.planning_status || "planned";

    if (nextPlanningStatus === "unplanned") {
      const reason = String(
        normalizedUpdates.unplanned_reason ?? oldExpense?.unplanned_reason ?? ""
      ).trim();
      if (!reason) throw new Error("Reason is required for unplanned expenses.");
      normalizedUpdates.unplanned_reason = reason;
    } else if (updates.planning_status !== undefined) {
      normalizedUpdates.unplanned_reason = null;
    }

    const { error } = await supabase
      .from("expenses")
      .update(normalizedUpdates)
      .eq("id", id);

    if (error) throw error;

    if (oldExpense?.wallet_id) {
      await updateWalletBalance(oldExpense.wallet_id, toNumber(oldExpense.amount));
    }

    const nextWalletId = normalizedUpdates.wallet_id ?? oldExpense?.wallet_id;
    const nextAmount =
      normalizedUpdates.amount !== undefined
        ? toNumber(normalizedUpdates.amount)
        : toNumber(oldExpense?.amount);

    if (nextWalletId) {
      await updateWalletBalance(nextWalletId, -nextAmount);
    }

    const linkedTxn = walletTransactions.find(
      (transaction) =>
        String(transaction?.expense_id || "") === String(id) ||
        (String(transaction?.type || "").toLowerCase() === "expense" &&
          String(transaction?.wallet_id || "") ===
            String(oldExpense?.wallet_id || "") &&
          toNumber(transaction?.amount) === toNumber(oldExpense?.amount))
    );

    const transactionPayload = {
      wallet_id: nextWalletId,
      amount: nextAmount,
      category: normalizedUpdates.category ?? oldExpense?.category,
      need_type: normalizedUpdates.need_type ?? oldExpense?.need_type,
      planning_status: nextPlanningStatus,
      unplanned_reason:
        nextPlanningStatus === "unplanned"
          ? normalizedUpdates.unplanned_reason ?? oldExpense?.unplanned_reason
          : null,
      notes: normalizedUpdates.notes ?? oldExpense?.notes ?? "",
      updated_at: new Date().toISOString(),
    };

    if (linkedTxn?.id) {
      const { error: transactionError } = await supabase
        .from("wallet_transactions")
        .update(transactionPayload)
        .eq("id", linkedTxn.id);

      if (transactionError) throw transactionError;
    } else if (nextWalletId) {
      await insertWalletTransaction({
        ...transactionPayload,
        type: "expense",
        expense_id: id,
        created_at:
          normalizedUpdates.date || oldExpense?.date || new Date().toISOString(),
      });
    }

    await loadAll();
  };

  const deleteExpense = async (id) => {
    const expense = expenses.find((item) => String(item.id) === String(id));

    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) throw error;

    if (expense?.wallet_id) {
      await updateWalletBalance(expense.wallet_id, toNumber(expense.amount));
    }

    const linkedTxn = walletTransactions.find(
      (transaction) =>
        String(transaction?.expense_id || "") === String(id) ||
        (String(transaction?.type || "").toLowerCase() === "expense" &&
          String(transaction?.wallet_id || "") ===
            String(expense?.wallet_id || "") &&
          toNumber(transaction?.amount) === toNumber(expense?.amount))
    );

    if (linkedTxn?.id) {
      const { error: transactionError } = await supabase
        .from("wallet_transactions")
        .delete()
        .eq("id", linkedTxn.id);

      if (transactionError) throw transactionError;
    }

    await loadAll();
  };

  const addWallet = async (wallet) => {
    const starting = toNumber(wallet.balance ?? wallet.starting_balance ?? 0);

    const { error } = await supabase.from("wallets").insert([
      {
        ...wallet,
        balance: starting,
        starting_balance: starting,
        user_id: user?.id || null,
        user_email: user?.email || null,
        created_by: user?.email || null,
      },
    ]);

    if (error) throw error;
    await loadAll();
  };

  const updateWallet = async (id, updates) => {
    const normalizedUpdates = { ...updates };

    if (updates.balance !== undefined) {
      normalizedUpdates.balance = toNumber(updates.balance);
    }

    if (updates.starting_balance !== undefined) {
      normalizedUpdates.starting_balance = toNumber(updates.starting_balance);
    }

    const { error } = await supabase
      .from("wallets")
      .update(normalizedUpdates)
      .eq("id", id);

    if (error) throw error;
    await loadAll();
  };

  const deleteWallet = async (id) => {
    const { error } = await supabase.from("wallets").delete().eq("id", id);
    if (error) throw error;

    await loadAll();
  };

  const reorderWallets = async (orderedWalletIds) => {
    const walletIds = Array.isArray(orderedWalletIds) ? orderedWalletIds : [];
    if (!walletIds.length) return;

    const results = await Promise.all(
      walletIds.map((walletId, index) =>
        supabase
          .from("wallets")
          .update({ sort_order: index, updated_at: new Date().toISOString() })
          .eq("id", String(walletId))
      )
    );

    const failed = results.find((result) => result?.error);
    if (failed?.error) throw failed.error;

    await loadAll();
  };

  const addIncome = async (income) => {
    const amount = toNumber(income.amount);

    if (income.wallet_id) {
      await updateWalletBalance(income.wallet_id, amount);
      await insertWalletTransaction({
        wallet_id: income.wallet_id,
        amount,
        type: "income",
        source_type: income.source_type || income.source,
        tag: income.tag,
        notes: income.notes,
        created_at: getSafeDate(income.date),
      });
    }

    await loadAll();
  };

  const transferBetweenWallets = async ({
    from_wallet_id,
    to_wallet_id,
    amount,
    notes = "",
  }) => {
    const parsedAmount = toNumber(amount);
    const fromWallet = wallets.find(
      (wallet) => String(wallet.id) === String(from_wallet_id)
    );
    const toWallet = wallets.find(
      (wallet) => String(wallet.id) === String(to_wallet_id)
    );

    if (!fromWallet || !toWallet) throw new Error("Wallet not found.");
    if (String(fromWallet.id) === String(toWallet.id)) {
      throw new Error("Source and destination wallets must be different.");
    }
    if (parsedAmount <= 0) throw new Error("Enter a valid transfer amount.");

    const fromBalance = toNumber(fromWallet.balance ?? fromWallet.current_balance);
    if (fromBalance < parsedAmount) {
      throw new Error("Insufficient balance in source wallet.");
    }

    const transferGroupId = generateId();

    await insertWalletTransaction({
      wallet_id: fromWallet.id,
      amount: parsedAmount,
      type: "transfer_out",
      transfer_group_id: transferGroupId,
      related_wallet_id: toWallet.id,
      notes,
    });

    await insertWalletTransaction({
      wallet_id: toWallet.id,
      amount: parsedAmount,
      type: "transfer_in",
      transfer_group_id: transferGroupId,
      related_wallet_id: fromWallet.id,
      notes,
    });

    await loadAll();
  };

  const saveBudget = async ({
    id = null,
    totalBudget,
    needsPct,
    wantsPct,
    otherPct,
    month = getMonthKey(),
    trackingStartDate = null,
  }) => {
    const total = toNumber(totalBudget);
    const needs = toNumber(needsPct);
    const wants = toNumber(wantsPct);
    const other = toNumber(otherPct);

    if (total <= 0) throw new Error("Please enter a valid total budget.");
    if (needs + wants + other !== 100) {
      throw new Error("Needs, Wants, and Other must total exactly 100%.");
    }

    const now = new Date().toISOString();
    const payload = {
      is_active: true,
      status: "active",
      month,
      total_budget: total,
      needs_pct: needs,
      wants_pct: wants,
      other_pct: other,
      needs_percent: needs,
      wants_percent: wants,
      other_percent: other,
      savings_pct: other,
      savings_percent: other,
      updated_at: now,
    };

    if (user?.id || user?.email) {
      await supabase
        .from("budgets")
        .update({ is_active: false, status: "inactive", updated_at: now })
        .or(
          [
            user?.id ? `user_id.eq.${user.id}` : null,
            user?.email ? `user_email.eq.${user.email}` : null,
            user?.email ? `email.eq.${user.email}` : null,
            user?.email ? `created_by.eq.${user.email}` : null,
          ]
            .filter(Boolean)
            .join(",")
        );
    }

    if (id) {
      const { error } = await supabase
        .from("budgets")
        .update(payload)
        .eq("id", String(id));
      if (error) throw error;
    } else {
      const { error } = await supabase.from("budgets").insert([
        {
          ...payload,
          tracking_start_date: trackingStartDate || now,
          range_start: trackingStartDate || now,
          created_at: now,
          created_by: user?.email || null,
          email: user?.email || null,
          user_id: user?.id || null,
        },
      ]);
      if (error) throw error;
    }

    await loadAll();
  };

  const resetBudgetTracking = async (id, timestamp = new Date().toISOString()) => {
    const { error } = await supabase
      .from("budgets")
      .update({
        tracking_start_date: timestamp,
        range_start: timestamp,
        updated_at: timestamp,
      })
      .eq("id", String(id));

    if (error) throw error;
    await loadAll();
  };

  const deleteBudget = async (id) => {
    const { error } = await supabase.from("budgets").delete().eq("id", String(id));
    if (error) throw error;
    await loadAll();
  };

  const saveSavingsGoal = async (goal) => {
    const targetAmount = toNumber(goal?.target_amount ?? goal?.targetAmount);
    const savedAmount = Math.max(
      0,
      toNumber(
        goal?.saved_amount ?? goal?.current_amount ?? goal?.saved ?? goal?.amount
      )
    );
    const reasons = Array.isArray(goal?.reasons)
      ? goal.reasons
      : [goal?.reason_one, goal?.reason_two, goal?.reason_three].filter(Boolean);

    const payload = {
      title: String(goal?.title || "").trim(),
      category: goal?.category || "",
      subcategory: goal?.subcategory || "",
      target_amount: targetAmount,
      saved_amount: savedAmount,
      current_amount: savedAmount,
      planned_use_date: goal?.planned_use_date || goal?.plannedUseDate || null,
      deadline: goal?.planned_use_date || goal?.plannedUseDate || null,
      reasons: reasons.length ? reasons : ["", "", ""],
      reason_one: goal?.reason_one ?? reasons?.[0] ?? "",
      reason_two: goal?.reason_two ?? reasons?.[1] ?? "",
      reason_three: goal?.reason_three ?? reasons?.[2] ?? "",
      emotional_value: goal?.emotional_value || goal?.emotionalValue || "joy",
      flexibility: goal?.flexibility || "flexible",
      priority: goal?.priority || "medium",
      notes: goal?.notes || "",
      wallet_id: goal?.wallet_id || goal?.walletId || null,
      created_by: user?.email || null,
      user_email: user?.email || null,
      user_id: user?.id || null,
      updated_date: new Date().toISOString(),
    };

    if (!payload.title) throw new Error("Please enter a goal title.");
    if (payload.target_amount <= 0) {
      throw new Error("Please enter a valid target amount.");
    }

    if (goal?.id) {
      const { error } = await supabase
        .from("savings_goals")
        .update(payload)
        .eq("id", String(goal.id));
      if (error) throw error;
    } else {
      const { error } = await supabase.from("savings_goals").insert([
        {
          id: goal?.id || `goal_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          ...payload,
          created_date: new Date().toISOString(),
        },
      ]);
      if (error) throw error;
    }

    await loadAll();
  };

  const deleteSavingsGoal = async (id) => {
    const { error } = await supabase
      .from("savings_goals")
      .delete()
      .eq("id", String(id));

    if (error) throw error;
    await loadAll();
  };

  const addSavingsToGoal = async ({ goalId, walletId, amount, notes = "" }) => {
    const goal = savingsGoals.find((item) => String(item.id) === String(goalId));
    const sourceWallet = wallets.find(
      (wallet) => String(wallet.id) === String(walletId)
    );
    const parsedAmount = toNumber(amount);

    if (!goal) throw new Error("Savings goal not found.");
    if (!sourceWallet) throw new Error("Source wallet not found.");
    if (parsedAmount <= 0) throw new Error("Please enter a valid amount.");

    const currentSaved = toNumber(goal?.saved_amount ?? goal?.current_amount);
    const target = toNumber(goal?.target_amount);
    const remaining = Math.max(target - currentSaved, 0);

    if (remaining <= 0) throw new Error("This goal is already fully funded.");

    const finalAmount = Math.min(parsedAmount, remaining);

    if (toNumber(sourceWallet?.balance) < finalAmount) {
      throw new Error("Not enough balance in the selected wallet.");
    }

    await insertWalletTransaction({
      wallet_id: sourceWallet.id,
      amount: finalAmount,
      type: "savings_goal",
      notes: notes || `Moved to savings goal: ${goal.title || "Savings Goal"}`,
    });

    const { error } = await supabase
      .from("savings_goals")
      .update({
        saved_amount: Math.min(currentSaved + finalAmount, target),
        current_amount: Math.min(currentSaved + finalAmount, target),
        wallet_id: sourceWallet.id,
        updated_date: new Date().toISOString(),
      })
      .eq("id", String(goal.id));

    if (error) throw error;
    await loadAll();
  };

  const updateSurvivalExpense = async (amount) => {
    const nextAmount = Math.max(0, toNumber(amount));

    if (!user?.id) {
      throw new Error("User not found.");
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        monthly_survival_expense: nextAmount,
        survival_setup_done: nextAmount > 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) throw error;
    await loadAll();
  };

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, expense) => sum + toNumber(expense.amount), 0),
    [expenses]
  );

  const totalIncome = useMemo(() => {
    return walletTransactions
      .filter((transaction) => {
        const type = String(transaction?.type || "").trim().toLowerCase();
        return type === "income" || type === "add";
      })
      .reduce((sum, transaction) => sum + toNumber(transaction.amount), 0);
  }, [walletTransactions]);

  const totalWalletBalance = useMemo(
    () =>
      wallets.reduce((sum, wallet) => {
        const value =
          wallet.balance ??
          wallet.current_balance ??
          wallet.wallet_balance ??
          wallet.starting_balance ??
          0;

        return sum + toNumber(value);
      }, 0),
    [wallets]
  );

  return {
    loading,
    expenses,
    incomes,
    wallets,
    budgets,
    walletTransactions,
    transfers,
    savingsGoals,
    profile,
    survivalExpense,
    retentionRate,
    totalExpenses,
    totalIncome,
    totalWalletBalance,
    refreshData,
    addExpense,
    updateExpense,
    deleteExpense,
    addWallet,
    updateWallet,
    deleteWallet,
    reorderWallets,
    addIncome,
    transferBetweenWallets,
    saveBudget,
    resetBudgetTracking,
    deleteBudget,
    saveSavingsGoal,
    deleteSavingsGoal,
    addSavingsToGoal,
    updateSurvivalExpense,
  };
}

export function getBudgetRemaining(budget = 0, spent = 0) {
  return Number(budget) - Number(spent);
}

export function formatMoney(value = 0) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(Number(value)) ? Number(value) : 0);
}

export function getMoneyLeft(totalMoney = 0, totalExpenses = 0) {
  return Number(totalMoney) - Number(totalExpenses);
}
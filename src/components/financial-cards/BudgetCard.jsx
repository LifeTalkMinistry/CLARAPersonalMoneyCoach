import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import FinancialCardShell from "./FinancialCardShell";
import FinancialFocusPanel from "./FinancialFocusPanel";

function money(v) {
  return `₱${Number(v || 0).toLocaleString()}`;
}

function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function currentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function BudgetBuilderPanel({ open, mode, initialTotal, initialCategories, onClose, onSave }) {
  const [declaredAmount, setDeclaredAmount] = useState(String(initialTotal || ""));
  const [categoryName, setCategoryName] = useState("");
  const [categoryAmount, setCategoryAmount] = useState("");
  const [categories, setCategories] = useState(initialCategories || []);

  if (!open) return null;

  const declared = toNumber(declaredAmount);
  const allocated = categories.reduce((sum, item) => sum + toNumber(item.allocated), 0);
  const unallocated = Math.max(declared - allocated, 0);

  const addCategory = () => {
    const name = categoryName.trim();
    const amount = toNumber(categoryAmount);
    if (!name || amount <= 0) return;

    setCategories((items) => [
      ...items,
      {
        id: `${Date.now()}-${name}`,
        category: name,
        allocated: amount,
        spent: 0,
      },
    ]);
    setCategoryName("");
    setCategoryAmount("");
  };

  const removeCategory = (id) => {
    setCategories((items) => items.filter((item) => item.id !== id));
  };

  const saveBudget = () => {
    onSave({
      month: currentMonthKey(),
      total: declared,
      categories,
    });
    onClose();
  };

  const panel = (
    <div className="fixed inset-0 z-[10000] flex items-end justify-center px-3 pb-3 pt-10 sm:items-center sm:p-5">
      <button type="button" onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <section className="relative w-full max-w-md overflow-hidden rounded-[30px] border border-white/10 bg-[#08111c]/95 text-white">
        <div className="relative border-b border-white/10 px-5 pb-4 pt-4">
          <h2 className="text-xl font-semibold">{mode === "create" ? "Create Budget" : "Manage Budget"}</h2>
        </div>
        <div className="relative px-5 py-5">
          <input type="number" value={declaredAmount} onChange={(e) => setDeclaredAmount(e.target.value)} />
          <button onClick={addCategory}>Add</button>
          {categories.map((item) => (
            <div key={item.id}>{item.category} - {money(item.allocated)}</div>
          ))}
          <button onClick={saveBudget}>Save</button>
        </div>
      </section>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(panel, document.body) : panel;
}

export default function BudgetCard({ data, onSaveBudget }) {
  const [builderOpen, setBuilderOpen] = useState(false);
  const source = data || {};

  const total = source?.total || 0;
  const spent = source?.spent || 0;
  const categories = Array.isArray(source?.categories) ? source.categories : [];

  const progress = useMemo(() => {
    if (!total) return 0;
    return Math.min((spent / total) * 100, 100);
  }, [total, spent]);

  const handleSaveBudget = async (nextBudget) => {
    await onSaveBudget(nextBudget);
  };

  return (
    <>
      <FinancialCardShell
        eyebrow="Budget"
        title="Monthly Plan"
        hero={money(total)}
        heroSubtext={`${money(total - spent)} left`}
        progress={progress}
      >
        <button onClick={() => setBuilderOpen(true)}>Show details</button>
      </FinancialCardShell>

      <BudgetBuilderPanel
        open={builderOpen}
        mode={total ? "manage" : "create"}
        initialTotal={total}
        initialCategories={categories}
        onClose={() => setBuilderOpen(false)}
        onSave={handleSaveBudget}
      />
    </>
  );
}

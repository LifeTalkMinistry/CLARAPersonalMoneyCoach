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
      <button
        type="button"
        aria-label="Close budget builder"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <section className="relative w-full max-w-md overflow-hidden rounded-[30px] border border-white/10 bg-[#08111c]/95 text-white shadow-[0_24px_90px_rgba(0,0,0,0.75)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(45,212,191,0.16),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(59,130,246,0.14),transparent_32%)]" />

        <div className="relative border-b border-white/10 px-5 pb-4 pt-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">
            Monthly Spending Plan
          </p>
          <div className="mt-2 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                {mode === "create" ? "Create Budget" : "Manage Budget"}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-white/45">
                Declare your spending amount, then distribute it into categories.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-white/70"
            >
              Close
            </button>
          </div>
        </div>

        <div className="relative max-h-[72vh] overflow-y-auto px-5 py-5">
          <label className="block rounded-[22px] border border-white/10 bg-white/[0.045] px-4 py-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
              Declared monthly amount
            </span>
            <input
              type="number"
              min="0"
              value={declaredAmount}
              onChange={(event) => setDeclaredAmount(event.target.value)}
              placeholder="0"
              className="mt-2 w-full bg-transparent text-3xl font-semibold text-white outline-none placeholder:text-white/20"
            />
          </label>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-[20px] border border-emerald-400/20 bg-emerald-400/10 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-100/60">
                Unallocated
              </p>
              <p className="mt-2 text-lg font-semibold text-emerald-100">{money(unallocated)}</p>
            </div>
            <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
                Allocated
              </p>
              <p className="mt-2 text-lg font-semibold text-white">{money(allocated)}</p>
            </div>
          </div>

          <div className="mt-4 rounded-[24px] border border-white/10 bg-black/15 p-4">
            <p className="text-sm font-semibold text-white">Add category</p>
            <div className="mt-3 grid grid-cols-[1fr_110px] gap-2">
              <input
                type="text"
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                placeholder="Food"
                className="rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-3 text-sm text-white outline-none placeholder:text-white/25"
              />
              <input
                type="number"
                min="0"
                value={categoryAmount}
                onChange={(event) => setCategoryAmount(event.target.value)}
                placeholder="0"
                className="rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-3 text-sm text-white outline-none placeholder:text-white/25"
              />
            </div>
            <button
              type="button"
              onClick={addCategory}
              className="mt-3 w-full rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/15"
            >
              + Add Category
            </button>
          </div>

          {categories.length > 0 && (
            <div className="mt-4 space-y-2">
              {categories.map((item) => (
                <div
                  key={item.id || item.category}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{item.category}</p>
                    <p className="mt-0.5 text-xs text-white/45">{money(item.allocated)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCategory(item.id)}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-white/50"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={saveBudget}
            className="mt-5 w-full rounded-[22px] border border-emerald-300/25 bg-emerald-400/15 px-4 py-4 text-sm font-bold text-emerald-50 shadow-[0_0_24px_rgba(52,211,153,0.12)] transition hover:bg-emerald-400/20"
          >
            {mode === "create" ? "Create Budget" : "Save Budget"}
          </button>
        </div>
      </section>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(panel, document.body) : panel;
}

export default function BudgetCard({
  data,
  onAdjustBudget,
  onReallocate,
  onCreateBudget,
  onManageBudget,
}) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [builderMode, setBuilderMode] = useState("create");
  const [localBudget, setLocalBudget] = useState(null);

  const source = localBudget || data || {};

  const total = source?.total || 0;
  const spent = source?.spent || 0;
  const totalExpenses = source?.totalExpenses ?? spent;
  const unplanned = source?.unplannedSpent || 0;
  const categories = Array.isArray(source?.categories) ? source.categories : [];

  const allocated = categories.reduce(
    (sum, item) => sum + toNumber(item?.allocated ?? item?.allocated_amount ?? item?.amount),
    0
  );

  const unallocated = Math.max(total - allocated, 0);
  const remaining = Math.max(total - spent, 0);
  const undocumented = Math.max(totalExpenses - spent - unplanned, 0);

  const progress = useMemo(() => {
    if (!total) return 0;
    return Math.min((spent / total) * 100, 100);
  }, [total, spent]);

  const status = progress < 50 ? "On Track" : progress < 80 ? "Caution" : "Critical";

  const progressClassName =
    progress < 50
      ? "from-emerald-300 to-emerald-500"
      : progress < 80
      ? "from-amber-300 to-amber-500"
      : "from-rose-300 to-rose-500";

  const panelProgressClassName =
    progress < 50 ? "bg-emerald-400" : progress < 80 ? "bg-amber-400" : "bg-rose-400";

  const badgeClassName =
    progress < 50 ? "text-emerald-400" : progress < 80 ? "text-amber-400" : "text-rose-400";

  const insight =
    total === 0
      ? "No plan yet. Start your monthly budget to stay in control."
      : unplanned > 0
      ? `${money(unplanned)} is unplanned. Consider adding categories.`
      : progress < 50
      ? "You're within a healthy range."
      : progress < 80
      ? "You're approaching your limit."
      : "Budget is tight. Adjustments recommended.";

  const openBudgetBuilder = (mode = total ? "manage" : "create") => {
    if (mode === "create" && onCreateBudget) {
      onCreateBudget();
      return;
    }

    if (mode === "manage" && onManageBudget) {
      onManageBudget();
      return;
    }

    if (onAdjustBudget) {
      onAdjustBudget();
      return;
    }

    setBuilderMode(mode);
    setBuilderOpen(true);
  };

  const handleCardClick = () => {
    if (total === 0) {
      openBudgetBuilder("create");
    }
  };

  const handleSaveBudget = (nextBudget) => {
    setLocalBudget({
      ...source,
      ...nextBudget,
      spent,
      totalExpenses,
      unplannedSpent: unplanned,
    });
  };

  const handleReallocate = () => {
    if (onReallocate) {
      onReallocate();
      return;
    }
    openBudgetBuilder("manage");
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        role={total === 0 ? "button" : undefined}
        tabIndex={total === 0 ? 0 : undefined}
        onKeyDown={(event) => {
          if (total === 0 && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            openBudgetBuilder("create");
          }
        }}
        className={`h-full w-full ${total === 0 ? "cursor-pointer" : ""} ${
          panelOpen ? "scale-[0.98] opacity-80 transition duration-300" : "transition duration-300"
        }`}
      >
        <FinancialCardShell
          eyebrow="Budget"
          title="Monthly Plan"
          icon="₱"
          badge={total ? status : "No Plan"}
          hero={money(total)}
          heroSubtext={total ? `${money(remaining)} left` : "No plan"}
          progress={progress}
          progressClassName={progressClassName}
          insight={insight}
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setPanelOpen(true);
            }}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm text-white/70 transition duration-300 hover:bg-white/[0.06] hover:text-white"
          >
            <span className="font-medium">Show details</span>
            <span className="text-lg leading-none text-white/60" aria-hidden>
              ⌄
            </span>
          </button>
        </FinancialCardShell>
      </div>

      <FinancialFocusPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        eyebrow="Budget"
        title="Monthly Plan"
        primaryLabel={total ? "Remaining" : "No Plan"}
        primaryValue={money(remaining)}
        badge={total ? status : "No Plan"}
        badgeClassName={badgeClassName}
        progress={progress}
        progressClassName={panelProgressClassName}
        insight={insight}
        actions={[
          {
            label: total ? "Manage Budget" : "Start Budgeting",
            description: total
              ? "Edit your monthly spending plan"
              : "Create this month's spending plan",
            onClick: () => openBudgetBuilder(total ? "manage" : "create"),
          },
          {
            label: total ? "Reallocate" : "Create Budget",
            description: total ? "Move money between categories" : "Declare amount and categories",
            onClick: total ? handleReallocate : () => openBudgetBuilder("create"),
          },
        ]}
        details={[
          { label: "Declared", value: money(total) },
          { label: "Spent", value: money(spent) },
          { label: "Remaining", value: money(remaining) },
          { label: "Categories", value: String(categories.length) },
          { label: "Unallocated", value: money(unallocated) },
          { label: "Allocated", value: money(allocated) },
          { label: "Unplanned", value: money(unplanned) },
          { label: "Undocumented", value: money(undocumented) },
        ]}
        footer="Budget buttons are now interactive. The local builder works immediately, and external handlers can connect this to the offline finance store later."
      />

      <BudgetBuilderPanel
        open={builderOpen}
        mode={builderMode}
        initialTotal={total}
        initialCategories={categories}
        onClose={() => setBuilderOpen(false)}
        onSave={handleSaveBudget}
      />
    </>
  );
}

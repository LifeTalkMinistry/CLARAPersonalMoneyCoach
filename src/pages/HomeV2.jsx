import { Plus, Wallet, Eye, TrendingUp, ShieldCheck } from "lucide-react";
import ClaraPageShell from "../components/shared/layout/ClaraPageShell";
import useFinancialData from "../hooks/useFinancialData";

function peso(value = 0) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function SurfaceCard({ children, className = "" }) {
  return (
    <section
      className={`relative overflow-hidden rounded-[30px] border px-5 py-5 ${className}`}
      style={{
        borderColor: "rgba(255,255,255,0.105)",
        background:
          "linear-gradient(145deg, rgba(18,30,35,0.94), rgba(7,16,22,0.95) 54%, rgba(4,12,18,0.98))",
        boxShadow:
          "0 26px 64px rgba(0,0,0,0.52), inset 0 1px 0 rgba(255,255,255,0.055)",
      }}
    >
      {children}
    </section>
  );
}

export default function HomeV2() {
  const { wallets, expenses, budgets, savingsGoals, loading } = useFinancialData();

  const totalWallets = Array.isArray(wallets)
    ? wallets.reduce((sum, wallet) => sum + (Number(wallet?.balance ?? wallet?.current_balance ?? 0) || 0), 0)
    : 0;

  const totalExpenses = Array.isArray(expenses)
    ? expenses.reduce((sum, expense) => sum + (Number(expense?.amount) || 0), 0)
    : 0;

  const budgetTotal = Number(budgets?.total || 0);
  const moneyLeft = totalWallets - totalExpenses;
  const savingsTotal = Array.isArray(savingsGoals)
    ? savingsGoals.reduce((sum, goal) => sum + (Number(goal?.saved_amount) || 0), 0)
    : 0;

  return (
    <ClaraPageShell compactHeader>
      <div className="min-h-[100dvh] overflow-y-auto px-3 pb-[calc(78px+env(safe-area-inset-bottom))]">
        <div className="flex flex-col gap-4">
          <section className="px-1 pt-1">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/38">
              Home 2 Preview
            </p>
            <h1 className="mt-2 text-[28px] font-black leading-none tracking-[-0.055em] text-white">
              Rebuilding CLARA
            </h1>
            <p className="mt-2 max-w-[300px] text-sm font-medium leading-relaxed text-white/45">
              A cleaner dashboard foundation with calmer hierarchy and stronger card depth.
            </p>
          </section>

          <SurfaceCard className="min-h-[168px]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.26em] text-white/38">
                  Money Left
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <h2 className="text-[38px] font-black leading-none tracking-[-0.07em] text-white">
                    {loading ? "—" : peso(moneyLeft)}
                  </h2>
                  <span className="rounded-full border border-white/10 bg-white/[0.045] p-1 text-white/45">
                    <Eye size={13} />
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold text-white/42">
                  Your main decision number for today.
                </p>
              </div>

              <button className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white shadow-[0_16px_36px_rgba(0,0,0,0.32)] active:scale-95">
                <Plus size={22} />
              </button>
            </div>
          </SurfaceCard>

          <div className="grid grid-cols-2 gap-3">
            <SurfaceCard className="min-h-[122px] rounded-[26px] px-4 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] text-[var(--clara-accent-text)]">
                <Wallet size={17} />
              </div>
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.24em] text-white/34">
                Wallets
              </p>
              <p className="mt-1 text-xl font-black tracking-[-0.04em] text-white">
                {loading ? "—" : peso(totalWallets)}
              </p>
            </SurfaceCard>

            <SurfaceCard className="min-h-[122px] rounded-[26px] px-4 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] text-[var(--clara-accent-text)]">
                <TrendingUp size={17} />
              </div>
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.24em] text-white/34">
                Budget
              </p>
              <p className="mt-1 text-xl font-black tracking-[-0.04em] text-white">
                {loading ? "—" : peso(budgetTotal)}
              </p>
            </SurfaceCard>
          </div>

          <SurfaceCard>
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] border border-white/10 bg-white/[0.055] text-[var(--clara-accent-text)]">
                  <ShieldCheck size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/34">
                    Safety Net
                  </p>
                  <h2 className="mt-1 truncate text-lg font-bold tracking-[-0.03em] text-white">
                    Emergency + Savings
                  </h2>
                </div>
              </div>
              <p className="shrink-0 text-xl font-black tracking-[-0.04em] text-white">
                {loading ? "—" : peso(savingsTotal)}
              </p>
            </div>
          </SurfaceCard>
        </div>
      </div>
    </ClaraPageShell>
  );
}

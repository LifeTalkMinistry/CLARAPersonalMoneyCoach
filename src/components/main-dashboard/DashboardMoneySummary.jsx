import { ArrowDownRight, Eye, EyeOff, Sparkles } from "lucide-react";
import { formatMoney } from "../../lib/dashboard/financeUtils";

export default function DashboardMoneySummary({
  moneyLeft = 0,
  totalExpenses = 0,
  moneyVisible = true,
  onToggleMoneyVisible,
}) {
  const safeMoneyLeft = Number.isFinite(Number(moneyLeft))
    ? Number(moneyLeft)
    : 0;
  const safeTotalExpenses = Number.isFinite(Number(totalExpenses))
    ? Number(totalExpenses)
    : 0;

  const totalActivity = Math.max(safeMoneyLeft + safeTotalExpenses, 0);
  const expenseRatio =
    totalActivity > 0 ? safeTotalExpenses / totalActivity : 0;
  const progressPercent = Math.min(Math.max(expenseRatio * 100, 0), 100);

  const hasNegativeBalance = safeMoneyLeft < 0;

  let status = "Stable";
  let statusText = "You’re still in a safe range.";
  let statusClass = "text-sky-200";
  let statusDotClass = "bg-sky-300 shadow-[0_0_14px_rgba(125,211,252,0.75)]";
  let progressClass = "from-sky-300 via-cyan-300 to-emerald-300";
  let glowClass = "bg-cyan-400/18";

  if (expenseRatio < 0.45 && !hasNegativeBalance) {
    status = "On Track";
    statusText = "Your money position looks healthy right now.";
    statusClass = "text-emerald-200";
    statusDotClass =
      "bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.75)]";
    progressClass = "from-emerald-300 via-cyan-300 to-sky-300";
    glowClass = "bg-emerald-400/18";
  } else if (expenseRatio >= 0.45 && expenseRatio < 0.75 && !hasNegativeBalance) {
    status = "Be Careful";
    statusText = "You’ve used a big part of your available money.";
    statusClass = "text-amber-200";
    statusDotClass =
      "bg-amber-300 shadow-[0_0_14px_rgba(252,211,77,0.75)]";
    progressClass = "from-amber-300 via-orange-300 to-rose-300";
    glowClass = "bg-amber-400/18";
  } else if (expenseRatio >= 0.75 || hasNegativeBalance) {
    status = "Overspending";
    statusText = hasNegativeBalance
      ? "You’re past your current money position. Slow down first."
      : "Spending is getting close to your limit.";
    statusClass = "text-rose-200";
    statusDotClass =
      "bg-rose-300 shadow-[0_0_14px_rgba(253,164,175,0.75)]";
    progressClass = "from-rose-300 via-orange-300 to-amber-300";
    glowClass = "bg-rose-400/18";
  }

  const displayMoneyLeft = moneyVisible ? formatMoney(safeMoneyLeft) : "₱••••";
  const displayExpenses = moneyVisible ? formatMoney(safeTotalExpenses) : "₱••••";

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/[0.12] bg-[#081019]/92 px-4 py-4 shadow-[0_22px_55px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
      {/* PREMIUM DEPTH */}
      <div className={`pointer-events-none absolute -left-16 -top-20 h-48 w-48 rounded-full ${glowClass} blur-3xl`} />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-44 w-44 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_10%,rgba(255,255,255,0.10),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.045),transparent_45%)]" />

      <div className="relative z-10 space-y-4">
        {/* STATUS */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${statusDotClass}`} />
              <p className={`text-[10px] font-black uppercase tracking-[0.24em] ${statusClass}`}>
                {status}
              </p>
            </div>

            <p className="mt-1.5 line-clamp-1 text-[11px] font-medium text-white/48">
              Financial state at a glance
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <Sparkles className="h-3 w-3 text-white/55" />
            Insight
          </div>
        </div>

        {/* HERO MONEY LEFT */}
        <div>
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/42">
                Money Left
              </p>

              <p className="mt-1 text-[34px] font-black leading-none tracking-[-0.06em] text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.12)]">
                {displayMoneyLeft}
              </p>
            </div>

            {onToggleMoneyVisible && (
              <button
                type="button"
                onClick={onToggleMoneyVisible}
                aria-label={moneyVisible ? "Hide money amounts" : "Show money amounts"}
                className="mb-1 rounded-full border border-white/10 bg-white/[0.065] p-2.5 text-white/65 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-300 hover:bg-white/[0.12] hover:text-white active:scale-95"
              >
                {moneyVisible ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2 text-[12px] text-white/58">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/[0.055] text-white/55">
              <ArrowDownRight className="h-3.5 w-3.5" />
            </span>
            <span>
              {displayExpenses} spent this month
            </span>
          </div>
        </div>

        {/* INTELLIGENCE LINE */}
        <div className="rounded-2xl border border-white/[0.09] bg-black/18 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.055)]">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold text-white/62">
              {statusText}
            </p>
            <p className="shrink-0 text-[10px] font-bold text-white/38">
              {Math.round(progressPercent)}%
            </p>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.075]">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${progressClass} shadow-[0_0_18px_rgba(255,255,255,0.18)] transition-all duration-700 ease-out`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

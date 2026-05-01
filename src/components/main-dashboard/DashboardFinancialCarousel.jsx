import { useState } from "react";
import {
  AlertTriangle,
  Banknote,
  ChevronDown,
  PiggyBank,
  Shield,
  TrendingUp,
  WalletCards,
} from "lucide-react";

function formatMoney(value = 0) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function CardShell({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative h-full w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#0b1118]/90 p-4 text-left shadow-[0_20px_55px_rgba(0,0,0,0.42)] backdrop-blur-2xl transition active:scale-[0.99]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(20,184,166,0.16),transparent_36%),radial-gradient(circle_at_90%_100%,rgba(168,85,247,0.12),transparent_36%)]" />
      <div className="relative">{children}</div>
    </button>
  );
}

function ProgressBar({ percent = 0 }) {
  return (
    <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-rose-400"
        style={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }}
      />
    </div>
  );
}

export default function DashboardFinancialCarousel({
  budgetData = {},
  emergencyFundData = {},
  savingsData = {},
  investmentData = {},
  debtData = {},
}) {
  const [activeModal, setActiveModal] = useState(null);

  const declaredBudget = Number(budgetData?.monthlyLimit || budgetData?.limit || budgetData?.amount || 1000);
  const spentBudget = Number(budgetData?.spent || declaredBudget || 0);
  const remainingBudget = Math.max(declaredBudget - spentBudget, 0);
  const budgetPercent = declaredBudget > 0 ? (spentBudget / declaredBudget) * 100 : 0;

  const cards = [
    {
      key: "budget",
      icon: Banknote,
      label: "Budget",
      title: "Monthly Plan",
      amount: remainingBudget,
      sub: "left",
      status: "Critical",
      note: "Budget is tight. Adjustments recommended.",
      percent: budgetPercent,
    },
    {
      key: "emergency",
      icon: Shield,
      label: "Emergency Fund",
      title: "Safety Buffer",
      amount: emergencyFundData?.saved || 0,
      sub: `of ${formatMoney(emergencyFundData?.target || 0)}`,
      status: "Active",
      note: "Build your protection fund gradually.",
      percent:
        emergencyFundData?.target > 0
          ? (emergencyFundData.saved / emergencyFundData.target) * 100
          : 0,
    },
    {
      key: "savings",
      icon: PiggyBank,
      label: "Saving Goal",
      title: "Progress",
      amount: savingsData?.saved || 0,
      sub: `of ${formatMoney(savingsData?.target || 0)}`,
      status: "Track",
      note: "Keep your goals visible.",
      percent:
        savingsData?.target > 0 ? (savingsData.saved / savingsData.target) * 100 : 0,
    },
    {
      key: "investment",
      icon: TrendingUp,
      label: "Investment Fund",
      title: "Portfolio",
      amount: investmentData?.value || 0,
      sub: "current value",
      status: "Soon",
      note: "Investment tracking preview.",
      percent: 0,
    },
    {
      key: "debt",
      icon: AlertTriangle,
      label: "Debt / Obligation",
      title: "Obligations",
      amount: debtData?.total || 0,
      sub: "remaining",
      status: "Monitor",
      note: "Track what you still need to clear.",
      percent: 0,
    },
  ];

  const activeCard = cards.find((card) => card.key === activeModal);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 clara-no-scrollbar">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.key}
                className="h-[clamp(200px,34svh,306px)] min-w-full snap-center"
              >
                <CardShell onClick={() => setActiveModal(card.key)}>
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] text-white/75">
                      <Icon size={18} />
                    </div>

                    <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-200">
                      {card.status}
                    </span>
                  </div>

                  <div className="mt-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-white/35">
                      {card.label}
                    </p>
                    <h3 className="mt-1 text-base font-bold text-white">
                      {card.title}
                    </h3>
                  </div>

                  <div className="mt-7">
                    <p className="text-3xl font-extrabold tracking-tight text-white">
                      {formatMoney(card.amount)}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-white/50">
                      {card.sub}
                    </p>
                  </div>

                  <ProgressBar percent={card.percent} />

                  <p className="mt-4 text-xs leading-relaxed text-white/50">
                    {card.note}
                  </p>

                  <div className="absolute inset-x-4 bottom-4 rounded-[20px] border border-white/10 bg-white/[0.045] px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">Show details</span>
                      <ChevronDown size={16} className="text-white/50" />
                    </div>
                  </div>
                </CardShell>
              </div>
            );
          })}
        </div>

        <div className="mt-1 flex justify-center gap-2">
          {cards.map((card, index) => (
            <span
              key={card.key}
              className={`h-2 rounded-full ${
                index === 0 ? "w-7 bg-emerald-400" : "w-2 bg-white/20"
              }`}
            />
          ))}
        </div>
      </section>

      {activeCard && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 px-4 backdrop-blur-xl">
          <div
            className="absolute inset-0"
            onClick={() => setActiveModal(null)}
            aria-hidden="true"
          />

          <section className="relative w-full max-w-[390px] overflow-hidden rounded-[32px] border border-white/10 bg-[#071017]/95 p-5 text-white shadow-[0_26px_90px_rgba(0,0,0,0.68)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(20,184,166,0.20),transparent_34%),radial-gradient(circle_at_90%_14%,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.13),transparent_38%)]" />

            <div className="relative mx-auto mb-4 h-[4px] w-11 rounded-full bg-white/20" />

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-emerald-200/60">
                  {activeCard.label}
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
                  {activeCard.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-2 text-xs font-bold text-white/85"
              >
                Close
              </button>
            </div>

            <div className="relative mt-8 rounded-[24px] border border-white/10 bg-white/[0.055] p-4">
              <p className="text-[11px] font-medium text-white/45">Remaining</p>
              <p className="mt-2 text-3xl font-extrabold tracking-tight text-white">
                {formatMoney(activeCard.amount)}
              </p>

              <ProgressBar percent={activeCard.percent} />

              <p className="mt-4 text-sm text-white/65">{activeCard.note}</p>
            </div>

            <div className="relative mt-4 rounded-[24px] border border-white/10 bg-black/15 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-white">Breakdown</p>
                <p className="text-xs font-bold text-rose-300">{activeCard.status}</p>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between text-white/55">
                  <span>Declared</span>
                  <strong className="text-white">{formatMoney(declaredBudget)}</strong>
                </div>

                <div className="flex justify-between text-white/55">
                  <span>Spent</span>
                  <strong className="text-white">{formatMoney(spentBudget)}</strong>
                </div>

                <div className="flex justify-between text-white/55">
                  <span>Remaining</span>
                  <strong className="text-white">{formatMoney(remainingBudget)}</strong>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

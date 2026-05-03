import { Play, Target, Camera, EyeOff, ChevronDown } from "lucide-react";
import TopNav from "../../../components/fresh/shared/topnav";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-[#041a22] px-4 py-4 text-white">
      <div className="mx-auto max-w-[390px] space-y-4">
        <TopNav />
        <Billboard />
        <SavingsGoalCard />
        <CarouselDots />
        <MoneySummary />
      </div>
    </main>
  );
}

function Billboard() {
  return (
    <section className="relative h-[112px] overflow-hidden rounded-[20px] border border-white/15 bg-black/30 shadow-[0_16px_45px_rgba(0,0,0,0.35)]">
      <img
        src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop"
        alt="CLARA billboard"
        className="h-full w-full object-cover opacity-65"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
      <div className="absolute left-4 top-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/65">Try your</p>
        <h2 className="mt-1 text-lg font-black leading-none text-white">ADS</h2>
        <p className="mt-1 text-xs font-bold text-white">Now!</p>
      </div>
      <button type="button" className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl bg-black/35 text-emerald-300 backdrop-blur-md">
        <Play className="h-5 w-5 fill-emerald-300" />
      </button>
    </section>
  );
}

function SavingsGoalCard() {
  return (
    <section className="rounded-[24px] border border-cyan-400/60 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.22),transparent_38%),linear-gradient(135deg,#081b3f,#151942_55%,#3b0d20)] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.42)]">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400/10 text-emerald-300">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold">Savings Goals</h3>
            <p className="mt-1 max-w-[190px] text-xs font-semibold leading-tight text-white/70">Build dedicated money for what matters next</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/45">
            <Camera className="h-4 w-4" />
          </button>
          <span className="rounded-full bg-cyan-400/20 px-3 py-1 text-[10px] font-bold text-cyan-200">No Goals</span>
        </div>
      </div>
      <div className="mt-5">
        <p className="text-4xl font-black text-cyan-300">₱0</p>
        <p className="mt-4 text-sm font-bold leading-snug text-white">Start one goal so your extra money gets a clear destination.</p>
        <p className="mt-1 text-xs font-semibold text-white/55">Target: ₱0</p>
      </div>
      <div className="mt-4">
        <div className="mb-2 flex justify-between text-xs font-bold text-white/75"><span>Overall progress</span><span>0%</span></div>
        <div className="h-2 rounded-full bg-white/10"><div className="h-full w-0 rounded-full bg-cyan-300" /></div>
        <div className="mt-2 flex justify-between text-xs font-bold text-white/55"><span>₱0</span><span>₱0</span></div>
      </div>
      <button type="button" className="mt-4 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-bold text-white/85">
        Show details <ChevronDown className="h-4 w-4" />
      </button>
    </section>
  );
}

function CarouselDots() {
  return (
    <div className="flex justify-center gap-1.5 py-1">
      <span className="h-2 w-2 rounded-full bg-white/20" />
      <span className="h-2 w-2 rounded-full bg-white/25" />
      <span className="h-2 w-5 rounded-full bg-emerald-400" />
      <span className="h-2 w-2 rounded-full bg-white/25" />
      <span className="h-2 w-2 rounded-full bg-white/20" />
    </div>
  );
}

function MoneySummary() {
  return (
    <section className="grid grid-cols-2 overflow-hidden rounded-[22px] border border-cyan-400/60 bg-white/[0.04] shadow-[0_20px_60px_rgba(0,0,0,0.38)]">
      <SummaryCard label="Total Money Left" amount="₱••••••" />
      <SummaryCard label="Total Expense" amount="₱•••••" rightIcon={<EyeOff className="h-4 w-4" />} />
    </section>
  );
}

function SummaryCard({ label, amount, rightIcon }) {
  return (
    <div className="relative min-h-[96px] border-r border-cyan-300/40 bg-[linear-gradient(135deg,rgba(37,99,235,0.35),rgba(168,85,247,0.18),rgba(244,63,94,0.22))] p-4 last:border-r-0">
      {rightIcon ? <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/35">{rightIcon}</div> : null}
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/55">{label}</p>
      <p className="mt-4 text-3xl font-black tracking-tight text-white">{amount}</p>
    </div>
  );
}

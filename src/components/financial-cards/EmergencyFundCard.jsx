import { useMemo, useState } from "react";

export default function EmergencyFundCard({
  currentAmount = 0,
  targetAmount = 0,
  onAddFunds,
  onSetTarget,
}) {
  const [panelOpen, setPanelOpen] = useState(false);

  const progress = useMemo(() => {
    if (!targetAmount) return 0;
    return Math.min((currentAmount / targetAmount) * 100, 100);
  }, [currentAmount, targetAmount]);

  const remainingAmount = Math.max(targetAmount - currentAmount, 0);

  const statusColor =
    progress < 40
      ? "text-rose-400"
      : progress < 75
      ? "text-amber-400"
      : "text-emerald-400";

  const barColor =
    progress < 40
      ? "bg-rose-400"
      : progress < 75
      ? "bg-amber-400"
      : "bg-emerald-400";

  const detailTone =
    progress < 40
      ? "Building phase"
      : progress < 75
      ? "Steady phase"
      : "Protection phase";

  const insight =
    progress < 40
      ? "You're still building your safety net. Focus on consistency."
      : progress < 75
      ? "Good progress. Keep pushing toward full protection."
      : "Strong position. You're close to full emergency readiness.";

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_0_30px_rgba(0,0,0,0.3)] backdrop-blur-xl transition duration-300 ${
          panelOpen ? "scale-[0.98] opacity-80" : "scale-100 opacity-100"
        }`}
      >
        {/* OVERVIEW */}
        <div className="mb-3 flex items-start justify-between">
          <div>
            <p className="text-xs text-white/50">Emergency Fund</p>
            <h2 className="text-lg font-semibold text-white">Safety Net</h2>
          </div>

          <p className={`text-xs font-semibold ${statusColor}`}>
            {progress.toFixed(0)}%
          </p>
        </div>

        <h1 className="text-2xl font-bold text-white">
          ₱{currentAmount.toLocaleString()}
        </h1>

        <p className="mt-1 text-sm text-white/50">
          Target: ₱{targetAmount.toLocaleString()}
        </p>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full ${barColor} transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-[11px] text-white/40">
          <span>₱0</span>
          <span>₱{targetAmount.toLocaleString()}</span>
        </div>

        <p className="mt-3 text-xs text-white/60">{insight}</p>

        <div className="mt-4">
          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm text-white/70 transition duration-300 hover:bg-white/[0.06] hover:text-white"
          >
            <span className="font-medium">Show more</span>
            <span className="text-lg leading-none text-white/60" aria-hidden="true">
              ⌄
            </span>
          </button>
        </div>
      </div>

      {panelOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center px-3 pb-3 pt-10 sm:items-center sm:p-5">
          <button
            type="button"
            aria-label="Close emergency fund panel"
            onClick={() => setPanelOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_220ms_ease-out]"
          />

          <div className="relative flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-[30px] border border-white/10 bg-[#08111c]/95 shadow-[0_24px_90px_rgba(0,0,0,0.75)] backdrop-blur-2xl animate-[panelRise_320ms_cubic-bezier(0.2,0.9,0.2,1)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(45,212,191,0.18),transparent_34%),radial-gradient(circle_at_85%_18%,rgba(59,130,246,0.16),transparent_32%),radial-gradient(circle_at_80%_90%,rgba(244,63,94,0.14),transparent_35%)]" />

            <div className="relative border-b border-white/10 px-5 pb-4 pt-3">
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20" />

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                    Emergency Fund
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-white">Safety Net</h2>
                </div>

                <button
                  type="button"
                  onClick={() => setPanelOpen(false)}
                  className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/[0.1] hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="relative flex-1 overflow-y-auto px-5 py-5">
              <div className="rounded-[26px] border border-white/10 bg-white/[0.055] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs text-white/45">Saved amount</p>
                    <h3 className="mt-1 text-3xl font-bold text-white">
                      ₱{currentAmount.toLocaleString()}
                    </h3>
                  </div>

                  <span className={`text-sm font-semibold ${statusColor}`}>
                    {progress.toFixed(0)}%
                  </span>
                </div>

                <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full ${barColor} transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="mt-3 text-sm leading-relaxed text-white/60">{insight}</p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={onAddFunds}
                  className="rounded-[22px] border border-white/10 bg-white/[0.08] p-4 text-left transition hover:bg-white/[0.12]"
                >
                  <p className="text-sm font-semibold text-white">Add money</p>
                  <p className="mt-1 text-xs text-white/45">Increase saved fund</p>
                </button>

                <button
                  type="button"
                  onClick={onSetTarget}
                  className="rounded-[22px] border border-white/10 bg-white/[0.045] p-4 text-left transition hover:bg-white/[0.08]"
                >
                  <p className="text-sm font-semibold text-white">Edit target</p>
                  <p className="mt-1 text-xs text-white/45">Adjust goal amount</p>
                </button>
              </div>

              <div className="mt-4 space-y-2 rounded-[24px] border border-white/10 bg-black/15 p-4 text-sm">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="font-semibold text-white/85">Fund breakdown</p>
                  <span className={`text-xs font-semibold ${statusColor}`}>{detailTone}</span>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-3">
                  <span className="text-white/45">Saved amount</span>
                  <span className="font-medium text-white">₱{currentAmount.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/45">Target amount</span>
                  <span className="font-medium text-white">₱{targetAmount.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/45">Remaining</span>
                  <span className="font-medium text-white">₱{remainingAmount.toLocaleString()}</span>
                </div>
              </div>

              <p className="mt-4 rounded-[22px] border border-white/10 bg-white/[0.035] p-4 text-xs leading-relaxed text-white/45">
                This panel is your action layer. The dashboard card stays clean for overview,
                while this view gives you the tools and details when you need to make changes.
              </p>
            </div>
          </div>

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }

            @keyframes panelRise {
              from {
                opacity: 0;
                transform: translateY(28px) scale(0.96);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
}

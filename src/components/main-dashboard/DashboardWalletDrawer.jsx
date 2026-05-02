import { useMemo, useState } from "react";
import { ChevronRight, Plus, Wallet } from "lucide-react";

function formatPeso(value = 0) {
  const amount = Number(value) || 0;

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getWalletName(wallet, index) {
  return wallet?.name || wallet?.wallet_name || wallet?.title || `Wallet ${index + 1}`;
}

function getWalletBalance(wallet) {
  return Number(wallet?.balance ?? wallet?.current_balance ?? wallet?.amount ?? 0) || 0;
}

export default function DashboardWalletDrawer({ wallets = [], onAddWallet }) {
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  const safeWallets = Array.isArray(wallets) ? wallets : [];

  const totalBalance = useMemo(
    () => safeWallets.reduce((sum, wallet) => sum + getWalletBalance(wallet), 0),
    [safeWallets]
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setWalletModalOpen(true)}
        className="group relative w-full overflow-hidden rounded-[26px] border px-4 py-3 text-left backdrop-blur-2xl transition duration-300 active:scale-[0.98]"
        style={{
          borderColor: "var(--clara-border)",
          background: "var(--clara-glass)",
          boxShadow: "var(--clara-glow-premium)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-70 transition duration-300 group-active:opacity-50"
          style={{ background: "var(--clara-surface-glow)" }}
        />

        <div
          className="pointer-events-none absolute inset-x-6 top-0 h-px opacity-70"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--clara-accent-border), rgba(255,255,255,0.18), transparent)",
          }}
        />

        <div
          className="relative mx-auto mb-2.5 h-[2px] w-10 rounded-full"
          style={{
            background: "var(--clara-accent-soft)",
            boxShadow: "0 0 10px var(--clara-glow-soft)",
          }}
        />

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl border text-white/60"
              style={{
                borderColor: "var(--clara-border)",
                background: "var(--clara-panel)",
              }}
            >
              <Wallet size={15} strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
              <p
                className="text-[9px] font-bold uppercase tracking-[0.3em]"
                style={{ color: "var(--clara-accent-text)" }}
              >
                Wallets
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-white/40">
                {safeWallets.length} {safeWallets.length === 1 ? "wallet" : "wallets"}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2.5 text-right">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/36">
                Total
              </p>
              <p className="mt-0.5 text-[17px] font-extrabold tracking-tight text-white">
                {formatPeso(totalBalance)}
              </p>
            </div>

            <ChevronRight
              size={16}
              strokeWidth={1.8}
              className="text-white/25 transition duration-300 group-hover:translate-x-0.5 group-hover:text-white/40"
            />
          </div>
        </div>
      </button>

      {walletModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-xl">
          <div
            className="absolute inset-0"
            onClick={() => setWalletModalOpen(false)}
            aria-hidden="true"
          />

          <section
            className="relative w-full max-w-[390px] overflow-hidden rounded-[30px] border p-5 text-white backdrop-blur-2xl"
            style={{
              borderColor: "var(--clara-border)",
              background: "var(--clara-glass)",
              boxShadow: "0 26px 90px rgba(0,0,0,0.68), var(--clara-glow-premium)",
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-80"
              style={{ background: "var(--clara-surface-glow)" }}
            />

            <div className="relative mx-auto mb-4 h-[4px] w-11 rounded-full bg-white/20" />

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p
                  className="text-[11px] font-bold uppercase tracking-[0.26em]"
                  style={{ color: "var(--clara-accent-text)" }}
                >
                  Wallets
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
                  Wallets
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setWalletModalOpen(false)}
                className="rounded-full border px-3 py-2 text-xs font-bold text-white/85 transition active:scale-95"
                style={{
                  borderColor: "var(--clara-border)",
                  background: "var(--clara-panel)",
                }}
              >
                Close
              </button>
            </div>

            <div
              className="relative mt-8 rounded-[24px] border p-4"
              style={{
                borderColor: "var(--clara-border)",
                background: "var(--clara-panel)",
              }}
            >
              <p className="text-[11px] font-medium text-white/45">Total Balance</p>

              <div className="mt-2 flex items-end justify-between gap-3">
                <p className="text-3xl font-extrabold tracking-tight text-white">
                  {formatPeso(totalBalance)}
                </p>

                <p className="pb-1 text-xs font-bold text-white/45">
                  {safeWallets.length} {safeWallets.length === 1 ? "wallet" : "wallets"}
                </p>
              </div>
            </div>

            <div className="relative mt-4 space-y-3">
              {safeWallets.length > 0 ? (
                safeWallets.map((wallet, index) => (
                  <div
                    key={wallet?.id || wallet?.wallet_id || `${getWalletName(wallet, index)}-${index}`}
                    className="flex items-center justify-between gap-4 rounded-[22px] border p-4"
                    style={{
                      borderColor: "var(--clara-border)",
                      background: "var(--clara-panel)",
                    }}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border text-white/70"
                        style={{
                          borderColor: "var(--clara-border)",
                          background: "var(--clara-glass)",
                        }}
                      >
                        <Wallet size={17} strokeWidth={1.8} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-white">
                          {getWalletName(wallet, index)}
                        </p>
                        <p className="mt-0.5 text-xs text-white/40">
                          Available balance
                        </p>
                      </div>
                    </div>

                    <p className="shrink-0 text-sm font-extrabold text-white">
                      {formatPeso(getWalletBalance(wallet))}
                    </p>
                  </div>
                ))
              ) : (
                <div
                  className="rounded-[24px] border border-dashed px-4 py-8 text-center"
                  style={{
                    borderColor: "var(--clara-border)",
                    background: "rgba(0,0,0,0.14)",
                  }}
                >
                  <p className="text-sm font-bold text-white/75">No wallets yet</p>
                  <p className="mx-auto mt-2 max-w-[230px] text-xs leading-relaxed text-white/40">
                    Your wallets will appear here once added.
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onAddWallet}
              className="relative mt-5 flex w-full items-center justify-center gap-2 rounded-[22px] border px-4 py-4 text-sm font-bold transition active:scale-[0.99]"
              style={{
                borderColor: "var(--clara-accent-border)",
                background: "var(--clara-accent-soft)",
                color: "var(--clara-accent-text)",
                boxShadow: "0 0 24px var(--clara-glow-soft)",
              }}
            >
              <Plus size={17} strokeWidth={2.2} />
              Add Wallet
            </button>
          </section>
        </div>
      )}
    </>
  );
}

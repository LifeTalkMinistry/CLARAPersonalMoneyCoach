import { useMemo, useState } from "react";
import { Plus, Wallet } from "lucide-react";

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
        className="group relative w-full overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.035] px-4 py-4 text-left shadow-[0_18px_55px_rgba(0,0,0,0.42)] backdrop-blur-2xl transition duration-300 active:scale-[0.99]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(56,189,248,0.12),transparent_34%),radial-gradient(circle_at_88%_10%,rgba(168,85,247,0.10),transparent_32%)] opacity-70" />

        <div className="relative mx-auto mb-3 h-[3px] w-11 rounded-full bg-white/20 shadow-[0_0_12px_rgba(255,255,255,0.16)]" />

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white/65">
              <Wallet size={16} strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/60">
                Wallets
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-white/35">
                {safeWallets.length} {safeWallets.length === 1 ? "wallet" : "wallets"}
              </p>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/35">
              Total Balance
            </p>
            <p className="mt-0.5 text-lg font-extrabold tracking-tight text-white">
              {formatPeso(totalBalance)}
            </p>
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

          <section className="relative w-full max-w-[390px] overflow-hidden rounded-[30px] border border-white/10 bg-[#071017]/95 p-5 text-white shadow-[0_26px_90px_rgba(0,0,0,0.68)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(20,184,166,0.20),transparent_34%),radial-gradient(circle_at_90%_14%,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.13),transparent_38%)]" />

            <div className="relative mx-auto mb-4 h-[4px] w-11 rounded-full bg-white/20" />

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-emerald-200/60">
                  Wallets
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
                  Wallets
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setWalletModalOpen(false)}
                className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-2 text-xs font-bold text-white/85 transition hover:bg-white/[0.1]"
              >
                Close
              </button>
            </div>

            <div className="relative mt-8 rounded-[24px] border border-white/10 bg-white/[0.055] p-4">
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
                    className="flex items-center justify-between gap-4 rounded-[22px] border border-white/10 bg-white/[0.045] p-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] text-white/70">
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
                <div className="rounded-[24px] border border-dashed border-white/10 bg-black/15 px-4 py-8 text-center">
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
              className="relative mt-5 flex w-full items-center justify-center gap-2 rounded-[22px] border border-emerald-300/20 bg-emerald-300/[0.10] px-4 py-4 text-sm font-bold text-white shadow-[0_18px_45px_rgba(16,185,129,0.12)] transition hover:bg-emerald-300/[0.14] active:scale-[0.99]"
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

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
        className="group w-full rounded-[24px] border border-white/10 bg-white/[0.055] px-4 py-3 text-left shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition duration-300 active:scale-[0.98]"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px] border border-white/10 bg-white/[0.09] text-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <Wallet size={16} strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.26em] text-white/30">
                Wallets
              </p>
              <p className="mt-0.5 text-[12px] font-medium text-white/45">
                {safeWallets.length} {safeWallets.length === 1 ? "wallet" : "wallets"}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 text-right">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/30">
                Total
              </p>
              <p className="mt-0.5 text-[18px] font-extrabold tracking-tight text-white">
                {formatPeso(totalBalance)}
              </p>
            </div>

            <ChevronRight size={16} className="text-white/30" />
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

          <section className="relative w-full max-w-[390px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.06] p-5 text-white shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/30">
                  Wallets
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
                  Wallets
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setWalletModalOpen(false)}
                className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-2 text-xs font-bold text-white/80"
              >
                Close
              </button>
            </div>

            <div className="mt-6 rounded-[22px] border border-white/10 bg-white/[0.05] p-4">
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

            <div className="mt-4 space-y-3">
              {safeWallets.length > 0 ? (
                safeWallets.map((wallet, index) => (
                  <div
                    key={wallet?.id || wallet?.wallet_id || `${getWalletName(wallet, index)}-${index}`}
                    className="flex items-center justify-between gap-4 rounded-[20px] border border-white/10 bg-white/[0.05] p-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-white/10 bg-white/[0.09] text-white/70">
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
                <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.03] px-4 py-8 text-center">
                  <p className="text-sm font-bold text-white/70">No wallets yet</p>
                  <p className="mx-auto mt-2 max-w-[230px] text-xs leading-relaxed text-white/40">
                    Your wallets will appear here once added.
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onAddWallet}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-[20px] border border-white/10 bg-white/[0.08] px-4 py-4 text-sm font-bold text-white transition active:scale-[0.99]"
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

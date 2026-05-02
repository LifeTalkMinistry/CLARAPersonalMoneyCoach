import { useMemo, useState } from "react";
import { ChevronRight, Pencil, Plus, Trash2, Wallet } from "lucide-react";

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

export default function DashboardWalletDrawer({
  wallets = [],
  onAddWallet,
  onEditWallet,
  onDeleteWallet,
}) {
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const safeWallets = useMemo(
    () => (Array.isArray(wallets) ? wallets : []),
    [wallets]
  );

  const totalBalance = useMemo(
    () => safeWallets.reduce((sum, wallet) => sum + getWalletBalance(wallet), 0),
    [safeWallets]
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setWalletModalOpen(true)}
        className="group relative w-full overflow-hidden rounded-[24px] border px-4 py-3 text-left backdrop-blur-2xl transition duration-300 active:scale-[0.98]"
        style={{
          borderColor: "var(--clara-border)",
          background:
            "linear-gradient(135deg, rgba(107,157,58,0.24) 0%, rgba(17,58,37,0.92) 44%, rgba(11,38,54,0.92) 100%)",
          boxShadow: "var(--clara-shadow-soft), inset 0 1px 0 rgba(255,255,255,0.07)",
        }}
      >
        <div className="pointer-events-none absolute inset-0" style={{ background: "var(--clara-surface-glow)" }} />
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px] border shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" style={{ borderColor: "var(--clara-accent-border)", background: "rgba(215,239,89,0.10)", color: "var(--clara-accent-text)" }}>
              <Wallet size={16} strokeWidth={1.8} />
            </div>

            <div className="relative z-10 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.26em]" style={{ color: "var(--clara-accent-text)" }}>
                Wallets
              </p>
              <p className="mt-0.5 text-[12px] font-medium" style={{ color: "var(--clara-text-soft)" }}>
                {safeWallets.length} {safeWallets.length === 1 ? "wallet" : "wallets"}
              </p>
            </div>
          </div>

          <div className="relative z-10 flex shrink-0 items-center gap-3 text-right">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: "var(--clara-accent-text)" }}>
                Total
              </p>
              <p className="mt-0.5 text-[18px] font-extrabold tracking-tight text-white">
                {formatPeso(totalBalance)}
              </p>
            </div>

            <ChevronRight size={16} style={{ color: "var(--clara-accent-text)" }} />
          </div>
        </div>
      </button>

      {walletModalOpen && (
        <div className="clara-modal-backdrop fixed inset-0 z-[80] flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0"
            onClick={() => setWalletModalOpen(false)}
            aria-hidden="true"
          />

          <section className="clara-modal-surface relative w-full max-w-[390px] overflow-hidden rounded-[28px] p-5">
            <div className="pointer-events-none absolute inset-0" style={{ background: "var(--clara-surface-glow)" }} />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.24em]" style={{ color: "var(--clara-accent-text)" }}>
                  Wallets
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
                  Wallets
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setWalletModalOpen(false)}
                className="clara-button-secondary rounded-full px-3 py-2 text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="relative mt-6 rounded-[22px] border p-4" style={{ borderColor: "var(--clara-border)", background: "var(--clara-card)" }}>
              <p className="text-[11px] font-medium" style={{ color: "var(--clara-text-soft)" }}>Total Balance</p>

              <div className="mt-2 flex items-end justify-between gap-3">
                <p className="text-3xl font-extrabold tracking-tight text-white">
                  {formatPeso(totalBalance)}
                </p>

                <p className="pb-1 text-xs font-bold" style={{ color: "var(--clara-text-soft)" }}>
                  {safeWallets.length} {safeWallets.length === 1 ? "wallet" : "wallets"}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {safeWallets.length > 0 ? (
                safeWallets.map((wallet, index) => (
                  <div
                    key={wallet?.id || wallet?.wallet_id || `${getWalletName(wallet, index)}-${index}`}
                    className="rounded-[20px] border p-4"
                    style={{ borderColor: "var(--clara-border)", background: "var(--clara-glass)" }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border" style={{ borderColor: "var(--clara-accent-border)", background: "rgba(215,239,89,0.10)", color: "var(--clara-accent-text)" }}>
                          <Wallet size={17} strokeWidth={1.8} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-white">
                            {getWalletName(wallet, index)}
                          </p>
                          <p className="mt-0.5 text-xs" style={{ color: "var(--clara-text-soft)" }}>
                            Available balance
                          </p>
                        </div>
                      </div>

                      <p className="shrink-0 text-sm font-extrabold text-white">
                        {formatPeso(getWalletBalance(wallet))}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEditWallet?.(wallet)}
                        className="clara-button-secondary flex flex-1 items-center justify-center gap-2 rounded-[14px] px-3 py-2 text-xs font-bold transition active:scale-[0.98]"
                      >
                        <Pencil size={13} strokeWidth={2} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteWallet?.(wallet)}
                        className="flex items-center justify-center gap-2 rounded-[14px] border px-3 py-2 text-xs font-bold transition active:scale-[0.98]"
                        style={{ borderColor: "rgba(215,138,108,0.22)", background: "rgba(215,138,108,0.12)", color: "var(--clara-status-risk)" }}
                      >
                        <Trash2 size={13} strokeWidth={2} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[22px] border border-dashed px-4 py-8 text-center" style={{ borderColor: "var(--clara-border)", background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-sm font-bold" style={{ color: "var(--clara-text-soft)" }}>No wallets yet</p>
                  <p className="mx-auto mt-2 max-w-[230px] text-xs leading-relaxed" style={{ color: "var(--clara-text-muted)" }}>
                    Your wallets will appear here once added.
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onAddWallet}
              className="clara-button-primary mt-5 flex w-full items-center justify-center gap-2 rounded-[20px] px-4 py-4 text-sm font-bold transition active:scale-[0.99]"
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

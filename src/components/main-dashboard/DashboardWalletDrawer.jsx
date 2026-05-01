import { Plus, Wallet } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { formatMoney } from "../../lib/dashboard/financeUtils";

export default function DashboardWalletDrawer({ wallets = [] }) {
  const [expanded, setExpanded] = useState(false);
  const dragStartY = useRef(null);
  const dragDeltaY = useRef(0);

  const safeWallets = Array.isArray(wallets) ? wallets : [];

  const totalBalance = useMemo(
    () => safeWallets.reduce((sum, wallet) => sum + (Number(wallet?.balance) || 0), 0),
    [safeWallets]
  );

  const handlePointerDown = (event) => {
    dragStartY.current = event.clientY;
    dragDeltaY.current = 0;
  };

  const handlePointerMove = (event) => {
    if (dragStartY.current === null) return;
    dragDeltaY.current = event.clientY - dragStartY.current;
  };

  const handlePointerUp = () => {
    if (dragStartY.current === null) return;

    if (dragDeltaY.current > 24) {
      setExpanded(true);
    } else if (dragDeltaY.current < -24) {
      setExpanded(false);
    } else {
      setExpanded((current) => !current);
    }

    dragStartY.current = null;
    dragDeltaY.current = 0;
  };

  return (
    <section
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        dragStartY.current = null;
        dragDeltaY.current = 0;
      }}
      className={`group relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.045] shadow-[0_18px_46px_rgba(0,0,0,0.30)] backdrop-blur-2xl transition-all duration-300 ease-out active:scale-[0.99] ${
        expanded ? "max-h-[360px]" : "max-h-[60px]"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.09),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <div className="pointer-events-none absolute -top-10 left-1/2 h-20 w-44 -translate-x-1/2 rounded-full bg-white/[0.045] blur-2xl transition duration-300 group-active:bg-white/[0.07]" />

      <div className="relative px-4 pb-4 pt-3">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/25 shadow-[0_0_18px_rgba(255,255,255,0.22)]" />

        <div className="flex min-h-[36px] items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <Wallet className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase leading-none tracking-[0.24em] text-white/45">
                Wallets
              </p>
              <p className="mt-1 text-xs text-white/45">
                {safeWallets.length} {safeWallets.length === 1 ? "wallet" : "wallets"}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[18px] font-black leading-none tracking-tight text-white">
              {formatMoney(totalBalance)}
            </p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
              Total Balance
            </p>
          </div>
        </div>

        <div
          className={`transition-all duration-300 ease-out ${
            expanded
              ? "mt-5 translate-y-0 opacity-100"
              : "pointer-events-none mt-0 -translate-y-2 opacity-0"
          }`}
        >
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-white/70">Wallet system</p>
              <p className="mt-0.5 text-[11px] text-white/40">Read-only offline view</p>
            </div>

            <button
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-[11px] font-bold text-white/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] transition duration-300 hover:bg-white/[0.09] active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Wallet
            </button>
          </div>

          <div className="space-y-2">
            {safeWallets.length > 0 ? (
              safeWallets.map((wallet, index) => (
                <div
                  key={wallet?.id || wallet?.name || index}
                  className="flex items-center justify-between gap-3 rounded-[20px] border border-white/[0.08] bg-white/[0.035] px-3.5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white/85">
                      {wallet?.name || wallet?.wallet_name || "Wallet"}
                    </p>
                    <p className="mt-0.5 text-[11px] text-white/38">Available balance</p>
                  </div>

                  <p className="shrink-0 text-sm font-black tracking-tight text-white">
                    {formatMoney(Number(wallet?.balance) || 0)}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-[20px] border border-dashed border-white/[0.10] bg-white/[0.025] px-4 py-5 text-center">
                <p className="text-sm font-semibold text-white/70">No wallets yet</p>
                <p className="mt-1 text-xs text-white/40">Your wallets will appear here once added.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

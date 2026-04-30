import { Bot, Plus, Sparkles, TrendingUp, WalletCards, Target, ShieldCheck } from "lucide-react";
import { useRef, useState } from "react";

const commandItems = [
  {
    label: "Ask CLARA",
    description: "Open money coach",
    icon: Bot,
  },
  {
    label: "Quick expense",
    description: "Log spending fast",
    icon: WalletCards,
  },
  {
    label: "Spending insight",
    description: "Check your pattern",
    icon: TrendingUp,
  },
  {
    label: "Savings plan",
    description: "Build your next move",
    icon: Target,
  },
  {
    label: "Emergency fund",
    description: "Protect your base",
    icon: ShieldCheck,
  },
];

const ORB_SIZE = 60;
const EDGE_PADDING = 18;
const BOTTOM_SAFE = 18;

export default function DashboardQuickOrb({
  onTap,
  onDoubleTap,
  onLongPressStart,
  onLongPressEnd,
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const longPressTimer = useRef(null);
  const didLongPress = useRef(false);
  const dragData = useRef(null);
  const dragging = useRef(false);

  const openMenu = () => setOpen(true);
  const closeMenu = () => setOpen(false);
  const toggleMenu = () => setOpen((current) => !current);

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const getSafePosition = (x, y) => ({
    x: clamp(x, EDGE_PADDING, window.innerWidth - ORB_SIZE - EDGE_PADDING),
    y: clamp(y, EDGE_PADDING, window.innerHeight - ORB_SIZE - BOTTOM_SAFE),
  });

  const snapToNearestEdge = (pos) => {
    const centerX = pos.x + ORB_SIZE / 2;
    const snappedX =
      centerX < window.innerWidth / 2
        ? EDGE_PADDING
        : window.innerWidth - ORB_SIZE - EDGE_PADDING;

    return getSafePosition(snappedX, pos.y);
  };

  const handlePointerDown = (event) => {
    didLongPress.current = false;
    dragging.current = false;
    const rect = event.currentTarget.getBoundingClientRect();
    dragData.current = {
      startX: event.clientX,
      startY: event.clientY,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    };
    onLongPressStart?.();

    longPressTimer.current = window.setTimeout(() => {
      if (dragging.current) return;
      didLongPress.current = true;
      openMenu();
    }, 420);
  };

  const handlePointerMove = (event) => {
    if (!dragData.current) return;

    const movedX = Math.abs(event.clientX - dragData.current.startX);
    const movedY = Math.abs(event.clientY - dragData.current.startY);

    if (movedX > 7 || movedY > 7) {
      dragging.current = true;
      closeMenu();
      if (longPressTimer.current) window.clearTimeout(longPressTimer.current);
    }

    if (!dragging.current) return;

    setPosition(
      getSafePosition(
        event.clientX - dragData.current.offsetX,
        event.clientY - dragData.current.offsetY
      )
    );
  };

  const handlePointerEnd = () => {
    if (longPressTimer.current) window.clearTimeout(longPressTimer.current);
    onLongPressEnd?.();

    if (dragging.current && position) {
      setPosition(snapToNearestEdge(position));
    }

    window.setTimeout(() => {
      dragging.current = false;
      dragData.current = null;
    }, 0);
  };

  const handleOrbClick = () => {
    if (didLongPress.current || dragging.current) return;
    toggleMenu();
    onTap?.();
  };

  const handleCommandClick = (index) => {
    closeMenu();

    if (index === 0) onLongPressStart?.();
    if (index === 1) onTap?.();
    if (index === 2) onDoubleTap?.();
  };

  const wrapperClass = position
    ? "fixed z-50 transition-[left,top] duration-300 ease-out"
    : "fixed left-1/2 z-50 -translate-x-1/2 bottom-[calc(16px+env(safe-area-inset-bottom))] sm:bottom-[calc(18px+env(safe-area-inset-bottom))]";

  const wrapperStyle = position
    ? { left: `${position.x}px`, top: `${position.y}px` }
    : undefined;

  return (
    <div className={wrapperClass} style={wrapperStyle}>
      {open && (
        <button
          type="button"
          aria-label="Close CLARA command menu"
          onClick={closeMenu}
          className="fixed inset-0 -z-10 bg-black/20 backdrop-blur-[1px]"
        />
      )}

      <div
        className={`absolute bottom-[72px] left-1/2 w-[320px] max-w-[calc(100vw-32px)] -translate-x-1/2 overflow-hidden rounded-[30px] border border-white/12 bg-[#071018]/80 p-3 text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl transition-all duration-300 ease-out ${
          open
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-5 scale-95 opacity-0"
        }`}
      >
        <div className="mb-2 px-2 py-1">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-cyan-100/45">
            CLARA AI Command
          </p>
          <h3 className="mt-1 text-lg font-black tracking-[-0.03em] text-white">
            What do you need?
          </h3>
        </div>

        <div className="space-y-1.5">
          {commandItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleCommandClick(index)}
                className="group flex w-full items-center gap-3 rounded-[22px] border border-white/[0.06] bg-white/[0.045] px-3 py-3 text-left transition duration-200 hover:bg-white/[0.075] active:scale-[0.98]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-cyan-100/12 bg-cyan-200/[0.08] text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-200 group-active:scale-95">
                  <Icon size={18} strokeWidth={1.9} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold tracking-[-0.01em] text-white">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-white/42">
                    {item.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={handleOrbClick}
        onDoubleClick={onDoubleTap}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onPointerLeave={handlePointerEnd}
        className={`touch-none group relative flex h-[60px] w-[60px] items-center justify-center rounded-full border border-white/15 bg-white/[0.08] text-white shadow-[0_16px_44px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-all duration-300 ease-out active:scale-95 ${
          open ? "scale-105" : "scale-100"
        }`}
        aria-label="CLARA quick action"
        aria-expanded={open}
      >
        <span className="absolute -inset-3 rounded-full bg-cyan-300/10 blur-2xl transition duration-500 group-active:bg-cyan-300/20" />
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/18 via-white/[0.06] to-cyan-400/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]" />
        <span className="absolute inset-[5px] rounded-full border border-white/12 bg-[#07131a]/65" />

        <span className="relative flex h-[46px] w-[46px] items-center justify-center rounded-full bg-gradient-to-br from-cyan-200 via-emerald-300 to-sky-400 text-[#041018] shadow-[0_0_24px_rgba(45,212,191,0.28),inset_0_1px_0_rgba(255,255,255,0.55)] transition duration-300 group-active:scale-95">
          <Plus
            className={`h-5 w-5 stroke-[2.4] transition duration-300 ${
              open ? "rotate-45" : "rotate-0"
            }`}
          />
          <Sparkles className="absolute -right-1 -top-1 h-3.5 w-3.5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        </span>
      </button>
    </div>
  );
}

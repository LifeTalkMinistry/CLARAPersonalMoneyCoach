import {
  Bot,
  Plus,
  Sparkles,
  TrendingUp,
  WalletCards,
  Target,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const commandItems = [
  { label: "Ask CLARA", description: "Open money coach", icon: Bot },
  { label: "Quick expense", description: "Log spending fast", icon: WalletCards },
  { label: "Spending insight", description: "Check your pattern", icon: TrendingUp },
  { label: "Savings plan", description: "Build your next move", icon: Target },
  { label: "Emergency fund", description: "Protect your base", icon: ShieldCheck },
];

const ORB_SIZE = 60;
const EDGE_PADDING = 18;
const TOP_SAFE = 24;
const BOTTOM_SAFE = 24;

export default function DashboardQuickOrb({
  onTap,
  onDoubleTap,
  onLongPressStart,
  onLongPressEnd,
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dockSide, setDockSide] = useState("right");

  const dragData = useRef(null);
  const longPressTimer = useRef(null);
  const didLongPress = useRef(false);
  const dragging = useRef(false);
  const lastDockedPosition = useRef(null);

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const getSafePosition = (x, y) => ({
    x: clamp(x, EDGE_PADDING, window.innerWidth - ORB_SIZE - EDGE_PADDING),
    y: clamp(y, TOP_SAFE, window.innerHeight - ORB_SIZE - BOTTOM_SAFE),
  });

  const getCenterPosition = () =>
    getSafePosition(
      window.innerWidth / 2 - ORB_SIZE / 2,
      window.innerHeight / 2 + 130
    );

  const snapToNearestEdge = (pos) => {
    const shouldDockLeft = pos.x + ORB_SIZE / 2 < window.innerWidth / 2;

    return getSafePosition(
      shouldDockLeft
        ? EDGE_PADDING
        : window.innerWidth - ORB_SIZE - EDGE_PADDING,
      pos.y
    );
  };

  useEffect(() => {
    const start = getSafePosition(
      window.innerWidth - ORB_SIZE - EDGE_PADDING,
      window.innerHeight - ORB_SIZE - 110
    );

    setPosition(start);
    lastDockedPosition.current = start;
  }, []);

  const closeMenu = () => {
    setOpen(false);

    if (lastDockedPosition.current) {
      setPosition(lastDockedPosition.current);
      setDockSide(
        lastDockedPosition.current.x < window.innerWidth / 2 ? "left" : "right"
      );
    }
  };

  const openMenuCentered = () => {
    if (position) {
      lastDockedPosition.current = snapToNearestEdge(position);
    }

    setPosition(getCenterPosition());
    setDockSide("center");
    setOpen(true);
  };

  const handlePointerDown = (event) => {
    didLongPress.current = false;
    dragging.current = false;
    setIsDragging(false);

    const rect = event.currentTarget.getBoundingClientRect();

    dragData.current = {
      startX: event.clientX,
      startY: event.clientY,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      lastPosition: position,
    };

    onLongPressStart?.();

    longPressTimer.current = window.setTimeout(() => {
      if (dragging.current) return;
      didLongPress.current = true;
      openMenuCentered();
    }, 420);
  };

  const handlePointerMove = (event) => {
    if (!dragData.current) return;

    const movedX = Math.abs(event.clientX - dragData.current.startX);
    const movedY = Math.abs(event.clientY - dragData.current.startY);

    if (movedX > 7 || movedY > 7) {
      dragging.current = true;
      setIsDragging(true);
      setOpen(false);

      if (longPressTimer.current) {
        window.clearTimeout(longPressTimer.current);
      }
    }

    if (!dragging.current) return;

    const nextPosition = getSafePosition(
      event.clientX - dragData.current.offsetX,
      event.clientY - dragData.current.offsetY
    );

    dragData.current.lastPosition = nextPosition;
    setPosition(nextPosition);
    setDockSide(nextPosition.x < window.innerWidth / 2 ? "left" : "right");
  };

  const handlePointerEnd = () => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
    }

    onLongPressEnd?.();

    if (dragging.current && dragData.current?.lastPosition) {
      const snappedPosition = snapToNearestEdge(dragData.current.lastPosition);
      setPosition(snappedPosition);
      setDockSide(snappedPosition.x < window.innerWidth / 2 ? "left" : "right");
      lastDockedPosition.current = snappedPosition;
    }

    setTimeout(() => {
      dragging.current = false;
      dragData.current = null;
      setIsDragging(false);
    }, 220);
  };

  const handleOrbClick = () => {
    if (didLongPress.current || dragging.current || isDragging) return;

    if (open) {
      closeMenu();
      return;
    }

    openMenuCentered();
    onTap?.();
  };

  const handleCommandClick = (index) => {
    closeMenu();

    if (index === 0) onLongPressStart?.();
    if (index === 1) onTap?.();
    if (index === 2) onDoubleTap?.();
  };

  const menuAlignment =
    dockSide === "center"
      ? "left-1/2 -translate-x-1/2 origin-bottom"
      : dockSide === "left"
      ? "left-0 origin-bottom-left"
      : "right-0 origin-bottom-right";

  return (
    <div
      className={`fixed z-50 ${
        isDragging
          ? "transition-none"
          : "transition-[left,top] duration-300 ease-out"
      }`}
      style={position ? { left: position.x, top: position.y } : undefined}
    >
      {open && (
        <button
          type="button"
          aria-label="Close CLARA command menu"
          onClick={closeMenu}
          className="fixed inset-0 -z-10 bg-black/35 backdrop-blur-[2px]"
        />
      )}

      <div
        className={`absolute bottom-[76px] ${menuAlignment} w-[320px] max-w-[calc(100vw-32px)] overflow-hidden rounded-[30px] border border-lime-300/20 bg-[#071008]/92 p-3 text-white shadow-[0_24px_90px_rgba(132,204,22,0.20)] backdrop-blur-2xl transition-all duration-300 ease-out ${
          open
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-5 scale-95 opacity-0"
        }`}
      >
        <div className="mb-2 rounded-[22px] border border-lime-300/10 bg-lime-300/[0.06] px-3 py-3">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-lime-200/60">
            CLARA Command
          </p>
          <h3 className="mt-1 text-lg font-black tracking-[-0.03em] text-white">
            Ask before you act
          </h3>
          <p className="mt-1 text-xs text-white/42">
            Choose your next smart money move.
          </p>
        </div>

        <div className="space-y-1.5">
          {commandItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleCommandClick(index)}
                className="group flex w-full items-center gap-3 rounded-[22px] border border-lime-300/[0.08] bg-white/[0.045] px-3 py-3 text-left transition duration-200 hover:bg-lime-300/[0.08] active:scale-[0.98]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-lime-300/15 bg-lime-300/[0.10] text-lime-200 shadow-[0_0_18px_rgba(132,204,22,0.12)]">
                  <Icon size={18} strokeWidth={1.9} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-white">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-white/45">
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
        className={`touch-none group relative flex h-[60px] w-[60px] items-center justify-center rounded-full border border-lime-200/25 bg-[#0b1307]/80 text-white shadow-[0_16px_44px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-all duration-300 ease-out ${
          isDragging ? "scale-95 cursor-grabbing" : "cursor-grab active:scale-95"
        } ${open ? "scale-105" : "scale-100"}`}
        aria-label="CLARA quick action"
        aria-expanded={open}
      >
        <span className="absolute -inset-4 rounded-full bg-lime-300/20 blur-2xl" />
        <span className="absolute -inset-2 rounded-full bg-sky-400/10 blur-xl" />

        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-lime-200/35 via-lime-400/15 to-sky-400/20" />
        <span className="absolute inset-[5px] rounded-full border border-lime-100/20 bg-[#071008]/80" />

        <span className="relative flex h-[46px] w-[46px] items-center justify-center rounded-full bg-gradient-to-br from-lime-200 via-lime-400 to-sky-300 text-[#071008] shadow-[0_0_28px_rgba(163,230,53,0.38)]">
          <Plus
            className={`h-5 w-5 stroke-[2.6] transition duration-300 ${
              open ? "rotate-45" : "rotate-0"
            }`}
          />
          <Sparkles className="absolute -right-1 -top-1 h-3.5 w-3.5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        </span>
      </button>
    </div>
  );
}

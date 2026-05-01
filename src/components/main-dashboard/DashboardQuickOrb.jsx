import {
  Bot,
  Plus,
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
  state = "idle", // idle | thinking | attention | response
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
    event.currentTarget.setPointerCapture?.(event.pointerId);

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

  const handlePointerEnd = (event) => {
    event.currentTarget.releasePointerCapture?.(event.pointerId);

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

  const stateClasses = {
    idle: "",
    thinking: "animate-pulse scale-[1.02]",
    attention: "ring-1 ring-amber-300/30",
    response: "animate-[pulse_1.2s_ease-out]",
  };

  return (
    <div
      className={`fixed z-50 ${
        isDragging
          ? "transition-none"
          : "transition-[left,top] duration-300 ease-out"
      }`}
      style={position ? { left: position.x, top: position.y } : undefined}
    >
      <button
        type="button"
        onClick={handleOrbClick}
        onDoubleClick={onDoubleTap}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        className={`touch-none select-none group relative flex h-[60px] w-[60px] items-center justify-center rounded-full border border-white/[0.13] bg-[#080d12]/82 text-white shadow-[0_14px_34px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.13),inset_0_-18px_32px_rgba(0,0,0,0.22)] backdrop-blur-2xl transition-all duration-300 ease-out ${stateClasses[state]} ${
          isDragging ? "scale-95 cursor-grabbing" : "cursor-grab active:scale-95"
        } ${open ? "scale-105" : "scale-100"}`}
      >
        <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_24%,rgba(255,255,255,0.22),rgba(255,255,255,0.055)_34%,rgba(132,204,22,0.055)_58%,rgba(0,0,0,0.16)_100%)]" />
        <span className="pointer-events-none absolute inset-[5px] rounded-full border border-white/[0.085] bg-[#071008]/72 shadow-inner shadow-black/40" />
        <span className="pointer-events-none absolute inset-[13px] rounded-full bg-[radial-gradient(circle_at_35%_28%,rgba(255,255,255,0.18),rgba(163,230,53,0.12)_42%,rgba(4,9,8,0.88)_100%)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.14),inset_0_-10px_18px_rgba(0,0,0,0.34)]" />

        <span className="relative flex h-[42px] w-[42px] items-center justify-center rounded-full text-white/82 transition duration-300 group-hover:text-white">
          <Plus
            className={`h-5 w-5 stroke-[2.3] drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] transition duration-300 ${
              open ? "rotate-45 scale-95" : "rotate-0 scale-100"
            }`}
          />
        </span>
      </button>
    </div>
  );
}

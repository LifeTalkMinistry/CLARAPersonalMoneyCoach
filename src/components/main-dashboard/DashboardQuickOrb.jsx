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
        lastDockedPosition.current.x < window.innerWidth / 2
          ? "left"
          : "right"
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
      const snappedPosition = snapToNearestEdge(
        dragData.current.lastPosition
      );
      setPosition(snappedPosition);
      setDockSide(
        snappedPosition.x < window.innerWidth / 2 ? "left" : "right"
      );
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

  return (
    <div
      className={`fixed z-50 ${
        isDragging ? "" : "transition-[left,top] duration-300"
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
        className="relative flex h-[60px] w-[60px] items-center justify-center rounded-full border border-white/15 bg-[#080d12]/80 shadow-[0_14px_34px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
      >
        {/* subtle depth only — no particles */}
        <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12),transparent_60%)]" />

        <span className="relative flex items-center justify-center text-white/85">
          <Plus
            className={`h-5 w-5 transition duration-300 ${
              open ? "rotate-45 scale-95" : ""
            }`}
          />
        </span>
      </button>
    </div>
  );
}

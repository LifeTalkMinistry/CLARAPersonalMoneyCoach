import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  const [position, setPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPressing, setIsPressing] = useState(false);

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

  const clearLongPressTimer = () => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handlePointerDown = (event) => {
    event.currentTarget.setPointerCapture?.(event.pointerId);

    didLongPress.current = false;
    dragging.current = false;
    setIsDragging(false);
    setIsPressing(true);

    const rect = event.currentTarget.getBoundingClientRect();

    dragData.current = {
      startX: event.clientX,
      startY: event.clientY,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      lastPosition: position,
    };

    clearLongPressTimer();

    longPressTimer.current = window.setTimeout(() => {
      if (dragging.current) return;

      didLongPress.current = true;
      clearLongPressTimer();
      setIsPressing(false);
      onLongPressStart?.();
    }, 420);
  };

  const handlePointerMove = (event) => {
    if (!dragData.current) return;

    const movedX = Math.abs(event.clientX - dragData.current.startX);
    const movedY = Math.abs(event.clientY - dragData.current.startY);

    if (movedX > 7 || movedY > 7) {
      dragging.current = true;
      setIsDragging(true);
      setIsPressing(false);
      clearLongPressTimer();
    }

    if (!dragging.current) return;

    const nextPosition = getSafePosition(
      event.clientX - dragData.current.offsetX,
      event.clientY - dragData.current.offsetY
    );

    dragData.current.lastPosition = nextPosition;
    setPosition(nextPosition);
  };

  const handlePointerEnd = (event) => {
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    clearLongPressTimer();
    setIsPressing(false);

    if (dragging.current && dragData.current?.lastPosition) {
      const snappedPosition = snapToNearestEdge(dragData.current.lastPosition);
      setPosition(snappedPosition);
      lastDockedPosition.current = snappedPosition;
    }

    if (didLongPress.current) {
      onLongPressEnd?.();
    }

    setTimeout(() => {
      dragging.current = false;
      dragData.current = null;
      setIsDragging(false);
    }, 220);
  };

  const handleOrbClick = () => {
    if (didLongPress.current || dragging.current || isDragging) return;
    onTap?.();
  };

  const handleDoubleClick = (event) => {
    event.preventDefault();
    if (didLongPress.current || dragging.current || isDragging) return;
    onDoubleTap?.();
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
        onDoubleClick={handleDoubleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        className={`touch-none select-none group relative flex h-[60px] w-[60px] items-center justify-center rounded-full border border-white/[0.13] bg-[#080d12]/82 text-white shadow-[0_14px_34px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.13),inset_0_-18px_32px_rgba(0,0,0,0.22)] backdrop-blur-2xl transition-all duration-300 ease-out ${stateClasses[state]} ${
          isDragging
            ? "scale-95 cursor-grabbing"
            : isPressing
            ? "scale-[0.97] cursor-grab"
            : "cursor-grab active:scale-95"
        }`}
        aria-label="CLARA quick action"
      >
        <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_24%,rgba(255,255,255,0.22),rgba(255,255,255,0.055)_34%,rgba(132,204,22,0.055)_58%,rgba(0,0,0,0.16)_100%)]" />
        <span className="pointer-events-none absolute inset-[5px] rounded-full border border-white/[0.085] bg-[#071008]/72 shadow-inner shadow-black/40" />
        <span className="pointer-events-none absolute inset-[13px] rounded-full bg-[radial-gradient(circle_at_35%_28%,rgba(255,255,255,0.18),rgba(163,230,53,0.12)_42%,rgba(4,9,8,0.88)_100%)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.14),inset_0_-10px_18px_rgba(0,0,0,0.34)]" />

        <span
          className={`pointer-events-none absolute -inset-[5px] rounded-full border transition-all duration-300 ${
            isPressing
              ? "scale-110 border-lime-100/18 opacity-100"
              : "scale-100 border-white/[0.045] opacity-65"
          }`}
        />

        <span className="relative flex h-[42px] w-[42px] items-center justify-center rounded-full text-white/82 transition duration-300 group-hover:text-white">
          <Plus className="h-5 w-5 stroke-[2.3] drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] transition duration-300" />
        </span>
      </button>
    </div>
  );
}

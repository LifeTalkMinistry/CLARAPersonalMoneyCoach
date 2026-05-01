import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ORB_SIZE = 60;
const EDGE_PADDING = 18;
const TOP_SAFE = 24;
const BOTTOM_SAFE = 24;

export default function DashboardQuickOrb({
  onLongPressStart,
  onLongPressEnd,
  state = "idle",
}) {
  const [position, setPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const [showExpense, setShowExpense] = useState(false);

  const dragData = useRef(null);
  const longPressTimer = useRef(null);
  const didLongPress = useRef(false);
  const dragging = useRef(false);

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  const getSafePosition = (x, y) => ({
    x: clamp(x, EDGE_PADDING, window.innerWidth - ORB_SIZE - EDGE_PADDING),
    y: clamp(y, TOP_SAFE, window.innerHeight - ORB_SIZE - BOTTOM_SAFE),
  });

  const snapToEdge = (pos) => {
    const left = pos.x + ORB_SIZE / 2 < window.innerWidth / 2;
    return getSafePosition(
      left
        ? EDGE_PADDING
        : window.innerWidth - ORB_SIZE - EDGE_PADDING,
      pos.y
    );
  };

  useEffect(() => {
    setPosition(
      getSafePosition(
        window.innerWidth - ORB_SIZE - EDGE_PADDING,
        window.innerHeight - ORB_SIZE - 110
      )
    );
  }, []);

  const clearTimer = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleDown = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);

    didLongPress.current = false;
    dragging.current = false;

    setIsDragging(false);
    setIsPressing(true);

    const rect = e.currentTarget.getBoundingClientRect();

    dragData.current = {
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      last: position,
    };

    clearTimer();

    longPressTimer.current = setTimeout(() => {
      if (dragging.current) return;

      didLongPress.current = true;
      setIsPressing(false);
      onLongPressStart?.();
    }, 420);
  };

  const handleMove = (e) => {
    if (!dragData.current) return;

    const moved =
      Math.abs(e.clientX - dragData.current.startX) > 7 ||
      Math.abs(e.clientY - dragData.current.startY) > 7;

    if (moved) {
      dragging.current = true;
      setIsDragging(true);
      setIsPressing(false);
      clearTimer();
    }

    if (!dragging.current) return;

    const next = getSafePosition(
      e.clientX - dragData.current.offsetX,
      e.clientY - dragData.current.offsetY
    );

    dragData.current.last = next;
    setPosition(next);
  };

  const handleEnd = (e) => {
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    clearTimer();
    setIsPressing(false);

    if (dragging.current && dragData.current?.last) {
      setPosition(snapToEdge(dragData.current.last));
    }

    if (didLongPress.current) {
      onLongPressEnd?.();
    }

    setTimeout(() => {
      dragging.current = false;
      dragData.current = null;
      setIsDragging(false);
    }, 200);
  };

  const handleTap = () => {
    if (didLongPress.current || dragging.current || isDragging) return;

    setShowExpense(true);
  };

  return (
    <>
      {/* EXPENSE SHEET */}
      {showExpense && (
        <div className="fixed inset-0 z-40 flex items-end bg-black/40 backdrop-blur-sm">
          <div className="w-full rounded-t-[28px] border border-white/10 bg-[#0b1117] p-5 shadow-[0_-30px_80px_rgba(0,0,0,0.7)]">
            
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
              Quick Expense
            </p>

            <input
              autoFocus
              placeholder="₱0.00"
              className="mt-3 w-full bg-transparent text-4xl font-semibold text-white outline-none placeholder:text-white/20"
            />

            <button
              onClick={() => setShowExpense(false)}
              className="mt-5 w-full rounded-xl bg-white/10 py-3 text-sm text-white/80 active:scale-95"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* ORB */}
      <div
        className={`fixed z-50 ${
          isDragging ? "" : "transition-all duration-300"
        }`}
        style={position ? { left: position.x, top: position.y } : undefined}
      >
        <button
          onClick={handleTap}
          onPointerDown={handleDown}
          onPointerMove={handleMove}
          onPointerUp={handleEnd}
          onPointerCancel={handleEnd}
          className={`relative flex h-[60px] w-[60px] items-center justify-center rounded-full border border-white/15 bg-[#080d12]/80 backdrop-blur-xl ${
            isDragging
              ? "scale-95"
              : isPressing
              ? "scale-[0.96]"
              : "active:scale-95"
          }`}
        >
          <Plus className="h-5 w-5 text-white/80" />
        </button>
      </div>
    </>
  );
}

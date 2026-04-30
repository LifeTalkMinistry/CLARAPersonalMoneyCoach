import { Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const ORB_SIZE = 60;
const EDGE_PADDING = 18;
const TOP_SAFE = 92;
const BOTTOM_SAFE = 96;

export default function DashboardQuickOrb({
  onTap,
  onDoubleTap,
}) {
  const [position, setPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dockSide, setDockSide] = useState("right");

  const drag = useRef(null);

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  const safe = (x, y) => ({
    x: clamp(x, EDGE_PADDING, window.innerWidth - ORB_SIZE - EDGE_PADDING),
    y: clamp(y, TOP_SAFE, window.innerHeight - ORB_SIZE - BOTTOM_SAFE),
  });

  const snap = (pos) => {
    const points = [
      safe(EDGE_PADDING, window.innerHeight * 0.55),
      safe(window.innerWidth - ORB_SIZE - EDGE_PADDING, window.innerHeight * 0.55),
      safe(EDGE_PADDING, window.innerHeight - ORB_SIZE - BOTTOM_SAFE),
      safe(window.innerWidth - ORB_SIZE - EDGE_PADDING, window.innerHeight - ORB_SIZE - BOTTOM_SAFE),
    ];

    return points.reduce((nearest, point) => {
      const d1 = Math.hypot(pos.x - nearest.x, pos.y - nearest.y);
      const d2 = Math.hypot(pos.x - point.x, pos.y - point.y);
      return d2 < d1 ? point : nearest;
    });
  };

  useEffect(() => {
    // default bottom-right
    setPosition(
      safe(
        window.innerWidth - ORB_SIZE - EDGE_PADDING,
        window.innerHeight - ORB_SIZE - BOTTOM_SAFE
      )
    );
  }, []);

  const handleDown = (e) => {
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: position?.x || 0,
      originY: position?.y || 0,
    };
  };

  const handleMove = (e) => {
    if (!drag.current) return;

    setIsDragging(true);

    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;

    const next = safe(
      drag.current.originX + dx,
      drag.current.originY + dy
    );

    setPosition(next);
    setDockSide(next.x < window.innerWidth / 2 ? "left" : "right");
  };

  const handleUp = () => {
    if (!drag.current) return;

    setPosition((prev) => snap(prev));
    drag.current = null;

    setTimeout(() => setIsDragging(false), 200);
  };

  const menuAlign = useMemo(() => {
    return dockSide === "left"
      ? "left-0 origin-bottom-left"
      : "right-0 origin-bottom-right";
  }, [dockSide]);

  return (
    <div
      className="fixed z-50 transition-[left,top] duration-300 ease-out"
      style={position ? { left: position.x, top: position.y } : {}}
    >
      {/* COMMAND MENU (you already have this, keep it) */}
      <div
        className={`absolute bottom-[72px] ${menuAlign} transition-all duration-300`}
      >
        {/* keep your existing menu here */}
      </div>

      {/* ORB */}
      <button
        onClick={onTap}
        onDoubleClick={onDoubleTap}
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
        className={`group relative flex h-[60px] w-[60px] items-center justify-center rounded-full border border-white/15 bg-white/[0.08] text-white backdrop-blur-2xl transition-all duration-300 ${
          isDragging
            ? "scale-95 cursor-grabbing shadow-[0_18px_60px_rgba(34,211,238,0.25)]"
            : "cursor-grab active:scale-95 shadow-[0_16px_44px_rgba(0,0,0,0.45)]"
        }`}
      >
        {/* glow */}
        <span
          className={`absolute -inset-3 rounded-full blur-2xl transition ${
            isDragging ? "bg-cyan-300/20" : "bg-cyan-300/10"
          }`}
        />

        {/* inner orb */}
        <span className="relative flex h-[46px] w-[46px] items-center justify-center rounded-full bg-gradient-to-br from-cyan-200 via-emerald-300 to-sky-400 text-[#041018]">
          <Plus className="h-5 w-5 stroke-[2.4]" />
        </span>
      </button>
    </div>
  );
}

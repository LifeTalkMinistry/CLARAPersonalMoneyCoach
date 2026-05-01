import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const categories = [
  "Insight",
  "Success",
  "Testimony",
  "Q&A",
  "Budget Win",
  "Spending Reflection",
];

export default function PostComposerModal({
  open,
  selectedCategory = "Insight",
  content = "",
  onClose,
  onCategoryChange,
  onContentChange,
  onSubmit,
}) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isTextFocused, setIsTextFocused] = useState(false);

  const startYRef = useRef(0);
  const closeTimerRef = useRef(null);

  const canPost = content.trim().length > 0;

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
      return;
    }

    setVisible(false);
    setDragY(0);

    closeTimerRef.current = setTimeout(() => {
      setMounted(false);
    }, 220);

    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [open]);

  if (!mounted) return null;

  const handleClose = () => {
    setVisible(false);
    setDragY(0);
    setTimeout(() => {
      onClose?.();
    }, 180);
  };

  const handleTouchStart = (event) => {
    startYRef.current = event.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (event) => {
    const currentY = event.touches[0].clientY;
    const nextDragY = Math.max(0, currentY - startYRef.current);
    setDragY(nextDragY);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    if (dragY > 120) {
      handleClose();
      return;
    }

    setDragY(0);
  };

  const backdropOpacity = visible ? Math.max(0.32, 1 - dragY / 420) : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center px-3 pb-3 sm:items-center sm:pb-0"
      style={{
        opacity: backdropOpacity,
        backdropFilter: visible ? "blur(5px)" : "blur(0px)",
        background:
          "linear-gradient(to bottom, rgba(15,23,42,0.34), rgba(2,6,23,0.76))",
        transition: isDragging
          ? "none"
          : "opacity 220ms ease, backdrop-filter 260ms ease",
      }}
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full max-w-md overflow-hidden rounded-[26px] border border-white/10 bg-slate-950/95 shadow-[0_28px_90px_rgba(0,0,0,0.58)] backdrop-blur-2xl will-change-transform"
        style={{
          transform: `translateY(${visible ? dragY : 40}px) scale(${
            visible ? 1 : 0.96
          })`,
          opacity: visible ? 1 : 0,
          transition: isDragging
            ? "none"
            : visible
              ? "transform 260ms cubic-bezier(0.22,1,0.36,1), opacity 260ms cubic-bezier(0.22,1,0.36,1)"
              : "transform 180ms ease, opacity 180ms ease",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.08), 0 28px 90px rgba(0,0,0,0.58)",
        }}
      >
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-white/20 shadow-[0_0_12px_rgba(255,255,255,0.08)]" />

        <div className="flex items-center justify-between px-4 pb-2.5 pt-3.5">
          <h2 className="text-base font-semibold text-white/90">
            Create post
          </h2>

          <button
            type="button"
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] text-white/55 transition duration-200 hover:rotate-6 hover:bg-white/[0.075] hover:text-white/80 active:scale-95 active:rotate-12"
            aria-label="Close post composer"
          >
            <X size={17} />
          </button>
        </div>

        <div className="space-y-2.5 px-4 pb-3.5">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] text-xs font-semibold text-white/75">
              JM
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white/85">You</p>
              <p className="text-[11px] text-white/35">
                Share a money lesson
              </p>
            </div>
          </div>

          <textarea
            value={content}
            onChange={(event) => onContentChange(event.target.value)}
            onFocus={() => setIsTextFocused(true)}
            onBlur={() => setIsTextFocused(false)}
            rows={4}
            placeholder="What financial lesson do you want to share?"
            className="w-full resize-none rounded-[22px] border px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/30 transition duration-200 will-change-transform"
            style={{
              borderColor: isTextFocused
                ? "rgba(255,255,255,0.2)"
                : "rgba(255,255,255,0.1)",
              background: isTextFocused
                ? "rgba(255,255,255,0.065)"
                : "rgba(255,255,255,0.04)",
              boxShadow: isTextFocused
                ? "0 0 0 1px rgba(255,255,255,0.08)"
                : "none",
              transform:
                content.length > 0 && isTextFocused
                  ? "scale(1.01)"
                  : "scale(1)",
            }}
          />

          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((category) => {
              const active = selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => onCategoryChange(category)}
                  className={[
                    "shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition duration-150 active:scale-95",
                    active
                      ? "scale-[1.04] border-white/25 bg-white/[0.14] text-white/90 shadow-[0_0_18px_rgba(255,255,255,0.045)]"
                      : "border-white/10 bg-white/[0.035] text-white/45 hover:bg-white/[0.06] hover:text-white/70",
                  ].join(" ")}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
          <p className="text-[11px] text-white/32">
            Keep it honest and helpful.
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white/55 transition duration-150 hover:bg-white/[0.07] hover:text-white/75 active:scale-[0.97]"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onSubmit}
              disabled={!canPost}
              className="rounded-full border border-white/10 bg-white/[0.12] px-5 py-2 text-xs font-semibold text-white/85 transition duration-150 hover:bg-white/[0.16] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-35"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

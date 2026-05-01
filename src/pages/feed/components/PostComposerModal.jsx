import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export default function PostComposerModal({
  open,
  originRect,
  selectedCategory = "Insight",
  content = "",
  onClose,
  onCategoryChange,
  onContentChange,
  onSubmit,
}) {
  const modalRef = useRef(null);

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [transformStyle, setTransformStyle] = useState({});

  // -------------------------
  // OPEN / CLOSE ANIMATION
  // -------------------------
  useEffect(() => {
    if (open) {
      setMounted(true);
      setVisible(false);
      setContentVisible(false);

      requestAnimationFrame(() => {
        const modalRect = modalRef.current?.getBoundingClientRect();

        if (originRect && modalRect) {
          const dx = originRect.left - modalRect.left;
          const dy = originRect.top - modalRect.top;

          const scaleX = originRect.width / modalRect.width;
          const scaleY = originRect.height / modalRect.height;

          setTransformStyle({
            transform: `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY}) rotate(-1deg)`,
            opacity: 0.9,
            filter: "blur(0.4px)",
          });
        }

        requestAnimationFrame(() => {
          setVisible(true);

          setTransformStyle({
            transform: "translate(0px, 0px) scale(1,1) rotate(0deg)",
            opacity: 1,
            filter: "blur(0px)",
          });

          setTimeout(() => {
            setContentVisible(true);
          }, 90);
        });
      });
    } else {
      setContentVisible(false);
      setVisible(false);

      setTimeout(() => {
        setMounted(false);
      }, 240);
    }
  }, [open, originRect]);

  if (!mounted) return null;

  // -------------------------
  // CLOSE HANDLER
  // -------------------------
  const handleClose = () => {
    setContentVisible(false);
    setVisible(false);

    setTimeout(() => {
      onClose?.();
    }, 240);
  };

  // -------------------------
  // UI
  // -------------------------
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center px-3 pb-3 sm:items-center"
      onClick={handleClose}
      style={{
        opacity: visible ? 1 : 0,
        backdropFilter: visible ? "blur(6px)" : "blur(0px)",
        background:
          "linear-gradient(to bottom, rgba(15,23,42,0.18), rgba(2,6,23,0.85))",
        transition: "all 300ms ease",
      }}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-[26px] border border-white/10 bg-slate-950/95 shadow-[0_32px_110px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
        style={{
          ...transformStyle,
          transition: visible
            ? "transform 420ms cubic-bezier(0.16,1,0.3,1), opacity 300ms ease, filter 300ms ease"
            : "transform 240ms cubic-bezier(0.32,0,0.67,0), opacity 200ms ease",
        }}
      >
        {/* CONTENT */}
        <div
          style={{
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible
              ? "translateY(0px)"
              : "translateY(8px)",
            transition: "all 180ms ease",
          }}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <h2 className="text-base font-semibold text-white/90">
              Create post
            </h2>

            <button
              onClick={handleClose}
              className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]"
            >
              <X size={16} />
            </button>
          </div>

          {/* TEXTAREA */}
          <div className="px-4 pb-3">
            <textarea
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder="What financial lesson do you want to share?"
              className="w-full resize-none rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none"
              rows={4}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-end gap-2 border-t border-white/10 px-4 py-3">
            <button
              onClick={handleClose}
              className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/60"
            >
              Cancel
            </button>

            <button
              onClick={onSubmit}
              disabled={!content.trim()}
              className="rounded-full border border-white/10 bg-white/[0.12] px-5 py-2 text-xs text-white"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

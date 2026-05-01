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

          setTimeout(() => setContentVisible(true), 90);
        });
      });
    } else {
      setContentVisible(false);
      setVisible(false);
      setTimeout(() => setMounted(false), 240);
    }
  }, [open, originRect]);

  if (!mounted) return null;

  const handleClose = () => {
    setContentVisible(false);
    setVisible(false);
    setTimeout(() => onClose?.(), 240);
  };

  return (
    <div
      className="fixed inset-0 z-50 px-3 pt-[104px] sm:pt-[120px]"
      onClick={handleClose}
      style={{
        opacity: visible ? 1 : 0,
        backdropFilter: visible ? "blur(6px)" : "blur(0px)",
        background: "linear-gradient(to bottom, rgba(15,23,42,0.18), rgba(2,6,23,0.85))",
        transition: "opacity 300ms ease, backdrop-filter 300ms ease",
      }}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="mx-auto w-full max-w-md overflow-hidden rounded-[26px] border border-white/10 bg-slate-950/95 shadow-[0_32px_110px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
        style={{
          ...transformStyle,
          transformOrigin: "top center",
          transition: visible
            ? "transform 420ms cubic-bezier(0.16,1,0.3,1), opacity 300ms ease, filter 300ms ease"
            : "transform 240ms cubic-bezier(0.32,0,0.67,0), opacity 200ms ease, filter 200ms ease",
        }}
      >
        <div
          style={{
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? "translateY(0px)" : "translateY(8px)",
            transition: "opacity 180ms ease, transform 180ms ease",
          }}
        >
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <h2 className="text-base font-semibold text-white/90">Create post</h2>
            <button
              type="button"
              onClick={handleClose}
              className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/70"
            >
              <X size={16} />
            </button>
          </div>

          <div className="px-4 pb-3">
            <textarea
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder="What financial lesson do you want to share?"
              className="w-full resize-none rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
              rows={4}
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-white/10 px-4 py-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={!content.trim()}
              className="rounded-full border border-white/10 bg-white/[0.12] px-5 py-2 text-xs text-white disabled:opacity-35"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

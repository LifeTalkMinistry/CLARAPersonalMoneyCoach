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
  const [isTextFocused, setIsTextFocused] = useState(false);

  const canPost = content.trim().length > 0;

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
        backdropFilter: visible ? "blur(7px)" : "blur(0px)",
        background:
          "radial-gradient(circle at 50% 16%, rgba(255,255,255,0.05), transparent 30%), linear-gradient(to bottom, rgba(15,23,42,0.26), rgba(2,6,23,0.88))",
        transition: "opacity 300ms ease, backdrop-filter 300ms ease",
      }}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="mx-auto w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/95 shadow-[0_34px_120px_rgba(0,0,0,0.72)] backdrop-blur-2xl"
        style={{
          ...transformStyle,
          transformOrigin: "top center",
          transition: visible
            ? "transform 420ms cubic-bezier(0.16,1,0.3,1), opacity 300ms ease, filter 300ms ease"
            : "transform 240ms cubic-bezier(0.32,0,0.67,0), opacity 200ms ease, filter 200ms ease",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.1), 0 34px 120px rgba(0,0,0,0.72)",
        }}
      >
        <div
          style={{
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? "translateY(0px)" : "translateY(8px)",
            transition: "opacity 180ms ease, transform 180ms ease",
          }}
        >
          <div className="flex items-center justify-between px-4 pb-2 pt-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                Feed Composer
              </p>
              <h2 className="mt-1 text-base font-semibold text-white/92">
                Create post
              </h2>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] text-white/65 transition duration-200 hover:bg-white/[0.085] hover:text-white active:scale-95"
              aria-label="Close post composer"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-3 px-4 pb-4">
            <div className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/[0.035] p-2.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.075] text-xs font-bold text-white/75 shadow-[0_0_18px_rgba(255,255,255,0.04)]">
                JM
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white/85">You</p>
                <p className="text-[11px] text-white/38">
                  Share an insight, win, question, or money lesson
                </p>
              </div>

              <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.055] px-2.5 py-1 text-[10px] font-semibold text-white/45">
                {selectedCategory}
              </span>
            </div>

            <textarea
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              onFocus={() => setIsTextFocused(true)}
              onBlur={() => setIsTextFocused(false)}
              placeholder="What financial lesson do you want to share?"
              className="w-full resize-none rounded-[24px] border px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/35 transition duration-200"
              rows={4}
              style={{
                borderColor: isTextFocused
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(255,255,255,0.1)",
                background: isTextFocused
                  ? "rgba(255,255,255,0.065)"
                  : "rgba(255,255,255,0.04)",
                boxShadow: isTextFocused
                  ? "0 0 0 1px rgba(255,255,255,0.08), 0 18px 50px rgba(0,0,0,0.22)"
                  : "none",
              }}
            />

            <div className="space-y-2">
              <p className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/32">
                Choose post type
              </p>

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
                          ? "scale-[1.04] border-white/25 bg-white/[0.14] text-white/90 shadow-[0_0_20px_rgba(255,255,255,0.055)]"
                          : "border-white/10 bg-white/[0.035] text-white/45 hover:bg-white/[0.06] hover:text-white/70",
                      ].join(" ")}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
            <p className="text-[11px] text-white/32">Keep it honest and helpful.</p>

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
    </div>
  );
}

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

const CLOSE_DELAY = 320;
const DRAG_THRESHOLD = 110;

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
  const dragStart = useRef(null);

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [identityVisible, setIdentityVisible] = useState(false);
  const [chipsVisible, setChipsVisible] = useState(false);

  const [transformStyle, setTransformStyle] = useState({});
  const [isTextFocused, setIsTextFocused] = useState(false);

  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [closing, setClosing] = useState(false);

  const canPost = content.trim().length > 0;
  const dragProgress = Math.min(dragY / DRAG_THRESHOLD, 1);

  // -------------------------
  // OPEN / CLOSE LOGIC
  // -------------------------
  const getOriginTransform = () => {
    const modalRect = modalRef.current?.getBoundingClientRect();
    if (!originRect || !modalRect) {
      return {
        transform: "translateY(10px) scale(0.96)",
        opacity: 0,
      };
    }

    const dx = originRect.left - modalRect.left;
    const dy = originRect.top - modalRect.top;
    const scaleX = originRect.width / modalRect.width;
    const scaleY = originRect.height / modalRect.height;

    return {
      transform: `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`,
      opacity: 0.9,
    };
  };

  const closeWithAnimation = () => {
    if (closing) return;

    setClosing(true);
    setContentVisible(false);
    setIdentityVisible(false);
    setChipsVisible(false);

    setTimeout(() => {
      setTransformStyle(getOriginTransform());
      setVisible(false);
    }, 80);

    setTimeout(() => {
      setMounted(false);
      setClosing(false);
      onClose?.();
    }, CLOSE_DELAY);
  };

  useEffect(() => {
    if (open) {
      setMounted(true);
      setVisible(false);
      setContentVisible(false);
      setIdentityVisible(false);
      setChipsVisible(false);
      setClosing(false);
      setDragY(0);

      requestAnimationFrame(() => {
        setTransformStyle(getOriginTransform());

        requestAnimationFrame(() => {
          setVisible(true);
          setTransformStyle({
            transform: "translate(0,0) scale(1)",
            opacity: 1,
          });

          setTimeout(() => setIdentityVisible(true), 60);
          setTimeout(() => setContentVisible(true), 120);
          setTimeout(() => setChipsVisible(true), 180);
        });
      });
    } else if (mounted && !closing) {
      closeWithAnimation();
    }
  }, [open]);

  // -------------------------
  // DRAG INTERACTION
  // -------------------------
  useEffect(() => {
    const move = (e) => {
      if (!dragStart.current) return;
      const dist = Math.max(e.clientY - dragStart.current, 0);
      setDragY(dist);
      setIsDragging(true);
    };

    const up = () => {
      if (!dragStart.current) return;

      if (dragY > DRAG_THRESHOLD) {
        closeWithAnimation();
      } else {
        setDragY(0);
      }

      dragStart.current = null;
      setIsDragging(false);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [dragY]);

  if (!mounted) return null;

  const dragTransform = dragY
    ? `translateY(${dragY}px) scale(${1 - dragProgress * 0.04}) rotate(${dragProgress * 1.5}deg)`
    : "";

  // -------------------------
  // UI
  // -------------------------
  return (
    <div
      className="fixed inset-0 z-50 px-3 pt-[104px]"
      onClick={closeWithAnimation}
      style={{
        opacity: visible ? 1 : 0,
        backdropFilter: `blur(${visible ? 6 - dragProgress * 3 : 0}px)`,
        background:
          "radial-gradient(circle at 50% 25%, rgba(255,255,255,0.08), transparent 40%), linear-gradient(to bottom, rgba(15,23,42,0.3), rgba(2,6,23,0.9))",
        transition: "all 320ms ease",
      }}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => {
          if (e.target.closest("textarea, button")) return;
          dragStart.current = e.clientY;
        }}
        className="mx-auto w-full max-w-md rounded-[28px] border border-white/10 bg-slate-950/95 backdrop-blur-2xl"
        style={{
          ...transformStyle,
          transform: `${transformStyle.transform || ""} ${dragTransform}`,
          transition: isDragging
            ? "none"
            : "transform 480ms cubic-bezier(0.16,1,0.3,1)",
          boxShadow: `0 ${30 + dragProgress * 10}px ${
            100 - dragProgress * 40
          }px rgba(0,0,0,0.7)`,
        }}
      >
        {/* HEADER */}
        <div
          style={{
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? "translateY(0)" : "translateY(8px)",
            transition: "all 200ms ease",
          }}
        >
          <div className="flex justify-between px-4 pt-4">
            <div>
              <p className="text-[10px] tracking-[0.22em] text-white/35 uppercase">
                Feed Composer
              </p>
              <h2 className="text-white text-base font-semibold">
                Create post
              </h2>
            </div>

            <button onClick={closeWithAnimation}>
              <X size={16} />
            </button>
          </div>

          {/* IDENTITY */}
          <div
            className="mx-4 mt-3 flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/[0.04] p-2.5"
            style={{
              opacity: identityVisible ? 1 : 0,
              transform: identityVisible
                ? "translateY(0)"
                : "translateY(6px)",
              transition: "all 220ms ease",
            }}
          >
            <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.06)]">
              JM
            </div>

            <div>
              <p className="text-white/90 text-sm font-semibold">You</p>
              <p className="text-white/45 text-[11px]">
                Share a win, lesson, or question
              </p>
            </div>
          </div>

          {/* TEXTAREA */}
          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            onFocus={() => setIsTextFocused(true)}
            onBlur={() => setIsTextFocused(false)}
            placeholder="What financial lesson do you want to share?"
            className="w-[calc(100%-2rem)] mx-4 mt-3 rounded-[24px] px-4 py-3 text-white outline-none"
            style={{
              transform: isTextFocused ? "scale(1.01)" : "scale(1)",
              background: isTextFocused
                ? "rgba(255,255,255,0.07)"
                : "rgba(255,255,255,0.04)",
              boxShadow: isTextFocused
                ? "0 0 0 1px rgba(255,255,255,0.08), 0 20px 50px rgba(0,0,0,0.3)"
                : "none",
              transition: "all 200ms ease",
            }}
          />

          {/* CHIPS */}
          <div className="px-4 mt-3 flex gap-2 overflow-x-auto">
            {categories.map((c, i) => {
              const active = c === selectedCategory;
              return (
                <button
                  key={c}
                  onClick={() => onCategoryChange(c)}
                  style={{
                    opacity: chipsVisible ? 1 : 0,
                    transform: chipsVisible
                      ? active
                        ? "translateY(0) scale(1.04)"
                        : "translateY(0)"
                      : "translateY(12px) scale(0.96)",
                    transitionDelay: `${i * 40}ms`,
                    transition: "all 260ms cubic-bezier(0.16,1,0.3,1)",
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs ${
                    active
                      ? "bg-white/15 text-white"
                      : "bg-white/5 text-white/50"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {/* FOOTER */}
          <div className="flex justify-end px-4 py-4">
            <button
              disabled={!canPost}
              onClick={onSubmit}
              className="px-5 py-2 rounded-full bg-white/15 text-white text-xs"
              style={{
                animation: canPost ? "pulse 2.5s infinite" : "none",
              }}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

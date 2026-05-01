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

const CLOSE_DELAY = 420;
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
  const closeTimers = useRef([]);

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [identityVisible, setIdentityVisible] = useState(false);
  const [chipsVisible, setChipsVisible] = useState(false);

  const [transformStyle, setTransformStyle] = useState({});
  const [isTextFocused, setIsTextFocused] = useState(false);
  const [postPressed, setPostPressed] = useState(false);

  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [closing, setClosing] = useState(false);

  const canPost = content.trim().length > 0;
  const dragProgress = Math.min(dragY / DRAG_THRESHOLD, 1);
  const backdropBlur = visible ? Math.max(0, 6 - dragProgress * 5) : 0;

  const clearCloseTimers = () => {
    closeTimers.current.forEach((timer) => clearTimeout(timer));
    closeTimers.current = [];
  };

  const queueTimer = (callback, delay) => {
    const timer = setTimeout(callback, delay);
    closeTimers.current.push(timer);
  };

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

    clearCloseTimers();
    setClosing(true);
    setIsTextFocused(false);
    setPostPressed(false);
    setDragY(0);
    setIsDragging(false);

    setContentVisible(false);
    setIdentityVisible(false);
    setChipsVisible(false);

    queueTimer(() => {
      setTransformStyle(getOriginTransform());
    }, 90);

    queueTimer(() => {
      setVisible(false);
    }, 180);

    queueTimer(() => {
      setMounted(false);
      setClosing(false);
      onClose?.();
    }, CLOSE_DELAY);
  };

  useEffect(() => {
    if (open) {
      clearCloseTimers();

      setMounted(true);
      setVisible(false);
      setContentVisible(false);
      setIdentityVisible(false);
      setChipsVisible(false);
      setClosing(false);
      setDragY(0);
      setIsDragging(false);
      setPostPressed(false);

      requestAnimationFrame(() => {
        setTransformStyle(getOriginTransform());

        requestAnimationFrame(() => {
          setVisible(true);
          setTransformStyle({
            transform: "translate(0,0) scale(1)",
            opacity: 1,
          });

          setTimeout(() => setIdentityVisible(true), 70);
          setTimeout(() => setContentVisible(true), 130);
          setTimeout(() => setChipsVisible(true), 210);
        });
      });
    } else if (mounted && !closing) {
      closeWithAnimation();
    }

    return () => clearCloseTimers();
  }, [open]);

  useEffect(() => {
    const move = (e) => {
      if (!dragStart.current || closing) return;

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
  }, [dragY, closing]);

  if (!mounted) return null;

  const dragTransform = dragY
    ? `translateY(${dragY}px) scale(${1 - dragProgress * 0.04}) rotate(${
        dragProgress * 1.5
      }deg)`
    : "";

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden px-3 pt-[104px]"
      onClick={closeWithAnimation}
      style={{
        opacity: visible ? 1 : 0,
        backdropFilter: `blur(${backdropBlur}px)`,
        WebkitBackdropFilter: `blur(${backdropBlur}px)`,
        background:
          "radial-gradient(circle at 50% 30%, rgba(34,211,238,0.10), transparent 34%), radial-gradient(circle at 50% 48%, rgba(16,185,129,0.09), transparent 36%), linear-gradient(to bottom, rgba(2,6,23,0.40), rgba(2,6,23,0.76) 44%, rgba(0,0,0,0.92))",
        transition: closing
          ? "opacity 240ms ease 140ms, backdrop-filter 320ms ease"
          : "opacity 320ms ease, backdrop-filter 320ms ease",
      }}
    >
      <style>
        {`
          @keyframes claraComposerPostPulse {
            0%, 100% {
              box-shadow: 0 0 0 rgba(255,255,255,0), 0 12px 34px rgba(0,0,0,0.26);
            }
            50% {
              box-shadow: 0 0 28px rgba(255,255,255,0.10), 0 18px 44px rgba(0,0,0,0.34);
            }
          }
        `}
      </style>

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
            : "transform 480ms cubic-bezier(0.16,1,0.3,1), opacity 260ms ease, box-shadow 360ms ease",
          boxShadow: closing
            ? "0 18px 50px rgba(0,0,0,0.56)"
            : `0 ${36 - dragProgress * 14}px ${
                110 - dragProgress * 42
              }px rgba(0,0,0,0.74), 0 0 ${
                34 - dragProgress * 18
              }px rgba(255,255,255,0.045)`,
        }}
      >
        <div
          style={{
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? "translateY(0)" : "translateY(8px)",
            transition: closing
              ? "opacity 160ms ease, transform 160ms ease"
              : "opacity 220ms ease, transform 220ms ease",
          }}
        >
          <div className="flex items-start justify-between px-4 pt-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">
                Feed Composer
              </p>
              <h2 className="text-base font-semibold text-white">
                Create post
              </h2>
            </div>

            <button
              type="button"
              onClick={closeWithAnimation}
              className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-white/65 transition hover:bg-white/[0.07] hover:text-white active:scale-95"
              aria-label="Close composer"
            >
              <X size={16} />
            </button>
          </div>

          <div
            className="mx-4 mt-3 flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/[0.04] p-2.5"
            style={{
              opacity: identityVisible ? 1 : 0,
              transform: identityVisible ? "translateY(0)" : "translateY(8px)",
              transition: closing
                ? "opacity 140ms ease, transform 140ms ease"
                : "opacity 240ms ease, transform 240ms ease",
            }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-xs font-bold text-white/85 shadow-[0_0_26px_rgba(255,255,255,0.10)]">
              JM
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-white/90">You</p>
              <p className="truncate text-[11px] text-white/45">
                Share a win, lesson, or question
              </p>
            </div>
          </div>

          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            onFocus={() => setIsTextFocused(true)}
            onBlur={() => setIsTextFocused(false)}
            placeholder="What financial lesson do you want to share?"
            className="mx-4 mt-3 min-h-[132px] w-[calc(100%-2rem)] resize-none rounded-[24px] border px-4 py-3 text-sm text-white outline-none placeholder:text-white/28"
            style={{
              transform: isTextFocused ? "scale(1.01)" : "scale(1)",
              borderColor: isTextFocused
                ? "rgba(255,255,255,0.20)"
                : "rgba(255,255,255,0.10)",
              background: isTextFocused
                ? "rgba(255,255,255,0.075)"
                : "rgba(255,255,255,0.04)",
              boxShadow: isTextFocused
                ? "0 0 0 1px rgba(255,255,255,0.08), 0 0 34px rgba(255,255,255,0.055), 0 22px 50px rgba(0,0,0,0.34)"
                : "0 10px 28px rgba(0,0,0,0.16)",
              transition:
                "transform 180ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease",
            }}
          />

          <div className="mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
            {categories.map((c, i) => {
              const active = c === selectedCategory;

              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => onCategoryChange(c)}
                  style={{
                    opacity: chipsVisible ? 1 : 0,
                    transform: chipsVisible
                      ? active
                        ? "translateY(0) scale(1.04)"
                        : "translateY(0) scale(1)"
                      : "translateY(12px) scale(0.96)",
                    transition:
                      "opacity 260ms cubic-bezier(0.16,1,0.3,1), transform 260ms cubic-bezier(0.16,1,0.3,1), background 180ms ease, box-shadow 180ms ease",
                    transitionDelay: chipsVisible ? `${i * 40}ms` : "0ms",
                    boxShadow: active
                      ? "0 0 24px rgba(255,255,255,0.09), 0 10px 26px rgba(0,0,0,0.24)"
                      : "none",
                  }}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-xs ${
                    active
                      ? "border-white/18 bg-white/15 text-white"
                      : "border-white/10 bg-white/[0.05] text-white/50"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>

          <div className="flex justify-end px-4 py-4">
            <button
              type="button"
              disabled={!canPost}
              onPointerDown={() => canPost && setPostPressed(true)}
              onPointerUp={() => setPostPressed(false)}
              onPointerLeave={() => setPostPressed(false)}
              onClick={onSubmit}
              className="rounded-full border border-white/10 bg-white/15 px-5 py-2 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-white/[0.05] disabled:text-white/35"
              style={{
                opacity: canPost ? 1 : 0.45,
                transform: postPressed ? "scale(0.97)" : "scale(1)",
                animation: canPost
                  ? "claraComposerPostPulse 2.4s ease-in-out infinite"
                  : "none",
                boxShadow: canPost
                  ? "0 14px 34px rgba(0,0,0,0.30)"
                  : "none",
                transition:
                  "transform 140ms ease, opacity 180ms ease, box-shadow 180ms ease, background 180ms ease",
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

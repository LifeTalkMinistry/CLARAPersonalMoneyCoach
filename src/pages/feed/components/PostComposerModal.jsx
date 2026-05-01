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
  if (!open) return null;

  const canPost = content.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 px-3 pb-3 backdrop-blur-[3px] animate-in fade-in duration-200 sm:items-center sm:pb-0">
      <div className="w-full max-w-md overflow-hidden rounded-[26px] border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-2xl animate-in slide-in-from-bottom-6 zoom-in-95 duration-300 sm:slide-in-from-bottom-0">
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-white/20" />

        <div className="flex items-center justify-between px-4 pb-3 pt-4">
          <h2 className="text-base font-semibold text-white/90">
            Create post
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] text-white/55 transition hover:bg-white/[0.075] hover:text-white/80"
            aria-label="Close post composer"
          >
            <X size={17} />
          </button>
        </div>

        <div className="space-y-3 px-4 pb-4">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] text-xs font-semibold text-white/75">
              JM
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white/85">You</p>
              <p className="text-[11px] text-white/35">Share a money lesson</p>
            </div>
          </div>

          <textarea
            value={content}
            onChange={(event) => onContentChange(event.target.value)}
            rows={4}
            placeholder="What financial lesson do you want to share?"
            className="w-full resize-none rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/30 focus:border-white/20 focus:bg-white/[0.06]"
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
                    "shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition",
                    active
                      ? "border-white/20 bg-white/[0.12] text-white/85"
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
              onClick={onClose}
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white/55 transition hover:bg-white/[0.07] hover:text-white/75"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onSubmit}
              disabled={!canPost}
              className="rounded-full border border-white/10 bg-white/[0.12] px-5 py-2 text-xs font-semibold text-white/85 transition hover:bg-white/[0.16] disabled:cursor-not-allowed disabled:opacity-35"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

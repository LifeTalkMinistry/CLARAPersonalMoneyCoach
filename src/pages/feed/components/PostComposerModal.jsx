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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/75 px-4 pb-4 backdrop-blur-sm sm:items-center sm:pb-0">
      <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
              Create post
            </p>
            <h2 className="mt-1 text-base font-semibold text-white/90">
              Share a money lesson
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] text-white/55 transition hover:bg-white/[0.075] hover:text-white/80"
            aria-label="Close post composer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-sm font-semibold text-white/80">
              JM
            </div>

            <div>
              <p className="text-sm font-semibold text-white/85">You</p>
              <p className="text-xs text-white/35">Posting to CLARA Feed</p>
            </div>
          </div>

          <textarea
            value={content}
            onChange={(event) => onContentChange(event.target.value)}
            rows={6}
            placeholder="What financial lesson do you want to share?"
            className="w-full resize-none rounded-[22px] border border-white/10 bg-white/[0.045] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/30 focus:border-white/20 focus:bg-white/[0.06]"
          />

          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
              Category
            </p>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const active = selectedCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => onCategoryChange(category)}
                    className={[
                      "rounded-full border px-3 py-1.5 text-[11px] font-medium transition",
                      active
                        ? "border-white/20 bg-white/[0.12] text-white/85"
                        : "border-white/10 bg-white/[0.045] text-white/50 hover:bg-white/[0.075] hover:text-white/70",
                    ].join(" ")}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-white/10 px-4 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-xs font-semibold text-white/55 transition hover:bg-white/[0.075] hover:text-white/75"
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
  );
}

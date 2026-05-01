export default function PostCard({ post }) {
  const initials = post?.name?.slice(0, 2).toUpperCase() || "CL";
  const category = post?.category || "Insight";

  return (
    <article
      className="rounded-[24px] p-4 backdrop-blur-xl"
      style={{
        background: "var(--clara-card)",
        border: "1px solid var(--clara-border)",
        boxShadow: "var(--clara-glow-premium)",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-semibold"
          style={{
            border: "1px solid var(--clara-border)",
            background: "var(--clara-panel)",
            color: "var(--clara-text)",
          }}
        >
          {initials}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold" style={{ color: "var(--clara-text)" }}>
              {post.name}
            </h3>

            <span
              className="rounded-full px-2 py-0.5 text-[10px] uppercase"
              style={{
                border: "1px solid var(--clara-border)",
                background: "var(--clara-accent-soft)",
                color: "var(--clara-accent-text)",
              }}
            >
              {category}
            </span>
          </div>

          <p className="mt-3 text-sm" style={{ color: "var(--clara-text-soft)" }}>
            {post.content}
          </p>

          <div
            className="mt-4 flex gap-2 border-t pt-3 text-xs"
            style={{
              borderColor: "var(--clara-border)",
              color: "var(--clara-text-muted)",
            }}
          >
            <button>Reflect</button>
            <button>Comment</button>
            <button>Share</button>
          </div>
        </div>
      </div>
    </article>
  );
}

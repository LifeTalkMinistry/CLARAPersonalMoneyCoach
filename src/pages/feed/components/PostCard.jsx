import { Heart, MessageCircle, Share2 } from "lucide-react";

export default function PostCard({ post }) {
  const initials = post?.name?.slice(0, 2).toUpperCase() || "CL";

  return (
    <article
      className={[
        "rounded-[24px] border bg-white/[0.04] p-4 backdrop-blur-xl transition",
        "hover:border-white/15 hover:bg-white/[0.055]",
        post.isFeatured
          ? "border-white/15 shadow-[0_0_30px_rgba(255,255,255,0.045)]"
          : "border-white/10",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] text-xs font-semibold text-white shadow-[0_0_18px_rgba(255,255,255,0.05)]">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-white">{post.name}</h3>

            <span className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
              {post.badge}
            </span>

            {post.isFeatured && (
              <span className="rounded-full border border-white/10 bg-white/[0.07] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
                CLARA Insight
              </span>
            )}
          </div>

          <p className="mt-3 text-sm leading-6 text-white/75">
            {post.content}
          </p>

          {post.tag && (
            <p className="mt-3 text-xs font-medium text-white/40">
              {post.tag}
            </p>
          )}

          <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3">
            <Action icon={<Heart size={15} />} label="Reflect" />
            <Action icon={<MessageCircle size={15} />} label="Discuss" />
            <Action icon={<Share2 size={15} />} label="Share" />
          </div>
        </div>
      </div>
    </article>
  );
}

function Action({ icon, label }) {
  return (
    <button
      type="button"
      className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium text-white/45 transition hover:bg-white/[0.05] hover:text-white/70"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

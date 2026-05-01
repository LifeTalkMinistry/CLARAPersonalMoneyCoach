import { Heart, MessageCircle, Share2 } from "lucide-react";

export default function PostCard({ post }) {
  const initials = post?.name?.slice(0, 2).toUpperCase() || "CL";

  return (
    <article
      className={[
        "group relative overflow-hidden rounded-[24px] border bg-white/[0.04] p-4 backdrop-blur-xl transition duration-300",
        "shadow-[0_18px_50px_rgba(0,0,0,0.18)] hover:border-white/15 hover:bg-white/[0.055] hover:shadow-[0_0_30px_rgba(255,255,255,0.045)]",
        post.isFeatured
          ? "border-white/15 shadow-[0_0_34px_rgba(255,255,255,0.055)]"
          : "border-white/10",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.07] via-white/[0.018] to-transparent opacity-75" />
      <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {post.isFeatured && (
        <>
          <div className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-inset ring-white/[0.08]" />
          <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/[0.035] blur-2xl" />
        </>
      )}

      <div className="relative flex items-start gap-3">
        <div
          className={[
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-xs font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
            post.isFeatured
              ? "border-white/15 bg-white/[0.085]"
              : "border-white/10 bg-white/[0.065]",
          ].join(" ")}
        >
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-white/90">
              {post.name}
            </h3>

            <span className="rounded-full border border-white/10 bg-white/[0.045] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
              {post.badge}
            </span>

            {post.isFeatured && (
              <span className="rounded-full border border-white/15 bg-white/[0.07] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/58 shadow-[0_0_18px_rgba(255,255,255,0.035)]">
                CLARA Insight
              </span>
            )}
          </div>

          <p className="mt-3 text-sm leading-6 text-white/74">
            {post.content}
          </p>

          {post.tag && (
            <p className="mt-3 text-xs font-medium text-white/38">
              {post.tag}
            </p>
          )}

          <div className="mt-4 flex items-center gap-1.5 border-t border-white/10 pt-3">
            <Action icon={<Heart size={14} />} label="Reflect" />
            <Action icon={<MessageCircle size={14} />} label="Discuss" />
            <Action icon={<Share2 size={14} />} label="Share" />
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
      className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium text-white/40 transition duration-200 hover:bg-white/[0.045] hover:text-white/70"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

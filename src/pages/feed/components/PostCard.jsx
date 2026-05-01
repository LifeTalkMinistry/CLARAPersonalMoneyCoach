export default function PostCard({ post }) {
  const initials = post?.name?.slice(0, 2).toUpperCase() || "CL";
  const category = post?.category || "Insight";

  return (
    <article className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.065] text-xs font-semibold text-white">
          {initials}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white/90">
              {post.name}
            </h3>

            <span className="rounded-full border border-white/10 bg-white/[0.045] px-2 py-0.5 text-[10px] uppercase text-white/40">
              {category}
            </span>
          </div>

          <p className="mt-3 text-sm text-white/70">
            {post.content}
          </p>

          <div className="mt-4 flex gap-2 border-t border-white/10 pt-3 text-xs text-white/45">
            <button className="hover:text-white/70">Reflect</button>
            <button className="hover:text-white/70">Comment</button>
            <button className="hover:text-white/70">Share</button>
          </div>
        </div>
      </div>
    </article>
  );
}

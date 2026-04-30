export default function Item({ icon, title, description, right, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full border-b border-white/[0.07] px-4 py-3.5 text-left transition last:border-b-0 hover:bg-white/[0.045] active:bg-white/[0.07]"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-white/10 bg-white/[0.09] text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition group-active:scale-95">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[14px] font-semibold tracking-[-0.01em] text-white">
            {title}
          </h3>

          {description && (
            <p className="mt-0.5 line-clamp-1 text-[12px] leading-5 text-white/42">
              {description}
            </p>
          )}
        </div>

        {right && <div className="shrink-0">{right}</div>}
      </div>
    </button>
  );
}

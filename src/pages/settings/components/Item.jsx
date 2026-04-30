export default function Item({
  icon,
  title,
  description,
  right,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-[22px] border border-white/10 bg-white/[0.045] p-4 text-left transition hover:bg-white/[0.07]"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white/80">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-white">
            {title}
          </h3>

          {description && (
            <p className="mt-0.5 text-xs text-white/45">
              {description}
            </p>
          )}
        </div>

        {right && (
          <div className="shrink-0">
            {right}
          </div>
        )}
      </div>
    </button>
  );
}

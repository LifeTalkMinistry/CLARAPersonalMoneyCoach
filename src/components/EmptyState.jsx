export default function EmptyState({
  icon: Icon,
  title = "Nothing here yet",
  description = "Check back again later.",
  action = null,
  className = "",
}) {
  return (
    <div
      className={`rounded-[28px] border border-white/10 bg-white/[0.05] p-6 text-center shadow-[0_18px_44px_rgba(0,0,0,0.22)] backdrop-blur-2xl ${className}`}
    >
      {Icon ? (
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-[color:var(--theme-accent)]">
          <Icon className="h-6 w-6" />
        </div>
      ) : null}

      <h3 className="text-base font-semibold text-white">{title}</h3>

      {description ? (
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/55">
          {description}
        </p>
      ) : null}

      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

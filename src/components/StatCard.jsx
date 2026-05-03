export default function StatCard({
  label = "",
  value = "-",
  sub = "",
  icon: Icon = null,
  variant = "default",
  className = "",
  highlight = false,
}) {
  const variants = {
    default: {
      wrapper:
        "theme-panel-card backdrop-blur-xl shadow-[0_10px_24px_rgba(0,0,0,0.18)]",
      icon: "border border-white/10 bg-white/[0.06] text-white",
      value: "text-white",
      label: "text-white/75",
      sub: "text-white/60",
    },
    yellow: {
      wrapper:
        "border border-white/14 bg-[linear-gradient(180deg,rgba(42,36,18,0.68)_0%,rgba(24,22,12,0.58)_100%)] backdrop-blur-xl shadow-[0_10px_24px_rgba(0,0,0,0.18)]",
      icon: "border border-white/10 bg-white/[0.06] text-[#FFF4B0]",
      value: "text-white",
      label: "text-[#FDE68A]",
      sub: "text-[#FFF7CC]",
    },
    green: {
      wrapper:
        "border border-white/14 bg-[linear-gradient(180deg,rgba(16,42,34,0.66)_0%,rgba(10,24,22,0.58)_100%)] backdrop-blur-xl shadow-[0_10px_24px_rgba(0,0,0,0.18)]",
      icon: "border border-white/10 bg-white/[0.06] text-white",
      value: "text-white",
      label: "text-white/80",
      sub: "text-white/65",
    },
    blue: {
      wrapper:
        "border border-white/14 bg-[linear-gradient(180deg,rgba(18,36,52,0.66)_0%,rgba(12,22,30,0.58)_100%)] backdrop-blur-xl shadow-[0_10px_24px_rgba(0,0,0,0.18)]",
      icon: "border border-white/10 bg-white/[0.06] text-white",
      value: "text-white",
      label: "text-white/80",
      sub: "text-white/65",
    },
    danger: {
      wrapper:
        "border border-white/14 bg-[linear-gradient(180deg,rgba(48,18,20,0.68)_0%,rgba(28,14,16,0.60)_100%)] backdrop-blur-xl shadow-[0_10px_24px_rgba(0,0,0,0.18)]",
      icon: "border border-white/10 bg-white/[0.06] text-red-200",
      value: "text-white",
      label: "text-red-200",
      sub: "text-red-100",
    },
  };

  const v = variants[variant] || variants.default;

  return (
    <div
      className={`flex h-full flex-col rounded-2xl p-4 transition-all duration-300 active:scale-[0.97] hover:scale-[1.01] ${
        highlight
          ? "ring-1 ring-white/12 shadow-[0_14px_28px_rgba(0,0,0,0.14)]"
          : ""
      } ${v.wrapper} ${className}`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span
          className={`text-[11px] font-semibold uppercase tracking-wide ${v.label}`}
        >
          {label}
        </span>

        {Icon ? (
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${v.icon}`}
          >
            <Icon className="h-4 w-4" />
          </div>
        ) : null}
      </div>

      <p className={`break-words text-2xl font-bold leading-tight ${v.value}`}>
        {value}
      </p>

      {sub ? (
        <p className={`mt-2 text-sm leading-snug ${v.sub}`}>
          {sub}
        </p>
      ) : null}

      <div className="mt-auto pt-4">
        <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/5">
          <div className="h-full w-[60%] rounded-full bg-white/20" />
        </div>
      </div>
    </div>
  );
}

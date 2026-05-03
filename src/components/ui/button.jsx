import React from "react";

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-2xl text-sm font-medium transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20";

const variants = {
  default:
    "border border-white/10 bg-white/[0.07] text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)] backdrop-blur-xl hover:bg-white/[0.1]",
  secondary:
    "border border-white/10 bg-white/[0.05] text-white/80 backdrop-blur-xl hover:bg-white/[0.08]",
  ghost: "text-white/75 hover:bg-white/[0.06] hover:text-white",
  destructive:
    "border border-rose-400/20 bg-rose-500/12 text-rose-200 hover:bg-rose-500/18",
  outline:
    "border border-white/12 bg-transparent text-white/80 hover:bg-white/[0.06]",
};

const sizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-xl px-3",
  lg: "h-11 rounded-2xl px-6",
  icon: "h-10 w-10",
};

export const Button = React.forwardRef(
  ({ className = "", variant = "default", size = "default", type = "button", ...props }, ref) => {
    const variantClass = variants[variant] || variants.default;
    const sizeClass = sizes[size] || sizes.default;

    return (
      <button
        ref={ref}
        type={type}
        className={`${baseClasses} ${variantClass} ${sizeClass} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

import React from "react";

export const Input = React.forwardRef(({ className = "", type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={`flex h-10 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder:text-white/40 backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 ${className}`}
      {...props}
    />
  );
});

Input.displayName = "Input";

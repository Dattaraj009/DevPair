import React from "react";

const Button = React.forwardRef(
  ({ className = "", variant = "default", size = "default", children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const variants = {
      default:
        "bg-[#00E5FF] text-black shadow-[0_0_20px_rgba(0,229,255,0.25)] hover:bg-[#00f5ff] hover:shadow-[0_0_32px_rgba(0,229,255,0.4)] hover:-translate-y-[1px]",
      outline:
        "border border-[rgba(0,229,255,0.15)] text-[#EDF2FF] hover:border-[rgba(0,229,255,0.4)] hover:bg-white/5",
      ghost:
        "text-[#8899BB] hover:text-[#EDF2FF] hover:bg-white/5",
    };

    const sizes = {
      default: "px-6 py-2.5 text-sm",
      sm: "px-4 py-1.5 text-xs",
      lg: "px-8 py-3.5 text-base",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant] ?? variants.default} ${sizes[size] ?? sizes.default} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
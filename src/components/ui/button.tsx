"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "subtle";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  shortcut?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      shortcut,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-medium transition-all duration-150 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-amber-500 text-black font-semibold hover:bg-amber-400 shadow-[0_1px_2px_rgba(0,0,0,0.4),0_0_12px_rgba(245,158,11,0.2)] hover:shadow-[0_0_16px_rgba(245,158,11,0.35)]",
      secondary:
        "bg-[#111420] text-gray-200 hover:bg-[#181d2e] border border-white/[0.08] hover:border-white/[0.14] hover:text-white shadow-xs",
      outline:
        "bg-transparent text-gray-300 border border-white/[0.10] hover:bg-white/[0.04] hover:text-white hover:border-white/[0.2]",
      ghost:
        "bg-transparent text-gray-400 hover:text-white hover:bg-white/[0.05]",
      destructive:
        "bg-rose-600/90 text-white hover:bg-rose-600 border border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.2)]",
      subtle:
        "bg-amber-500/10 text-amber-300 hover:bg-amber-500/18 border border-amber-500/20",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs rounded-md gap-1.5",
      md: "h-9 px-4 text-xs font-medium rounded-lg gap-2",
      lg: "h-11 px-5 text-sm font-medium rounded-lg gap-2.5",
      icon: "h-9 w-9 rounded-lg p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />}
        {children}
        {shortcut && !isLoading && (
          <span className="ml-1 text-[10px] font-mono opacity-50 px-1 py-0.2 rounded bg-black/30 border border-white/[0.08]">
            {shortcut}
          </span>
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

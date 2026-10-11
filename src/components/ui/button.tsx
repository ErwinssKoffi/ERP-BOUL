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
      "relative inline-flex items-center justify-center font-medium transition-all duration-150 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0070f3]/70 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]";

    // Style Vercel pur : Boutons en bleu Vercel (#0070f3) et contrastes sobres
    const variantStyles = {
      primary:
        "bg-[#0070f3] text-white font-medium hover:bg-[#0060df] shadow-[0_1px_2px_rgba(0,112,243,0.3)] border border-[#0070f3]",
      secondary:
        "bg-white text-black font-medium hover:bg-[#eaeaea] border border-[#eaeaea] dark:bg-white dark:text-black dark:hover:bg-[#eaeaea] dark:border-white shadow-xs",
      outline:
        "bg-transparent text-[#ededed] border border-[#333333] hover:border-[#0070f3] hover:text-[#0070f3] hover:bg-[#0070f3]/10",
      ghost:
        "bg-transparent text-[#888888] hover:text-[#ededed] hover:bg-white/[0.06]",
      destructive:
        "bg-[#e00] text-white hover:bg-[#c00] border border-[#e00] shadow-xs",
      subtle:
        "bg-[#0070f3]/15 text-[#0070f3] hover:bg-[#0070f3]/25 border border-[#0070f3]/30",
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
          <span className="ml-1 text-[10px] font-mono opacity-70 px-1 py-0.2 rounded bg-black/40 border border-white/20">
            {shortcut}
          </span>
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

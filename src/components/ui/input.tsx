import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-lg border bg-[#0d101a] px-3 py-1.5 text-xs text-gray-100 placeholder:text-gray-500",
          "border-[#20273a] hover:border-[#2d374f] focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30",
          "disabled:cursor-not-allowed disabled:opacity-50 transition-colors font-sans",
          error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

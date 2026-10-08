import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border bg-[#0d101a] px-3 py-2 text-xs text-gray-100 placeholder:text-gray-500",
          "border-[#20273a] hover:border-[#2d374f] focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30",
          "disabled:cursor-not-allowed disabled:opacity-50 transition-colors font-sans resize-y",
          error && "border-rose-500 focus:border-rose-500",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

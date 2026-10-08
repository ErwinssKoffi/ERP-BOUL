import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            "flex h-9 w-full appearance-none rounded-lg border bg-[#0d101a] pl-3 pr-8 py-1.5 text-xs text-gray-100",
            "border-[#20273a] hover:border-[#2d374f] focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30",
            "disabled:cursor-not-allowed disabled:opacity-50 transition-colors font-sans cursor-pointer",
            error && "border-rose-500 focus:border-rose-500",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    );
  }
);
Select.displayName = "Select";

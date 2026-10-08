import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, onChange, disabled, ...props }, ref) => {
    return (
      <label
        className={cn(
          "relative inline-flex items-center cursor-pointer select-none",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <input
          type="checkbox"
          ref={ref}
          disabled={disabled}
          checked={checked}
          onChange={(e) => {
            onChange?.(e);
            onCheckedChange?.(e.target.checked);
          }}
          className="sr-only peer"
          {...props}
        />
        <div
          className={cn(
            "w-9 h-5 rounded-full bg-[#161a29] border border-[#232a3f] transition-colors relative",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-amber-500/40",
            "peer-checked:bg-amber-500 peer-checked:border-amber-500",
            className
          )}
        >
          <div
            className={cn(
              "w-3.5 h-3.5 rounded-full bg-gray-300 absolute top-[2px] left-[2px] transition-transform",
              "peer-checked:translate-x-4 peer-checked:bg-black"
            )}
          />
        </div>
      </label>
    );
  }
);
Switch.displayName = "Switch";

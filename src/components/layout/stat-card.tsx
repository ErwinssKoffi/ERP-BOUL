import * as React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  change?: {
    value: string;
    trend: "up" | "down" | "neutral";
  };
  icon?: React.ReactNode;
  hint?: string;
  accent?: boolean;
  className?: string;
}

export function StatCard({
  label,
  value,
  subValue,
  change,
  icon,
  hint,
  accent = false,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-[#222222] bg-[#0a0a0a] p-4 text-[#ededed] space-y-2 transition-all duration-200 overflow-hidden group hover:border-[#0070f3]/60 hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-[0_8px_24px_rgba(0,112,243,0.12)] cursor-default",
        "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/[0.12] before:to-transparent",
        accent && "border-white/20 bg-gradient-to-b from-white/[0.03] to-transparent",
        className
      )}
    >
      <div className="flex items-center justify-between text-xs text-[#888888]">
        <span className="font-medium tracking-wide text-[#a1a1aa]">{label}</span>
        {icon && (
          <div className="text-[#888888] group-hover:text-white transition-colors">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline space-x-2">
        <div className="text-2xl font-bold tracking-tight text-white font-mono">
          {value}
        </div>
        {subValue && <span className="text-xs text-[#888888] font-mono">{subValue}</span>}
      </div>

      {(change || hint) && (
        <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#1f1f1f] text-[#888888]">
          {change ? (
            <div
              className={cn(
                "flex items-center space-x-1 font-mono",
                change.trend === "up" && "text-[#ededed] font-medium",
                change.trend === "down" && "text-[#888888]",
                change.trend === "neutral" && "text-[#888888]"
              )}
            >
              {change.trend === "up" && <TrendingUp className="w-3 h-3 text-[#ededed]" />}
              {change.trend === "down" && <TrendingDown className="w-3 h-3 text-[#888888]" />}
              <span>{change.value}</span>
            </div>
          ) : (
            <span />
          )}

          {hint && <span className="text-[#71717a] font-mono">{hint}</span>}
        </div>
      )}
    </div>
  );
}

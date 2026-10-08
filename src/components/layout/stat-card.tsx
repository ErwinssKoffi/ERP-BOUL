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
        "relative rounded-xl border border-white/[0.08] bg-[#0c0e17] p-4 text-gray-100 space-y-2 transition-all duration-200 overflow-hidden group hover:border-white/[0.16]",
        "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/[0.12] before:to-transparent",
        accent && "border-amber-500/30 bg-gradient-to-b from-amber-500/[0.04] to-transparent shadow-[0_0_20px_rgba(245,158,11,0.06)]",
        className
      )}
    >
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="font-medium tracking-wide text-gray-300">{label}</span>
        {icon && (
          <div className="text-gray-400 group-hover:text-amber-400 transition-colors">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline space-x-2">
        <div className="text-2xl font-bold tracking-tight text-white font-mono">
          {value}
        </div>
        {subValue && <span className="text-xs text-gray-400 font-mono">{subValue}</span>}
      </div>

      {(change || hint) && (
        <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-white/[0.05] text-gray-400">
          {change ? (
            <div
              className={cn(
                "flex items-center space-x-1 font-mono",
                change.trend === "up" && "text-emerald-400",
                change.trend === "down" && "text-rose-400",
                change.trend === "neutral" && "text-gray-400"
              )}
            >
              {change.trend === "up" && <TrendingUp className="w-3 h-3" />}
              {change.trend === "down" && <TrendingDown className="w-3 h-3" />}
              <span>{change.value}</span>
            </div>
          ) : (
            <span />
          )}

          {hint && <span className="text-gray-400">{hint}</span>}
        </div>
      )}
    </div>
  );
}

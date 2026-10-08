import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "destructive" | "outline" | "dot";
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const base =
    "inline-flex items-center text-[10px] font-medium font-mono px-2 py-0.5 rounded-md transition-colors";

  const variants = {
    default: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
    secondary: "bg-[#161b2a] text-gray-300 border border-[#262f45]",
    success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
    destructive: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
    outline: "text-gray-300 border border-[#23293a] bg-transparent",
    dot: "bg-transparent text-gray-300 px-0 py-0 flex items-center gap-1.5 font-sans text-xs",
  };

  return (
    <div className={cn(base, variants[variant], className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Indicateur de statut conforme à la discipline "Zero-Pill"
 * Un texte discret non encapsulé dans une pilule, avec point lumineux subtil.
 */
export function StatusIndicator({
  status,
  label,
  className,
}: {
  status: "active" | "idle" | "warning" | "error";
  label: string;
  className?: string;
}) {
  const dotColors = {
    active: "bg-emerald-400",
    idle: "bg-gray-400",
    warning: "bg-amber-400",
    error: "bg-rose-400",
  };

  return (
    <div className={cn("inline-flex items-center space-x-1.5 text-xs text-gray-300", className)}>
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColors[status])} />
      <span>{label}</span>
    </div>
  );
}

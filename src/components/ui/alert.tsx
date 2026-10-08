import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "destructive";
  title?: string;
}

export function Alert({ variant = "default", title, children, className, ...props }: AlertProps) {
  const icons = {
    default: <Info className="w-4 h-4 text-sky-400 shrink-0" />,
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
    destructive: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
  };

  const variantStyles = {
    default: "bg-sky-950/20 border-sky-800/40 text-sky-200",
    success: "bg-emerald-950/20 border-emerald-800/40 text-emerald-200",
    warning: "bg-amber-950/20 border-amber-800/40 text-amber-200",
    destructive: "bg-rose-950/20 border-rose-800/40 text-rose-200",
  };

  return (
    <div
      className={cn("flex items-start space-x-3 rounded-xl border p-3.5 text-xs", variantStyles[variant], className)}
      role="alert"
      {...props}
    >
      <div className="mt-0.5">{icons[variant]}</div>
      <div className="flex-1 space-y-0.5">
        {title && <h5 className="font-semibold text-white leading-tight">{title}</h5>}
        <div className="text-gray-300 leading-relaxed text-xs">{children}</div>
      </div>
    </div>
  );
}

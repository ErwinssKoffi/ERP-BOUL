import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
}

export function FormField({
  label,
  hint,
  error,
  required,
  children,
  className,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)} {...props}>
      {label && (
        <label className="block text-xs font-medium text-gray-300">
          {label}
          {required && <span className="text-amber-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-[11px] text-gray-500 leading-normal">{hint}</p>}
      {error && <p className="text-[11px] text-rose-400 font-medium leading-normal">{error}</p>}
    </div>
  );
}

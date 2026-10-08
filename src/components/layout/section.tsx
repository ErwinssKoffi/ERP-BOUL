import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function Section({ title, description, action, children, className, ...props }: SectionProps) {
  return (
    <section className={cn("space-y-4", className)} {...props}>
      {(title || action) && (
        <div className="flex items-center justify-between pb-1">
          <div>
            {title && <h2 className="text-sm font-semibold text-white tracking-tight">{title}</h2>}
            {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

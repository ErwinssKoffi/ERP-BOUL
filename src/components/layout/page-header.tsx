import * as React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
  kpiSlot?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  kpiSlot,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col space-y-3 pb-4 border-b border-[#1b2132]", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-1.5 text-xs text-gray-500 font-mono">
          {breadcrumbs.map((b, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="text-gray-600">/</span>}
              <span className={cn(i === breadcrumbs.length - 1 ? "text-gray-300 font-medium" : "text-gray-500")}>
                {b.label}
              </span>
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-tight">{title}</h1>
          {description && <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">{description}</p>}
        </div>

        {actions && <div className="flex items-center space-x-2.5 shrink-0">{actions}</div>}
      </div>

      {kpiSlot && <div className="pt-2">{kpiSlot}</div>}
    </div>
  );
}

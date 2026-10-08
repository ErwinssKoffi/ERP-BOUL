"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function AccordionItem({ title, children, defaultOpen = false, className }: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className={cn("border border-[#1e2538] bg-[#0d101a] rounded-xl overflow-hidden mb-2", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left text-xs font-semibold text-white hover:bg-[#131724] transition-colors"
      >
        <span>{title}</span>
        <ChevronDown
          className={cn("w-4 h-4 text-gray-400 transition-transform duration-200", isOpen && "rotate-180")}
        />
      </button>
      {isOpen && <div className="p-4 pt-1 text-xs text-gray-300 border-t border-[#181d2a] animate-fadeIn">{children}</div>}
    </div>
  );
}

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Calendar, ChevronDown, Check } from "lucide-react";

export type DateRangePeriod = "today" | "7days" | "30days" | "month";

export interface DateRangeOption {
  id: DateRangePeriod;
  label: string;
  subLabel?: string;
}

export const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { id: "today", label: "Aujourd'hui", subLabel: "05h - 19h · Débit en direct" },
  { id: "7days", label: "7 Derniers Jours", subLabel: "Semaine glissante · Tendance" },
  { id: "30days", label: "30 Derniers Jours", subLabel: "Anticipation trésorerie & charges" },
  { id: "month", label: "Ce Mois-ci (Octobre)", subLabel: "Clôture d'exploitation" },
];

export function DateRangeDropdown({
  value,
  onChange,
  className,
}: {
  value: DateRangePeriod;
  onChange: (val: DateRangePeriod) => void;
  className?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const selectedOption =
    DATE_RANGE_OPTIONS.find((opt) => opt.id === value) || DATE_RANGE_OPTIONS[1];

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className={cn("relative inline-block text-left select-none", className)} ref={dropdownRef}>
      {/* Trigger Button Vercel-style */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#0a0a0a] border border-[#262626] hover:border-[#404040] text-xs text-white transition-all cursor-pointer shadow-xs"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <Calendar className="w-3.5 h-3.5 text-[#888888]" />
        <span className="font-medium text-[#ededed]">{selectedOption.label}</span>
        <ChevronDown className={cn("w-3 h-3 text-[#888888] transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {/* Menu Options */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-1.5 w-64 rounded-xl border border-[#262626] bg-[#0a0a0a] p-1.5 text-xs text-[#ededed] shadow-2xl shadow-black animate-scaleUp">
          <div className="px-2.5 py-1 text-[10px] font-mono uppercase text-[#888888] tracking-wider border-b border-[#1f1f1f] mb-1">
            Période d'Analyse
          </div>

          <div className="space-y-0.5">
            {DATE_RANGE_OPTIONS.map((opt) => {
              const isSelected = opt.id === value;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onChange(opt.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-left transition-colors cursor-pointer",
                    isSelected
                      ? "bg-[#171717] text-white font-medium"
                      : "text-[#a1a1aa] hover:bg-[#121212] hover:text-white"
                  )}
                >
                  <div>
                    <div className="text-xs font-medium text-white">{opt.label}</div>
                    {opt.subLabel && (
                      <div className="text-[10px] font-mono text-[#71717a]">{opt.subLabel}</div>
                    )}
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#0070f3] ml-2 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

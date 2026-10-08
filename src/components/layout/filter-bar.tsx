"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export interface FilterBarProps {
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  facets?: React.ReactNode;
  activeFilterCount?: number;
  onClearFilters?: () => void;
  className?: string;
}

export function FilterBar({
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Rechercher...",
  facets,
  activeFilterCount = 0,
  onClearFilters,
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-2 rounded-xl bg-[#0c0f18] border border-[#1e2538]",
        className
      )}
    >
      <div className="relative flex-1 min-w-[200px]">
        <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <Input
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-8 bg-[#090b12] border-[#1b2132]"
        />
        {searchValue && (
          <button
            onClick={() => onSearchChange?.("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {facets}

        {activeFilterCount > 0 && onClearFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-gray-400 text-xs">
            Effacer ({activeFilterCount})
          </Button>
        )}
      </div>
    </div>
  );
}

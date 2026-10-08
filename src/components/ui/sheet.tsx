"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  side?: "right" | "left";
  children?: React.ReactNode;
  className?: string;
}

export function Sheet({
  isOpen,
  onClose,
  title,
  description,
  side = "right",
  children,
  className,
}: SheetProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div
        className={cn(
          "fixed inset-y-0 max-w-full flex",
          side === "right" ? "right-0 pl-10" : "left-0 pr-10"
        )}
      >
        <div
          className={cn(
            "w-screen max-w-md bg-[#0c0f18] border-[#1e2538] text-gray-100 p-6 shadow-2xl flex flex-col justify-between",
            side === "right" ? "border-l" : "border-r",
            className
          )}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1b2132] pb-4">
              <div>
                {title && <h2 className="text-base font-semibold text-white tracking-tight">{title}</h2>}
                {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-gray-400 hover:text-white hover:bg-[#151a28] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh-160px)] pr-1">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

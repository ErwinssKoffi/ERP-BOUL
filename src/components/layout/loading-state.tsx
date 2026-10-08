import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface LoadingStateProps {
  label?: string;
  className?: string;
}

export function LoadingState({ label = "Chargement des données...", className }: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 space-y-3 text-center", className)}>
      <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
      <span className="text-xs text-gray-400 font-mono">{label}</span>
    </div>
  );
}

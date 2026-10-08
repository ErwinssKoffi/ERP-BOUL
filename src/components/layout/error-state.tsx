import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Une erreur est survenue",
  message = "Impossible de charger les informations demandées.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-10 text-center rounded-2xl border border-rose-900/30 bg-rose-950/10 space-y-3",
        className
      )}
    >
      <div className="w-11 h-11 rounded-xl bg-rose-900/20 border border-rose-800/40 flex items-center justify-center text-rose-400">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="text-sm font-semibold text-white">{title}</h4>
        <p className="text-xs text-rose-300/80 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-2 border-rose-800/50 hover:bg-rose-950/30">
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Réessayer
        </Button>
      )}
    </div>
  );
}

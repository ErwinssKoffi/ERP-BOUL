import * as React from "react";
import { cn } from "@/lib/utils";

export function Avatar({
  name,
  role,
  size = "md",
  className,
}: {
  name: string;
  role?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sizeStyles = {
    sm: "w-7 h-7 text-[10px]",
    md: "w-9 h-9 text-xs",
    lg: "w-11 h-11 text-sm",
  };

  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 font-bold text-black flex items-center justify-center shrink-0 border border-amber-300/40 select-none shadow-sm",
        sizeStyles[size],
        className
      )}
      title={`${name} ${role ? `(${role})` : ""}`}
    >
      {initials}
    </div>
  );
}

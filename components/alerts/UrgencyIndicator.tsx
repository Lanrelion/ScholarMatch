import React from "react";
import { cn } from "@/lib/utils";

interface UrgencyIndicatorProps {
  daysLeft: number;
}

export function UrgencyIndicator({ daysLeft }: UrgencyIndicatorProps) {
  if (daysLeft <= 1) {
    return (
      <div className="flex items-center gap-2">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-urgent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-urgent"></span>
        </div>
        <span className="text-[12px] font-ui font-medium text-urgent">
          {daysLeft === 0 ? "Today" : "Tomorrow"}
        </span>
      </div>
    );
  }

  const isWarning = daysLeft <= 7;

  return (
    <div className={cn(
      "px-2 py-0.5 rounded-full text-[11px] font-ui font-medium shrink-0",
      isWarning 
        ? "bg-amber-500/10 text-amber-600 border border-amber-500/20" 
        : "bg-surface text-ink-secondary border border-border"
    )}>
      {daysLeft} days left
    </div>
  );
}

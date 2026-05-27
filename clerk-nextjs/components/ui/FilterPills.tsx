import React from "react";
import { cn } from "@/lib/utils";

interface Option {
  id: string;
  label: string;
}

interface FilterPillsProps {
  options: Option[];
  activeId: string;
  onChange: (id: string) => void;
}

export function FilterPills({ options, activeId, onChange }: FilterPillsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-4 md:px-6">
      {options.map((opt) => {
        const isActive = activeId === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={cn(
              "whitespace-nowrap px-4 py-2 rounded-pill font-ui text-sm transition-all duration-200 border",
              isActive 
                ? "bg-moss text-white border-moss shadow-sm" 
                : "bg-surface text-ink border-border hover:border-border-strong hover:bg-surface-hover"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

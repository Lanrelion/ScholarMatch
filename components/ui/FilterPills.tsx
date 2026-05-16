"use client";

import React from "react";

interface FilterOption {
  id: string;
  label: string;
}

interface FilterPillsProps {
  options: FilterOption[];
  activeId: string;
  onChange: (id: string) => void;
}

export function FilterPills({ options, activeId, onChange }: FilterPillsProps) {
  return (
    <div 
      className="flex gap-2 px-4 pb-2 overflow-x-auto snap-x"
      style={{
        scrollbarWidth: "none",
        maskImage: "linear-gradient(to right, transparent 0, black 16px, black calc(100% - 16px), transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0, black 16px, black calc(100% - 16px), transparent 100%)"
      }}
    >
      {options.map((option) => {
        const isActive = activeId === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`
              snap-start whitespace-nowrap min-h-[34px] px-[14px] py-[6px] rounded-full text-[13px] transition-all duration-150 border
              ${isActive 
                ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white font-medium" 
                : "bg-white border-[var(--color-border)] text-gray-700 hover:border-gray-300"
              }
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

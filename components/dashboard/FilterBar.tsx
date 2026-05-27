"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { CaretDown } from "@phosphor-icons/react";

export type FilterType = "all" | "fully_funded" | "university" | "masters" | "destination" | "closing_soon" | "new";
export type SortType = "match" | "deadline" | "recent" | "amount";

interface FilterBarProps {
  activeFilter: FilterType;
  onFilterChange: (f: FilterType) => void;
  activeSort: SortType;
  onSortChange: (s: SortType) => void;
  hasDestination?: boolean;
}

export function FilterBar({ activeFilter, onFilterChange, activeSort, onSortChange, hasDestination = false }: FilterBarProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);

  const filters = [
    { id: "all", label: "All matches" },
    { id: "fully_funded", label: "Fully funded" },
    { id: "university", label: "University-specific" },
    { id: "masters", label: "Masters" },
    ...(hasDestination ? [{ id: "destination", label: "My destination" }] : []),
    { id: "closing_soon", label: "Closing soon" },
    { id: "new", label: "New this week" }
  ];

  const sorts = [
    { id: "match", label: "Best match" },
    { id: "deadline", label: "Deadline" },
    { id: "recent", label: "Recently added" },
    { id: "amount", label: "Funding amount" }
  ];

  const currentSortLabel = sorts.find(s => s.id === activeSort)?.label || "Best match";

  return (
    <div className="w-full border-b border-border bg-bg/95 backdrop-blur-md sticky top-[80px] md:top-[90px] z-20">
      <div className="flex items-center px-6 md:px-8 py-4 gap-2">
        {/* Filter Chips Container */}
        <div className="flex-1 flex items-center gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-1 -mb-1">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => onFilterChange(f.id as FilterType)}
              className={cn(
                "snap-start shrink-0 px-4 py-2 rounded-full font-ui text-[13px] transition-all duration-180 border whitespace-nowrap",
                activeFilter === f.id
                  ? "bg-ink text-bg border-ink font-medium"
                  : "bg-surface text-ink-secondary border-border hover:bg-surface-hover hover:border-border-strong font-normal"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Sort Control */}
        <div className="flex items-center pl-4 ml-2 border-l border-border h-6 relative shrink-0">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-1.5 font-ui text-[13px] text-ink-secondary hover:text-ink transition-colors"
          >
            Sort: {currentSortLabel}
            <CaretDown size={14} className={cn("transition-transform", isSortOpen && "rotate-180")} />
          </button>

          {isSortOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
              <div className="absolute top-full right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-[0_8px_32px_rgba(22,21,20,0.12)] py-1 z-50">
                {sorts.map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSortChange(s.id as SortType);
                      setIsSortOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2 font-ui text-[13px] transition-colors",
                      activeSort === s.id ? "bg-moss-light text-moss font-medium" : "text-ink-secondary hover:bg-surface-hover hover:text-ink"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

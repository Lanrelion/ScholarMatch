"use client"

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function AdminTabs({ currentTab }: { currentTab: string }) {

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 pb-4 mb-4">
      <div className="flex items-center gap-2 p-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full shadow-sm">
        <Link 
          href="/admin?tab=all&page=1"
          className={cn(
            "px-6 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-full transition-all",
            currentTab === "all" 
              ? "bg-[var(--color-moss)] text-[var(--color-surface)] shadow-md shadow-[var(--color-moss)]/20" 
              : "text-[var(--color-ink-tertiary)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)]"
          )}
        >
          All Scholarships
        </Link>
        <Link 
          href="/admin?tab=pending&page=1"
          className={cn(
            "px-6 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-full transition-all",
            currentTab === "pending" 
              ? "bg-[var(--color-moss)] text-[var(--color-surface)] shadow-md shadow-[var(--color-moss)]/20" 
              : "text-[var(--color-ink-tertiary)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)]"
          )}
        >
          Pending Review
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link 
          href="/admin/new"
          className="h-11 px-6 rounded-full bg-[var(--color-ink)] text-[var(--color-surface)] text-[11px] font-black uppercase tracking-wider hover:scale-105 transition-transform active:scale-95 flex items-center justify-center shadow-lg shadow-black/10"
        >
          + Create Entry
        </Link>
      </div>
    </div>
  );
}

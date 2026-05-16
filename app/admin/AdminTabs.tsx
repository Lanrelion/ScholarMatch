"use client"

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function AdminTabs({ currentTab }: { currentTab: string }) {

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 pb-2 border-b border-[var(--color-border)]">
      <div className="flex items-center gap-8">
        <Link 
          href="/admin?tab=all&page=1"
          className={cn(
            "pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative",
            currentTab === "all" 
              ? "text-[var(--color-primary)]" 
              : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
          )}
        >
          All Scholarships
          {currentTab === "all" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)] rounded-full" />}
        </Link>
        <Link 
          href="/admin?tab=pending&page=1"
          className={cn(
            "pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative",
            currentTab === "pending" 
              ? "text-[var(--color-primary)]" 
              : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
          )}
        >
          Pending Review
          {currentTab === "pending" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)] rounded-full" />}
        </Link>
      </div>

      <div className="flex items-center gap-4 pb-1">
        <Link 
          href="/admin/new"
          className="h-10 px-6 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-black uppercase tracking-wider hover:brightness-110 transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20"
        >
          + Create Entry
        </Link>
      </div>
    </div>
  );
}

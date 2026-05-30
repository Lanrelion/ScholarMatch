"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter, CheckCircle, ShieldCheck, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentVerified = searchParams.get("verified");
  const currentActive = searchParams.get("active");
  const currentMinSaves = searchParams.get("minSaves") || "0";

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1"); // Always reset to page 1 on filter change
    if (value === null || value === "" || (key === "minSaves" && value === "0")) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-8">
      <div className="flex items-center gap-2 pl-4 pr-2 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full shadow-sm hover:shadow-md transition-shadow group">
        <ShieldCheck size={14} className="text-blue-500" />
        <select 
          value={currentVerified || ""} 
          onChange={(e) => updateFilter("verified", e.target.value)}
          className="text-[11px] font-black uppercase tracking-wider bg-transparent outline-none cursor-pointer text-[var(--color-text-primary)]"
        >
          <option value="" className="bg-[var(--color-white)]">Verification Status</option>
          <option value="true" className="bg-[var(--color-white)]">Verified Only</option>
          <option value="false" className="bg-[var(--color-white)]">Unverified Only</option>
        </select>
      </div>

      <div className="flex items-center gap-2 pl-4 pr-2 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full shadow-sm hover:shadow-md transition-shadow group">
        <CheckCircle size={14} className="text-[var(--color-primary)]" />
        <select 
          value={currentActive || ""} 
          onChange={(e) => updateFilter("active", e.target.value)}
          className="text-[11px] font-black uppercase tracking-wider bg-transparent outline-none cursor-pointer text-[var(--color-text-primary)]"
        >
          <option value="" className="bg-[var(--color-white)]">Visibility Status</option>
          <option value="true" className="bg-[var(--color-white)]">Active Only</option>
          <option value="false" className="bg-[var(--color-white)]">Hidden Only</option>
        </select>
      </div>

      <div className="flex items-center gap-2 pl-4 pr-2 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full shadow-sm hover:shadow-md transition-shadow group">
        <TrendingUp size={14} className="text-orange-500" />
        <select 
          value={currentMinSaves} 
          onChange={(e) => updateFilter("minSaves", e.target.value)}
          className="text-[11px] font-black uppercase tracking-wider bg-transparent outline-none cursor-pointer text-[var(--color-text-primary)]"
        >
          <option value="0" className="bg-[var(--color-white)]">All Save Counts</option>
          <option value="1" className="bg-[var(--color-white)]">1+ Saves</option>
          <option value="5" className="bg-[var(--color-white)]">5+ Saves</option>
          <option value="10" className="bg-[var(--color-white)]">10+ Saves</option>
        </select>
      </div>

      {(currentVerified || currentActive || currentMinSaves !== "0") && (
        <button 
          onClick={() => router.push("?")}
          className="text-[10px] font-black text-[var(--color-text-tertiary)] uppercase tracking-[0.2em] hover:text-[var(--color-primary)] transition-colors ml-2 hover:bg-[var(--color-surface)] px-4 py-2 rounded-full border border-transparent hover:border-[var(--color-border)]"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

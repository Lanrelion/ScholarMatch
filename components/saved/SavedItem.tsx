"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Award, Trash2, ChevronRight, Clock } from "lucide-react";
import { Scholarship } from "@prisma/client";
import { cn } from "@/lib/utils";

interface Props {
  item: {
    id: string;
    scholarship: Scholarship;
    matchScore: number;
  };
  onUnsave: (id: string) => void;
}

export default function SavedItem({ item, onUnsave }: Props) {
  const router = useRouter();
  const { scholarship } = item;

  const handleUnsave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/saved/${item.id}`, { method: "DELETE" });
      if (res.ok) {
        onUnsave(item.id);
      }
    } catch (err) {}
  };

  const getDeadlineInfo = () => {
    if (!scholarship.deadline) return { label: "Open deadline", color: "text-[var(--color-text-tertiary)]" };
    const date = new Date(scholarship.deadline);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / 86400000);

    if (diffDays <= 0) return { label: "Closed", color: "text-[var(--color-red)]" };
    if (diffDays <= 7) return { label: `${diffDays}d left`, color: "text-[var(--color-red)]" };
    if (diffDays <= 30) return { label: `${diffDays}d left`, color: "text-[var(--color-amber)]" };
    
    return { 
      label: date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }), 
      color: "text-[var(--color-text-secondary)]" 
    };
  };

  const deadline = getDeadlineInfo();

  return (
    <div 
      onClick={() => router.push(`/scholarship/${scholarship.id}?from=saved`)}
      className="flex items-center gap-3 px-4 py-4 cursor-pointer active:bg-[var(--color-surface)] transition-colors group"
    >
      {/* Icon */}
      <div className="w-11 h-11 rounded-[var(--radius-lg)] bg-[var(--color-primary-surface)] border border-[var(--color-primary-border)] flex-shrink-0 flex items-center justify-center text-[var(--color-primary)]">
        <Award size={20} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-[15px] font-bold text-[var(--color-text-primary)] truncate leading-tight mb-1">
          {scholarship.title}
        </h3>
        <div className="flex items-center gap-2">
          <div className={cn("flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider", deadline.color)}>
            <Clock size={12} strokeWidth={3} />
            {deadline.label}
          </div>
          <span className="text-[var(--color-border-strong)]">•</span>
          <span className="text-[11px] font-black text-[var(--color-primary)] uppercase tracking-widest">
            {Math.round(item.matchScore * 100)}% Match
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={handleUnsave}
          aria-label="Remove from saved"
          className="w-10 h-10 flex items-center justify-center text-[var(--color-text-tertiary)] hover:text-[var(--color-red)] transition-colors active:scale-90"
        >
          <Trash2 size={18} />
        </button>
        <div className="text-[var(--color-border-strong)] group-hover:translate-x-0.5 transition-transform">
          <ChevronRight size={18} />
        </div>
      </div>
    </div>
  );
}

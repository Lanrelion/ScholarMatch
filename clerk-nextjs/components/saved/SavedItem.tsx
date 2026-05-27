"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Medal, ArrowRight, Trash } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface SavedItemProps {
  item: any; // { id: string, scholarship: ScholarshipWithMatch, changeAlerted: boolean }
  onUnsave: (id: string) => void;
}

export default function SavedItem({ item, onUnsave }: SavedItemProps) {
  const router = useRouter();
  const { scholarship } = item;

  const now = new Date();
  const deadline = scholarship.deadline ? new Date(scholarship.deadline) : null;
  const daysLeft = deadline ? Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;

  const isUrgent = daysLeft !== null && daysLeft <= 7;
  const isWarning = daysLeft !== null && daysLeft > 7 && daysLeft <= 30;

  const handleUnsave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/saved/${item.id}`, { method: "DELETE" });
      if (res.ok) {
        onUnsave(item.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getDeadlineText = () => {
    if (daysLeft === null) return "Open deadline";
    if (daysLeft < 0) return "Closed";
    return `${daysLeft} days left`;
  };

  const getDeadlineColorClass = () => {
    if (isUrgent) return "text-urgent font-medium";
    if (isWarning) return "text-warning";
    return "text-ink-tertiary";
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] as any }}
      onClick={() => router.push(`/scholarship/${scholarship.id}`)}
      className="group flex flex-row items-center w-full bg-surface border border-border rounded-xl p-4 md:px-5 mb-2 cursor-pointer transition-all duration-180 ease-primary hover:border-border-strong hover:shadow-[0_4px_20px_rgba(22,21,20,0.06)]"
    >
      {/* LEFT — Icon square */}
      <div 
        className={cn(
          "shrink-0 w-12 h-12 rounded-md flex items-center justify-center mr-4 transition-colors",
          isUrgent ? "bg-urgent-surface" : "bg-moss-light",
          isUrgent && "animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"
        )}
      >
        <Medal size={22} weight="fill" className={isUrgent ? "text-urgent" : "text-moss"} />
      </div>

      {/* MIDDLE — Content */}
      <div className="flex-1 min-w-0 mr-4">
        <h3 className="text-[14px] font-ui font-medium text-ink whitespace-nowrap overflow-hidden text-ellipsis">
          {scholarship.title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className={cn("text-[12px]", getDeadlineColorClass())}>
            {getDeadlineText()}
          </span>
          <span className="text-[12px] text-border">·</span>
          <span className="text-[12px] font-ui font-medium text-moss">
            {Math.round(item.matchScore * 100)}% match
          </span>
        </div>
      </div>

      {/* RIGHT — Actions */}
      <div className="shrink-0 flex flex-col gap-1.5">
        <button 
          className="w-9 h-9 rounded-md bg-transparent hover:bg-surface-hover flex items-center justify-center text-ink-tertiary transition-colors"
          aria-label="View Details"
        >
          <ArrowRight size={16} weight="bold" />
        </button>
        <button 
          onClick={handleUnsave}
          className="w-9 h-9 rounded-md bg-transparent hover:bg-surface-hover flex items-center justify-center text-ink-tertiary hover:text-urgent transition-colors"
          aria-label="Remove saved item"
        >
          <Trash size={16} weight="fill" />
        </button>
      </div>
    </motion.div>
  );
}

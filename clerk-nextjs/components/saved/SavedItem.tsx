"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Scholarship } from "@prisma/client";

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
      } else {
        alert("Could not remove. Try again.");
      }
    } catch (err) {
      alert("Network error. Try again.");
    }
  };

  const getDeadlineInfo = () => {
    if (!scholarship.deadline) return { label: "Open deadline", style: "text-gray-400" };
    const date = new Date(scholarship.deadline);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / 86400000);

    if (diffDays <= 0) return { label: "Closed", style: "text-[#E24B4A] font-medium" };
    if (diffDays <= 7) return { label: `${diffDays} days left`, style: "text-[#A32D2D] font-medium" };
    if (diffDays <= 30) return { label: `${diffDays} days left`, style: "text-[#854F0B]" };
    
    return { 
      label: date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }), 
      style: "text-gray-400" 
    };
  };

  const deadline = getDeadlineInfo();

  return (
    <div 
      onClick={() => router.push(`/scholarship/${scholarship.id}`)}
      className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 cursor-pointer active:bg-gray-50 transition-colors"
    >
      {/* LEFT — icon square */}
      <div className="w-10 h-10 rounded-xl bg-[#E1F5EE] flex-shrink-0 flex items-center justify-center">
        <i className="ti-award text-[#0F6E56] text-lg"></i>
      </div>

      {/* MIDDLE — content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {scholarship.title}
        </h3>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-xs ${deadline.style}`}>{deadline.label}</span>
          <span className="text-xs text-gray-300">·</span>
          <span className="text-xs text-[#0F6E56]">
            {Math.round(item.matchScore * 100)}% match
          </span>
        </div>
      </div>

      {/* RIGHT — actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleUnsave}
          aria-label="Remove from saved"
          className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-[#E24B4A] transition-colors"
        >
          <i className="ti-trash text-base"></i>
        </button>
        <div className="text-gray-300">
          <i className="ti-chevron-right text-base"></i>
        </div>
      </div>
    </div>
  );
}

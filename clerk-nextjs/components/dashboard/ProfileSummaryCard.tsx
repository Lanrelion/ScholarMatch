"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  nationality: string | null;
  degreeLevel: string | null;
  fieldOfStudy: string | null;
}

export function ProfileSummaryCard({ nationality, degreeLevel, fieldOfStudy }: Props) {
  const router = useRouter();

  const getFlag = (code: string | null) => {
    if (!code) return "🌍";
    // Simplified flag logic
    return code === "NG" ? "🇳🇬" : "🌍";
  };

  return (
    <div className="mx-4 sm:mx-6 lg:mx-8 mb-8">
      <div 
        onClick={() => router.push("/profile")}
        className="w-full bg-white border border-gray-100 rounded-[var(--radius-xl)] p-4 lg:p-6 flex flex-col lg:flex-row items-center justify-between gap-4 cursor-pointer hover:shadow-lg transition-all active:scale-[0.99] group overflow-hidden relative shadow-sm"
      >
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-[var(--color-primary-surface)] flex items-center justify-center text-[var(--color-primary)] text-xl shadow-sm shrink-0">
            {getFlag(nationality)}
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm lg:text-base font-black text-[var(--color-text-primary)]">
              {degreeLevel || "Complete your profile"}
            </h2>
            <p className="text-[11px] lg:text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest">
              {fieldOfStudy || "Enhance your matches"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto justify-end lg:justify-start">
          <span className="text-[10px] lg:text-[11px] font-black text-[var(--color-primary)] uppercase tracking-widest bg-[var(--color-primary-surface)] px-3 py-1.5 rounded-lg border border-[var(--color-primary-border)]/50">
            Edit Profile
          </span>
        </div>
      </div>
    </div>
  );
}

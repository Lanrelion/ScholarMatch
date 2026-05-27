"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  nationality: string;
  currentDegree: string;
  fieldOfStudy: string;
}

// Generate a deterministic SVG gradient aura based on a seed string (e.g., name)
const generateAura = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    ["#4f46e5", "#ec4899", "#8b5cf6"], // Indigo/Pink/Purple
    ["#0ea5e9", "#10b981", "#3b82f6"], // Sky/Emerald/Blue
    ["#f59e0b", "#ef4444", "#ec4899"], // Amber/Red/Pink
    ["#8b5cf6", "#3b82f6", "#06b6d4"], // Purple/Blue/Cyan
    ["#14b8a6", "#3b82f6", "#6366f1"], // Teal/Blue/Indigo
  ];
  
  const palette = colors[Math.abs(hash) % colors.length];
  
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full object-cover opacity-80" preserveAspectRatio="none">
      <defs>
        <radialGradient id={`grad-${hash}`} cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
          <stop offset="0%" stopColor={palette[0]} />
          <stop offset="50%" stopColor={palette[1]} />
          <stop offset="100%" stopColor={palette[2]} />
        </radialGradient>
        <filter id="blur">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      <rect width="100" height="100" fill={`url(#grad-${hash})`} filter="url(#blur)" />
    </svg>
  );
};

export function ProfileHeader({ firstName, lastName, nationality, currentDegree, fieldOfStudy }: ProfileHeaderProps) {
  const seed = `${firstName}${lastName}`;
  const aura = useMemo(() => generateAura(seed), [seed]);

  return (
    <div className="relative overflow-hidden rounded-[24px] bg-surface border border-border">
      {/* Background Aura Header */}
      <div className="h-32 w-full relative">
        <div className="absolute inset-0">
          {aura}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
      </div>

      {/* Content */}
      <div className="px-6 pb-6 pt-2 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex-1">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[32px] md:text-[40px] font-editorial font-normal text-ink leading-none tracking-tight mb-2"
            >
              {firstName || "Scholar"} {lastName || "Match"}
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap items-center gap-2 text-ink-secondary font-ui text-[14px]"
            >
              {nationality && (
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-moss/40" />
                  {nationality}
                </span>
              )}
              {currentDegree && (
                <>
                  <span className="text-border-strong">•</span>
                  <span className="font-medium text-ink">{currentDegree === "UNDERGRADUATE" ? "BSc" : currentDegree === "MASTERS" ? "Masters" : "PhD"} Candidate</span>
                </>
              )}
              {fieldOfStudy && (
                <>
                  <span className="text-border-strong">•</span>
                  <span>{fieldOfStudy}</span>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

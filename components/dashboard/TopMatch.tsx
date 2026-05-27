"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookmarkSimple } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { ScholarshipCard } from "./ScholarshipCard";
import { ScholarshipWithMatch } from "@/types/scholarship";

interface TopMatchProps {
  scholarship: ScholarshipWithMatch;
  profile: Record<string, unknown>;
  onSave?: (id: string) => void;
  isSaved?: boolean;
}

export function TopMatch({ scholarship, profile, onSave, isSaved = false }: TopMatchProps) {
  const router = useRouter();

  if (!scholarship) return null;

  // Format deadline and urgency
  const now = new Date();
  const deadline = scholarship.deadline ? new Date(scholarship.deadline) : null;
  let daysLeft = null;
  if (deadline) {
    daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }

  const isUrgent = daysLeft !== null && daysLeft <= 30 && daysLeft >= 0;

  // Parse eligibility for chips
  const eligibility = (scholarship.matchBreakdown as any) || {};
  const chips = [];
  if (eligibility.nationality?.isEligible) chips.push(`✓ ${(profile as Record<string, string>)?.nationality || 'Nationality'}`);
  if (eligibility.degree?.isEligible) chips.push(`✓ ${(profile as Record<string, string>)?.currentDegree || 'Degree'}`);
  if (eligibility.fieldOfStudy?.isEligible) chips.push(`✓ ${(profile as Record<string, string>)?.fieldOfStudy || 'Field'}`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mx-6 md:mx-8 mt-6 rounded-[24px] overflow-hidden relative cursor-pointer min-h-[220px] md:min-h-[280px] top-match group"
      onClick={() => router.push(`/scholarship/${scholarship.id}`)}
      style={{
        background: "linear-gradient(135deg, #0A2818 0%, #1A3A24 40%, #2C4A1E 70%, #3D5A2E 100%)",
      }}
    >
      {/* Grain overlay */}
      <div 
        className="absolute inset-0 z-[1] opacity-5 pointer-events-none" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />

      {/* Ambient glow */}
      <div className="absolute -top-10 -right-10 w-[300px] h-[300px] pointer-events-none z-[1] top-match-glow transition-transform duration-700 ease-out"
           style={{ background: "radial-gradient(circle, rgba(201,168,106,0.15) 0%, transparent 70%)" }} 
      />

      <div className="relative z-[2] p-8 md:p-9 flex flex-col md:flex-row h-full">
        
        {/* Left Column */}
        <div className="flex-1 flex flex-col items-start justify-center">
          
          <div className="flex gap-2 mb-5">
            <span className="bg-white/10 text-white/90 border border-white/20 font-ui text-[11px] font-medium uppercase tracking-[0.1em] px-3 py-1 rounded-full">
              YOUR TOP MATCH
            </span>
            <span className="bg-moss text-white border border-moss font-ui text-[11px] font-medium uppercase tracking-[0.1em] px-3 py-1 rounded-full">
              {Math.round((scholarship.matchScore || 0) * 100)}% Match
            </span>
          </div>

          <h2 className="font-editorial text-[clamp(1.5rem,2.5vw,2.25rem)] font-normal text-[#F4F1EB] leading-[1.2] max-w-[460px] mb-3">
            {scholarship.title}
          </h2>

          <p className="font-ui text-[15px] text-white/65 mb-6">
            {scholarship.provider} · {(scholarship as any).countryOfStudy || "Multiple Countries"}
          </p>

          {/* Eligibility Strip */}
          <div className="flex flex-wrap gap-3 mb-7">
            {chips.slice(0, 3).map((chip, i) => (
              <span key={i} className="bg-white/10 border border-white/15 text-white/80 font-ui text-[12px] px-2.5 py-1 rounded-full">
                {chip}
              </span>
            ))}
            {chips.length > 3 && (
              <span className="bg-white/10 border border-white/15 text-white/80 font-ui text-[12px] px-2.5 py-1 rounded-full">
                +{chips.length - 3} more
              </span>
            )}
          </div>

          {/* CTA Row */}
          <div className="flex items-center gap-3 mt-auto">
            <button className="bg-white text-moss-dark font-ui text-[14px] font-medium px-6 py-3 rounded-full hover:bg-white/90 hover:-translate-y-[1px] transition-all">
              View scholarship →
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (onSave) onSave(scholarship.id);
              }}
              className="w-11 h-11 flex items-center justify-center bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-all z-10"
            >
              <BookmarkSimple size={18} className="text-white" weight={isSaved ? "fill" : "regular"} />
            </button>
          </div>

          {deadline && (
            <div className={`mt-4 font-ui text-[13px] ${isUrgent ? 'text-[#ffb432]/90' : 'text-white/50'}`}>
              Closes {deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              {daysLeft !== null && ` · ${daysLeft} days away`}
            </div>
          )}

        </div>

        {/* Right Column Preview (Desktop only) */}
        <div className="hidden lg:block w-[340px] shrink-0 ml-12 relative opacity-90 top-match-card-preview transition-transform duration-500 ease-out z-[2]" 
             style={{ transform: "scale(0.88) rotate(2deg) translateY(20px)", transformOrigin: "bottom right" }}>
           <div className="absolute inset-0 shadow-[0_32px_64px_rgba(0,0,0,0.4)] rounded-[24px] pointer-events-none" />
           <div className="pointer-events-none select-none">
             <ScholarshipCard scholarship={scholarship} isPreview={true} />
           </div>
        </div>

      </div>

    </motion.div>
  );
}

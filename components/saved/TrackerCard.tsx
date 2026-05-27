import React from "react";
import { ScholarshipWithMatch } from "@/types/scholarship";
import { Clock, PushPin } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface TrackerCardProps {
  item: { id: string; scholarship: ScholarshipWithMatch; changeAlerted?: boolean };
  provided?: any; // For dnd-kit or react-beautiful-dnd innerRef and draggableProps
  isDragging?: boolean;
}

const getDeterministicGradient = (seed: string) => {
  const gradients = [
    'linear-gradient(135deg, #2d1b69 0%, #5f6f52 100%)', // Twilight Moss
    'linear-gradient(135deg, #1a3a4a 0%, #2d5a6e 100%)', // Ocean Deep
    'linear-gradient(135deg, #3d2c1d 0%, #a67c52 100%)', // Earthy Clay
    'linear-gradient(135deg, #1a1a2e 0%, #30304a 100%)', // Midnight Blue
    'linear-gradient(135deg, #2d3f3f 0%, #4a6f6f 100%)', // Muted Teal
    'linear-gradient(135deg, #4a2c2c 0%, #8b4a4a 100%)', // Terracotta
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
};

export function TrackerCard({ item, provided, isDragging }: TrackerCardProps) {
  const { scholarship, changeAlerted } = item;
  
  // Parse eligibility
  const breakdown = (scholarship as any).matchBreakdown || {};
  const criteria = Object.values(breakdown) as any[];
  const failed = criteria.filter(c => !c.isEligible);
  const passed = criteria.filter(c => c.isEligible);
  const signals = [...failed, ...passed].slice(0, 2); 

  // Deadline logic
  const now = new Date();
  const deadline = scholarship.deadline ? new Date(scholarship.deadline) : null;
  let daysLeft = null;
  if (deadline) {
    daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }
  const isUrgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 14;

  const bgGradient = getDeterministicGradient(scholarship.id);

  return (
    <div
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      className={cn(
        "group relative w-full flex flex-col rounded-xl overflow-hidden bg-surface border transition-all duration-300",
        isDragging 
          ? "border-moss shadow-[0_24px_48px_rgba(95,111,82,0.2)] rotate-2 z-50 cursor-grabbing scale-105" 
          : "border-border hover:border-border-strong hover:shadow-[0_12px_24px_rgba(22,21,20,0.08)] hover:-translate-y-1 cursor-grab"
      )}
      style={{
        ...provided?.draggableProps?.style,
      }}
    >
      {/* Cover / Header section */}
      <div 
        className="h-[100px] w-full p-4 flex flex-col justify-between relative"
        style={{ background: bgGradient }}
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
        
        <div className="relative z-10 flex justify-between items-start">
          {changeAlerted && (
            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-ui font-medium uppercase tracking-wider px-2 py-0.5 rounded-sm border border-white/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#ff4b4b] rounded-full animate-pulse" />
              Updated
            </span>
          )}
          {isUrgent && (
            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-ui font-medium px-2 py-0.5 rounded-full border border-white/30 ml-auto flex items-center gap-1">
              <Clock size={12} />
              {daysLeft}d left
            </span>
          )}
        </div>
      </div>

      {/* Content section */}
      <div className="p-4 flex flex-col bg-surface flex-1">
        <h3 className="font-editorial text-[18px] text-ink leading-[1.2] mb-1 group-hover:text-moss transition-colors">
          {scholarship.title}
        </h3>
        <p className="font-ui text-[13px] text-ink-secondary line-clamp-1 mb-4">
          {scholarship.provider} {(scholarship as any).countryOfStudy ? `· ${(scholarship as any).countryOfStudy}` : ''}
        </p>

        {/* Tags / Signals */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {scholarship.amount && (
            <span className="bg-surface-hover border border-border text-ink-secondary text-[11px] font-ui px-2 py-0.5 rounded-md">
              💰 {scholarship.currency || '$'}{scholarship.amount.toLocaleString()}
            </span>
          )}
          {signals.map((signal, i) => (
             <span 
              key={i} 
              className={cn(
                "border text-[11px] font-ui px-2 py-0.5 rounded-md flex items-center gap-1",
                signal.isEligible 
                  ? "bg-moss-light border-moss/30 text-moss-dark" 
                  : "bg-[#fee2e2] border-[#f87171]/30 text-[#b91c1c]"
              )}
            >
              {signal.isEligible ? '✓' : '×'} {signal.category}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

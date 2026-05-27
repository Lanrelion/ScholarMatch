"use client";

import React from "react";
import { GraduationCap, MapPin, Target, Briefcase } from "@phosphor-icons/react";

interface JourneyMilestone {
  id: string;
  type: "past" | "current" | "future";
  title: string;
  subtitle: string;
  date?: string;
  icon: "degree" | "experience" | "target";
}

interface JourneyTimelineProps {
  milestones: JourneyMilestone[];
}

const iconMap = {
  degree: GraduationCap,
  experience: Briefcase,
  target: Target,
};

export function JourneyTimeline({ milestones }: JourneyTimelineProps) {
  return (
    <div className="bg-surface border border-border rounded-[24px] p-6 relative">
      <h2 className="text-[18px] font-editorial text-ink mb-6">Academic Journey</h2>
      
      <div className="relative">
        {/* Continuous vertical line */}
        <div className="absolute left-[19px] top-[10px] bottom-[20px] w-px bg-border" />
        
        <div className="flex flex-col gap-6">
          {milestones.map((milestone, index) => {
            const Icon = iconMap[milestone.icon];
            const isTarget = milestone.type === "future";
            const isCurrent = milestone.type === "current";
            
            return (
              <div key={milestone.id} className="relative flex gap-4 items-start group">
                {/* Node icon */}
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border shrink-0 transition-all duration-300 ${
                  isTarget 
                    ? "bg-surface border-dashed border-border-strong text-ink-tertiary" 
                    : isCurrent
                      ? "bg-moss-light border-moss text-moss shadow-[0_0_12px_rgba(42,77,32,0.15)]"
                      : "bg-surface border-border text-ink-secondary group-hover:border-border-strong"
                }`}>
                  <Icon size={18} weight={isCurrent ? "fill" : "regular"} />
                </div>
                
                {/* Content */}
                <div className="pt-2 pb-2">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className={`font-ui text-[14px] font-medium leading-none ${isTarget ? "text-ink-secondary" : "text-ink"}`}>
                      {milestone.title}
                    </h3>
                    {milestone.date && (
                      <span className="font-ui text-[11px] text-ink-tertiary">
                        {milestone.date}
                      </span>
                    )}
                  </div>
                  <p className="font-ui text-[13px] text-ink-secondary">
                    {milestone.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

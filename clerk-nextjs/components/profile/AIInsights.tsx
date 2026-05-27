"use client";

import React from "react";
import { Sparkle, TrendUp } from "@phosphor-icons/react";

interface Insight {
  id: string;
  text: string;
  type: "strength" | "opportunity";
}

interface AIInsightsProps {
  insights: Insight[];
}

export function AIInsights({ insights }: AIInsightsProps) {
  return (
    <div className="bg-surface border border-[#3b82f6]/20 rounded-[24px] p-6 relative overflow-hidden">
      {/* Subtle AI background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#3b82f6]/10 rounded-full blur-[60px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#8b5cf6]/10 rounded-full blur-[50px] pointer-events-none translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-5">
          <Sparkle size={18} weight="fill" className="text-[#3b82f6]" />
          <h2 className="text-[16px] font-editorial text-ink">Intelligence Insights</h2>
        </div>
        
        <div className="flex flex-col gap-4">
          {insights.length > 0 ? (
            insights.map((insight) => (
              <div 
                key={insight.id} 
                className="bg-white/40 backdrop-blur-sm border border-white/60 p-4 rounded-xl flex items-start gap-3"
              >
                {insight.type === "strength" ? (
                  <TrendUp size={16} className="text-[#10b981] mt-0.5 shrink-0" />
                ) : (
                  <Sparkle size={16} className="text-[#8b5cf6] mt-0.5 shrink-0" />
                )}
                <p className="font-ui text-[13px] leading-relaxed text-ink-secondary">
                  {insight.text}
                </p>
              </div>
            ))
          ) : (
            <p className="font-ui text-[13px] text-ink-secondary italic">
              Add more profile details to generate personalized AI insights.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

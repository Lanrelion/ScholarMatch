"use client";

import React from "react";

export function MatchingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center py-24 animate-in fade-in duration-500">
      <div className="flex items-center justify-center mb-5 h-8">
        <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] mx-1.5 inline-block animate-[matchPulse_1s_ease-in-out_infinite]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] mx-1.5 inline-block animate-[matchPulse_1s_ease-in-out_infinite_0.2s]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] mx-1.5 inline-block animate-[matchPulse_1s_ease-in-out_infinite_0.4s]" />
      </div>
      <p className="text-[15px] font-bold text-[var(--color-text-primary)] tracking-tight">
        Matching your profile...
      </p>
      <p className="text-xs text-[var(--color-text-tertiary)] mt-1.5">
        Analyzing 127 opportunities
      </p>
      <style>{`
        @keyframes matchPulse {
          0%, 100% { transform: scale(0.6); opacity: 0.3; }
          50%      { transform: scale(1.2); opacity: 1.0; }
        }
      `}</style>
    </div>
  );
}

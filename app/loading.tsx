import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100]">
      <div className="flex items-center justify-center mb-6 h-8">
        <span className="w-3 h-3 rounded-full bg-[var(--color-primary)] mx-1.5 inline-block animate-[pulse_1s_ease-in-out_infinite]" />
        <span className="w-3 h-3 rounded-full bg-[var(--color-primary)] mx-1.5 inline-block animate-[pulse_1s_ease-in-out_infinite_0.2s]" />
        <span className="w-3 h-3 rounded-full bg-[var(--color-primary)] mx-1.5 inline-block animate-[pulse_1s_ease-in-out_infinite_0.4s]" />
      </div>
      <p className="text-sm font-bold text-[var(--color-text-primary)] tracking-tight">
        ScholarMatch
      </p>
      <p className="text-[11px] text-[var(--color-text-tertiary)] mt-2 uppercase tracking-[0.2em]">
        Loading your opportunities
      </p>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(0.6); opacity: 0.3; }
          50%      { transform: scale(1.2); opacity: 1.0; }
        }
      `}</style>
    </div>
  );
}

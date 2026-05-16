export function MatchingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="flex items-center justify-center mb-4">
        <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] mx-1 inline-block animate-[matchPulse_1.2s_ease-in-out_infinite]" />
        <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] mx-1 inline-block animate-[matchPulse_1.2s_ease-in-out_infinite_0.2s]" />
        <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] mx-1 inline-block animate-[matchPulse_1.2s_ease-in-out_infinite_0.4s]" />
      </div>
      <p className="text-sm font-medium text-[var(--color-text-secondary)]">
        Finding scholarships for you...
      </p>
      <style>{`
        @keyframes matchPulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%           { transform: scale(1.0); opacity: 1.0; }
        }
      `}</style>
    </div>
  );
}

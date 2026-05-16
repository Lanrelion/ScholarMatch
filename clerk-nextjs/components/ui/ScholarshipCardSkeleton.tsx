export function ScholarshipCardSkeleton() {
  return (
    <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] p-4 mb-3 shadow-[var(--shadow-card)]">
      {/* Title lines */}
      <div className="w-3/4 h-4 mb-2 rounded-sm bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
      <div className="w-1/2 h-3 mb-4 rounded-sm bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
      
      {/* Pills */}
      <div className="flex gap-2 mb-4">
        <div className="w-20 h-5 rounded-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
        <div className="w-16 h-5 rounded-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
        <div className="w-14 h-5 rounded-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
      </div>
      
      {/* Match bar */}
      <div className="w-full h-1 mb-3 rounded-sm bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
      
      {/* Eligibility lines */}
      <div className="w-2/3 h-3 mb-2 rounded-sm bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
      <div className="w-3/4 h-3 mb-2 rounded-sm bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
      
      {/* CTA */}
      <div className="w-full h-10 mt-3 rounded-xl bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
      
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

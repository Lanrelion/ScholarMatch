import React from "react";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[480px] mx-auto">
      {/* Header Skeleton */}
      <div className="px-4 pt-5 pb-3 flex items-start justify-between bg-white sticky top-0 z-30">
        <div className="flex flex-col gap-2">
          <div className="h-6 w-32 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-3 w-24 bg-gray-50 rounded-lg animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="w-10 h-10 bg-gray-100 rounded-full animate-pulse" />
          <div className="w-10 h-10 bg-gray-100 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Summary Card Skeleton */}
      <div className="mx-4 mb-4 h-12 bg-gray-50 rounded-xl animate-pulse" />

      {/* Feed Skeleton */}
      <div className="px-4 flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-gray-50 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}

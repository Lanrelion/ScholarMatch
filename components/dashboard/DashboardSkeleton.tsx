"use client";

import React from "react";

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Match Skeleton */}
      <div className="mx-6 md:mx-8 mt-6 rounded-[24px] overflow-hidden min-h-[220px] md:min-h-[280px] skeleton" />

      {/* Filter Bar Skeleton */}
      <div className="w-full border-b border-border bg-bg/95 mt-8 px-6 md:px-8 py-4">
        <div className="flex gap-2">
          <div className="w-24 h-9 rounded-full skeleton shrink-0" />
          <div className="w-32 h-9 rounded-full skeleton shrink-0" />
          <div className="w-40 h-9 rounded-full skeleton shrink-0" />
          <div className="w-28 h-9 rounded-full skeleton shrink-0" />
        </div>
      </div>

      {/* Feed Skeleton Grid */}
      <div className="px-6 md:px-8 py-8 flex flex-col gap-10">
        <div>
          <div className="w-40 h-6 mb-6 skeleton rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="bg-surface border border-border rounded-[24px] overflow-hidden flex flex-col h-[380px]"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="h-[160px] skeleton w-full" />
                <div className="p-4 pt-4 pb-4.5 flex-1 flex flex-col">
                  <div className="w-3/4 h-4 skeleton rounded mb-2 mt-2" />
                  <div className="w-1/2 h-3 skeleton rounded mb-4" />
                  <div className="flex gap-2 mb-4 mt-2">
                    <div className="w-16 h-5 skeleton rounded-full" />
                    <div className="w-16 h-5 skeleton rounded-full" />
                    <div className="w-16 h-5 skeleton rounded-full" />
                  </div>
                  <div className="w-full h-2 skeleton rounded-full mt-auto mb-2" />
                  <div className="w-full h-2 skeleton rounded-full mb-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .skeleton {
          background: linear-gradient(
            90deg,
            var(--color-surface) 25%,
            var(--color-surface-hover) 37%,
            var(--color-surface) 63%
          );
          background-size: 800px 100%;
          animation: shimmer 1.6s ease infinite;
        }
      `}} />
    </div>
  );
}

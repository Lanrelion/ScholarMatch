import React from "react";

export function ScholarshipCardSkeleton() {
  return (
    <div className="scholarship-card flex flex-col h-full animate-pulse border border-border bg-surface rounded-xl overflow-hidden min-h-[400px]">
      <div className="card-image bg-surface-hover h-[180px]" />
      <div className="card-body p-6 flex flex-col flex-1">
        <div className="h-5 bg-border rounded w-3/4 mb-3" />
        <div className="h-4 bg-border rounded w-1/2 mb-6" />
        
        <div className="flex gap-2 mb-6">
          <div className="h-5 bg-border rounded w-16" />
          <div className="h-5 bg-border rounded w-20" />
        </div>
        
        <div className="w-full h-1.5 bg-border rounded-full mb-6" />
        
        <div className="flex gap-2 flex-wrap mb-6">
          <div className="h-6 w-20 bg-border rounded-full" />
          <div className="h-6 w-24 bg-border rounded-full" />
        </div>
        
        <div className="mt-auto pt-4 border-t border-border flex justify-between">
          <div className="h-6 w-24 bg-border rounded-full" />
          <div className="h-4 w-12 bg-border rounded" />
        </div>
      </div>
    </div>
  );
}

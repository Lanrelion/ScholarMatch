import React from "react";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col flex-1 min-h-screen bg-bg">
      {/* Header Skeleton mimicking DashboardHeader */}
      <header className="px-6 md:px-8 pt-7 pb-4 flex items-start justify-between bg-bg sticky top-0 z-30">
        <div className="flex flex-col gap-3 mt-1">
          <div className="h-7 w-48 rounded-md skeleton" />
          <div className="h-3.5 w-64 rounded-md skeleton" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full skeleton" />
          <div className="w-9 h-9 rounded-full skeleton" />
        </div>
      </header>
      
      <main className="flex-1">
        <DashboardSkeleton />
      </main>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { ErrorState } from "@/components/ui/ErrorState";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setIsOffline(true);
    }
    console.error("Dashboard Error Boundary Caught:", error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 h-full min-h-[60vh]">
      <ErrorState 
        type={isOffline ? "offline" : "api-error"} 
        onRetry={() => {
          reset();
          window.location.reload();
        }} 
      />
    </div>
  );
}

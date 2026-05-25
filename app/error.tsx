"use client";

import React, { useEffect } from "react";
import { ErrorState } from "@/components/ui/ErrorState";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-bg relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay grain-overlay" />
      <div className="z-10 w-full">
        <ErrorState 
          type="api-error" 
          onRetry={() => {
            reset();
            window.location.reload();
          }} 
        />
      </div>
    </div>
  );
}

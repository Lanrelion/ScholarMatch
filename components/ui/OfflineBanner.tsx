"use client";

import React, { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    // Initial check
    updateStatus();

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-[var(--color-red)] text-white px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300">
      <WifiOff size={14} strokeWidth={3} />
      You are currently offline. Showing cached results.
    </div>
  );
}

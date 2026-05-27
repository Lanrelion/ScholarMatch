import React from "react";
import { CircleNotch } from "@phosphor-icons/react";

export function MatchingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center h-[50vh]">
      <CircleNotch size={48} className="text-moss animate-spin mb-4" />
      <h3 className="text-lg font-editorial font-medium text-ink mb-2">Analyzing Your Profile</h3>
      <p className="text-sm font-ui text-ink-secondary">Finding the best scholarships for your academic background...</p>
    </div>
  );
}

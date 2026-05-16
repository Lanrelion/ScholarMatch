"use client";

import React from "react";
import { BottomNav } from "@/components/layout/BottomNav";
import { ErrorState } from "@/components/ui/ErrorState";
import { BellOff } from "lucide-react";

export default function AlertsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-4 pt-6 pb-3 border-b border-[var(--color-border)]">
        <h1 className="text-lg font-medium text-[var(--color-text-primary)]">Alerts</h1>
        <p className="text-[var(--color-text-secondary)] text-sm mt-0.5">Stay updated on your scholarship matches</p>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center pb-20 animate-[fadeUp_0.3s_ease-out]">
        <ErrorState 
          icon={<BellOff size={32} className="text-[var(--color-text-tertiary)]" />}
          title="No alerts yet"
          description="We'll notify you when new scholarships matching your profile are found."
        />
      </main>

      <BottomNav />
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleNotch, ArrowLeft, Clock } from "@phosphor-icons/react";
import { BottomNav } from "@/components/layout/BottomNav";
import { AlertTimeline } from "@/components/alerts/AlertTimeline";
import { AlertItem } from "@/components/alerts/AlertRow";

export default function DeadlinesPage() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const savedRes = await fetch("/api/saved");
        if (!savedRes.ok) throw new Error("Failed to fetch");

        const savedData = await savedRes.json();
        const now = new Date();
        const unifiedAlerts: AlertItem[] = [];

        savedData.forEach((item: any) => {
          // 1. Deadline Alerts Only
          if (!item.deadlineDismissed && item.scholarship.deadline) {
            const deadline = new Date(item.scholarship.deadline);
            const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysLeft >= 0 && daysLeft <= 30) {
              unifiedAlerts.push({
                id: item.id,
                type: 'deadline',
                scholarshipId: item.scholarshipId,
                title: item.scholarship.title,
                timestamp: deadline,
                daysLeft,
              });
            }
          }
        });

        // Sort overall by timeline
        unifiedAlerts.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

        setAlerts(unifiedAlerts);
      } catch (err) {
        setError("Failed to load deadlines");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center pb-[64px]">
        <CircleNotch size={24} className="animate-spin text-moss" />
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center">
      <div className="w-full max-w-[800px] px-6 pt-8 pb-32">
        
        {/* Back row */}
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 bg-transparent hover:bg-surface-hover px-2 py-1 -ml-2 rounded-md transition-colors text-ink font-ui font-medium text-[14px]"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        {/* HEADER */}
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-editorial font-normal text-ink leading-tight">
              Deadlines
            </h1>
            <p className="text-[13px] font-ui text-ink-secondary mt-1">
              {alerts.length === 0 ? "You have no upcoming deadlines." : `${alerts.length} deadlines approaching.`}
            </p>
          </div>
          <Clock size={24} className="text-ink-secondary" weight="light" />
        </header>

        {error ? (
          <div className="text-red-500 font-ui text-[14px]">{error}</div>
        ) : (
          <AlertTimeline initialAlerts={alerts} />
        )}

      </div>
      
      <BottomNav />
    </div>
  );
}

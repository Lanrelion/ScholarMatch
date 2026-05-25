"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, BookmarkSimple, Bell, User } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [savedRes, reviewsRes] = await Promise.all([
          fetch("/api/saved"),
          fetch("/api/reviews")
        ]);

        const savedData = savedRes.ok ? await savedRes.json() : [];
        const reviewsData = reviewsRes.ok ? await reviewsRes.json() : [];

        const now = new Date();
        const upcomingDeadlines = savedData.filter((item: any) => {
          if (!item.scholarship.deadline) return false;
          const deadline = new Date(item.scholarship.deadline);
          const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return daysLeft >= 0 && daysLeft <= 14; // Within 14 days
        }).length;

        const changeAlerts = savedData.filter((item: any) => item.changeAlerted).length;
        const pendingReviews = reviewsData.length;

        setAlertCount(upcomingDeadlines + changeAlerts + pendingReviews);
      } catch (err) {
        // Silently fail on nav
      }
    }
    
    fetchCounts();
  }, []);

  const tabs = [
    { id: "discover", label: "Discover", icon: House, path: "/dashboard" },
    { id: "saved", label: "Saved", icon: BookmarkSimple, path: "/saved" },
    { id: "alerts", label: "Alerts", icon: Bell, path: "/alerts", count: alertCount },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 h-[64px] bg-bg/80 backdrop-blur-xl border-t border-border pb-[env(safe-area-inset-bottom)] flex z-50 md:hidden">
      {tabs.map((tab) => {
        const isActive = pathname === tab.path || pathname.startsWith(tab.path + "/");
        const Icon = tab.icon;
        
        return (
          <Link
            key={tab.id}
            href={tab.path}
            className="flex-1 flex flex-col items-center justify-center gap-1 relative group"
          >
            {isActive && (
               <span className="absolute top-0 w-8 h-0.5 rounded-full bg-moss transition-all duration-300" />
            )}
            <div className="relative flex flex-col items-center mt-1">
              <Icon 
                size={24} 
                weight={isActive ? "fill" : "regular"}
                className={cn("transition-colors", isActive ? "text-moss" : "text-ink-secondary")} 
              />
              {tab.id === "alerts" && (tab.count || 0) > 0 && (
                <span className="absolute -top-1 -right-2 w-[18px] h-[18px] rounded-full bg-urgent text-white text-[10px] flex items-center justify-center font-bold">
                  {tab.count}
                </span>
              )}
            </div>
            <span 
              className={cn(
                "text-[10px] font-ui font-medium transition-colors",
                isActive ? "text-moss" : "text-ink-secondary group-hover:text-ink"
              )}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

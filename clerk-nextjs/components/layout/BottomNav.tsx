"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, BookmarkSimple, Bell, User, Clock } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useNavCounts } from "@/hooks/useNavCounts";

export function BottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { fetchCounts, ...counts } = useNavCounts();

  useEffect(() => {
    setMounted(true);
    fetchCounts();
  }, [fetchCounts]);

  const tabs = [
    { id: "discover", label: "Discover", icon: Compass, path: "/dashboard", count: mounted ? counts.discoverCount : 0 },
    { id: "saved", label: "Saved", icon: BookmarkSimple, path: "/saved", count: mounted ? counts.savedCount : 0 },
    { id: "deadlines", label: "Deadlines", icon: Clock, path: "/deadlines", count: mounted ? counts.deadlinesCount : 0 },
    { id: "alerts", label: "Alerts", icon: Bell, path: "/alerts", count: mounted ? counts.alertsCount : 0 },
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
              {(tab.count || 0) > 0 && (
                <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-urgent text-white text-[10px] flex items-center justify-center font-bold">
                  {(tab.count || 0) > 99 ? "99+" : tab.count}
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

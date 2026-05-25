"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, BookmarkSimple, Bell, User } from "@phosphor-icons/react";

interface Props {
  savedCount?: number;
}

export default function BottomNav({ savedCount = 0 }: Props) {
  const pathname = usePathname();

  const tabs = [
    { id: "discover", label: "Discover", icon: Compass, path: "/dashboard" },
    { id: "saved", label: "Saved", icon: BookmarkSimple, path: "/saved", count: savedCount },
    { id: "alerts", label: "Alerts", icon: Bell, path: "/alerts" },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 h-[60px] bg-white/95 backdrop-blur-[8px] border-t border-[var(--color-border)] pb-[env(safe-area-inset-bottom)] flex z-50">
      {tabs.map((tab) => {
        const isActive = pathname === tab.path || pathname.startsWith(tab.path + "/");
        const Icon = tab.icon;
        
        return (
          <Link
            key={tab.id}
            href={tab.path}
            className="w-1/4 flex flex-col items-center gap-[3px] pt-2 pb-1.5 relative group"
          >
            {isActive && (
              <span className="absolute top-[-2px] w-1 h-1 rounded-full bg-[var(--color-primary)] transition-all duration-200" />
            )}
            <div className="relative flex flex-col items-center">
              <Icon 
                size={20} 
                className={isActive ? "text-[var(--color-primary)]" : "text-[var(--color-text-tertiary)]"} 
              />
              {tab.id === "saved" && (tab.count || 0) > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[var(--color-primary)] text-white text-[10px] flex items-center justify-center font-bold animate-[scaleIn_0.3s_cubic-bezier(0.34,1.56,0.64,1)]">
                  {tab.count}
                </span>
              )}
            </div>
            <span 
              className={`text-[10px] font-medium transition-colors ${
                isActive ? "text-[var(--color-primary)]" : "text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-secondary)]"
              }`}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

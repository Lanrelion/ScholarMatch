"use client";

import React, { useEffect, useState } from "react";
import { MagnifyingGlass, Bell } from "@phosphor-icons/react";
import Link from "next/link";
import { useSearchOverlay } from "@/hooks/useSearchOverlay"; // We will create this

interface Props {
  firstName: string | null;
  totalMatches?: number;
  newMatchesCount?: number;
  urgentDeadlineDays?: number;
}

export function DashboardHeader({ firstName, totalMatches = 0, newMatchesCount = 0, urgentDeadlineDays = 0 }: Props) {
  const { openSearch } = useSearchOverlay();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    return "Late night";
  };

  const getSubLine = () => {
    if (newMatchesCount > 0) return `${newMatchesCount} new scholarships match your profile.`;
    if (urgentDeadlineDays > 0 && urgentDeadlineDays <= 14) return `One of your saved scholarships closes in ${urgentDeadlineDays} days.`;
    return `You have ${totalMatches} scholarships waiting to be explored.`;
  };

  const greeting = mounted ? getGreeting() : "Welcome";
  const displayName = firstName ? `, ${firstName}.` : ".";
  
  // Open search on Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openSearch]);

  return (
    <header className="px-6 md:px-8 pt-7 pb-4 flex items-start justify-between bg-bg sticky top-0 z-30">
      <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
        <h1 className="text-[28px] font-editorial font-light text-ink leading-tight tracking-tight">
          {greeting}{displayName}
        </h1>
        <p className="text-ink-secondary text-[14px] font-ui mt-1">
          {mounted ? getSubLine() : "Loading your matches..."}
        </p>
      </div>

      <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
        {/* Search icon (All screens) */}
        <button
          onClick={openSearch}
          className="btn-icon"
          aria-label="Search scholarships"
        >
          <MagnifyingGlass size={20} className="text-ink-secondary" />
        </button>

        <Link
          href="/alerts"
          aria-label="Notifications"
          className="btn-icon relative"
        >
          <Bell size={20} className="text-ink-secondary" />
          {urgentDeadlineDays > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-urgent rounded-full border border-surface shadow-sm" />
          )}
        </Link>
      </div>
    </header>
  );
}

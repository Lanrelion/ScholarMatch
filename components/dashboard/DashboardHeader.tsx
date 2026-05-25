"use client";

import React from "react";
import { Search, Bell, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface Props {
  firstName: string | null;
}

export function DashboardHeader({ firstName }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    if (searchQuery) params.set("q", searchQuery);
    else params.delete("q");
    router.push(`/dashboard?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (!isSearchOpen && searchQuery) {
      // Clear search if closed and query exists
      setSearchQuery("");
      const params = new URLSearchParams(window.location.search);
      params.delete("q");
      router.push(`/dashboard?${params.toString()}`, { scroll: false });
    }
  }, [isSearchOpen]);

  const greeting = getGreeting();
  const displayName = firstName ? `, ${firstName}` : "";

  return (
    <header className="px-6 py-5 flex items-center justify-between bg-bg/90 backdrop-blur-md sticky top-0 z-30 transition-all duration-300 border-b border-border">
      {!isSearchOpen ? (
        <>
          <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
            <h1 className="text-2xl font-editorial font-medium text-ink leading-tight tracking-tight">
              {greeting}{displayName}
            </h1>
            <p className="text-ink-secondary text-sm font-ui mt-0.5">
              Let's find your perfect match
            </p>
          </div>

          <div className="flex items-center gap-1 animate-in fade-in slide-in-from-right-4 duration-500">
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search scholarships"
              className="btn-icon"
            >
              <Search size={20} />
            </button>
            <Link
              href="/alerts"
              aria-label="Notifications"
              className="btn-icon relative"
            >
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-urgent rounded-full border-2 border-surface shadow-sm" />
            </Link>
          </div>
        </>
      ) : (
        <form 
          onSubmit={handleSearchSubmit}
          className="flex-1 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <div className="flex-1 relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors">
              <Search size={18} />
            </div>
            <input
              autoFocus
              type="text"
              placeholder="Search by title, field or provider..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl text-sm font-bold placeholder:text-gray-400 outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all"
            />
          </div>
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="w-11 h-11 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-gray-600 rounded-2xl transition-all active:scale-90"
          >
            <X size={20} />
          </button>
        </form>
      )}
    </header>
  );
}

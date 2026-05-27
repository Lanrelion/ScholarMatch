"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScholarshipWithMatch } from "@/types/scholarship";
import { TopMatch } from "./TopMatch";
import { FilterBar, FilterType, SortType } from "./FilterBar";
import { SectionLabel } from "./SectionLabel";
import { ScholarshipCard } from "./ScholarshipCard";
import { DashboardSkeleton } from "./DashboardSkeleton";

import { useNavCounts } from "@/hooks/useNavCounts";

interface DiscoveryFeedProps {
  initialScholarships: ScholarshipWithMatch[];
  profile: Record<string, unknown>;
  initialSavedIds?: string[];
}

export function DiscoveryFeed({ initialScholarships, profile, initialSavedIds = [] }: DiscoveryFeedProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [activeSort, setActiveSort] = useState<SortType>("match");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(initialSavedIds));
  const { fetchCounts } = useNavCounts();

  // Client-side filtering
  const filteredScholarships = useMemo(() => {
    let list = [...initialScholarships];

    // Apply Filter
    switch (activeFilter) {
      case "fully_funded":
        list = list.filter(s => (s as any).eligibilityParsed?.fundingType?.toLowerCase() === "full" || !s.amount);
        break;
      case "university":
        list = list.filter(s => s.provider?.toLowerCase().includes("university") || s.provider?.toLowerCase().includes("college"));
        break;
      case "masters":
        list = list.filter(s => s.eligibleDegrees?.includes("MASTERS"));
        break;
      case "closing_soon":
        const now = new Date();
        list = list.filter(s => {
          if (!s.deadline) return false;
          const days = Math.ceil((new Date(s.deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return days >= 0 && days <= 30;
        });
        break;
      case "new":
        list = list.slice(0, 5);
        break;
      case "destination":
        list = list.filter(s => (s as any).countryOfStudy === profile?.targetCountryOfStudy);
        break;
    }

    // Apply Sort
    switch (activeSort) {
      case "match":
        list.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        break;
      case "deadline":
        list.sort((a, b) => {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        });
        break;
      case "recent":
        break;
      case "amount":
        list.sort((a, b) => (b.amount || 0) - (a.amount || 0));
        break;
    }

    return list;
  }, [initialScholarships, activeFilter, activeSort, profile]);

  if (!initialScholarships || initialScholarships.length === 0) {
    return <DashboardSkeleton />;
  }

  const topMatch = initialScholarships[0];
  const feedItems = filteredScholarships.filter(s => s.id !== topMatch?.id);

  // Grouping for sections
  const bestMatches = feedItems.slice(0, 6);
  const closingSoon = feedItems.filter(s => {
    if (!s.deadline) return false;
    const days = Math.ceil((new Date(s.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days >= 0 && days <= 30;
  }).slice(0, 2);
  const universitySpecific = feedItems.filter(s => s.provider?.toLowerCase().includes("university")).slice(0, 3);
  const moreMatches = feedItems.slice(6); // The rest

  const toggleSave = async (id: string) => {
    const isSaved = savedIds.has(id);
    
    // Optimistic UI update
    setSavedIds(prev => {
      const next = new Set(prev);
      if (isSaved) next.delete(id);
      else next.add(id);
      return next;
    });

    try {
      if (isSaved) {
        await fetch("/api/saved", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scholarshipId: id })
        });
      } else {
        const scholarship = initialScholarships.find(s => s.id === id);
        await fetch("/api/saved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            scholarshipId: id,
            matchScore: scholarship?.matchScore || 0,
            matchBreakdown: scholarship?.matchBreakdown || {}
          })
        });
      }
      // Force refresh the global nav counts
      fetchCounts(true);
    } catch (err) {
      console.error("Failed to toggle save", err);
      // Revert on error
      setSavedIds(prev => {
        const next = new Set(prev);
        if (isSaved) next.add(id);
        else next.delete(id);
        return next;
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* 3. Top Match Banner */}
      <TopMatch 
        scholarship={topMatch} 
        profile={profile} 
        isSaved={savedIds.has(topMatch?.id)} 
        onSave={toggleSave} 
      />

      {/* 4. Filter Bar */}
      <div className="mt-8">
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          activeSort={activeSort}
          onSortChange={setActiveSort}
          hasDestination={!!profile?.targetCountryOfStudy}
        />
      </div>

      {/* 6. Discovery Feed */}
      <div className="px-6 md:px-8 py-8 pb-32">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`${activeFilter}-${activeSort}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-12"
          >
            {feedItems.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-editorial text-2xl text-ink mb-2">No scholarships match this filter.</p>
                <p className="font-ui text-ink-secondary">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <>
                {/* Best Matches Row */}
                {bestMatches.length > 0 && (
                  <div>
                    <SectionLabel label="Best matches" count={bestMatches.length} action={{ text: "See all", href: "#" }} />
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {bestMatches.map(s => (
                        <ScholarshipCard key={s.id} scholarship={s} isSaved={savedIds.has(s.id)} onSave={toggleSave} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Closing Soon Urgency Grid */}
                {closingSoon.length > 0 && (
                  <div>
                    <SectionLabel label="Closing soon" isUrgent action={{ text: "See all", href: "/deadlines" }} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {closingSoon.map(s => (
                        <div key={s.id} className="relative">
                          {/* Urgency border decoration */}
                          <div className="absolute left-0 top-6 bottom-6 w-[3px] bg-urgent rounded-r-sm z-10" />
                          <ScholarshipCard scholarship={s} isSaved={savedIds.has(s.id)} onSave={toggleSave} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* University-specific Grid */}
                {universitySpecific.length > 0 && (
                  <div>
                    <SectionLabel label="University-specific" />
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {universitySpecific.map(s => (
                        <ScholarshipCard key={s.id} scholarship={s} isSaved={savedIds.has(s.id)} onSave={toggleSave} />
                      ))}
                    </div>
                  </div>
                )}

                {/* More Matches Grid */}
                {moreMatches.length > 0 && (
                  <div>
                    <SectionLabel label="More matches" />
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {moreMatches.map(s => (
                        <ScholarshipCard key={s.id} scholarship={s} isSaved={savedIds.has(s.id)} onSave={toggleSave} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

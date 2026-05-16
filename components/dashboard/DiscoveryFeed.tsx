"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Star, ChevronRight, RefreshCcw } from "lucide-react";
import { ScholarshipWithMatch } from "@/types/scholarship";
import { ScholarshipCard } from "./ScholarshipCard";
import { MatchingIndicator } from "@/components/ui/MatchingIndicator";
import { FilterPills } from "@/components/ui/FilterPills";
import { ScholarshipCardSkeleton } from "@/components/ui/ScholarshipCardSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { cn } from "@/lib/utils";

const FILTER_OPTIONS = [
  { id: "all", label: "All matches" },
  { id: "fullFunding", label: "Fully funded" },
  { id: "europe", label: "Europe" },
  { id: "masters", label: "Masters" },
];

export function DiscoveryFeed({ 
  initialScholarships = [], 
  initialSavedIds = {}, 
  initialReviewCount = 0,
  profile = null
}: { 
  initialScholarships?: ScholarshipWithMatch[], 
  initialSavedIds?: Record<string, string>,
  initialReviewCount?: number,
  profile?: any
}) {
  const router = useRouter();
  const [scholarships, setScholarships] = useState<ScholarshipWithMatch[]>(initialScholarships);
  const [isLoading, setIsLoading] = useState(initialScholarships.length === 0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialScholarships.length === 20); // Assumption for initial load
  const [activeFilter, setActiveFilter] = useState("all");
  const [userProfile, setUserProfile] = useState<any>(profile);
  const [savedIds, setSavedIds] = useState<Record<string, string>>(initialSavedIds); // scholarshipId -> savedId
  const [reviewCount, setReviewCount] = useState(initialReviewCount);
  const [showNudge, setShowNudge] = useState(true);

  const fetchData = async (pageNum: number, isMore = false) => {
    // If we have initial data and it's the first page, we already have what we need
    if (pageNum === 1 && initialScholarships.length > 0 && !isMore) {
      setIsLoading(false);
      return;
    }

    if (isMore) setIsLoadingMore(true);
    else setIsLoading(true);
    
    setError(null);

    try {
      const [res, profileRes, savedRes, reviewRes] = await Promise.all([
        fetch(`/api/scholarships?page=${pageNum}&limit=20`),
        !userProfile ? fetch("/api/profile") : Promise.resolve(null),
        fetch("/api/saved"),
        fetch("/api/reviews")
      ]);

      if (!res.ok) throw new Error("Failed to load scholarships");
      const data = await res.json();
      
      const newScholarships = data.data;
      setScholarships(prev => isMore ? [...prev, ...newScholarships] : newScholarships);
      setHasMore(data.meta.hasMore);
      
      if (profileRes && profileRes.ok) {
        const profileData = await profileRes.json();
        setUserProfile(profileData.profile);
      }

      if (savedRes && savedRes.ok) {
        const savedData = await savedRes.json();
        const mapping: Record<string, string> = {};
        savedData.forEach((item: any) => {
          mapping[item.scholarshipId] = item.id;
        });
        setSavedIds(mapping);
      }

      if (reviewRes && reviewRes.ok) {
        const reviewData = await reviewRes.json();
        setReviewCount(reviewData.length);
        if (sessionStorage.getItem("review_nudge_tapped")) {
          setShowNudge(false);
        }
      }
    } catch (err) {
      setError("Could not load scholarships");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const [isFreshMatch, setIsFreshMatch] = useState(false);

  useEffect(() => {
    const lastMatch = localStorage.getItem("last_match_timestamp");
    const now = Date.now();
    if (!lastMatch || now - parseInt(lastMatch) > 24 * 60 * 60 * 1000) {
      setIsFreshMatch(true);
      localStorage.setItem("last_match_timestamp", now.toString());
    }
    fetchData(1);
  }, []);

  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";

  const filteredScholarships = useMemo(() => {
    let list = scholarships;

    if (query) {
      list = list.filter(s => 
        s.title.toLowerCase().includes(query) || 
        s.provider?.toLowerCase().includes(query) ||
        s.fieldsOfStudy.some(f => f.toLowerCase().includes(query)) ||
        s.description?.toLowerCase().includes(query)
      );
    }

    switch (activeFilter) {
      case "fullFunding":
        return list.filter(s => s.eligibilityParsed?.fundingType === "full");
      case "europe":
        const europeanDomains = [".de", ".se", ".be", ".nl", ".eu", ".ch", ".no", ".dk", ".fi", ".fr", ".it", ".es"];
        return list.filter(s => {
          const domainMatch = s.sourceDomain && europeanDomains.some(d => s.sourceDomain!.endsWith(d));
          const funderMatch = s.provider && /Europe|Germany|Sweden|Flemish|Dutch|France|Erasmus/i.test(s.provider);
          return domainMatch || funderMatch;
        });
      case "masters":
        return list.filter(s => s.eligibleDegrees.includes("MASTERS"));
      default:
        return list;
    }
  }, [scholarships, activeFilter, query]);

  const isEmptyState = filteredScholarships.length === 0 && scholarships.length > 0;
  const displayList = isEmptyState ? scholarships.slice(0, 5) : filteredScholarships;

  if (isLoading && page === 1) {
    return (
      <div className="flex flex-col">
        {isFreshMatch ? (
          <MatchingIndicator />
        ) : (
          <div className="px-4 mt-8 flex flex-col gap-4">
            <div className="h-6 w-32 bg-gray-100 rounded animate-pulse mb-2" />
            {[1, 2, 3].map(i => <ScholarshipCardSkeleton key={i} />)}
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <ErrorState 
          title="Couldn't find scholarships"
          description="There was a problem reaching our servers. Check your connection and try again."
        />
        <button 
          onClick={() => fetchData(1)}
          className="mt-6 w-full h-[44px] bg-[var(--color-primary)] text-white rounded-[var(--radius-md)] font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <RefreshCcw size={16} />
          Retry connection
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <div className="mt-2 mb-2">
        <FilterPills 
          options={FILTER_OPTIONS} 
          activeId={activeFilter} 
          onChange={setActiveFilter} 
        />
      </div>

      <div className="px-4 mb-4">
        <p className="text-[13px] text-[var(--color-text-secondary)] font-medium">
          {filteredScholarships.length} matches found
        </p>
      </div>

      <div className="px-4 pb-12 flex flex-col gap-4 stagger-children">
        {isEmptyState && (
          <div className="p-4 bg-[var(--color-amber-surface)] rounded-[var(--radius-md)] border border-[var(--color-border)]/20 mb-2">
             <p className="text-sm text-[var(--color-amber-dark)] font-medium">
               {query ? `No results for "${query}"` : "No exact matches for this filter"}
             </p>
             <p className="text-[13px] text-[var(--color-amber-dark)] opacity-80 mt-1">
               Showing your top overall matches instead:
             </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayList.map((s, idx) => (
          <React.Fragment key={s.id}>
            {/* Review Nudge */}
            {idx === 2 && reviewCount > 0 && showNudge && (
               <div 
                 onClick={() => {
                   sessionStorage.setItem("review_nudge_tapped", "true");
                   setShowNudge(false);
                   router.push('/saved');
                 }}
                 className="p-4 bg-[var(--color-primary-surface)] rounded-[var(--radius-md)] border border-[var(--color-primary-border)] flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform group shadow-sm"
               >
                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[var(--color-primary)] flex-shrink-0 shadow-sm">
                   <Star size={20} fill="currentColor" />
                 </div>
                 <div className="flex-1">
                   <p className="text-sm font-bold text-[var(--color-primary-dark)]">
                     Rate your {reviewCount} matches
                   </p>
                   <p className="text-[11px] text-[var(--color-primary-dark)] opacity-70">
                     Help us refine your future recommendations
                   </p>
                 </div>
                 <ChevronRight size={18} className="text-[var(--color-primary)] group-hover:translate-x-0.5 transition-transform" />
               </div>
            )}
            
            <ScholarshipCard 
              scholarship={s} 
              initialSaved={!!savedIds[s.id]} 
              savedItemId={savedIds[s.id]} 
            />

            {/* Profile Nudge */}
            {idx === 4 && userProfile?.gpa === null && (
               <div className="p-4 border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-md)] bg-[var(--color-surface)] flex items-center justify-between cursor-pointer active:scale-[0.99] transition-transform" onClick={() => router.push('/profile')}>
                 <p className="text-[13px] text-[var(--color-text-secondary)] font-medium">Add your GPA for 40% better matching →</p>
               </div>
            )}
          </React.Fragment>
        ))}
        </div>

        {hasMore && (
          <button
            onClick={() => {
              const next = page + 1;
              setPage(next);
              fetchData(next, true);
            }}
            disabled={isLoadingMore}
            className="mt-4 bg-white border border-[var(--color-border-strong)] rounded-[var(--radius-md)] h-[50px] w-full text-sm text-[var(--color-text-secondary)] font-bold flex items-center justify-center gap-2 active:bg-gray-50 transition-colors"
          >
            {isLoadingMore ? (
               <RefreshCcw size={16} className="animate-spin text-[var(--color-primary)]" />
            ) : "View more opportunities"}
          </button>
        )}
      </div>
    </div>
  );
}

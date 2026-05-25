"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Star, CaretRight, ArrowsClockwise } from "@phosphor-icons/react";
import { ScholarshipWithMatch } from "@/types/scholarship";
import { ScholarshipCard } from "./ScholarshipCard";
import { MatchingIndicator } from "@/components/ui/MatchingIndicator";
import { FilterPills } from "@/components/ui/FilterPills";
import { ScholarshipCardSkeleton } from "@/components/ui/ScholarshipCardSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const FILTER_OPTIONS = [
  { id: "all", label: "All matches" },
  { id: "fullFunding", label: "Fully funded" },
  { id: "europe", label: "Europe" },
  { id: "masters", label: "Masters" },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const revealVariants = {
  hidden: { opacity: 0, y: 32, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as any
    }
  }
};

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
  const [hasMore, setHasMore] = useState(initialScholarships.length === 20);
  const [activeFilter, setActiveFilter] = useState("all");
  const [userProfile, setUserProfile] = useState<any>(profile);
  const [savedIds, setSavedIds] = useState<Record<string, string>>(initialSavedIds);
  const [reviewCount, setReviewCount] = useState(initialReviewCount);
  const [showNudge, setShowNudge] = useState(true);
  const [isFreshMatch, setIsFreshMatch] = useState(false);

  const fetchData = async (pageNum: number, isMore = false) => {
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
          <div className="px-6 mt-8 flex flex-col gap-6">
            <div className="h-6 w-32 bg-surface-hover rounded animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => <ScholarshipCardSkeleton key={i} />)}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState 
        type="api-error"
        onRetry={() => fetchData(1)}
      />
    );
  }

  const featured = displayList[0];
  const horizontalGroup = displayList.slice(1, 4);
  const gridGroup = displayList.slice(4);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="flex flex-col"
    >
      <motion.div variants={revealVariants} className="mt-2 mb-6">
        <FilterPills 
          options={FILTER_OPTIONS} 
          activeId={activeFilter} 
          onChange={setActiveFilter} 
        />
      </motion.div>

      <div className="px-6 pb-24 flex flex-col gap-12">
        {isEmptyState && (
          <motion.div variants={revealVariants} className="p-4 bg-warning-surface rounded-lg border border-warning">
             <p className="text-sm text-warning font-medium">
               {query ? `No results for "${query}"` : "No exact matches for this filter"}
             </p>
             <p className="text-[13px] text-warning mt-1 opacity-80">
               Showing your top overall matches instead:
             </p>
          </motion.div>
        )}

        {/* Featured Full-Width Card */}
        {featured && (
          <motion.div variants={revealVariants}>
            <div className="flex items-center gap-2 mb-4">
              <Star size={16} weight="fill" className="text-moss" />
              <h2 className="font-editorial text-lg text-ink">Top Match</h2>
            </div>
            <ScholarshipCard 
              scholarship={featured} 
              initialSaved={!!savedIds[featured.id]} 
              savedItemId={savedIds[featured.id]}
            />
          </motion.div>
        )}

        {/* Horizontal Scroll Row */}
        {horizontalGroup.length > 0 && (
          <motion.div variants={revealVariants} className="-mx-6">
            <div className="px-6 flex items-center justify-between mb-4">
              <h2 className="font-editorial text-lg text-ink">Highly Recommended</h2>
            </div>
            <div className="flex overflow-x-auto gap-6 px-6 pb-4 snap-x snap-mandatory no-scrollbar">
              {horizontalGroup.map((s) => (
                <div key={s.id} className="min-w-[85vw] md:min-w-[400px] snap-center">
                  <ScholarshipCard 
                    scholarship={s} 
                    initialSaved={!!savedIds[s.id]} 
                    savedItemId={savedIds[s.id]} 
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 2-Column Grid */}
        {gridGroup.length > 0 && (
          <motion.div variants={revealVariants}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-editorial text-lg text-ink">More Opportunities</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gridGroup.map((s, idx) => (
                <React.Fragment key={s.id}>
                  {/* Review Nudge */}
                  {idx === 2 && reviewCount > 0 && showNudge && (
                     <div 
                       onClick={() => {
                         sessionStorage.setItem("review_nudge_tapped", "true");
                         setShowNudge(false);
                         router.push('/saved');
                       }}
                       className="p-4 bg-moss-light rounded-lg border border-moss flex items-center gap-3 cursor-pointer transition-transform hover:-translate-y-1"
                     >
                       <div className="w-10 h-10 rounded-full bg-bg flex items-center justify-center text-moss shrink-0">
                         <Star size={20} weight="fill" />
                       </div>
                       <div className="flex-1">
                         <p className="text-sm font-ui font-medium text-ink">
                           Rate your {reviewCount} matches
                         </p>
                         <p className="text-xs font-ui text-ink-secondary mt-0.5">
                           Help us refine your future recommendations
                         </p>
                       </div>
                       <CaretRight size={18} className="text-moss" />
                     </div>
                  )}
                  
                  <ScholarshipCard 
                    scholarship={s} 
                    initialSaved={!!savedIds[s.id]} 
                    savedItemId={savedIds[s.id]} 
                  />
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        )}

        {hasMore && (
          <motion.div variants={revealVariants} className="flex justify-center mt-4">
            <Button
              onClick={() => {
                const next = page + 1;
                setPage(next);
                fetchData(next, true);
              }}
              disabled={isLoadingMore}
              variant="secondary"
              className="w-full md:w-auto flex items-center gap-2 justify-center"
            >
              {isLoadingMore ? (
                 <ArrowsClockwise size={16} className="animate-spin text-clay" />
              ) : "Load more opportunities"}
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}


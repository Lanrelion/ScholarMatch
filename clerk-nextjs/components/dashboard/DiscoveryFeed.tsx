"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ScholarshipWithMatch, FilterKey } from "@/types/scholarship";
import ScholarshipCard from "./ScholarshipCard";

export default function DiscoveryFeed() {
  const [scholarships, setScholarships] = useState<ScholarshipWithMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [savedIds, setSavedIds] = useState<Record<string, string>>({}); // scholarshipId -> savedId

  const fetchData = async (pageNum: number, isMore = false) => {
    if (isMore) setIsLoadingMore(true);
    else setIsLoading(true);
    
    setError(null);

    try {
      const res = await fetch(`/api/scholarships?page=${pageNum}&limit=20`);
      if (!res.ok) throw new Error("Failed to load scholarships");
      
      const data = await res.json();
      const newScholarships = data.data;
      
      setScholarships(prev => isMore ? [...prev, ...newScholarships] : newScholarships);
      setHasMore(data.meta.hasMore);
      
      // Also fetch profile if not already fetched
      if (!userProfile) {
        const profileRes = await fetch("/api/profile");
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setUserProfile(profileData.profile);
        }
      }

      // Fetch saved items
      const savedRes = await fetch("/api/saved");
      if (savedRes.ok) {
        const savedData = await savedRes.json();
        const mapping: Record<string, string> = {};
        savedData.forEach((item: any) => {
          mapping[item.scholarshipId] = item.id;
        });
        setSavedIds(mapping);
      }
    } catch (err) {
      setError("Could not load scholarships");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const filteredScholarships = useMemo(() => {
    switch (activeFilter) {
      case "fullFunding":
        return scholarships.filter(s => s.eligibilityParsed?.fundingType === "full");
      case "universitySpecific":
        return scholarships.filter(s => s.scholarshipType !== "NATIONAL");
      case "myDestination":
        return scholarships.filter(s => userProfile?.countryOfStudy && s.universityCountry === userProfile.countryOfStudy);
      case "masters":
        return scholarships.filter(s => s.eligibleDegrees.includes("MASTERS"));
      default:
        return scholarships;
    }
  }, [scholarships, activeFilter]);

  const displayList = filteredScholarships.length > 0 ? filteredScholarships : scholarships.slice(0, 3);
  const isEmptyState = filteredScholarships.length === 0 && scholarships.length > 0;

  if (isLoading && page === 1) {
    return (
      <div className="px-4 flex flex-col gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse p-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="flex gap-2">
               <div className="h-6 bg-gray-200 rounded-full w-20"></div>
               <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <i className="ti-wifi-off text-3xl text-gray-300 mb-4"></i>
        <h3 className="text-gray-900 font-medium">Could not load scholarships</h3>
        <p className="text-gray-500 text-sm mt-1">Check your connection and try again</p>
        <button 
          onClick={() => fetchData(1)}
          className="mt-6 px-6 py-2.5 bg-[#1D9E75] text-white rounded-xl font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* FILTER PILLS */}
      <div className="px-4 py-2 flex overflow-x-auto no-scrollbar gap-2">
        <FilterPill 
          label="All" 
          active={activeFilter === "all"} 
          onClick={() => setActiveFilter("all")} 
        />
        <FilterPill 
          label="Fully funded" 
          active={activeFilter === "fullFunding"} 
          onClick={() => setActiveFilter("fullFunding")} 
        />
        <FilterPill 
          label="University-specific" 
          active={activeFilter === "universitySpecific"} 
          onClick={() => setActiveFilter("universitySpecific")} 
        />
        <FilterPill 
          label="Masters" 
          active={activeFilter === "masters"} 
          onClick={() => setActiveFilter("masters")} 
        />
        <FilterPill 
          label="My destination" 
          active={activeFilter === "myDestination"} 
          onClick={() => setActiveFilter("myDestination")} 
        />
      </div>

      <div className="px-4 py-2">
        <p className="text-[13px] text-gray-500 font-normal">
          {filteredScholarships.length} matches for your profile
        </p>
      </div>

      {/* LIST */}
      <div className="px-4 pb-8 flex flex-col gap-3">
        {isEmptyState && (
          <div className="py-4">
             <p className="text-sm text-gray-900 font-medium">No exact matches for this filter</p>
             <p className="text-sm text-[#1D9E75] mt-1">Here are your top overall matches →</p>
          </div>
        )}

        {displayList.map((s, idx) => (
          <React.Fragment key={s.id}>
            <ScholarshipCard 
              scholarship={s} 
              initialSaved={!!savedIds[s.id]} 
              savedItemId={savedIds[s.id]} 
            />
            {idx === 4 && userProfile?.gpa === null && (
               <div className="p-4 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50 flex items-center justify-between">
                 <p className="text-sm text-gray-600 font-medium">Add your GPA to improve your matches →</p>
               </div>
            )}
          </React.Fragment>
        ))}

        {hasMore && (
          <button
            onClick={() => {
              const next = page + 1;
              setPage(next);
              fetchData(next, true);
            }}
            disabled={isLoadingMore}
            className="mt-4 bg-white border border-gray-200 rounded-xl px-4 py-3 w-full text-sm text-gray-600 font-medium flex items-center justify-center gap-2"
          >
            {isLoadingMore ? (
               <div className="w-4 h-4 border-2 border-gray-300 border-t-[#1D9E75] rounded-full animate-spin"></div>
            ) : "Load more"}
          </button>
        )}
      </div>
    </div>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-1.5 text-sm transition-colors ${
        active 
          ? "bg-[#1D9E75] text-white font-medium shadow-sm" 
          : "bg-white border border-gray-200 text-gray-600 font-normal hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WarningCircle, ArrowLeft } from "@phosphor-icons/react";
import { BottomNav } from "@/components/layout/BottomNav";
import ReviewPrompt from "@/components/reviews/ReviewPrompt";
import PushPermission from "@/components/pwa/PushPermission";
import { ErrorState } from "@/components/ui/ErrorState";
import { CollectionBoard } from "@/components/saved/CollectionBoard";
import { cn } from "@/lib/utils";

export default function SavedPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [savedRes, reviewsRes] = await Promise.all([
        fetch("/api/saved"),
        fetch("/api/reviews")
      ]);

      if (savedRes.ok) {
        const data = await savedRes.json();
        setItems(data);
      } else {
        setError("Failed to load saved scholarships");
      }

      if (reviewsRes.ok) {
        const data = await reviewsRes.json();
        setPendingReviews(data);
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const alertedItems = items.filter((item) => item.changeAlerted);

  const filters = [
    { id: "all", label: "All Saves" },
    { id: "urgent", label: "Closing < 14 Days" },
    { id: "fully_funded", label: "Fully Funded" },
    { id: "updated", label: "Recently Updated" },
  ];

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center">
      <div className="w-full max-w-[1440px] px-6 lg:px-8 pt-6 pb-24">
        
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

        {/* HEADER ROW */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-[32px] md:text-[40px] font-editorial font-normal text-ink leading-tight tracking-tight">
              The Tracker
            </h1>
            <p className="text-[14px] font-ui text-ink-secondary mt-1">
              Your visual sanctuary for intellectual organization.
            </p>
          </div>
          
          <div className="text-[13px] font-ui text-ink-secondary flex items-center gap-4">
            <span>{items.length} total saves</span>
            {pendingReviews.length > 0 && <span>· {pendingReviews.length} to review</span>}
          </div>
        </header>

        {/* STICKY FILTER BAR */}
        <div className="sticky top-0 z-30 bg-bg/95 backdrop-blur-md border-b border-border py-4 mb-8 -mx-6 px-6 lg:-mx-8 lg:px-8 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2">
            {filters.map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={cn(
                  "px-4 py-1.5 rounded-full font-ui text-[13px] whitespace-nowrap transition-all duration-200 border",
                  activeFilter === f.id 
                    ? "bg-ink text-bg border-ink font-medium" 
                    : "bg-surface text-ink-secondary border-border hover:bg-surface-hover hover:text-ink hover:border-border-strong"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* FRESHNESS ALERT BANNERS */}
        {alertedItems.length > 0 && activeFilter === "all" && (
          <div className="mb-10">
            {alertedItems.map(item => (
              <div 
                key={`alert-${item.id}`}
                onClick={() => router.push(`/scholarship/${item.scholarship.id}`)}
                className="bg-warning-surface border-l-[3px] border-l-warning rounded-lg p-[14px] px-[18px] mb-2 flex items-start gap-2.5 cursor-pointer hover:bg-warning/10 transition-colors"
              >
                <WarningCircle size={18} weight="fill" className="text-warning shrink-0 mt-[2px]" />
                <div>
                  <h4 className="text-[14px] font-ui font-medium text-ink mb-0.5">
                    {item.scholarship.title}
                  </h4>
                  <p className="text-[12px] font-ui text-warning-dark leading-snug">
                    This scholarship has been updated. Check the latest details before applying.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* REVIEW PROMPTS */}
        {pendingReviews.length > 0 && activeFilter === "all" && (
          <div className="mb-10">
            <div className="text-[11px] font-ui font-medium text-moss tracking-[0.1em] uppercase mb-4">
              Rate your matches
            </div>
            <div className="space-y-4 max-w-2xl">
              {pendingReviews.map((item) => (
                <div key={`review-${item.id}`} className="bg-surface border border-border rounded-xl p-4">
                  <ReviewPrompt 
                    scholarship={item.scholarship}
                    savedScholarshipId={item.id}
                    onComplete={(id) => setPendingReviews(prev => prev.filter(p => p.scholarship.id !== id))}
                    onDismiss={(id) => setPendingReviews(prev => prev.filter(p => p.scholarship.id !== id))}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PUSH PERMISSION */}
        <div className="mb-8">
          <PushPermission />
        </div>

        {/* SAVED LIST (COLLECTION BOARD) */}
        {isLoading ? (
          <div className="flex gap-6 overflow-hidden min-h-[50vh]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-[320px] shrink-0 space-y-4">
                <div className="w-32 h-6 bg-surface border border-border rounded animate-pulse" />
                <div className="h-48 bg-surface border border-border rounded-xl animate-pulse" />
                <div className="h-64 bg-surface border border-border rounded-xl animate-pulse" />
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorState type="api-error" onRetry={fetchData} />
        ) : items.length === 0 ? (
          <ErrorState type="empty-saved" />
        ) : (
          <CollectionBoard initialItems={items} activeFilter={activeFilter} />
        )}

      </div>
      <BottomNav />
    </div>
  );
}

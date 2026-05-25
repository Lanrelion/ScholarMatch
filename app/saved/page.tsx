"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WarningCircle, Bookmark, ArrowRight, ArrowClockwise, ArrowLeft } from "@phosphor-icons/react";
import SavedItem from "@/components/saved/SavedItem";
import { BottomNav } from "@/components/layout/BottomNav";
import ReviewPrompt from "@/components/reviews/ReviewPrompt";
import { PushPermission } from "@/components/pwa/PushPermission";
import { ErrorState } from "@/components/ui/ErrorState";
import { cn } from "@/lib/utils";

export default function SavedPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  
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

  const handleUnsave = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Organize items
  const upcomingDeadlineItems = items
    .filter((item) => item.scholarship.deadline !== null)
    .sort((a, b) => new Date(a.scholarship.deadline!).getTime() - new Date(b.scholarship.deadline!).getTime());

  const openDeadlineItems = items.filter((item) => item.scholarship.deadline === null);
  const alertedItems = items.filter((item) => item.changeAlerted);

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center">
      <div className="w-full max-w-[1000px] px-6 lg:px-8 pt-6 pb-24">
        
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
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[28px] font-editorial font-normal text-ink leading-tight">
              Saved
            </h1>
            <p className="text-[13px] font-ui text-ink-secondary mt-1">
              {items.length} saved · {pendingReviews.length} to review
            </p>
          </div>
        </header>

        {/* FRESHNESS ALERT BANNERS */}
        {alertedItems.length > 0 && (
          <div className="mb-8">
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
        {pendingReviews.length > 0 && (
          <div className="mb-8">
            <div className="text-[11px] font-ui font-medium text-moss tracking-[0.1em] uppercase mb-4">
              Rate your matches
            </div>
            <div className="space-y-4">
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
        <PushPermission />

        {/* SAVED LIST */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-surface border border-border rounded-xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <ErrorState type="api-error" onRetry={fetchData} />
        ) : items.length === 0 ? (
          <ErrorState type="empty-saved" />
        ) : (
          <div className="space-y-10">
            {upcomingDeadlineItems.length > 0 && (
              <section>
                <div className="text-[11px] font-ui font-medium uppercase tracking-[0.1em] text-ink-tertiary mb-3">
                  Upcoming Deadlines
                </div>
                <div className="flex flex-col">
                  {upcomingDeadlineItems.map((item) => (
                    <SavedItem key={item.id} item={item} onUnsave={handleUnsave} />
                  ))}
                </div>
              </section>
            )}

            {openDeadlineItems.length > 0 && (
              <section>
                <div className="text-[11px] font-ui font-medium uppercase tracking-[0.1em] text-ink-tertiary mb-3">
                  Open Deadline
                </div>
                <div className="flex flex-col">
                  {openDeadlineItems.map((item) => (
                    <SavedItem key={item.id} item={item} onUnsave={handleUnsave} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

      </div>
      <BottomNav />
    </div>
  );
}

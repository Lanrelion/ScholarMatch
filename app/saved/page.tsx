"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, AlertTriangle, ArrowRight, RefreshCcw } from "lucide-react";
import SavedItem from "@/components/saved/SavedItem";
import { BottomNav } from "@/components/layout/BottomNav";
import ReviewPrompt from "@/components/reviews/ReviewPrompt";
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

  const now = new Date();
  const fourteenDaysFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  const closingSoonItems = items.filter((item) => {
    if (!item.scholarship.deadline) return false;
    const deadline = new Date(item.scholarship.deadline);
    return deadline <= fourteenDaysFromNow && deadline >= now;
  }).sort((a, b) => new Date(a.scholarship.deadline!).getTime() - new Date(b.scholarship.deadline!).getTime());

  const otherSavedItems = items.filter((item) => {
    if (!item.scholarship.deadline) return false;
    const deadline = new Date(item.scholarship.deadline);
    return deadline > fourteenDaysFromNow;
  }).sort((a, b) => new Date(a.scholarship.deadline!).getTime() - new Date(b.scholarship.deadline!).getTime());

  const openItems = items.filter((item) => item.scholarship.deadline === null);

  return (
    <div className="min-h-screen bg-white pb-24 flex flex-col items-center animate-in fade-in duration-300">
      <div className="w-full max-w-2xl">
        {/* Pattern A Header */}
        <header className="px-4 pt-6 pb-2 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Saved</h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
              {items.length} opportunities tracked
            </p>
          </div>
        </header>

        {/* Change Alerts */}
        <div className="px-4 mt-4">
          {items.filter(item => item.changeAlerted).map(item => (
            <div 
              key={`alert-${item.id}`}
              onClick={() => router.push(`/scholarship/${item.scholarship.id}?from=saved`)}
              className="bg-[var(--color-amber-surface)] rounded-[var(--radius-md)] p-3 mb-3 border border-[var(--color-amber)]/20 flex items-start gap-3 cursor-pointer active:scale-[0.98] transition-transform shadow-sm"
            >
              <AlertTriangle size={18} className="text-[var(--color-amber)] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-[var(--color-amber-dark)] font-bold leading-tight">
                  Updated: {item.scholarship.title}
                </p>
                <p className="text-xs text-[var(--color-amber-dark)] opacity-70 mt-0.5">
                  Requirements changed. Please review before applying.
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Reviews Section */}
        {pendingReviews.length > 0 && (
          <div className="mt-6 mb-2">
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] font-bold px-4 mb-3">
              Rate your matches
            </h2>
            <div className="space-y-3">
              {pendingReviews.map((item) => (
                <ReviewPrompt 
                  key={`review-${item.id}`}
                  scholarship={item.scholarship}
                  savedScholarshipId={item.id}
                  onComplete={(id) => setPendingReviews(prev => prev.filter(p => p.scholarship.id !== id))}
                  onDismiss={(id) => setPendingReviews(prev => prev.filter(p => p.scholarship.id !== id))}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-4">
          {isLoading ? (
            <div className="px-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-[var(--color-surface)] rounded-[var(--radius-md)] animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="py-16 px-6 text-center flex flex-col items-center">
              <RefreshCcw size={40} className="text-[var(--color-red)] opacity-20 mb-4" />
              <p className="text-[var(--color-red)] font-bold">{error}</p>
              <button 
                onClick={fetchData}
                className="mt-6 h-[44px] px-8 bg-[var(--color-primary)] text-white rounded-[var(--radius-md)] text-sm font-bold active:scale-95 transition-transform"
              >
                Try again
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-24 px-6 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-[var(--color-surface)] rounded-full flex items-center justify-center mb-6">
                <Bookmark size={32} className="text-[var(--color-text-tertiary)] opacity-30" />
              </div>
              <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">No saved matches yet</h2>
              <p className="text-sm text-[var(--color-text-secondary)] mb-10 max-w-[260px] leading-relaxed">
                Save scholarships you qualify for to get deadline reminders and track your progress.
              </p>
              <button
                onClick={() => router.push("/dashboard")}
                className="bg-[var(--color-primary)] text-white px-10 py-3.5 rounded-[var(--radius-xl)] text-sm font-bold shadow-lg shadow-[var(--color-primary)]/20 active:scale-95 transition-all flex items-center gap-2"
              >
                Find opportunities
                <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <div className="space-y-10 mt-6 stagger-children">
              {closingSoonItems.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 px-4 mb-4">
                    <h2 className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-red)] font-black">
                      Closing soon
                    </h2>
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-red)] animate-pulse" />
                  </div>
                  <div className="divide-y divide-[var(--color-border)]/30 border-y border-[var(--color-border)]/30 bg-white">
                    {closingSoonItems.map((item) => (
                      <SavedItem key={item.id} item={item} onUnsave={handleUnsave} />
                    ))}
                  </div>
                </section>
              )}

              {otherSavedItems.length > 0 && (
                <section>
                  <h2 className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] font-bold px-4 mb-4">
                    Saved Opportunities
                  </h2>
                  <div className="divide-y divide-[var(--color-border)]/30 border-y border-[var(--color-border)]/30 bg-white">
                    {otherSavedItems.map((item) => (
                      <SavedItem key={item.id} item={item} onUnsave={handleUnsave} />
                    ))}
                  </div>
                </section>
              )}

              {openItems.length > 0 && (
                <section>
                  <h2 className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] font-bold px-4 mb-4">
                    Open deadline
                  </h2>
                  <div className="divide-y divide-[var(--color-border)]/30 border-y border-[var(--color-border)]/30 bg-white">
                    {openItems.map((item) => (
                      <SavedItem key={item.id} item={item} onUnsave={handleUnsave} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

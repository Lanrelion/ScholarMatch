"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Bell, Star, Star as StarIcon, CircleNotch, ArrowLeft } from "@phosphor-icons/react";
import { BottomNav } from "@/components/layout/BottomNav";
import { cn } from "@/lib/utils";

export default function AlertsPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const [savedRes, reviewsRes] = await Promise.all([
          fetch("/api/saved"),
          fetch("/api/reviews")
        ]);

        if (savedRes.ok) setItems(await savedRes.json());
        if (reviewsRes.ok) setReviews(await reviewsRes.json());
      } catch (err) {
        setError("Failed to load alerts");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const now = new Date();
  
  // 1. Deadline Alerts (<= 14 days)
  const deadlineAlerts = items
    .filter(item => {
      if (!item.scholarship.deadline) return false;
      const deadline = new Date(item.scholarship.deadline);
      const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysLeft >= 0 && daysLeft <= 14;
    })
    .sort((a, b) => new Date(a.scholarship.deadline!).getTime() - new Date(b.scholarship.deadline!).getTime());

  // 2. Change Alerts
  const changeAlerts = items.filter(item => item.changeAlerted);

  // 3. Review Prompts
  const reviewPrompts = reviews;

  const totalAlerts = deadlineAlerts.length + changeAlerts.length + reviewPrompts.length;

  const handleReview = async (savedId: string, scholarshipId: string, rating: number) => {
    try {
      // Optimistic update
      setReviews(prev => prev.filter(r => r.id !== savedId));
      
      await fetch(`/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          savedScholarshipId: savedId,
          scholarshipId,
          rating,
          feedback: ""
        })
      });
    } catch (err) {
      console.error("Failed to submit review");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center pb-[64px]">
        <CircleNotch size={24} className="animate-spin text-moss" />
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center">
      <div className="w-full max-w-[800px] px-6 pt-8 pb-32">
        
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

        {/* HEADER */}
        <header className="mb-10">
          <h1 className="text-[28px] font-editorial font-normal text-ink leading-tight">
            Alerts
          </h1>
          <p className="text-[13px] font-ui text-ink-secondary mt-1">
            {totalAlerts === 0 ? "You're all caught up." : `${totalAlerts} items need your attention.`}
          </p>
        </header>

        {/* EMPTY STATE */}
        {totalAlerts === 0 && !error && (
          <div className="flex flex-col items-center justify-center text-center mt-20">
            <Bell size={64} weight="light" className="text-border-strong mb-6" />
            <h2 className="text-[28px] font-editorial font-light italic text-ink mb-3">
              You're all caught up.
            </h2>
            <p className="text-[15px] font-ui text-ink-secondary max-w-xs leading-relaxed">
              Alerts about deadlines, updates, and matches will appear here.
            </p>
          </div>
        )}

        {/* TIMELINE LAYOUT */}
        <div className="space-y-12">
          
          {/* DEADLINE ALERTS */}
          {deadlineAlerts.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Clock size={16} weight="fill" className="text-moss" />
                <h2 className="text-[11px] uppercase tracking-[0.1em] text-ink-tertiary font-medium">
                  Deadline Alerts
                </h2>
              </div>
              
              <div className="relative pl-[4px]">
                {/* Vertical connector line */}
                <div className="absolute left-[9px] top-4 bottom-4 w-px bg-border" />
                
                {deadlineAlerts.map((item, idx) => {
                  const deadline = new Date(item.scholarship.deadline!);
                  const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  const isUrgent = daysLeft <= 7;
                  
                  return (
                    <div key={`deadline-${item.id}`} className="relative flex items-start mb-4 last:mb-0">
                      {/* Timeline dot */}
                      <div className="absolute left-[4px] top-6 w-[10px] h-[10px] rounded-full bg-white border-2 border-moss z-10" />
                      
                      {/* Content card */}
                      <div className="ml-[28px] flex-1 bg-surface border border-border rounded-lg p-4 md:px-[18px]">
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="text-[14px] font-ui font-medium text-ink leading-snug">
                            {item.scholarship.title}
                          </h3>
                          <div className={cn(
                            "shrink-0 px-2.5 py-1 rounded-full text-[11px] font-ui font-medium whitespace-nowrap",
                            isUrgent ? "bg-urgent-surface text-urgent border border-urgent/20" : "bg-moss-light text-moss border border-moss/20"
                          )}>
                            {deadline.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <span className={cn(
                            "text-[13px] font-ui",
                            isUrgent ? "text-urgent font-medium" : "text-ink-secondary"
                          )}>
                            {daysLeft} {daysLeft === 1 ? "day" : "days"} until deadline
                          </span>
                          <button 
                            onClick={() => router.push(`/scholarship/${item.scholarship.id}`)}
                            className="text-[13px] font-ui text-clay hover:text-clay-light transition-colors"
                          >
                            &rarr; View scholarship
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* UPDATES */}
          {changeAlerts.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Bell size={16} weight="fill" className="text-clay" />
                <h2 className="text-[11px] uppercase tracking-[0.1em] text-ink-tertiary font-medium">
                  Updates
                </h2>
              </div>
              
              <div className="relative pl-[4px]">
                <div className="absolute left-[9px] top-4 bottom-4 w-px bg-border" />
                
                {changeAlerts.map(item => (
                  <div key={`update-${item.id}`} className="relative flex items-start mb-4 last:mb-0">
                    <div className="absolute left-[4px] top-6 w-[10px] h-[10px] rounded-full bg-white border-2 border-clay z-10" />
                    
                    <div className="ml-[28px] flex-1 bg-surface border border-border rounded-lg p-4 md:px-[18px]">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-[14px] font-ui font-medium text-ink leading-snug">
                          {item.scholarship.title}
                        </h3>
                        <div className="shrink-0 bg-clay/10 text-clay px-2 py-0.5 rounded-full text-[11px] font-ui font-medium">
                          Updated
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-3">
                        <span className="text-[13px] font-ui text-ink-secondary">
                          This scholarship has changed since you saved it.
                        </span>
                        <button 
                          onClick={() => router.push(`/scholarship/${item.scholarship.id}`)}
                          className="text-[13px] font-ui text-clay hover:text-clay-light transition-colors shrink-0 sm:text-right"
                        >
                          &rarr; Review changes
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* AWAITING YOUR REVIEW */}
          {reviewPrompts.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Star size={16} weight="fill" className="text-gold" />
                <h2 className="text-[11px] uppercase tracking-[0.1em] text-ink-tertiary font-medium">
                  Awaiting Your Review
                </h2>
              </div>
              
              <div className="relative pl-[4px]">
                <div className="absolute left-[9px] top-4 bottom-4 w-px bg-border" />
                
                {reviewPrompts.map(item => (
                  <div key={`review-${item.id}`} className="relative flex items-start mb-4 last:mb-0">
                    <div className="absolute left-[4px] top-6 w-[10px] h-[10px] rounded-full bg-white border-2 border-gold z-10" />
                    
                    <div className="ml-[28px] flex-1 bg-surface border border-border rounded-lg p-4 md:px-[18px]">
                      <h3 className="text-[14px] font-ui font-medium text-ink leading-snug mb-1">
                        {item.scholarship.title}
                      </h3>
                      <p className="text-[13px] font-ui text-ink-secondary mb-4">
                        Rate your match to improve future results.
                      </p>
                      
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleReview(item.id, item.scholarshipId, star)}
                            className="group p-1 hover:scale-110 transition-transform"
                          >
                            <StarIcon 
                              size={24} 
                              weight="regular"
                              className="text-border-strong group-hover:text-gold group-hover:fill-gold transition-colors" 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}

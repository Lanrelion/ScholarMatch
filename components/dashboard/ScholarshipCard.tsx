"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ScholarshipWithMatch } from "@/types/scholarship";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { EligibilitySignals } from "@/components/ui/EligibilitySignals";
import { BookmarkSimple, ArrowRight } from "@phosphor-icons/react";

interface Props {
  scholarship: ScholarshipWithMatch;
  initialSaved?: boolean;
  savedItemId?: string;
  delay?: number;
}

export function ScholarshipCard({ scholarship, initialSaved = false, savedItemId: initialSavedId, delay = 0 }: Props) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [savedId, setSavedId] = useState(initialSavedId);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleCardClick = () => {
    router.push(`/scholarship/${scholarship.id}?from=feed`);
  };

  async function handleSave(e: React.MouseEvent) {
    e.stopPropagation();
    if (isSaving) return;
    setIsSaving(true);

    try {
      if (isSaved && savedId) {
        const res = await fetch(`/api/saved/${savedId}`, { method: "DELETE" });
        if (res.ok) {
          setIsSaved(false);
          setSavedId(undefined);
          setToastMessage("Removed from saved");
        }
      } else {
        const res = await fetch("/api/saved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scholarshipId: scholarship.id,
            matchScore: scholarship.matchScore,
            matchBreakdown: scholarship.matchBreakdown
          })
        });
        if (res.ok) {
          const data = await res.json();
          setSavedId(data.id);
          setIsSaved(true);
          setToastMessage("Saved to collection");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }

  const matchPercent = Math.round((scholarship.matchScore || 0) * 100);
  
  const cardReveal = {
    hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
    visible: {
      opacity: 1, y: 0, filter: 'blur(0px)',
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as any,
        delay: delay
      }
    }
  };

  return (
    <motion.div 
      variants={cardReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      onClick={handleCardClick}
      className={cn(
        "scholarship-card flex flex-col h-full relative",
        !scholarship.isActive && "opacity-60 grayscale"
      )}
    >
      <div className="card-image relative">
        <img 
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=400" 
          alt="University" 
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-ink px-2.5 py-1 text-xs rounded-full font-ui font-medium border border-border">
            Global
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={cn("btn-icon", isSaved && "saved", isSaving && "opacity-70 pointer-events-none")}
            aria-label="Save scholarship"
          >
            <BookmarkSimple size={18} weight={isSaved ? "fill" : "regular"} className={isSaved ? "text-moss" : "text-ink-secondary"} />
          </button>
        </div>
      </div>

      <div className="card-body flex flex-col flex-1">
        {toastMessage && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-ink text-white px-3 py-1.5 rounded-full text-xs font-medium z-10 shadow-lg">
            {toastMessage}
          </div>
        )}
        
        <h3 className="card-title line-clamp-2">
          {scholarship.title}
        </h3>
        <p className="card-meta">
          {scholarship.provider}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4 mt-1">
          <span className="px-2.5 py-0.5 bg-moss-light text-moss text-[11px] uppercase tracking-wider font-semibold rounded-pill">
            {scholarship.amount ? `${scholarship.currency || '$'}${scholarship.amount.toLocaleString()}` : 'Funding'}
          </span>
          <span className="px-2.5 py-0.5 bg-clay-light text-clay text-[11px] uppercase tracking-wider font-semibold rounded-pill">
            {scholarship.eligibleDegrees?.[0] || 'Any Level'}
          </span>
        </div>

        <div className="mb-2">
          <div className="flex justify-between items-end mb-1.5">
            <span className="text-xs font-ui text-ink-secondary">Compatibility</span>
            <span className="text-xs font-ui font-medium text-moss">{matchPercent}%</span>
          </div>
          <div className="w-full h-1 bg-surface-hover rounded-full overflow-hidden">
            <div 
              className="h-full bg-moss rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${matchPercent}%` }}
            />
          </div>
        </div>

        <EligibilitySignals breakdown={scholarship.matchBreakdown} />

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-border mt-4">
          {scholarship.deadline ? (
            <Badge deadline={scholarship.deadline} />
          ) : (
            <span className="deadline-badge deadline-badge--neutral">Rolling</span>
          )}
          
          <span className="text-xs font-ui font-medium text-ink-secondary flex items-center gap-1 group-hover:text-moss transition-colors">
            View <ArrowRight size={12} weight="bold" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

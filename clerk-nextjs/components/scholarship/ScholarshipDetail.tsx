"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  BookmarkSimple, 
  ShareNetwork, 
  Info, 
  CheckCircle, 
  XCircle, 
  WarningCircle, 
  CaretDown 
} from "@phosphor-icons/react";
import { ScholarshipWithMatch, MatchSignal } from "@/types/scholarship";
import { cn } from "@/lib/utils";

interface Props {
  scholarship: ScholarshipWithMatch;
  matchScore: number;
  matchBreakdown: ScholarshipWithMatch["matchBreakdown"];
  initialSaved?: boolean;
  savedItemId?: string;
}

export function ScholarshipDetail({
  scholarship,
  matchScore,
  matchBreakdown,
  initialSaved = false,
  savedItemId: initialSavedId,
}: Props) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [savedId, setSavedId] = useState(initialSavedId);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showOriginalEligibility, setShowOriginalEligibility] = useState(false);

  // Animate progress bar on mount
  const [progressWidth, setProgressWidth] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressWidth(Math.round(matchScore * 100));
    }, 100);
    return () => clearTimeout(timer);
  }, [matchScore]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleShare = async () => {
    const shareData = {
      title: scholarship.title,
      text: `${scholarship.title} — ${scholarship.provider}.`,
      url: window.location.href,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (err) {}
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        setToastMessage("Link copied to clipboard");
      } catch (err) {}
    }
  };

  const handleSave = async () => {
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
            matchScore: matchScore,
            matchBreakdown: matchBreakdown
          })
        });
        if (res.ok) {
          const data = await res.json();
          setSavedId(data.id);
          setIsSaved(true);
          setToastMessage("Saved scholarship");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplyNow = () => {
    window.open(scholarship.sourceUrl, "_blank");
    if (isSaved && savedId) {
      fetch(`/api/saved/${savedId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceVisited: true })
      }).catch(console.error);
    }
  };

  // Parsing values
  const fundingType = scholarship.eligibilityParsed?.fundingType === "full" ? "FULLY FUNDED" : "PARTIAL FUNDING";
  const degreeLevel = scholarship.eligibleDegrees?.[0]?.toUpperCase() || "ANY LEVEL";
  
  const fundingValue = scholarship.eligibilityParsed?.fundingType === "full"
    ? "Fully funded"
    : scholarship.amount
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: scholarship.currency || "USD" }).format(scholarship.amount)
    : "Variable funding";

  const formattedDeadline = scholarship.deadline
    ? new Date(scholarship.deadline).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Open / Rolling";

  const getDeadlineColor = () => {
    if (!scholarship.deadline) return "text-ink";
    const days = Math.ceil((new Date(scholarship.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days <= 7) return "text-urgent";
    if (days <= 30) return "text-warning";
    return "text-ink";
  };

  const appMethod = scholarship.eligibilityParsed?.applicationMethod;
  const appValue = appMethod === "ADMISSION_FIRST" ? "Admission required first"
                 : appMethod === "AUTOMATIC" ? "Auto-considered on admission"
                 : "Apply directly";

  // Match signals
  const signals = [
    { key: "Nationality", data: matchBreakdown.nationality },
    { key: "Degree level", data: matchBreakdown.degreeLevel },
    { key: "Field", data: matchBreakdown.field },
    { key: "GPA", data: matchBreakdown.gpa },
    { key: "Financial need", data: matchBreakdown.financialNeed },
    { key: "Work experience", data: matchBreakdown.workExperience }
  ];

  const getSignalIcon = (signal: MatchSignal) => {
    if (signal.partial) return <WarningCircle size={20} weight="fill" className="text-warning mt-[2px] shrink-0" />;
    if (signal.pass) return <CheckCircle size={20} weight="fill" className="text-moss mt-[2px] shrink-0" />;
    return <XCircle size={20} weight="fill" className="text-urgent mt-[2px] shrink-0" />;
  };

  // Unsplash fallback logic
  const hostCountry = scholarship.eligibilityParsed?.hostCountry || scholarship.eligibilityParsed?.universityCountry || "";
  const imageUrl = hostCountry ? `https://source.unsplash.com/1200x400/?${encodeURIComponent(hostCountry)},university,landscape` : null;

  return (
    <div className="min-h-screen bg-bg relative">
      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-24 left-1/2 z-[100] bg-ink text-white text-[12px] font-ui font-medium px-4 py-2 rounded-full shadow-lg"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <div 
        className="w-full h-[280px] relative"
        style={{
          background: `linear-gradient(135deg, var(--color-moss) 0%, var(--color-moss-dark) 60%, var(--color-clay) 100%)`
        }}
      >
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt="Location" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}
        
        {/* Grain overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay grain-overlay" />
        
        {/* Top gradient overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 50%)" }}
        />

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-5 left-5 h-10 px-4 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 rounded-full flex items-center gap-2 text-white transition-colors z-10"
        >
          <ArrowLeft size={16} weight="bold" />
          <span className="font-ui font-medium text-[13px]">Back</span>
        </button>

        {/* Actions */}
        <div className="absolute top-5 right-5 flex items-center gap-2 z-10">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <BookmarkSimple size={20} weight={isSaved ? "fill" : "regular"} />
          </button>
          <button
            onClick={handleShare}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ShareNetwork size={20} weight="regular" />
          </button>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="max-w-[720px] mx-auto px-6 pt-10 pb-[120px]">
        
        {/* HEADER BLOCK */}
        <header>
          <div className="text-[11px] font-ui font-medium uppercase tracking-[0.1em] text-moss mb-3">
            {fundingType} · {degreeLevel}
          </div>
          <h1 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-editorial font-normal text-ink leading-[1.2] mb-3">
            {scholarship.title}
          </h1>
          <div className="text-[14px] font-ui text-ink-secondary flex items-center flex-wrap gap-x-1.5">
            <span className="font-medium text-ink">{scholarship.provider}</span>
            <span>·</span>
            <span>{scholarship.sourceDomain}</span>
            {scholarship.lastChangedAt && (
              <>
                <span className="text-ink-tertiary ml-2">·</span>
                <span className="text-[12px] text-ink-tertiary ml-1.5">
                  Verified {Math.max(0, Math.floor((Date.now() - new Date(scholarship.lastChangedAt).getTime()) / 86400000))} days ago
                </span>
              </>
            )}
          </div>
        </header>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
          <div className="bg-surface border border-border rounded-lg p-4 px-5">
            <div className="text-[11px] font-ui uppercase tracking-[0.08em] text-ink-tertiary mb-1">Funding</div>
            <div className="text-[16px] font-ui font-medium text-ink truncate">{fundingValue}</div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-4 px-5">
            <div className="text-[11px] font-ui uppercase tracking-[0.08em] text-ink-tertiary mb-1">Deadline</div>
            <div className={cn("text-[16px] font-ui font-medium truncate", getDeadlineColor())}>{formattedDeadline}</div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-4 px-5">
            <div className="text-[11px] font-ui uppercase tracking-[0.08em] text-ink-tertiary mb-1">Study Level</div>
            <div className="text-[16px] font-ui font-medium text-ink truncate">
              {scholarship.eligibleDegrees.join(" · ") || "Any"}
            </div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-4 px-5">
            <div className="text-[11px] font-ui uppercase tracking-[0.08em] text-ink-tertiary mb-1">How to apply</div>
            <div className="text-[16px] font-ui font-medium text-ink truncate">{appValue}</div>
          </div>
        </div>

        {appMethod === "ADMISSION_FIRST" && (
          <div className="mt-3 bg-[#E6F1FB] rounded-lg p-3.5 px-4.5 flex items-start gap-2.5">
            <Info size={18} weight="fill" className="text-[#185FA5] shrink-0 mt-[1px]" />
            <p className="text-[13px] font-ui text-[#0C447C] leading-snug">
              You must be admitted to this university before applying for this scholarship.
            </p>
          </div>
        )}

        {/* MATCH SCORE SECTION */}
        <div className="mt-10 border-t border-border pt-10">
          <div className="flex items-end justify-between mb-3">
            <h3 className="text-[14px] font-ui font-medium text-ink">Your compatibility</h3>
            <div className="text-[48px] font-editorial font-light text-moss leading-none">
              {Math.round(matchScore * 100)}%
            </div>
          </div>

          <div className="w-full h-[6px] bg-border rounded-full overflow-hidden">
            <div 
              className="h-full bg-moss rounded-full transition-[width] duration-1000"
              style={{ width: `${progressWidth}%`, transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
            />
          </div>

          <div className="mt-6">
            <div className="text-[11px] font-ui uppercase tracking-[0.1em] text-ink-tertiary mb-2">
              Why you match
            </div>
            
            <div className="flex flex-col">
              {signals.map((sig, idx) => (
                <div 
                  key={sig.key} 
                  className={cn(
                    "flex items-start gap-3.5 py-3.5",
                    idx !== signals.length - 1 && "border-b border-border"
                  )}
                >
                  {getSignalIcon(sig.data)}
                  <div>
                    <div className="text-[14px] font-ui font-medium text-ink">
                      {sig.key}
                    </div>
                    <div className="text-[13px] font-ui text-ink-secondary mt-[2px]">
                      {sig.data.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {scholarship.eligibilityRaw && (
              <div className="mt-4">
                <button 
                  onClick={() => setShowOriginalEligibility(!showOriginalEligibility)}
                  className="flex items-center gap-1.5 text-[13px] font-ui text-clay hover:text-clay-light transition-colors"
                >
                  <span>Original eligibility text</span>
                  <motion.div animate={{ rotate: showOriginalEligibility ? 180 : 0 }}>
                    <CaretDown size={14} weight="bold" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {showOriginalEligibility && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 bg-surface border border-border rounded-md p-4 text-[13px] font-ui text-ink-secondary leading-[1.6] whitespace-pre-wrap">
                        {scholarship.eligibilityRaw}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* ABOUT SECTION */}
        <div className="mt-10 border-t border-border pt-10">
          <div className="text-[11px] font-ui uppercase tracking-[0.1em] text-ink-tertiary mb-4">
            About this scholarship
          </div>
          
          {scholarship.description ? (
            <div className="text-[15px] font-ui text-ink-secondary leading-[1.7] whitespace-pre-wrap">
              {scholarship.description}
            </div>
          ) : (
            <div className="text-[15px] font-ui text-ink-tertiary italic">
              See the official scholarship page for full details.
            </div>
          )}

          {scholarship.fieldsOfStudy && scholarship.fieldsOfStudy.length > 0 && (
            <div className="mt-8">
              <div className="text-[11px] font-ui uppercase tracking-[0.1em] text-ink-tertiary mb-3">
                Fields covered
              </div>
              <div className="flex flex-wrap gap-2">
                {scholarship.fieldsOfStudy.map((field) => (
                  <span 
                    key={field} 
                    className="bg-surface-hover text-ink-secondary border border-border rounded-full px-3 py-1 text-[13px] font-ui"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STICKY BOTTOM CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-t border-border">
        <div className="max-w-[720px] mx-auto px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))] flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-12 h-12 shrink-0 rounded-full border border-border flex items-center justify-center text-ink hover:bg-surface-hover transition-colors"
          >
            <motion.div
              initial={false}
              animate={{ scale: isSaved ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <BookmarkSimple size={22} weight={isSaved ? "fill" : "regular"} className={isSaved ? "text-moss" : ""} />
            </motion.div>
          </button>
          
          <button
            onClick={handleApplyNow}
            className="flex-1 h-12 bg-moss text-white rounded-full font-ui font-medium text-[15px] flex items-center justify-center gap-2 hover:bg-moss-dark transition-colors"
          >
            Apply now &rarr;
          </button>

          <button
            onClick={handleShare}
            className="w-12 h-12 shrink-0 rounded-full border border-border flex items-center justify-center text-ink hover:bg-surface-hover transition-colors"
          >
            <ShareNetwork size={22} weight="regular" />
          </button>
        </div>
      </div>
    </div>
  );
}

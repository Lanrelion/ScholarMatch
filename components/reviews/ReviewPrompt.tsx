"use client";

import React, { useState, useEffect } from "react";
import { Star, X, Check, ArrowRight, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  scholarship: any;
  savedScholarshipId: string;
  onComplete: (scholarshipId: string) => void;
  onDismiss: (scholarshipId: string) => void;
}

type Step = "rating" | "followup" | "applied" | "done";

export default function ReviewPrompt({ scholarship, onComplete, onDismiss }: Props) {
  const [step, setStep] = useState<Step>("rating");
  const [rating, setRating] = useState<number | null>(null);
  const [mismatchReasons, setMismatchReasons] = useState<string[]>([]);
  const [applied, setApplied] = useState<boolean | null>(null);
  const [noteText, setNoteText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (step === "done") {
      const t = setTimeout(() => onComplete(scholarship.id), 1500);
      return () => clearTimeout(t);
    }
  }, [step, scholarship.id, onComplete]);

  const toggleReason = (reason: string) => {
    setMismatchReasons(prev => 
      prev.includes(reason) ? prev.filter(r => r !== reason) : [...prev, reason]
    );
  };

  async function handleSubmit(finalApplied?: boolean) {
    setIsSubmitting(true);
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scholarshipId: scholarship.id,
          rating,
          mismatchReasons,
          note: noteText || undefined,
          applied: finalApplied !== undefined ? finalApplied : applied
        })
      });
      setStep("done");
    } catch (err) {
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleRatingSelect = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleNextFromRating = () => {
    if (!rating) return;
    if (rating <= 2) {
      setStep("followup");
    } else {
      setStep("applied");
    }
  };

  const handleAppliedSelect = (val: boolean) => {
    setApplied(val);
    handleSubmit(val);
  };

  if (step === "done") {
    return (
      <div className="bg-[var(--color-primary-surface)] border border-[var(--color-primary-border)] rounded-[var(--radius-xl)] p-6 mx-4 mb-3 flex flex-col items-center animate-in zoom-in-95 duration-300">
        <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center mb-3">
          <Check size={24} strokeWidth={3} />
        </div>
        <p className="text-sm text-center text-[var(--color-primary-dark)] font-bold">Feedback received!</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-xl)] p-5 mx-4 mb-3 shadow-sm animate-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-[15px] font-bold text-[var(--color-text-primary)] leading-tight truncate pr-6">
          {scholarship.title}
        </h3>
        <button 
          onClick={() => onDismiss(scholarship.id)}
          className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors p-1 -mt-1 -mr-1"
        >
          <X size={18} />
        </button>
      </div>

      {step === "rating" && (
        <div className="animate-in fade-in duration-300">
          <p className="text-[13px] text-[var(--color-text-secondary)] mb-5">Was this a good match for you?</p>
          <div className="flex gap-2 justify-between mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRatingSelect(star)}
                className={cn(
                  "w-11 h-11 rounded-full border flex items-center justify-center transition-all active:scale-90",
                  rating && star <= rating 
                    ? "bg-[var(--color-amber-surface)] text-[var(--color-amber)] border-[var(--color-amber)]" 
                    : "bg-[var(--color-surface)] text-[var(--color-text-tertiary)] border-[var(--color-border)]"
                )}
              >
                <Star size={20} fill={rating && star <= rating ? "currentColor" : "none"} strokeWidth={rating && star <= rating ? 2 : 1.5} />
              </button>
            ))}
          </div>
          <button 
            disabled={!rating}
            onClick={handleNextFromRating}
            className="w-full h-11 bg-[var(--color-primary)] text-white rounded-[var(--radius-lg)] text-[13px] font-bold disabled:opacity-30 disabled:grayscale transition-all flex items-center justify-center gap-2"
          >
            Continue
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {step === "followup" && (
        <div className="animate-in fade-in duration-300">
          <p className="text-[13px] text-[var(--color-text-secondary)] mb-4">What didn't match?</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {["Nationality", "Study level", "GPA", "Field", "Closed", "Other"].map(reason => (
              <button 
                key={reason}
                onClick={() => toggleReason(reason)}
                className={cn(
                  "border rounded-full px-4 py-2 text-[11px] font-bold transition-all active:scale-95",
                  mismatchReasons.includes(reason)
                    ? "bg-[var(--color-red-surface)] border-[var(--color-red)] text-[var(--color-red-dark)]"
                    : "bg-white border-[var(--color-border-strong)] text-[var(--color-text-secondary)]"
                )}
              >
                {reason}
              </button>
            ))}
          </div>
          <textarea 
            placeholder="Help us improve (optional)"
            className="text-[13px] rounded-[var(--radius-md)] border border-[var(--color-border-strong)] p-3 w-full h-20 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 resize-none mb-4"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
          <button
            onClick={() => handleSubmit()}
            disabled={isSubmitting}
            className="w-full h-11 bg-[var(--color-text-primary)] text-white rounded-[var(--radius-lg)] text-[13px] font-bold disabled:opacity-50 transition-all"
          >
            {isSubmitting ? "Submitting..." : "Send Feedback"}
          </button>
        </div>
      )}

      {step === "applied" && (
        <div className="animate-in fade-in duration-300">
          <p className="text-[13px] text-[var(--color-text-secondary)] mb-6 text-center">Final check: Did you apply?</p>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleAppliedSelect(true)}
              className="border border-[var(--color-border)] rounded-[var(--radius-xl)] p-5 flex flex-col items-center gap-3 hover:bg-[var(--color-surface)] active:scale-95 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary-surface)] flex items-center justify-center text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                <ThumbsUp size={20} />
              </div>
              <span className="text-[11px] font-bold text-[var(--color-text-primary)] uppercase tracking-wider">Yes, I applied</span>
            </button>
            <button 
              onClick={() => handleAppliedSelect(false)}
              className="border border-[var(--color-border)] rounded-[var(--radius-xl)] p-5 flex flex-col items-center gap-3 hover:bg-[var(--color-surface)] active:scale-95 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-text-tertiary)] group-hover:scale-110 transition-transform">
                <ThumbsDown size={20} />
              </div>
              <span className="text-[11px] font-bold text-[var(--color-text-primary)] uppercase tracking-wider">Not yet</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

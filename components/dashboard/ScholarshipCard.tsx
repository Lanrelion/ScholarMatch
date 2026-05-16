"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Bookmark, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Globe, 
  GraduationCap, 
  BookOpen, 
  BarChart, 
  ArrowRight,
  Check
} from "lucide-react";
import { ScholarshipWithMatch, MatchSignal } from "@/types/scholarship";
import { cn } from "@/lib/utils";

interface Props {
  scholarship: ScholarshipWithMatch;
  initialSaved?: boolean;
  savedItemId?: string;
}

export function ScholarshipCard({ scholarship, initialSaved = false, savedItemId: initialSavedId }: Props) {
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
          setToastMessage("Removed from matches");
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
          setToastMessage("Saved to matches");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }

  const getDeadlineInfo = () => {
    if (!scholarship.deadline) return null;
    const date = new Date(scholarship.deadline);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    const label = date.toLocaleDateString('en-GB', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    
    if (diffDays <= 7) return { label, styles: "text-[var(--color-red)] bg-[var(--color-red-surface)]" };
    return { label, styles: "text-[var(--color-text-secondary)] bg-[var(--color-surface)]" };
  };

  const deadline = getDeadlineInfo();

  return (
    <div 
      onClick={handleCardClick}
      className={cn(
        "group relative bg-white border border-gray-100 rounded-3xl p-6 transition-all duration-500 flex flex-col h-full shadow-sm hover:shadow-xl hover:border-[var(--color-primary-border)] hover:-translate-y-1 cursor-pointer overflow-hidden",
        !scholarship.isActive && "opacity-60"
      )}
    >
      {/* Background Accent Gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--color-primary)]/[0.04] to-transparent rounded-bl-full pointer-events-none" />

      {/* Mini Toast */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-[var(--color-text-primary)] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
            <Check size={12} strokeWidth={3} />
            {toastMessage}
          </div>
        </div>
      )}

      {/* Header: Score Badge & Save */}
      <div className="flex justify-between items-center mb-6 relative">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-primary-surface)] rounded-full border border-[var(--color-primary-border)]/50">
          <div className="relative w-5 h-5">
            <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#e2e8f0" strokeWidth="4" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray={`${scholarship.matchScore * 100}, 100`} className="text-[var(--color-primary)]" />
            </svg>
          </div>
          <span className="text-[11px] font-black text-[var(--color-primary)] tracking-tight">
            {Math.round(scholarship.matchScore * 100)}% Match
          </span>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90",
            isSaved 
              ? "bg-[var(--color-primary-surface)] text-[var(--color-primary)] shadow-sm" 
              : "bg-gray-50 text-gray-400 hover:text-gray-600"
          )}
        >
          <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} className={isSaving ? "animate-pulse" : ""} />
        </button>
      </div>

      {/* Title & Provider */}
      <div className="flex-1 mb-6">
        <h3 className="text-xl font-extrabold text-[var(--color-text-primary)] leading-tight mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
          {scholarship.title}
        </h3>
        <p className="text-sm font-medium text-[var(--color-text-secondary)] opacity-80">
          {scholarship.provider}
        </p>
      </div>

      {/* Match Signals Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <SignalItem type="nationality" signal={scholarship.matchBreakdown.nationality} />
        <SignalItem type="degree" signal={scholarship.matchBreakdown.degreeLevel} />
        <SignalItem type="field" signal={scholarship.matchBreakdown.field} />
        <SignalItem type="gpa" signal={scholarship.matchBreakdown.gpa} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-5 border-t border-gray-50 mt-auto">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Deadline</span>
          <span className="text-xs font-black text-[var(--color-red)]">
            {deadline?.label || "Rolling"}
          </span>
        </div>
        
        <button className="px-5 py-2.5 bg-[var(--color-text-primary)] text-white rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] transition-all hover:bg-black active:scale-95 shadow-xl shadow-black/5">
          Details
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}

function SignalItem({ type, signal }: { type: string; signal: MatchSignal }) {
  if (!signal.label) return null;

  const getIcon = () => {
    switch (type) {
      case "nationality": return <Globe size={12} />;
      case "degree": return <GraduationCap size={12} />;
      case "field": return <BookOpen size={12} />;
      case "gpa": return <BarChart size={12} />;
      default: return null;
    }
  };

  const getStatusIcon = () => {
    if (signal.partial) return <AlertCircle size={10} className="text-[var(--color-amber)]" />;
    if (signal.pass) return <CheckCircle2 size={10} className="text-[var(--color-primary)]" />;
    return <XCircle size={10} className="text-[var(--color-red)]" />;
  };

  return (
    <div className="flex items-center gap-1.5 overflow-hidden">
      <div className="shrink-0 text-[var(--color-text-tertiary)]">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0 flex items-center gap-1">
        <span className="text-[10px] text-[var(--color-text-secondary)] font-medium truncate uppercase tracking-tight">
          {type}
        </span>
        <span className="shrink-0">{getStatusIcon()}</span>
      </div>
    </div>
  );
}

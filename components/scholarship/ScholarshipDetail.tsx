"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Bookmark, 
  Share2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ExternalLink,
  Globe,
  GraduationCap,
  BookOpen,
  BarChart, 
  Check,
  Star,
  Calendar
} from "lucide-react";
import { ScholarshipWithMatch, MatchSignal } from "@/types/scholarship";
import { BackButton } from "@/components/ui/BackButton";
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
  savedId: initialSavedId,
}: Props) {
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

  const handleShare = async () => {
    const shareData = {
      title: scholarship.title,
      text: `${scholarship.title} — ${scholarship.provider}.`,
      url: `${window.location.origin}/scholarship/${scholarship.id}`,
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
          setToastMessage("Removed from matches");
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
          setToastMessage("Saved to matches");
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

  const formattedDeadline = scholarship.deadline
    ? new Date(scholarship.deadline).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Open deadline";

  const fundingValue = scholarship.eligibilityParsed?.fundingType === "full"
    ? "Fully funded"
    : scholarship.amount
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: scholarship.currency || "USD" }).format(scholarship.amount)
    : "See details";

  return (
    <div className="min-h-screen bg-white pb-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Mini Toast */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-[var(--color-text-primary)] text-white text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-2xl flex items-center gap-2">
            <Check size={14} strokeWidth={3} />
            {toastMessage}
          </div>
        </div>
      )}

      {/* Pattern B Header */}
      <header className="px-4 py-4 sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-[var(--color-border)]/50">
        <BackButton />
        <h1 className="text-[13px] sm:text-base font-black text-[var(--color-text-primary)] absolute left-1/2 -translate-x-1/2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[160px] sm:max-w-md uppercase tracking-tight">
          {scholarship.title}
        </h1>
        <div className="w-10" />
      </header>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Left Column: Details */}
          <div className="flex-1 space-y-12">
            <section>
              <div className="inline-block px-4 py-1.5 rounded-xl bg-[var(--color-primary-surface)] text-[var(--color-primary)] text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                {scholarship.provider}
              </div>
              <h1 className="text-4xl lg:text-6xl font-black text-[var(--color-text-primary)] leading-[1.05] mb-6 tracking-tighter">
                {scholarship.title}
              </h1>
              <p className="text-lg text-[var(--color-text-secondary)] font-medium opacity-70">
                Offering opportunities across {scholarship.sourceDomain}
              </p>
            </section>

            {/* Mobile Only Stats */}
            <section className="lg:hidden grid grid-cols-2 gap-4">
              <StatCard label="Funding" value={fundingValue} icon={Wallet} />
              <StatCard label="Deadline" value={formattedDeadline} urgency={true} date={scholarship.deadline} />
            </section>

            {/* Match Potential Section */}
            <section className="p-8 rounded-[32px] border border-gray-100 bg-gray-50/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[var(--color-primary)]/[0.03] to-transparent rounded-bl-[120px] pointer-events-none" />
              
              <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-10">
                <div>
                  <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.25em] mb-2">Match Potential</h2>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-[var(--color-primary)] tracking-tighter">{Math.round(matchScore * 100)}%</span>
                    <span className="text-sm font-bold text-[var(--color-primary)] opacity-60 italic">Compatibility</span>
                  </div>
                </div>
                
                <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="16"
                      fill="none"
                      className="stroke-[var(--color-primary)]"
                      strokeWidth="3"
                      strokeDasharray={`${matchScore * 100}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white shadow-xl flex items-center justify-center">
                      <Star className="text-[var(--color-primary)]" size={24} fill="currentColor" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 relative">
                <SignalRow label="Nationality" signal={matchBreakdown.nationality} icon={Globe} />
                <SignalRow label="Degree Level" signal={matchBreakdown.degreeLevel} icon={GraduationCap} />
                <SignalRow label="Field of Study" signal={matchBreakdown.field} icon={BookOpen} />
                {matchBreakdown.gpa.label && <SignalRow label="Academic Record" signal={matchBreakdown.gpa} icon={BarChart} />}
              </div>
            </section>

            {/* Description */}
            <section>
              <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400 mb-8 flex items-center gap-3">
                <span className="w-8 h-px bg-gray-200" />
                About this opportunity
              </h2>
              <div className="prose prose-sm max-w-none">
                {scholarship.description ? (
                  <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap font-medium">
                    {scholarship.description}
                  </p>
                ) : (
                  <p className="text-lg text-gray-400 italic text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    No detailed description available.
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Sidebar Stats & Actions */}
          <aside className="hidden lg:block w-96 shrink-0">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-2xl shadow-black/5 space-y-8">
                <div className="space-y-6">
                  <SidebarStat label="Financial Value" value={fundingValue} icon={Wallet} />
                  <SidebarStat label="Application Deadline" value={formattedDeadline} icon={Calendar} urgency={!!scholarship.deadline} />
                  <SidebarStat label="Academic Level" value={scholarship.eligibleDegrees.join(", ")} icon={GraduationCap} />
                  <SidebarStat label="Location Eligibility" value={scholarship.eligibleNationalities?.join(", ") || "Worldwide"} icon={Globe} />
                </div>

                <div className="pt-8 border-t border-gray-50 flex flex-col gap-4">
                  <button
                    onClick={handleApplyNow}
                    className="w-full bg-[var(--color-primary)] text-white rounded-2xl h-14 text-sm font-black uppercase tracking-[0.2em] hover:brightness-110 transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl shadow-[var(--color-primary)]/20"
                  >
                    Apply Now
                    <ExternalLink size={18} />
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      className={cn(
                        "flex-1 h-14 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs transition-all active:scale-95",
                        isSaved ? "bg-[var(--color-primary-surface)] border-[var(--color-primary-border)] text-[var(--color-primary)]" : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                      {isSaved ? "Saved" : "Save"}
                    </button>
                    <button
                      onClick={handleShare}
                      className="w-14 h-14 rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-all active:scale-95"
                    >
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Nudge */}
              <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-500 shadow-sm shrink-0">
                  <Star size={20} />
                </div>
                <p className="text-[11px] text-blue-700/80 font-bold leading-relaxed">
                  Verified by ScholarMatch AI. We ensure all external links are secure and directly related to the provider.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

  </div>
);
}

function StatCard({ label, value, urgency = false, date = null, icon: Icon }: { label: string; value: string; urgency?: boolean; date?: string | null; icon?: any }) {
  const getUrgencyStyles = () => {
    if (!urgency || !date) return "text-[var(--color-text-primary)]";
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 7) return "text-[var(--color-red)]";
    if (diffDays <= 30) return "text-[var(--color-amber)]";
    return "text-[var(--color-text-primary)]";
  };

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon size={12} className="text-[var(--color-text-tertiary)]" />}
        <p className="text-[10px] uppercase tracking-widest text-[var(--color-text-tertiary)] font-black">{label}</p>
      </div>
      <p className={cn("text-sm font-black truncate", getUrgencyStyles())}>{value}</p>
    </div>
  );
}

function SignalRow({ label, signal, icon: Icon }: { label: string; signal: MatchSignal; icon: any }) {
  const getStatusIcon = () => {
    if (signal.partial) return <AlertCircle size={20} className="text-[var(--color-amber)]" />;
    if (signal.pass) return <CheckCircle2 size={20} className="text-[var(--color-primary)]" />;
    return <XCircle size={20} className="text-[var(--color-red)]" />;
  };

  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-white border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-tertiary)] shrink-0 shadow-sm">
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-[11px] font-black text-[var(--color-text-primary)] uppercase tracking-wider">{label}</p>
          {getStatusIcon()}
        </div>
        <p className="text-[13px] text-[var(--color-text-secondary)] font-medium leading-snug">{signal.label}</p>
      </div>
    </div>
  );
}

function SidebarStat({ label, value, icon: Icon, urgency = false }: { label: string; value: string; icon: any; urgency?: boolean }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0 shadow-sm">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className={cn("text-sm font-extrabold leading-snug", urgency ? "text-[var(--color-red)]" : "text-[var(--color-text-primary)]")}>
          {value}
        </p>
      </div>
    </div>
  );
}

const Wallet = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
);

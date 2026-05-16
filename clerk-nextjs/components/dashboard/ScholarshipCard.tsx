"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ScholarshipWithMatch, MatchSignal } from "@/types/scholarship";

interface Props {
  scholarship: ScholarshipWithMatch;
  initialSaved?: boolean;
  savedItemId?: string;
}

export default function ScholarshipCard({ scholarship, initialSaved = false, savedItemId }: Props) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [savedId, setSavedId] = useState(savedItemId);
  const [isSaving, setIsSaving] = useState(false);

  const handleCardClick = () => {
    router.push(`/scholarship/${scholarship.id}`);
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
        } else {
          // Rollback and notify
          setIsSaved(true);
          alert("Could not remove. Try again.");
        }
      } else {
        // Optimistic toggle
        setIsSaved(true);
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
        } else {
          // Rollback and notify
          setIsSaved(false);
          alert("Could not save. Try again.");
        }
      }
    } catch (err) {
      // Catch network errors
      setIsSaved(!isSaved); 
      alert("Network error. Try again.");
    } finally {
      setIsSaving(false);
    }
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const formattedDeadline = scholarship.deadline 
      ? new Date(scholarship.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : "";

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
    const shareUrl = `${appUrl}/scholarship/${scholarship.id}`;

    const shareData = {
      title: scholarship.title,
      text: `${scholarship.title} — ${scholarship.provider}. Apply by ${formattedDeadline}. Find your match on ScholarMatch:`,
      url: shareUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied!");
      } catch (err) {
        console.error("Clipboard failed", err);
      }
    }
  };

  // PILL HELPERS
  const getDeadlineInfo = () => {
    if (!scholarship.deadline) return null;
    const date = new Date(scholarship.deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const label = `Due ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    
    if (diffDays <= 7) return { label, styles: "bg-[#FCEBEB] text-[#A32D2D]" };
    if (diffDays <= 30) return { label, styles: "bg-[#FAEEDA] text-[#854F0B]" };
    return { label, styles: "bg-gray-100 text-gray-500" };
  };

  const deadlinePill = getDeadlineInfo();

  return (
    <div 
      onClick={handleCardClick}
      className="border border-gray-200 rounded-xl p-4 mb-1 bg-white cursor-pointer active:scale-[0.98] transition-transform shadow-sm"
    >
      {/* TOP ROW */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h2 className="text-sm font-medium text-gray-900 leading-snug line-clamp-2">
            {scholarship.title}
          </h2>
          <p className="text-[11px] text-gray-500 font-normal mt-0.5">
            {scholarship.provider}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 transition-colors ${
            isSaved ? "bg-[#E1F5EE] border-[#1D9E75]" : "bg-gray-50 border-gray-200"
          }`}
        >
          {isSaving ? (
            <i className="ti-loader-2 text-[15px] text-gray-400 animate-spin"></i>
          ) : (
            <i className={`${isSaved ? "ti-bookmark text-[#1D9E75]" : "ti-bookmark text-gray-400"} text-[15px]`}></i>
          )}
        </button>
      </div>

      {/* PILLS ROW */}
      <div className="flex flex-wrap gap-1.5 mt-2">
        {scholarship.eligibilityParsed?.fundingType === "full" ? (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#E1F5EE] text-[#0F6E56]">
            Fully funded
          </span>
        ) : (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            Partial funding
          </span>
        )}

        {deadlinePill && (
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${deadlinePill.styles}`}>
            {deadlinePill.label}
          </span>
        )}

        {scholarship.eligibleDegrees.map((deg: string) => (
          <span key={deg} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
            {deg.charAt(0) + deg.slice(1).toLowerCase()}
          </span>
        ))}
      </div>

      {/* MATCH BAR ROW */}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-[10px] text-gray-400 font-normal">Match</span>
        <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#1D9E75] rounded-full transition-all duration-500" 
            style={{ width: `${scholarship.matchScore * 100}%` }}
          />
        </div>
        <span className="text-[10px] font-medium text-[#0F6E56]">
          {Math.round(scholarship.matchScore * 100)}%
        </span>
      </div>

      {/* ELIGIBILITY SIGNALS */}
      <div className="mt-3 flex flex-col gap-1">
        {Object.entries(scholarship.matchBreakdown)
          .filter(([_, signal]) => (signal as MatchSignal).label !== null)
          .map(([key, signal]) => (
            <SignalRow key={key} signal={signal as MatchSignal} />
          ))
        }
      </div>

      {/* CTA ROW */}
      <div className="mt-4 flex gap-2">
        <button 
          className="flex-1 bg-[#1D9E75] text-white text-xs font-medium rounded-xl py-2.5 hover:bg-[#0F6E56] transition-colors"
        >
          View details
        </button>
        <button
          onClick={handleShare}
          className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <i className="ti-share text-[16px]"></i>
        </button>
      </div>
    </div>
  );
}

function SignalRow({ signal }: { signal: MatchSignal }) {
  let icon = "ti-circle-check text-[#1D9E75]";
  if (signal.partial) icon = "ti-alert-circle text-[#EF9F27]";
  else if (!signal.pass) icon = "ti-circle-x text-[#E24B4A]";

  return (
    <div className="flex items-center gap-1.5 text-[11px] font-normal">
      <i className={`${icon} text-[14px]`}></i>
      <span className="text-gray-500">{signal.label}</span>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ScholarshipWithMatch, MatchSignal } from "@/types/scholarship";

interface Props {
  scholarship: ScholarshipWithMatch;
  matchScore: number;
  matchBreakdown: ScholarshipWithMatch["matchBreakdown"];
  initialSaved?: boolean;
  savedItemId?: string;
}

export default function ScholarshipDetail({
  scholarship,
  matchScore,
  matchBreakdown,
  initialSaved = false,
  savedItemId,
}: Props) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [savedId, setSavedId] = useState(savedItemId);
  const [isSaving, setIsSaving] = useState(false);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard");
    }
  };

  const handleShare = async () => {
    const formattedDeadline = scholarship.deadline
      ? new Date(scholarship.deadline).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Open deadline";

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
    const shareUrl = `${appUrl}/scholarship/${scholarship.id}`;

    const shareData = {
      title: scholarship.title,
      text: `${scholarship.title} — ${scholarship.provider}. Apply by ${formattedDeadline}. Find your match on ScholarMatch:`,
      url: shareUrl,
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

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      if (isSaved && savedId) {
        const res = await fetch(`/api/saved/${savedId}`, { method: "DELETE" });
        if (res.ok) {
          setIsSaved(false);
          setSavedId(undefined);
        } else {
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
            matchScore: matchScore,
            matchBreakdown: matchBreakdown
          })
        });
        if (res.ok) {
          const data = await res.json();
          setSavedId(data.id);
        } else {
          setIsSaved(false);
          alert("Could not save. Try again.");
        }
      }
    } catch (err) {
      setIsSaved(!isSaved);
      alert("Network error. Try again.");
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

  const getDeadlineStyles = () => {
    if (!scholarship.deadline) return "text-gray-800";
    const date = new Date(scholarship.deadline);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) return "text-[#A32D2D] font-medium";
    if (diffDays <= 30) return "text-[#854F0B] font-medium";
    return "text-gray-800";
  };

  const formattedDeadline = scholarship.deadline
    ? new Date(scholarship.deadline).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Open deadline";

  const fundingValue = scholarship.eligibilityParsed?.fundingType === "full"
    ? "Fully funded"
    : scholarship.amount
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: scholarship.currency || "USD" }).format(scholarship.amount)
    : "See details";

  const appRouteLabel = scholarship.applicationRoute === "DIRECT"
    ? "Direct application"
    : scholarship.applicationRoute === "ADMISSION_FIRST"
    ? "Admission required first"
    : "Auto-considered on admission";

  return (
    <div className="min-h-screen bg-white pb-24 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        {/* SECTION 1: HEADER */}
        <section className="px-4 pt-4 pb-3">
          <button
            onClick={handleBack}
            className="text-sm text-gray-500 font-normal hover:text-gray-800 transition-colors mb-3 flex items-center gap-1"
          >
            ← Back to results
          </button>
          <h1 className="text-xl font-medium text-gray-900 leading-tight mb-1">
            {scholarship.title}
          </h1>
          <p className="text-sm text-gray-500 font-normal">
            {scholarship.provider} · {scholarship.sourceDomain}
          </p>
        </section>

        {/* SECTION 2: KEY STATS */}
        <section className="px-4 py-4 border-b border-gray-100 grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Funding</p>
            <p className="text-sm font-medium text-gray-900">{fundingValue}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Deadline</p>
            <p className={`text-sm ${getDeadlineStyles()}`}>{formattedDeadline}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Study level</p>
            <p className="text-sm font-medium text-gray-900">
              {scholarship.eligibleDegrees.map(d => d.charAt(0) + d.slice(1).toLowerCase()).join(" · ")}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">How to apply</p>
            <p className="text-sm font-medium text-gray-900">{appRouteLabel}</p>
          </div>
        </section>

        {scholarship.applicationRoute === "ADMISSION_FIRST" && (
          <div className="mx-4 mt-4 bg-[#E6F1FB] rounded-xl p-3 flex items-start gap-2">
            <i className="ti-info-circle text-[#185FA5] mt-0.5"></i>
            <p className="text-xs text-[#0C447C]">
              You must be admitted to this university before applying for this scholarship.
            </p>
          </div>
        )}

        {/* SECTION 3: MATCH SCORE */}
        <section className="px-4 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-900">Your match</p>
            <p className="text-lg font-medium text-[#0F6E56]">{Math.round(matchScore * 100)}%</p>
          </div>
          <div className="h-2 bg-gray-100 rounded-full w-full overflow-hidden mb-6">
            <div
              className="h-full bg-[#1D9E75] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${matchScore * 100}%` }}
            />
          </div>

          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-3">
            Eligibility breakdown
          </p>

          <div className="flex flex-col">
            <SignalRow label="Nationality" signal={matchBreakdown.nationality} />
            <SignalRow label="Degree level" signal={matchBreakdown.degreeLevel} />
            <SignalRow label="Field of study" signal={matchBreakdown.field} />
            {matchBreakdown.gpa?.label && <SignalRow label="GPA" signal={matchBreakdown.gpa} />}
            <SignalRow label="Financial need" signal={matchBreakdown.financialNeed} />
            {matchBreakdown.targetCountry && <SignalRow label="Destination" signal={matchBreakdown.targetCountry} />}
            {matchBreakdown.programMatch && <SignalRow label="Program" signal={matchBreakdown.programMatch} />}
          </div>

          <div className="bg-gray-50 rounded-xl p-3 mt-4">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1">
              Original eligibility text
            </p>
            <p className="text-xs text-gray-500 leading-relaxed italic">
              "Source requirement: {scholarship.eligibilityRaw}"
            </p>
          </div>
        </section>

        {/* SECTION 4: ABOUT */}
        <section className="px-4 py-4 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-900 mb-2">About this scholarship</h2>
          {scholarship.description ? (
            <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">
              {scholarship.description}
            </p>
          ) : (
            <p className="text-sm text-gray-400 italic">
              See the official scholarship page for full details.
            </p>
          )}

          {scholarship.fieldsOfStudy && scholarship.fieldsOfStudy.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-2">
                Fields covered
              </p>
              <div className="flex flex-wrap gap-1.5">
                {scholarship.fieldsOfStudy.map((f) => (
                  <span
                    key={f}
                    className="bg-gray-100 text-gray-600 text-[10px] font-medium px-2.5 py-1 rounded-full"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* SECTION 5: STICKY CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))] flex items-center gap-2 z-50">
        <button
          onClick={handleSave}
          disabled={isSaving}
          aria-label="Save scholarship"
          className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors active:bg-gray-50 ${
            isSaved ? "bg-[#E1F5EE] border-[#1D9E75]" : "border-gray-200"
          }`}
        >
          {isSaving ? (
            <i className="ti-loader-2 text-[#1D9E75] animate-spin text-xl"></i>
          ) : (
            <i
              className={`${
                isSaved ? "ti-bookmark text-[#1D9E75]" : "ti-bookmark text-gray-400"
              } text-xl`}
            ></i>
          )}
        </button>

        <button
          onClick={handleApplyNow}
          className="flex-1 bg-[#1D9E75] text-white rounded-xl h-12 text-sm font-medium hover:bg-[#0F6E56] transition-colors active:scale-[0.98]"
        >
          Apply now
        </button>

        <button
          onClick={handleShare}
          aria-label="Share scholarship"
          className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center transition-colors active:bg-gray-50"
        >
          <i className="ti-share text-gray-400 text-xl"></i>
        </button>
      </div>
    </div>
  );
}

function SignalRow({ label, signal }: { label: string; signal: MatchSignal }) {
  let icon = "ti-circle-check text-[#1D9E75]";
  if (signal.partial) icon = "ti-alert-circle text-[#EF9F27]";
  else if (!signal.pass) icon = "ti-circle-x text-[#E24B4A]";

  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-5 shrink-0 mt-0.5">
        <i className={`${icon} text-lg`}></i>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700 leading-tight">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{signal.label}</p>
      </div>
    </div>
  );
}

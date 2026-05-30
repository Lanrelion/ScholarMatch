"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { ArrowLeft, LockKey, CircleNotch, CheckCircle, Student, GlobeHemisphereWest, Bank } from "@phosphor-icons/react";
import { BottomNav } from "@/components/layout/BottomNav";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

// New Components
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ReadinessScore } from "@/components/profile/ReadinessScore";
import { JourneyTimeline } from "@/components/profile/JourneyTimeline";
import { AIInsights } from "@/components/profile/AIInsights";
import { CustomSelect } from "@/components/ui/CustomSelect";

type ProfileData = {
  firstName: string;
  lastName: string;
  nationality: string;
  currentDegree: "UNDERGRADUATE" | "MASTERS" | "PHD" | "";
  fieldOfStudy: string;
  gpa: string;
  gpaScale: string;
  needsFinancialAid: boolean | null;
  targetCountryOfStudy: string;
};

const DEGREE_OPTIONS = [
  { value: "UNDERGRADUATE", label: "BSc / Undergraduate" },
  { value: "MASTERS", label: "Masters" },
  { value: "PHD", label: "PhD" },
];

const DESTINATION_OPTIONS = [
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "Germany", label: "Germany" },
  { value: "Sweden", label: "Sweden" },
  { value: "Canada", label: "Canada" },
  { value: "Netherlands", label: "Netherlands" },
  { value: "United States", label: "United States" },
  { value: "France", label: "France" },
  { value: "Australia", label: "Australia" },
  { value: "Anywhere", label: "Open to anywhere" },
];

import { ALL_FIELDS } from "@/components/onboarding/screens/Screen5Field";

const FIELD_OPTIONS = ALL_FIELDS.map(f => ({ value: f, label: f }));

const GPA_SCALE_OPTIONS = [
  { value: "4.0", label: "4.0 Scale" },
  { value: "5.0", label: "5.0 Scale" },
  { value: "7.0", label: "7.0 Scale" },
  { value: "100", label: "Percentage (100)" },
];

export default function ProfilePage() {
  const router = useRouter();
  const { signOut } = useClerk();
  const { user, isLoaded: isUserLoaded } = useUser();

  const [profile, setProfile] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    nationality: "",
    currentDegree: "",
    fieldOfStudy: "",
    gpa: "",
    gpaScale: "4.0",
    needsFinancialAid: null,
    targetCountryOfStudy: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const profRes = await fetch("/api/profile");
        const profData = await profRes.json();

        if (profData.exists) {
          setProfile({
            firstName: profData.profile.firstName || "",
            lastName: profData.profile.lastName || "",
            nationality: profData.profile.nationality || "",
            currentDegree: profData.profile.currentDegree || "",
            fieldOfStudy: profData.profile.fieldOfStudy || "",
            gpa: profData.profile.gpa?.toString() || "",
            gpaScale: profData.profile.gpaScale?.toString() || "4.0",
            needsFinancialAid: profData.profile.needsFinancialAid,
            targetCountryOfStudy: profData.profile.countryOfStudy || "",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const updateField = (field: keyof ProfileData, value: any) => {
    setProfile(p => ({ ...p, [field]: value }));
    setIsDirty(true);
  };

  const [saveError, setSaveError] = useState("");

  const handleSave = async () => {
    if (isSaving || !isDirty) return;
    setIsSaving(true);
    setSaveError("");
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profile,
          needsFinancialAid: profile.needsFinancialAid ?? false,
          gpa: profile.gpa ? parseFloat(profile.gpa) : null,
          gpaScale: profile.gpaScale ? parseFloat(profile.gpaScale) : null,
          citizenships: profile.nationality ? [profile.nationality] : [],
          countryOfStudy: profile.targetCountryOfStudy === "Anywhere" ? "" : profile.targetCountryOfStudy
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setIsDirty(false);
        // Invalidate router cache so dashboard matching triggers a fresh recalculation!
        router.refresh();
        setTimeout(() => setSavedSuccess(false), 2500);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setSaveError(`Failed to save: ${errorData.error || res.statusText}`);
      }
    } catch (err) {
      console.error(err);
      setSaveError("Network error while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !isUserLoaded) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <CircleNotch size={24} className="animate-spin text-moss" />
      </div>
    );
  }

  // Calculate mock readiness score based on filled fields
  const filledFields = Object.values(profile).filter(v => v !== "" && v !== null).length;
  const totalFields = Object.keys(profile).length;
  const readinessScore = Math.round((filledFields / totalFields) * 100);

  // Generate AI Insights
  const insights = [];
  if (profile.gpa && parseFloat(profile.gpa) >= 3.5 && profile.gpaScale === "4.0") {
    insights.push({ id: "1", type: "strength", text: `Your ${profile.gpa} GPA makes you highly competitive for top-tier academic merit scholarships.` });
  }
  if (profile.fieldOfStudy) {
    insights.push({ id: "2", type: "strength", text: `There is currently a 24% increase in funding opportunities for ${profile.fieldOfStudy} candidates.` });
  }
  if (!profile.targetCountryOfStudy || profile.targetCountryOfStudy === "Anywhere") {
    insights.push({ id: "3", type: "opportunity", text: "Adding a target destination country will unlock region-specific government scholarships (e.g. Chevening, DAAD)." });
  }

  // Generate Timeline Milestones
  const milestones = [];
  if (profile.currentDegree) {
    milestones.push({
      id: "m1",
      type: "past",
      title: "Previous Education",
      subtitle: `Completed prerequisites for ${profile.currentDegree.toLowerCase()} studies.`,
      icon: "degree"
    });
    milestones.push({
      id: "m2",
      type: "current",
      title: "Current Status",
      subtitle: `${profile.currentDegree === "UNDERGRADUATE" ? "BSc" : profile.currentDegree === "MASTERS" ? "Masters" : "PhD"} in ${profile.fieldOfStudy || "Progress"}`,
      date: "Present",
      icon: "degree"
    });
  }
  milestones.push({
    id: "m3",
    type: "future",
    title: "Target Opportunity",
    subtitle: `Seeking ${profile.needsFinancialAid ? "fully-funded " : ""}programs${profile.targetCountryOfStudy && profile.targetCountryOfStudy !== "Anywhere" ? ` in ${profile.targetCountryOfStudy}` : " globally"}.`,
    icon: "target"
  });

  return (
    <div className="min-h-screen bg-bg flex flex-col pb-[120px]">
      <div className="flex-1 max-w-[800px] mx-auto w-full px-4 sm:px-6 py-8">
        
        {/* Top Navigation */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 bg-transparent hover:bg-surface-hover px-2 py-1 -ml-2 rounded-md transition-colors text-ink font-ui font-medium text-[14px]"
          >
            <ArrowLeft size={16} />
            Home
          </button>
          
          <button 
            onClick={() => signOut(() => router.push("/"))}
            className="flex items-center gap-1.5 text-ink-tertiary hover:text-ink-secondary text-[13px] font-ui transition-colors"
          >
            <LockKey size={14} />
            Sign out
          </button>
        </div>

        <ProfileHeader 
          firstName={profile.firstName}
          lastName={profile.lastName}
          nationality={profile.nationality}
          currentDegree={profile.currentDegree}
          fieldOfStudy={profile.fieldOfStudy}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* LEFT COLUMN: Metric & Insights */}
          <div className="md:col-span-1 flex flex-col gap-6">
            <ReadinessScore score={readinessScore} />
            <AIInsights insights={insights as any} />
          </div>

          {/* RIGHT COLUMN: Timeline & Bento Grid Data */}
          <div className="md:col-span-2 flex flex-col gap-6">
            
            {/* Inline Editing Bento Cards */}
            <div className="bg-surface border border-border rounded-[24px] p-6">
              <h2 className="text-[18px] font-editorial text-ink mb-5">Core Profile</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                <div className="group z-40">
                  <label className="text-[11px] font-ui uppercase tracking-wider text-ink-tertiary font-medium flex items-center gap-1.5 mb-1.5">
                    <Student size={14} /> Degree Level
                  </label>
                  <CustomSelect
                    value={profile.currentDegree}
                    onChange={(val) => updateField("currentDegree", val)}
                    options={DEGREE_OPTIONS}
                    placeholder="Select degree..."
                  />
                </div>

                <div className="group z-30">
                  <label className="text-[11px] font-ui uppercase tracking-wider text-ink-tertiary font-medium flex items-center gap-1.5 mb-1.5">
                    <GlobeHemisphereWest size={14} /> Target Destination
                  </label>
                  <CustomSelect
                    value={profile.targetCountryOfStudy || "Anywhere"}
                    onChange={(val) => updateField("targetCountryOfStudy", val === "Anywhere" ? "" : val)}
                    options={DESTINATION_OPTIONS}
                    placeholder="Select destination..."
                  />
                </div>

                <div className="group z-20">
                  <label className="text-[11px] font-ui uppercase tracking-wider text-ink-tertiary font-medium mb-1.5 flex items-center gap-1.5">
                    Field of Study
                  </label>
                  <CustomSelect
                    value={profile.fieldOfStudy}
                    onChange={(val) => updateField("fieldOfStudy", val)}
                    options={FIELD_OPTIONS}
                    placeholder="Select field..."
                  />
                </div>

                <div className="group flex gap-4 z-10">
                  <div className="flex-[3]">
                    <label className="text-[11px] font-ui uppercase tracking-wider text-ink-tertiary font-medium mb-1.5 block">
                      GPA Score
                    </label>
                    <input 
                      type="number"
                      step="0.01"
                      value={profile.gpa}
                      onChange={(e) => updateField("gpa", e.target.value)}
                      placeholder="e.g. 3.8"
                      className="w-full bg-transparent border-b border-border/50 hover:border-border focus:border-moss outline-none py-[7px] text-[14px] font-ui text-ink transition-colors placeholder:text-ink-tertiary"
                    />
                  </div>
                  <div className="flex-[2] relative">
                    <label className="text-[11px] font-ui uppercase tracking-wider text-ink-tertiary font-medium mb-1.5 block">
                      Scale
                    </label>
                    <CustomSelect
                      value={profile.gpaScale}
                      onChange={(val) => updateField("gpaScale", val)}
                      options={GPA_SCALE_OPTIONS}
                    />
                  </div>
                </div>
              </div>
            </div>

            <JourneyTimeline milestones={milestones as any} />
          </div>
        </div>

      </div>

      {/* STICKY SAVE BUTTON */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-t border-border transition-transform duration-300 ${isDirty || saveError ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="max-w-[800px] mx-auto px-6 py-3 pb-[calc(12px+env(safe-area-inset-bottom))] flex items-center justify-end gap-4">
          {saveError && (
            <div className="text-sm font-ui font-medium text-urgent">
              {saveError}
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className={cn(
              "px-8 h-12 rounded-full font-ui font-medium text-[14px] flex items-center justify-center gap-2 transition-all duration-200",
              savedSuccess 
                ? "bg-success-surface text-success pointer-events-none" 
                : "bg-moss text-white hover:bg-moss-dark shadow-lg shadow-moss/20"
            )}
          >
            {isSaving ? (
              <CircleNotch size={18} className="animate-spin" />
            ) : savedSuccess ? (
              <>
                <CheckCircle size={18} weight="fill" />
                Saved
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </div>

      {(!isDirty && !saveError) && <BottomNav />}
    </div>
  );
}

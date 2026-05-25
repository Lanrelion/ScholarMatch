"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { ArrowLeft, LockKey, CheckCircle, CircleNotch } from "@phosphor-icons/react";
import { BottomNav } from "@/components/layout/BottomNav";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

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

  const [stats, setStats] = useState({ saved: 0, reviewed: 0, avgMatch: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [profRes, savedRes, reviewsRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/saved"),
          fetch("/api/reviews")
        ]);

        const profData = await profRes.json();
        const savedData = savedRes.ok ? await savedRes.json() : [];
        const reviewsData = reviewsRes.ok ? await reviewsRes.json() : [];

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

        const avgMatch = savedData.length > 0
          ? savedData.reduce((acc: number, curr: any) => acc + curr.matchScore, 0) / savedData.length
          : 0;

        setStats({
          saved: savedData.length,
          reviewed: reviewsData.length,
          avgMatch: Math.round(avgMatch * 100),
        });

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

  const handleSave = async () => {
    if (isSaving || !isDirty) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profile,
          gpa: profile.gpa ? parseFloat(profile.gpa) : null,
          gpaScale: profile.gpaScale ? parseFloat(profile.gpaScale) : null,
          citizenships: profile.nationality ? [profile.nationality] : [],
          countryOfStudy: profile.targetCountryOfStudy
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setIsDirty(false);
        setTimeout(() => setSavedSuccess(false), 2500);
      }
    } catch (err) {
      console.error(err);
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

  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();

  // Get flag emoji for nationality (rough implementation for common codes, fallback to flag if undefined)
  const getFlag = (code: string) => {
    if (!code) return "🌍";
    const codePoints = code.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col pb-[100px]">
      
      {/* PAGE HEADER */}
      <header className="bg-surface border-b border-border pt-8 px-6 pb-6">
        <div className="max-w-[600px] mx-auto w-full relative">
          
          {/* Back row */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 bg-transparent hover:bg-surface-hover px-2 py-1 -ml-2 rounded-md transition-colors text-ink font-ui font-medium text-[14px]"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          {/* Identity block */}
          <div className="mt-[20px] flex items-center">
            <div className="w-[56px] h-[56px] shrink-0 rounded-full bg-moss-light border-2 border-moss flex items-center justify-center">
              <span className="text-[22px] font-editorial font-normal text-moss">
                {initials || "?"}
              </span>
            </div>
            <div className="ml-4">
              <h1 className="text-[28px] font-editorial font-normal text-ink leading-tight">
                {profile.firstName || "Your"} {profile.lastName || "Profile"}
              </h1>
              <p className="text-[14px] font-ui text-ink-secondary mt-0.5">
                {profile.nationality ? `${getFlag(profile.nationality)} ${profile.nationality}` : "No nationality"} · {profile.currentDegree || "No degree selected"}
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-6 mt-[24px]">
            <div>
              <div className="text-[32px] font-editorial font-normal text-moss leading-none mb-1">{stats.saved}</div>
              <div className="text-[11px] font-ui uppercase tracking-[0.08em] text-ink-tertiary font-medium">Saved</div>
            </div>
            <div>
              <div className="text-[32px] font-editorial font-normal text-moss leading-none mb-1">{stats.reviewed}</div>
              <div className="text-[11px] font-ui uppercase tracking-[0.08em] text-ink-tertiary font-medium">Reviewed</div>
            </div>
            <div>
              <div className="text-[32px] font-editorial font-normal text-moss leading-none mb-1">{stats.avgMatch > 0 ? `${stats.avgMatch}%` : "—"}</div>
              <div className="text-[11px] font-ui uppercase tracking-[0.08em] text-ink-tertiary font-medium">Avg. Match</div>
            </div>
          </div>
        </div>
      </header>

      {/* FORM SECTIONS */}
      <div className="flex-1 max-w-[600px] mx-auto w-full px-6 py-8">
        
        {/* PERSONAL */}
        <div className="mb-10">
          <div className="text-[11px] font-ui uppercase tracking-[0.08em] text-ink-tertiary font-medium mb-4 pb-2 border-b border-border">
            Personal
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First name"
              value={profile.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
            />
            <Input
              label="Last name"
              value={profile.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
            />
          </div>
        </div>

        {/* ACADEMIC PROFILE */}
        <div className="mb-10">
          <div className="text-[11px] font-ui uppercase tracking-[0.08em] text-ink-tertiary font-medium mb-4 pb-2 border-b border-border">
            Academic Profile
          </div>
          
          <div className="mb-6">
            <div className="text-[13px] font-ui text-ink-secondary mb-2">Degree level</div>
            <div className="flex gap-3">
              {["UNDERGRADUATE", "MASTERS", "PHD"].map((level) => {
                const isSelected = profile.currentDegree === level;
                return (
                  <button
                    key={level}
                    onClick={() => updateField("currentDegree", level)}
                    className={cn(
                      "flex-1 h-12 flex items-center justify-center rounded-lg border text-[13px] font-ui font-medium transition-colors",
                      isSelected 
                        ? "bg-moss-light border-moss text-moss" 
                        : "bg-surface border-border text-ink-secondary hover:bg-surface-hover"
                    )}
                  >
                    {level === "UNDERGRADUATE" ? "BSc" : level === "MASTERS" ? "Masters" : "PhD"}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-6">
            <Input
              label="Field of study"
              value={profile.fieldOfStudy}
              onChange={(e) => updateField("fieldOfStudy", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-[1fr_100px] gap-4">
            <Input
              label="GPA"
              type="number"
              value={profile.gpa}
              onChange={(e) => updateField("gpa", e.target.value)}
            />
            <Input
              label="Scale"
              type="number"
              value={profile.gpaScale}
              onChange={(e) => updateField("gpaScale", e.target.value)}
            />
          </div>
        </div>

        {/* PREFERENCES */}
        <div className="mb-10">
          <div className="text-[11px] font-ui uppercase tracking-[0.08em] text-ink-tertiary font-medium mb-4 pb-2 border-b border-border">
            Preferences
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <Input
              label="Nationality"
              value={profile.nationality}
              onChange={(e) => updateField("nationality", e.target.value)}
            />
            <Input
              label="Target country"
              value={profile.targetCountryOfStudy}
              onChange={(e) => updateField("targetCountryOfStudy", e.target.value)}
            />
          </div>

          <div>
            <div className="text-[13px] font-ui text-ink-secondary mb-2">Needs financial aid?</div>
            <div className="flex gap-3">
              <button
                onClick={() => updateField("needsFinancialAid", true)}
                className={cn(
                  "flex-1 h-12 flex items-center justify-center rounded-lg border text-[13px] font-ui font-medium transition-colors",
                  profile.needsFinancialAid === true
                    ? "bg-moss-light border-moss text-moss" 
                    : "bg-surface border-border text-ink-secondary hover:bg-surface-hover"
                )}
              >
                Yes
              </button>
              <button
                onClick={() => updateField("needsFinancialAid", false)}
                className={cn(
                  "flex-1 h-12 flex items-center justify-center rounded-lg border text-[13px] font-ui font-medium transition-colors",
                  profile.needsFinancialAid === false
                    ? "bg-moss-light border-moss text-moss" 
                    : "bg-surface border-border text-ink-secondary hover:bg-surface-hover"
                )}
              >
                No
              </button>
            </div>
          </div>
        </div>

        {/* ACCOUNT */}
        <div>
          <div className="text-[11px] font-ui uppercase tracking-[0.08em] text-ink-tertiary font-medium mb-4 pb-2 border-b border-border">
            Account
          </div>
          
          <div className="bg-surface border border-border rounded-lg p-4 flex items-start gap-3">
            <LockKey size={20} className="text-ink-tertiary shrink-0 mt-[2px]" />
            <div>
              <div className="text-[14px] font-ui text-ink-secondary mb-1">
                {user?.primaryEmailAddress?.emailAddress}
              </div>
              <button 
                onClick={() => signOut(() => router.push("/"))}
                className="text-[13px] font-ui text-clay hover:text-clay-light transition-colors"
              >
                Manage your email via account settings &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* SCHOLARSHIP DNA SECTION */}
        <div className="mt-8 bg-surface border border-border rounded-xl p-6 md:p-7">
          <h2 className="text-[22px] font-editorial font-normal text-ink mb-1">
            Your scholarship profile
          </h2>
          <p className="text-[13px] font-ui text-ink-secondary mb-6">
            How our matching engine sees you.
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.needsFinancialAid && (
              <div className="bg-moss-light border border-moss text-moss rounded-full px-3.5 py-1.5 text-[13px] font-ui font-medium">
                Need-based funding
              </div>
            )}
            {profile.targetCountryOfStudy && (
              <div className="bg-moss-light border border-moss text-moss rounded-full px-3.5 py-1.5 text-[13px] font-ui font-medium">
                {profile.targetCountryOfStudy} destination
              </div>
            )}
            {profile.currentDegree && (
              <div className="bg-moss-light border border-moss text-moss rounded-full px-3.5 py-1.5 text-[13px] font-ui font-medium">
                {profile.currentDegree === "UNDERGRADUATE" ? "BSc" : profile.currentDegree === "MASTERS" ? "Masters" : "PhD"} level
              </div>
            )}
            {profile.fieldOfStudy && (
              <div className="bg-moss-light border border-moss text-moss rounded-full px-3.5 py-1.5 text-[13px] font-ui font-medium">
                {profile.fieldOfStudy} focus
              </div>
            )}
          </div>
        </div>

      </div>

      {/* STICKY SAVE BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-t border-border">
        <div className="max-w-[600px] mx-auto px-6 py-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
          <button
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className={cn(
              "w-full h-14 rounded-full font-ui font-medium text-[15px] flex items-center justify-center gap-2 transition-all duration-200",
              savedSuccess 
                ? "bg-success-surface text-success hover:bg-success-surface pointer-events-none" 
                : isDirty
                  ? "bg-moss text-white hover:bg-moss-dark shadow-lg shadow-moss/20"
                  : "bg-surface-hover text-ink-secondary cursor-not-allowed border border-border"
            )}
          >
            {isSaving ? (
              <CircleNotch size={20} className="animate-spin" />
            ) : savedSuccess ? (
              <>
                <CheckCircle size={20} weight="fill" />
                Saved!
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </div>

      {/* Only show bottom nav if we don't have dirty state */}
      {!isDirty && <BottomNav />}
    </div>
  );
}

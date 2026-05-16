"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { User, Globe, GraduationCap, BookOpen, BarChart3, Wallet, Mail, Settings, Check, Loader2, AlertCircle, LogOut } from "lucide-react";
import StepName from "@/components/onboarding/StepName";
import StepNationality from "@/components/onboarding/StepNationality";
import StepDegreeLevel from "@/components/onboarding/StepDegreeLevel";
import StepFieldOfStudy from "@/components/onboarding/StepFieldOfStudy";
import StepGPA from "@/components/onboarding/StepGPA";
import { BottomNav } from "@/components/layout/BottomNav";
import { BackButton } from "@/components/ui/BackButton";
import { cn } from "@/lib/utils";

type ProfileData = {
  firstName: string;
  lastName: string;
  nationality: string;
  currentDegree: "UNDERGRADUATE" | "MASTERS" | "PHD";
  fieldOfStudy: string;
  gpa: string;
  gpaScale: number;
  needsFinancialAid: boolean | null;
  workExperienceYears: string;
  countryOfStudy: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const { signOut } = useClerk();
  const { user, isLoaded: isUserLoaded } = useUser();

  const handleLogout = () => {
    signOut(() => router.push("/"));
  };
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChangingNationality, setIsChangingNationality] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data.exists) {
        setProfile({
          firstName: data.profile.firstName || "",
          lastName: data.profile.lastName || "",
          nationality: data.profile.nationality || "",
          currentDegree: data.profile.currentDegree || "UNDERGRADUATE",
          fieldOfStudy: data.profile.fieldOfStudy || "",
          gpa: data.profile.gpa?.toString() || "",
          gpaScale: data.profile.gpaScale || 4,
          needsFinancialAid: data.profile.needsFinancialAid,
          workExperienceYears: data.profile.workExperienceYears || "",
          countryOfStudy: data.profile.countryOfStudy || "",
        });
      } else {
        router.push("/onboarding/step/1");
      }
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateField = (field: keyof ProfileData, value: any) => {
    setProfile((prev) => (prev ? { ...prev, [field]: value } : null));
    setIsDirty(true);
    if (field === "nationality") {
      setIsChangingNationality(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profile,
          gpa: profile.gpa ? parseFloat(profile.gpa) : null,
          citizenships: [profile.nationality],
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setIsDirty(false);
        setTimeout(() => setSavedSuccess(false), 2000);
      } else {
        const data = await res.json();
        setError(data.error || "Could not save. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !isUserLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col pb-[120px] animate-in fade-in duration-500">
      {/* Pattern B Header */}
      <header className="px-4 pt-2 pb-3 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-[var(--color-border)]/50">
        <BackButton />
        <h1 className="text-base font-bold text-[var(--color-text-primary)] absolute left-1/2 -translate-x-1/2">
          Your Profile
        </h1>
        <div className="w-10" />
      </header>

      <div className="flex-1 px-4 py-8 space-y-12 max-w-2xl mx-auto w-full">
        {error && (
          <div className="bg-[var(--color-red-surface)] border border-[var(--color-red)] text-[var(--color-red-dark)] text-[13px] font-bold p-4 rounded-[var(--radius-lg)] flex items-center gap-3">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* SECTION — Identity */}
        <ProfileSection title="Identity" icon={User}>
          <StepName
            firstName={profile.firstName}
            lastName={profile.lastName}
            onChange={(field, val) => handleUpdateField(field, val)}
          />
        </ProfileSection>

        {/* SECTION — Nationality */}
        <ProfileSection title="Location" icon={Globe}>
          {!isChangingNationality ? (
            <div className="flex items-center justify-between bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--color-primary-surface)] border border-[var(--color-primary-border)] flex items-center justify-center text-[var(--color-primary)] text-sm font-black">
                  {profile.nationality}
                </div>
                <span className="text-sm font-bold text-[var(--color-text-primary)]">
                  {profile.nationality === "NG" ? "Nigeria" : 
                   profile.nationality === "KE" ? "Kenya" : 
                   profile.nationality === "GH" ? "Ghana" : profile.nationality}
                </span>
              </div>
              <button
                onClick={() => setIsChangingNationality(true)}
                className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-wider px-4 py-2 hover:bg-[var(--color-primary-surface)] rounded-full transition-colors"
              >
                Change
              </button>
            </div>
          ) : (
            <StepNationality
              value={profile.nationality}
              onChange={(val) => handleUpdateField("nationality", val)}
              hideHeader
            />
          )}
        </ProfileSection>

        {/* SECTION — Education */}
        <ProfileSection title="Education" icon={GraduationCap}>
          <div className="space-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[var(--color-text-tertiary)] font-bold mb-3">Target Degree</p>
              <StepDegreeLevel
                value={profile.currentDegree}
                onChange={(val) => handleUpdateField("currentDegree", val)}
                hideHeader
              />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[var(--color-text-tertiary)] font-bold mb-3">Field of Study</p>
              <StepFieldOfStudy
                value={profile.fieldOfStudy}
                onChange={(val) => handleUpdateField("fieldOfStudy", val)}
                hideHeader
              />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[var(--color-text-tertiary)] font-bold mb-3">Academic Score</p>
              <StepGPA
                gpa={profile.gpa}
                gpaScale={profile.gpaScale}
                onChange={(field, val) => handleUpdateField(field as any, val)}
                hideHeader
                hideFinancial
              />
            </div>
          </div>
        </ProfileSection>

        {/* SECTION — Support */}
        <ProfileSection title="Funding Support" icon={Wallet}>
          <StepGPA
            needsFinancialAid={profile.needsFinancialAid}
            onChange={(field, val) => handleUpdateField(field as any, val)}
            hideHeader
            hideGPA
          />
        </ProfileSection>

        {/* SECTION — Account */}
        <ProfileSection title="Account Settings" icon={Settings}>
          <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] p-4 space-y-4 border border-[var(--color-border)]">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest">Email Address</span>
              <span className="text-[15px] text-[var(--color-text-primary)] font-bold flex items-center gap-2">
                <Mail size={16} className="text-[var(--color-text-tertiary)]" />
                {user?.primaryEmailAddress?.emailAddress}
              </span>
            </div>
            <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
              <button
                onClick={() => window.open("https://accounts.clerk.dev/user", "_blank")}
                className="flex items-center gap-2 text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider hover:opacity-70 transition-opacity"
              >
                Security
                <Settings size={14} />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs font-bold text-[var(--color-red)] uppercase tracking-wider hover:opacity-70 transition-opacity"
              >
                Sign out
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </ProfileSection>
      </div>

      {/* Sticky Save Button */}
      <div className="fixed bottom-[60px] left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-[var(--color-border)] px-4 py-4 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleSave}
            disabled={isSaving || (!isDirty && !savedSuccess)}
            className={cn(
              "w-full h-[52px] rounded-[var(--radius-xl)] flex items-center justify-center text-sm font-bold transition-all active:scale-[0.98]",
              savedSuccess
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-text-primary)] text-white hover:bg-black",
              "disabled:opacity-30 disabled:cursor-not-allowed"
            )}
          >
            {isSaving ? (
              <Loader2 className="animate-spin" />
            ) : savedSuccess ? (
              <div className="flex items-center gap-2">
                <Check size={20} strokeWidth={3} />
                <span>Changes saved</span>
              </div>
            ) : (
              "Save Profile"
            )}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function ProfileSection({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4 px-1">
        <Icon size={16} className="text-[var(--color-primary)]" />
        <h2 className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] font-black">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

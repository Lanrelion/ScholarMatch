"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import StepName from "@/components/onboarding/StepName";
import StepNationality from "@/components/onboarding/StepNationality";
import StepDegreeLevel from "@/components/onboarding/StepDegreeLevel";
import StepFieldOfStudy from "@/components/onboarding/StepFieldOfStudy";
import StepGPA from "@/components/onboarding/StepGPA";
import BottomNav from "@/components/layout/BottomNav";

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
  const { user, isLoaded: isUserLoaded } = useUser();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChangingNationality, setIsChangingNationality] = useState(false);

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
        <div className="flex flex-col items-center gap-3">
          <i className="ti-loader-2 text-3xl text-[#1D9E75] animate-spin"></i>
          <p className="text-gray-500 text-sm font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* TOP BAR */}
      <div className="sticky top-0 bg-white z-10 border-b border-gray-50">
        <div className="flex items-center gap-3 px-4 pt-4 pb-2">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center -ml-2 text-gray-900 hover:bg-gray-50 rounded-full transition-colors"
          >
            <i className="ti-arrow-left text-xl"></i>
          </button>
          <h1 className="text-lg font-medium text-gray-900">Edit profile</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 pb-40 space-y-8 max-w-2xl mx-auto w-full">
        {error && (
          <div className="bg-red-50 border border-red-100 text-[#E24B4A] text-sm p-4 rounded-xl flex items-center gap-3">
            <i className="ti-alert-circle text-lg"></i>
            {error}
          </div>
        )}

        {/* SECTION — Name */}
        <section className="space-y-4">
          <h2 className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold px-1">
            Name
          </h2>
          <StepName
            firstName={profile.firstName}
            lastName={profile.lastName}
            onChange={(field, val) => handleUpdateField(field, val)}
          />
        </section>

        <hr className="border-gray-50" />

        {/* SECTION — Nationality */}
        <section className="space-y-4">
          <h2 className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold px-1">
            Nationality
          </h2>
          {!isChangingNationality ? (
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E1F5EE] border border-[#1D9E75] flex items-center justify-center text-[#1D9E75] text-xs font-bold">
                  {profile.nationality}
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {profile.nationality === "NG" ? "Nigeria" : 
                   profile.nationality === "KE" ? "Kenya" : 
                   profile.nationality === "GH" ? "Ghana" : profile.nationality}
                </span>
              </div>
              <button
                onClick={() => setIsChangingNationality(true)}
                className="text-xs font-semibold text-[#1D9E75] px-3 py-1.5 hover:bg-[#E1F5EE] rounded-lg transition-colors"
              >
                Change
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <StepNationality
                value={profile.nationality}
                onChange={(val) => handleUpdateField("nationality", val)}
                hideHeader
              />
            </div>
          )}
        </section>

        <hr className="border-gray-50" />

        {/* SECTION — Degree level */}
        <section className="space-y-4">
          <h2 className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold px-1">
            Degree level
          </h2>
          <StepDegreeLevel
            value={profile.currentDegree}
            onChange={(val) => handleUpdateField("currentDegree", val)}
            hideHeader
          />
        </section>

        <hr className="border-gray-50" />

        {/* SECTION — Field of study */}
        <section className="space-y-4">
          <h2 className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold px-1">
            Field of study
          </h2>
          <StepFieldOfStudy
            value={profile.fieldOfStudy}
            onChange={(val) => handleUpdateField("fieldOfStudy", val)}
            hideHeader
          />
        </section>

        <hr className="border-gray-50" />

        {/* SECTION — GPA */}
        <section className="space-y-4">
          <h2 className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold px-1">
            GPA
          </h2>
          <StepGPA
            gpa={profile.gpa}
            gpaScale={profile.gpaScale}
            onChange={(field, val) => handleUpdateField(field as any, val)}
            hideHeader
            hideFinancial
          />
        </section>

        <hr className="border-gray-50" />

        {/* SECTION — Financial need */}
        <section className="space-y-4">
          <h2 className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold px-1">
            Financial support needed?
          </h2>
          <StepGPA
            needsFinancialAid={profile.needsFinancialAid}
            onChange={(field, val) => handleUpdateField(field as any, val)}
            hideHeader
            hideGPA
          />
        </section>

        <hr className="border-gray-50" />

        {/* SECTION — Account */}
        <section className="space-y-4">
          <h2 className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold px-1">
            Account
          </h2>
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-gray-400 uppercase">Email</span>
              <span className="text-sm text-gray-900 font-medium">
                {user?.primaryEmailAddress?.emailAddress}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500">Manage your email in account settings</p>
              <button
                onClick={() => window.open("https://accounts.clerk.dev/user", "_blank")}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#1D9E75]"
              >
                Settings
                <i className="ti-external-link"></i>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* STICKY SAVE BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 pb-[calc(16px+env(safe-area-inset-bottom))] z-20">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full h-14 rounded-2xl flex items-center justify-center text-sm font-semibold transition-all shadow-sm active:scale-95 ${
              savedSuccess
                ? "bg-[#639922] text-white"
                : "bg-[#1D9E75] text-white"
            } disabled:opacity-70`}
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <i className="ti-loader-2 animate-spin"></i>
                <span>Saving...</span>
              </div>
            ) : savedSuccess ? (
              <div className="flex items-center gap-2">
                <i className="ti-check"></i>
                <span>Saved!</span>
              </div>
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </div>

      <BottomNav activeTab="profile" />
    </div>
  );
}

"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingShell from "@/components/onboarding/OnboardingShell";
import Screen1Name from "@/components/onboarding/screens/Screen1Name";
import Screen2Nationality from "@/components/onboarding/screens/Screen2Nationality";
import Screen3GPA from "@/components/onboarding/screens/Screen3GPA";
import Screen4Destination from "@/components/onboarding/screens/Screen4Destination";
import Screen5Field from "@/components/onboarding/screens/Screen5Field";
import Screen6Experience from "@/components/onboarding/screens/Screen6Experience";
import MatchReveal from "@/components/onboarding/MatchReveal";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { ScholarshipWithMatch } from "@/types/scholarship";

export default function OnboardingStep({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const stepNumber = parseInt(resolvedParams.step, 10);
  const [error, setError] = useState("");
  const [showReveal, setShowReveal] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const [topMatches, setTopMatches] = useState<ScholarshipWithMatch[]>([]);
  const { state, updateField, isStepValid, loading } = useOnboardingState();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-bg">
        <div className="w-8 h-8 rounded-full border-2 border-moss border-t-transparent animate-spin mb-4" />
        <span className="text-[13px] font-ui text-ink-secondary">Loading your onboarding session...</span>
      </div>
    );
  }

  if (isNaN(stepNumber) || stepNumber < 1 || stepNumber > 6) {
    if (typeof window !== "undefined") {
      router.replace("/onboarding/step/1");
    }
    return null;
  }

  const handleBack = () => {
    if (stepNumber > 1) {
      router.back();
    }
  };

  const handleContinue = async () => {
    if (!isStepValid(stepNumber)) return;

    if (stepNumber < 6) {
      router.push(`/onboarding/step/${stepNumber + 1}`);
    } else {
      setShowReveal(true);
      try {
        const payload = {
          firstName: state.firstName.trim(),
          lastName: state.lastName.trim(),
          nationality: state.nationality,
          citizenships: [state.nationality],
          currentDegree: state.currentDegree,
          fieldOfStudy: state.fields.join(", "),
          gpa: state.gpa,
          gpaScale: state.gpaScale,
          needsFinancialAid: state.needsFinancialAid,
          workExperienceYears: state.workExperienceYears,
          countryOfStudy: state.destinations.length > 0 && !state.destinations.includes("ANY")
            ? state.destinations[0]
            : null,
        };

        const res = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const matchRes = await fetch("/api/scholarships?limit=4");
          if (matchRes.ok) {
            const result = await matchRes.json();
            setMatchCount(result.meta?.total || 0);
            setTopMatches(result.data || []);
          }
        } else {
          setShowReveal(false);
          const errorData = await res.json().catch(() => ({}));
          console.error("Onboarding submission failed:", res.status, errorData);
          setError(`Error: ${res.status} - ${errorData.error || "Please try again."}`);
        }
      } catch (err) {
        setShowReveal(false);
        console.error("Onboarding submission error:", err);
        setError("Network error. Please check your connection.");
      }
    }
  };

  const handleSkip = () => {
    router.push(`/onboarding/step/${stepNumber + 1}`);
  };

  const continueDisabled = !isStepValid(stepNumber) || showReveal;

  // Determine continue label based on step
  const getContinueLabel = (): string | undefined => {
    if (stepNumber === 4 && state.destinations.length > 0) {
      return `Continue with ${state.destinations.length} ${state.destinations.length === 1 ? "destination" : "destinations"} →`;
    }
    if (stepNumber === 5 && state.fields.length > 0) {
      return `Continue with ${state.fields.length} ${state.fields.length === 1 ? "field" : "fields"} →`;
    }
    if (stepNumber === 6) {
      return "Find my matches →";
    }
    return undefined;
  };

  // Determine if skip is available
  const showSkip = stepNumber === 3; // GPA is skippable

  if (showReveal) {
    return (
      <MatchReveal
        matchCount={matchCount}
        topMatches={topMatches}
        onComplete={() => router.push("/dashboard")}
        userName={state.firstName}
        nationalityName={state.nationalityName}
        destinations={state.destinations}
        fields={state.fields}
      />
    );
  }

  return (
    <OnboardingShell
      currentStep={stepNumber}
      totalSteps={6}
      onBack={handleBack}
      onContinue={handleContinue}
      continueDisabled={continueDisabled}
      isLastStep={stepNumber === 6}
      showSkip={showSkip}
      onSkip={handleSkip}
      continueLabel={getContinueLabel()}
    >
      {stepNumber === 1 && <Screen1Name state={state} updateField={updateField} />}
      {stepNumber === 2 && <Screen2Nationality state={state} updateField={updateField} />}
      {stepNumber === 3 && <Screen3GPA state={state} updateField={updateField} />}
      {stepNumber === 4 && <Screen4Destination state={state} updateField={updateField} />}
      {stepNumber === 5 && <Screen5Field state={state} updateField={updateField} />}
      {stepNumber === 6 && <Screen6Experience state={state} updateField={updateField} />}

      {error && stepNumber === 6 && (
        <div className="mt-4 text-center text-sm font-ui font-medium text-urgent">
          {error}
        </div>
      )}
    </OnboardingShell>
  );
}

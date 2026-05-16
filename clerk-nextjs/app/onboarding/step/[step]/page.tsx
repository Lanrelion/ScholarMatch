"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingShell from "@/components/onboarding/OnboardingShell";
import StepName from "@/components/onboarding/StepName";
import StepNationality from "@/components/onboarding/StepNationality";
import StepDegreeLevel from "@/components/onboarding/StepDegreeLevel";
import StepFieldOfStudy from "@/components/onboarding/StepFieldOfStudy";
import StepGPA from "@/components/onboarding/StepGPA";
import StepExperience from "@/components/onboarding/StepExperience";
import { useOnboardingState } from "@/hooks/useOnboardingState";

export default function OnboardingStep({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const stepNumber = parseInt(resolvedParams.step, 10);
  const [error, setError] = useState("");
  const { state, updateField, isStepValid } = useOnboardingState();

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
      try {
        const payload = {
          firstName: state.firstName.trim(),
          lastName: state.lastName.trim(),
          nationality: state.nationality,
          citizenships: [state.nationality],
          currentDegree: state.currentDegree,
          fieldOfStudy: state.fieldOfStudy.trim(),
          gpa: state.gpa ? parseFloat(state.gpa) : null,
          gpaScale: state.gpaScale,
          needsFinancialAid: state.needsFinancialAid,
          workExperienceYears: state.workExperienceYears === "3+" ? 3 : parseInt(state.workExperienceYears || "0", 10),
          countryOfStudy: state.targetCountry === "ANY" ? null : state.targetCountry,
        };

        const res = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          router.push("/dashboard");
        } else {
          const errorData = await res.json().catch(() => ({}));
          console.error("Onboarding submission failed:", res.status, errorData);
          setError(`Error: ${res.status} - ${errorData.error || "Please try again."}`);
        }
      } catch (err) {
        console.error("Onboarding submission error:", err);
        setError("Network error. Please check your connection.");
      }
    }
  };

  const continueDisabled = !isStepValid(stepNumber);

  return (
    <OnboardingShell
      currentStep={stepNumber}
      totalSteps={6}
      onBack={handleBack}
      onContinue={handleContinue}
      continueDisabled={continueDisabled}
      isLastStep={stepNumber === 6}
    >
      <div className="flex-1 py-8 px-6 overflow-y-auto">
        {stepNumber === 1 && <StepName state={state} updateField={updateField} />}
        {stepNumber === 2 && <StepNationality state={state} updateField={updateField} />}
        {stepNumber === 3 && <StepDegreeLevel state={state} updateField={updateField} />}
        {stepNumber === 4 && <StepFieldOfStudy state={state} updateField={updateField} />}
        {stepNumber === 5 && <StepGPA state={state} updateField={updateField} />}
        {stepNumber === 6 && <StepExperience state={state} updateField={updateField} />}
        
        {error && stepNumber === 6 && (
          <div className="mt-4 text-center text-sm font-medium text-[#E24B4A]">
            {error}
          </div>
        )}
      </div>
    </OnboardingShell>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export type OnboardingState = {
  firstName: string;
  lastName: string;
  nationality: string;
  currentDegree: "UNDERGRADUATE" | "MASTERS" | "PHD" | "";
  fieldOfStudy: string;
  gpa: string;
  gpaScale: 4 | 5 | 7 | 100;
  needsFinancialAid: boolean | null;
  workExperienceYears: string;
  targetCountry: string;
  aspiration: string | null;
};

const initialState: OnboardingState = {
  firstName: "",
  lastName: "",
  nationality: "",
  currentDegree: "",
  fieldOfStudy: "",
  gpa: "",
  gpaScale: 4,
  needsFinancialAid: null,
  workExperienceYears: "",
  targetCountry: "",
  aspiration: null,
};

const stateCache: Record<string, OnboardingState> = {};

export function useOnboardingState() {
  const { user } = useUser();
  const key = user?.id ?? "anonymous";

  if (!stateCache[key]) {
    stateCache[key] = { ...initialState };
  }

  const [state, setState] = useState<OnboardingState>(stateCache[key]);

  // Sync state if user changes (e.g. from anonymous to signed in)
  useEffect(() => {
    setState(stateCache[key]);
  }, [key]);

  const updateField = <K extends keyof OnboardingState>(
    field: K,
    value: OnboardingState[K]
  ) => {
    setState((prev) => {
      const next = { ...prev, [field]: value };
      stateCache[key] = next;
      return next;
    });
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return state.firstName.trim().length > 0 && state.lastName.trim().length > 0;
      case 2:
        return state.nationality.length === 2;
      case 3:
        return ["UNDERGRADUATE", "MASTERS", "PHD"].includes(state.currentDegree);
      case 4:
        return state.fieldOfStudy.trim().length > 0;
      case 5:
        if (state.needsFinancialAid === null) return false;
        if (state.gpa !== "") {
          const num = parseFloat(state.gpa);
          if (isNaN(num) || num < 0 || num > state.gpaScale) return false;
        }
        return true;
      case 6:
        return state.targetCountry.length === 2 && state.workExperienceYears.trim().length > 0;
      default:
        return false;
    }
  };

  return { state, updateField, isStepValid };
}

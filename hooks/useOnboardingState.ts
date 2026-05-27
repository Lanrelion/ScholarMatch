"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export type OnboardingState = {
  // Screen 1
  firstName: string;
  lastName: string;
  aspiration: string;

  // Screen 2
  nationality: string;        // ISO code e.g. "NG"
  nationalityName: string;    // e.g. "Nigeria"

  // Screen 3
  gpa: number | null;
  gpaScale: 4 | 5 | 7 | 100;

  // Screen 4
  destinations: string[];     // ISO codes, empty = anywhere

  // Screen 5
  fields: string[];

  // Screen 6
  currentDegree: "UNDERGRADUATE" | "MASTERS" | "PHD" | "";
  workExperienceYears: number;

  // Derived
  needsFinancialAid: boolean;
};

const initialState: OnboardingState = {
  firstName: "",
  lastName: "",
  aspiration: "",
  nationality: "",
  nationalityName: "",
  gpa: null,
  gpaScale: 4,
  destinations: [],
  fields: [],
  currentDegree: "",
  workExperienceYears: 0,
  needsFinancialAid: true,
};

const stateCache: Record<string, OnboardingState> = {};

export function useOnboardingState() {
  const { user } = useUser();
  const key = user?.id ?? "anonymous";

  if (!stateCache[key]) {
    stateCache[key] = { ...initialState };
  }

  const [state, setState] = useState<OnboardingState>(stateCache[key]);
  const [loading, setLoading] = useState(true);

  // Sync state if user changes (e.g. from anonymous to signed in) and fetch profile
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // If already loaded in cache (i.e. not empty name), don't fetch again
    if (stateCache[key] && stateCache[key].firstName !== "") {
      setState(stateCache[key]);
      setLoading(false);
      return;
    }

    let isSubscribed = true;

    fetch("/api/profile")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data) => {
        if (isSubscribed && data.exists && data.profile) {
          const p = data.profile;
          
          // Map DB profile to OnboardingState
          const loadedState: OnboardingState = {
            firstName: p.firstName || "",
            lastName: p.lastName || "",
            aspiration: "", // Not stored in DB
            nationality: p.nationality || "",
            nationalityName: p.nationality || "", // Will be updated by selector
            gpa: p.gpa,
            gpaScale: (p.gpaScale as any) || 4,
            destinations: p.countryOfStudy ? [p.countryOfStudy] : [],
            fields: p.fieldOfStudy ? p.fieldOfStudy.split(", ") : [],
            currentDegree: p.currentDegree || "",
            workExperienceYears: p.workExperienceYears || 0,
            needsFinancialAid: p.needsFinancialAid ?? true,
          };

          stateCache[key] = loadedState;
          setState(loadedState);
        }
      })
      .catch((err) => {
        console.warn("Could not load profile from database, using initial state:", err);
      })
      .finally(() => {
        if (isSubscribed) setLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [key, user]);

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
        return state.firstName.trim().length > 0;
      case 2:
        return state.nationality.length === 2;
      case 3:
        return true; // GPA is optional
      case 4:
        return state.destinations.length > 0;
      case 5:
        return state.fields.length > 0;
      case 6:
        return ["UNDERGRADUATE", "MASTERS", "PHD"].includes(state.currentDegree);
      default:
        return false;
    }
  };

  return { state, updateField, isStepValid, loading };
}

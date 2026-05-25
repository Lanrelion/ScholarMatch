"use client";

import React from "react";
import { OnboardingState } from "@/hooks/useOnboardingState";
import { Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface Props {
  state: OnboardingState;
  updateField: <K extends keyof OnboardingState>(field: K, value: OnboardingState[K]) => void;
}

const COUNTRIES = [
  { code: "DE", name: "Germany" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "SE", name: "Sweden" },
  { code: "BE", name: "Belgium" },
  { code: "NL", name: "Netherlands" },
  { code: "UG", name: "Uganda" },
  { code: "ZA", name: "South Africa" },
  { code: "ANY", name: "No preference" },
];

export default function StepExperience({ state, updateField }: Props) {
  return (
    <div className="flex flex-col gap-10 pb-12">
      <div>
        <h2 className="text-4xl font-editorial text-ink mb-3 leading-tight">Almost there!</h2>
        <p className="text-ink-secondary text-base font-ui">
          Tell us about your experience and where you'd like to study.
        </p>
      </div>

      <div className="space-y-10">
        {/* Work Experience */}
        <div>
          <label className="block text-sm font-ui font-medium text-ink mb-4">
            Years of Work Experience
          </label>
          <div className="grid grid-cols-4 gap-3">
            {["0", "1", "2", "3+"].map((exp) => (
              <button
                key={exp}
                onClick={() => updateField("workExperienceYears", exp)}
                className={cn(
                  "py-3 rounded-2xl border text-sm font-ui transition-all duration-300 ease-in-out",
                  state.workExperienceYears === exp
                    ? "bg-moss text-white border-moss shadow-sm scale-[1.02]"
                    : "bg-surface border-border text-ink hover:border-border-strong hover:bg-surface-hover"
                )}
              >
                {exp}
              </button>
            ))}
          </div>
          <p className="text-[12px] text-ink-secondary mt-3 font-ui italic">
            Some scholarships like Chevening require 2+ years of professional experience.
          </p>
        </div>

        {/* Target Country */}
        <div>
          <label className="block text-sm font-ui font-medium text-ink mb-4">
            Target Country of Study
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {COUNTRIES.map((country) => {
              const isSelected = state.targetCountry === country.code;
              return (
                <button
                  key={country.code}
                  onClick={() => updateField("targetCountry", country.code)}
                  className={cn(
                    "text-left p-4 rounded-2xl border transition-all duration-300 ease-in-out group",
                    isSelected
                      ? "border-moss bg-moss-light shadow-sm scale-[1.01]"
                      : "border-border bg-surface hover:border-border-strong hover:bg-surface-hover"
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="font-editorial text-lg font-medium text-ink">{country.name}</div>
                    <div className={cn(
                      "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                      isSelected ? "border-moss bg-moss" : "border-border group-hover:border-border-strong"
                    )}>
                      <Check weight="bold" size={12} className={cn(
                        "text-white transition-opacity",
                        isSelected ? "opacity-100" : "opacity-0"
                      )} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

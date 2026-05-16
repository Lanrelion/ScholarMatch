"use client";

import React from "react";
import { OnboardingState } from "@/hooks/useOnboardingState";

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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-medium text-gray-900 mb-2">Almost there!</h2>
      <p className="text-gray-500 mb-8">
        Tell us about your experience and where you'd like to study.
      </p>

      <div className="space-y-6">
        {/* Work Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Years of Work Experience
          </label>
          <div className="grid grid-cols-4 gap-2">
            {["0", "1", "2", "3+"].map((exp) => (
              <button
                key={exp}
                onClick={() => updateField("workExperienceYears", exp)}
                className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                  state.workExperienceYears === exp
                    ? "bg-[#E1F5EE] border-[#1D9E75] text-[#0F6E56]"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {exp}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 mt-2 italic">
            Some scholarships like Chevening require 2+ years of professional experience.
          </p>
        </div>

        {/* Target Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Target Country of Study
          </label>
          <div className="grid grid-cols-2 gap-2">
            {COUNTRIES.map((country) => (
              <button
                key={country.code}
                onClick={() => updateField("targetCountry", country.code)}
                className={`py-3 px-4 rounded-xl border text-sm font-medium text-left flex justify-between items-center transition-all ${
                  state.targetCountry === country.code
                    ? "bg-[#E1F5EE] border-[#1D9E75] text-[#0F6E56]"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {country.name}
                {state.targetCountry === country.code && (
                  <i className="ti-circle-check text-[#1D9E75]"></i>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

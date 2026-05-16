"use client";

import React from "react";

interface Props {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onContinue: () => void;
  continueDisabled: boolean;
  isLastStep: boolean;
  children: React.ReactNode;
}

export default function OnboardingShell({
  currentStep,
  totalSteps,
  onBack,
  onContinue,
  continueDisabled,
  isLastStep,
  children,
}: Props) {
  const dots = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* TOP - progress dots */}
      <div className="px-6 pt-6 pb-2 flex-none">
        <div className="flex w-full gap-2">
          {dots.map((dot) => (
            <div
              key={dot}
              className={`h-1 flex-1 rounded-full ${
                dot < currentStep
                  ? "bg-[#1D9E75]"
                  : dot === currentStep
                  ? "bg-[#5DCAA5]"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* MIDDLE - content */}
      <div className="flex-1 flex flex-col min-h-0">
        {children}
      </div>

      {/* BOTTOM - navigation */}
      <div className="p-6 border-t border-gray-100 flex items-center justify-between flex-none">
        {currentStep > 1 ? (
          <button
            onClick={onBack}
            className="text-gray-500 font-medium px-4 min-h-[44px] hover:text-gray-800 transition-colors"
          >
            ← Back
          </button>
        ) : (
          <div className="w-16" />
        )}

        <button
          onClick={onContinue}
          disabled={continueDisabled}
          className={`min-h-[44px] rounded-xl px-6 py-2 font-medium transition-colors w-full sm:w-auto ml-auto ${
            continueDisabled
              ? "bg-[#1D9E75] opacity-50 cursor-not-allowed text-white"
              : "bg-[#1D9E75] text-white hover:bg-[#0F6E56]"
          }`}
        >
          {isLastStep ? "Find my scholarships →" : "Continue →"}
        </button>
      </div>
    </div>
  );
}

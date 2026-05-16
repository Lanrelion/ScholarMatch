"use client";

import React from "react";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Sleek Progress Header */}
      <div className="px-6 pt-10 pb-4 flex-none space-y-4">
        <div className="flex w-full gap-1.5 h-1">
          {steps.map((step) => (
            <div
              key={step}
              className={cn(
                "h-full flex-1 rounded-full transition-all duration-500",
                step <= currentStep
                  ? "bg-[var(--color-primary)]"
                  : "bg-[var(--color-border)]"
              )}
            />
          ))}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)]">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)]">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </div>

      {/* Navigation Footer */}
      <div className="p-6 pb-10 border-t border-[var(--color-border)] flex items-center gap-4 flex-none bg-white/80 backdrop-blur-md">
        {currentStep > 1 && (
          <button
            onClick={onBack}
            className="flex items-center justify-center w-12 h-12 rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] transition-all active:scale-90"
            aria-label="Go back"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        <button
          onClick={onContinue}
          disabled={continueDisabled}
          className={cn(
            "h-14 rounded-[var(--radius-xl)] px-8 font-bold text-sm transition-all flex-1 flex items-center justify-center gap-2 active:scale-[0.98]",
            continueDisabled
              ? "bg-[var(--color-border)] text-[var(--color-text-tertiary)] cursor-not-allowed"
              : "bg-[var(--color-primary)] text-white shadow-[0_8px_20px_-4px_rgba(29,158,117,0.3)] hover:brightness-105"
          )}
        >
          {isLastStep ? "Find my scholarships" : "Continue"}
          <ArrowRight size={18} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

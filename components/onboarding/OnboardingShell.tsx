"use client";

import React from "react";
import { CaretLeft, ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Props {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onContinue: () => void;
  continueDisabled: boolean;
  isLastStep: boolean;
  children: React.ReactNode;
}

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] as any } }
};

export default function OnboardingShell({
  currentStep,
  totalSteps,
  onBack,
  onContinue,
  continueDisabled,
  isLastStep,
  children,
}: Props) {
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="flex flex-col h-screen bg-bg overflow-hidden relative">
      {/* Full viewport width progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-border z-50 overflow-hidden">
        <motion.div 
          className="h-full bg-moss"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as any }}
        />
      </div>

      {/* Sleek Progress Header */}
      <div className="pt-12 pb-4 flex-none">
        <div className="px-6 flex justify-between items-center">
          <span className="text-[10px] font-ui font-medium uppercase tracking-widest text-ink-secondary">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-[10px] font-ui font-medium uppercase tracking-widest text-moss">
            {Math.round(progressPercent)}% Complete
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <motion.div 
        key={currentStep}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex-1 flex flex-col min-h-0 px-6 overflow-y-auto no-scrollbar"
      >
        {children}
      </motion.div>

      {/* Navigation Footer */}
      <div className="p-6 pb-[env(safe-area-inset-bottom)] border-t border-border flex items-center gap-4 flex-none bg-bg/80 backdrop-blur-md">
        {currentStep > 1 && (
          <button
            onClick={onBack}
            className="btn-icon"
            aria-label="Go back"
          >
            <CaretLeft size={20} />
          </button>
        )}

        <Button
          onClick={onContinue}
          disabled={continueDisabled}
          className="flex-1 flex items-center justify-center gap-2"
        >
          {isLastStep ? "Find my matches" : "Continue"}
          <ArrowRight size={18} weight="bold" />
        </Button>
      </div>
    </div>
  );
}


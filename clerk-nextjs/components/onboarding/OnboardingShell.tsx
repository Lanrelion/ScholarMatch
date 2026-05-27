"use client";

import React, { useEffect, useCallback } from "react";
import { CaretLeft } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onContinue: () => void;
  continueDisabled: boolean;
  isLastStep: boolean;
  showSkip?: boolean;
  onSkip?: () => void;
  continueLabel?: string;
  children: React.ReactNode;
}

const AMBIENT_BACKGROUNDS = [
  "linear-gradient(180deg, var(--color-bg) 0%, var(--color-bg) 100%)",              // 1: neutral parchment
  "linear-gradient(180deg, var(--color-bg) 0%, #F5F0E6 100%)",                       // 2: slight warm
  "linear-gradient(180deg, var(--color-bg) 0%, #F0F2F0 100%)",                       // 3: slight cool
  "linear-gradient(180deg, #F8F3EA 0%, #F2EBD9 100%)",                               // 4: deepest warmth
  "linear-gradient(180deg, var(--color-bg) 0%, var(--color-bg) 100%)",              // 5: neutral
  "linear-gradient(180deg, var(--color-bg) 0%, #F0EDE6 100%)",                       // 6: slight darkening
];

const pageVariants = {
  initial: { opacity: 0, x: 40, filter: "blur(4px)" },
  animate: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    x: -40,
    filter: "blur(4px)",
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] as const },
  },
};

export default function OnboardingShell({
  currentStep,
  totalSteps,
  onBack,
  onContinue,
  continueDisabled,
  isLastStep,
  showSkip,
  onSkip,
  continueLabel,
  children,
}: Props) {
  const progressPercent = (currentStep / totalSteps) * 100;

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (e.key === "Enter" && !continueDisabled) {
        // Don't trigger if user is typing in a textarea
        if (target.tagName !== "TEXTAREA") {
          e.preventDefault();
          onContinue();
        }
      }
      if (e.key === "Backspace" && !isInput && currentStep > 1) {
        e.preventDefault();
        onBack();
      }
    },
    [continueDisabled, onContinue, onBack, currentStep]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const bg =
    AMBIENT_BACKGROUNDS[(currentStep - 1) % AMBIENT_BACKGROUNDS.length];

  return (
    <div className="flex flex-col h-dvh overflow-hidden relative">
      {/* Ambient background */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{ background: bg }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* Progress bar — 2px, full width, no dots */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-border z-50 overflow-hidden">
        <motion.div
          className="h-full bg-moss"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
        />
      </div>

      {/* Top bar: back arrow (left) + step counter (right) */}
      <div className="flex items-center justify-between px-6 pt-5 pb-2 flex-none">
        <div className="w-10">
          {currentStep > 1 && (
            <button
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center text-ink-tertiary hover:text-ink transition-colors"
              aria-label="Go back"
            >
              <CaretLeft size={20} />
            </button>
          )}
        </div>
        <span className="font-ui text-[12px] text-ink-tertiary">
          {currentStep} of {totalSteps}
        </span>
      </div>

      {/* Main content — question sits at ~38% from top */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex-1 flex flex-col"
          >
            {/* Spacer to push content to ~38% from top */}
            <div className="flex-[38] min-h-0" />
            <div className="w-full max-w-[580px] mx-auto px-6 shrink-0">{children}</div>
            <div className="flex-[62] min-h-0" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom: Continue button */}
      <div className="px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-4 flex flex-col items-center gap-3 flex-none">
        <button
          onClick={onContinue}
          disabled={continueDisabled}
          className="min-w-[180px] px-8 py-[14px] bg-moss text-white rounded-full font-ui text-[15px] font-medium transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(95,111,82,0.35)] disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:cursor-not-allowed"
        >
          {continueLabel || (isLastStep ? "Find my matches →" : "Continue →")}
        </button>

        {showSkip && onSkip && (
          <button
            onClick={onSkip}
            className="font-ui text-[13px] text-ink-tertiary hover:text-ink-secondary transition-colors"
          >
            Skip for now →
          </button>
        )}
      </div>
    </div>
  );
}

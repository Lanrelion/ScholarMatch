"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { OnboardingState } from "@/hooks/useOnboardingState";

interface Props {
  state: OnboardingState;
  updateField: <K extends keyof OnboardingState>(
    field: K,
    value: OnboardingState[K]
  ) => void;
}

const ASPIRATIONS = [
  "medicine in Canada",
  "tech entrepreneurship",
  "public policy in Europe",
  "climate research",
  "engineering in Germany",
];

const ROTATE_INTERVAL = 3000;
const GREETING_DEBOUNCE = 400;

export default function Screen1Name({ state, updateField }: Props) {
  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingName, setGreetingName] = useState("");
  const [aspirationIndex, setAspirationIndex] = useState(0);
  const [firstNameFocused, setFirstNameFocused] = useState(false);
  const [aspirationFocused, setAspirationFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    firstNameRef.current?.focus();
  }, []);

  // Debounced greeting
  const handleFirstNameChange = useCallback(
    (value: string) => {
      updateField("firstName", value);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (value.trim().length === 0) {
        setShowGreeting(false);
        return;
      }

      debounceRef.current = setTimeout(() => {
        setGreetingName(value.trim());
        setShowGreeting(true);
      }, GREETING_DEBOUNCE);
    },
    [updateField]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Rotate aspiration placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setAspirationIndex((prev) => (prev + 1) % ASPIRATIONS.length);
    }, ROTATE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const hasFirstName = state.firstName.trim().length > 0;

  return (
    <div className="flex flex-col gap-10">
      {/* Question */}
      <div>
        <h1
          className="font-editorial font-light text-ink leading-tight"
          style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}
        >
          What&rsquo;s your name?
        </h1>
        <p className="font-ui text-[16px] font-normal text-ink-secondary mt-3">
          This helps us personalise everything for you.
        </p>
      </div>

      {/* Greeting */}
      <AnimatePresence>
        {showGreeting && greetingName && (
          <motion.p
            key="greeting"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-editorial text-[28px] text-moss italic"
          >
            Hi, {greetingName}.
          </motion.p>
        )}
      </AnimatePresence>

      {/* Inputs */}
      <div className="flex flex-col gap-8">
        {/* First Name Input */}
        <div className="relative">
          <input
            ref={firstNameRef}
            type="text"
            value={state.firstName}
            onChange={(e) => handleFirstNameChange(e.target.value)}
            onFocus={() => setFirstNameFocused(true)}
            onBlur={() => setFirstNameFocused(false)}
            placeholder="Your first name..."
            className="w-full bg-transparent border-0 border-b-2 border-border rounded-none
                       font-ui text-[20px] text-ink placeholder:text-ink-secondary/50
                       py-3 px-0 outline-none focus:ring-0
                       transition-colors duration-200"
            autoComplete="given-name"
          />
          {/* Animated bottom line */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-moss"
            initial={{ width: "0%" }}
            animate={{ width: firstNameFocused ? "100%" : "0%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

      </div>
    </div>
  );
}

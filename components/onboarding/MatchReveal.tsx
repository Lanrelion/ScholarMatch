"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScholarshipCard } from "@/components/dashboard/ScholarshipCard";
import { ScholarshipWithMatch } from "@/types/scholarship";

interface MatchRevealProps {
  matchCount: number;
  topMatches: ScholarshipWithMatch[];
  onComplete: () => void;
  userName?: string;
  nationalityName?: string;
  destinations?: string[];
  fields?: string[];
}

const useCountUp = (target: number, duration: number = 1200, startDelay: number = 0) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const delayTimer = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(delayTimer);
  }, [startDelay]);

  useEffect(() => {
    if (!started || target === 0) return;
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, started]);
  return count;
};

// Simple floating particle
function Particle({ delay, x, size }: { delay: number; x: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        bottom: "-10px",
        backgroundColor: "var(--color-moss)",
      }}
      initial={{ opacity: 0, y: 0 }}
      animate={{
        opacity: [0, 0.5, 0.3, 0],
        y: [0, -120, -200, -280],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
}

export default function MatchReveal({
  matchCount,
  topMatches,
  onComplete,
  userName,
  nationalityName,
  destinations,
  fields,
}: MatchRevealProps) {
  const [phase, setPhase] = useState<"awakening" | "thinking" | "revealing" | "transition" | "cards">("awakening");
  const [messageIndex, setMessageIndex] = useState(0);
  const [showCount, setShowCount] = useState(false);
  const [countDone, setCountDone] = useState(false);

  const thinkingMessages = useMemo(() => [
    userName ? `Reading ${userName}'s profile...` : "Reading your profile...",
    "Scanning 500+ scholarships...",
    `Checking ${nationalityName || "nationality"} eligibility...`,
    "Analysing academic requirements...",
    destinations && destinations.length > 0
      ? `Finding opportunities in ${destinations.length} ${destinations.length === 1 ? "country" : "countries"}...`
      : "Searching globally...",
    `Matching ${fields?.[0] || "your field of study"}...`,
    "Discovering hidden university awards...",
    "Almost there...",
  ], [userName, nationalityName, destinations, fields]);

  // Phase sequencing
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Phase 1: Awakening → Thinking at 800ms
    timers.push(setTimeout(() => setPhase("thinking"), 800));

    // Show count at 1500ms
    timers.push(setTimeout(() => setShowCount(true), 1500));

    // Phase 2: Thinking → Revealing at 2800ms
    timers.push(setTimeout(() => setPhase("revealing"), 2800));

    // Phase 3: Revealing → Transition at 3500ms
    timers.push(setTimeout(() => setPhase("transition"), 3500));

    // Phase 4: Transition → Cards at 4200ms
    timers.push(setTimeout(() => setPhase("cards"), 4200));

    return () => timers.forEach(clearTimeout);
  }, []);

  // Thinking message cycling
  useEffect(() => {
    if (phase !== "thinking") return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => {
        if (prev < thinkingMessages.length - 1) return prev + 1;
        return prev;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [phase, thinkingMessages.length]);

  // Count up for scholarship total
  const scholarshipCount = useCountUp(500, 1200, 1500); // Always count up to 500 during loading
  const matchCountUp = useCountUp(matchCount, 600, 3000);

  // Mark count done when it hits target
  useEffect(() => {
    if (scholarshipCount >= 500) setCountDone(true);
  }, [scholarshipCount]);

  // Particles data
  const particles = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 3,
      size: 2 + Math.random() * 2,
    }));
  }, []);

  // Background color
  const bgColor =
    phase === "awakening" || phase === "thinking" || phase === "revealing"
      ? "#0A0A0A"
      : phase === "transition"
        ? "#0A0A0A"
        : "var(--color-bg)";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      animate={{ backgroundColor: bgColor }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      {/* Particles (visible during thinking phase) */}
      <AnimatePresence>
        {(phase === "thinking" || phase === "revealing") && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((p) => (
              <Particle key={p.id} x={p.x} delay={p.delay} size={p.size} />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* PHASE 1: AWAKENING — Logo pulse */}
      <AnimatePresence>
        {(phase === "awakening" || phase === "thinking") && (
          <motion.div
            key="logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: [1, 1.04, 1] }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              opacity: { duration: 0.4 },
              scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
            }}
            className="w-[40px] h-[40px] bg-moss rounded-[8px] flex items-center justify-center mb-8"
          >
            <span className="text-white font-ui text-[14px] font-bold tracking-tight">SM</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PHASE 2: THINKING — Animated messages */}
      <AnimatePresence mode="wait">
        {phase === "thinking" && (
          <motion.div
            key={`msg-${messageIndex}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="font-ui text-[15px] font-normal text-white/60 text-center max-w-[320px] mb-6"
          >
            {thinkingMessages[messageIndex]}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scholarship count (appears at 1500ms) */}
      <AnimatePresence>
        {showCount && (phase === "thinking" || phase === "revealing") && (
          <motion.div
            key="count"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
            className="font-editorial text-[28px] font-light text-center"
          >
            <span className={countDone ? "text-[#8DA67D]" : "text-white"}>
              {countDone
                ? `${scholarshipCount} scholarships analysed`
                : `Evaluating ${scholarshipCount} scholarships`}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PHASE 3: REVEALING — Final message */}
      <AnimatePresence>
        {phase === "revealing" && (
          <motion.div
            key="reveal-text"
            className="flex flex-col items-center text-center px-6 absolute"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0, duration: 0.5 }}
              className="font-ui text-[14px] uppercase tracking-[0.12em] text-white/50 mb-6"
            >
              YOUR RESULTS ARE READY
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="font-editorial text-[clamp(2rem,5vw,3.5rem)] font-light text-[#F4F1EB] leading-tight"
            >
              {matchCount === 0 ? (
                <>
                  We couldn&apos;t find an<br />exact match right now.
                </>
              ) : (
                <>
                  We found{" "}
                  <span className="text-[#8DA67D]">{matchCountUp}</span>{" "}
                  scholarships
                  <br />
                  aligned with your future.
                </>
              )}
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PHASE 4: TRANSITION + CARDS — Results page */}
      <AnimatePresence>
        {phase === "cards" && (
          <motion.div
            key="cards-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="flex-1 overflow-y-auto px-4 sm:px-6 pt-16 pb-12 w-full max-w-4xl mx-auto no-scrollbar"
          >
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
              className="mb-8"
            >
              <div className="text-[11px] font-ui font-bold text-moss uppercase tracking-widest mb-3">
                Your Matches
              </div>
              <h1 className="text-[clamp(2rem,4vw,3rem)] font-editorial font-light text-ink leading-tight">
                {matchCount === 0 ? (
                  <>
                    We couldn&apos;t find an exact match right now.
                  </>
                ) : (
                  <>
                    We found {matchCount} scholarships
                    <br />
                    aligned with your future.
                  </>
                )}
              </h1>
              <p className="text-[14px] font-ui text-ink-secondary mt-3">
                {matchCount === 0 ? (
                  <>
                    But don&apos;t worry, there are many open scholarships
                    <br />
                    you can explore on your dashboard.
                  </>
                ) : (
                  <>
                    Here are your top matches. Save the ones
                    <br />
                    that excite you.
                  </>
                )}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
              {topMatches.map((scholarship, index) => (
                <motion.div
                  key={scholarship.id}
                  initial={{ opacity: 0, y: 48, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: index * 0.15,
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1] as const,
                  }}
                >
                  <ScholarshipCard scholarship={scholarship} />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="flex flex-col items-center gap-3"
            >
              <button
                onClick={onComplete}
                className="w-full sm:w-auto px-8 py-4 bg-moss text-white rounded-full font-ui font-medium text-[15px] hover:bg-moss-dark transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(95,111,82,0.3)]"
              >
                {matchCount === 0 ? "Go to my dashboard \u2192" : `Explore all ${matchCount} matches \u2192`}
              </button>
              {matchCount > 0 && (
                <p className="text-[12px] font-ui text-ink-tertiary text-center">
                  Or save scholarships individually from the feed.
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

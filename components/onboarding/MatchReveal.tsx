"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScholarshipCard } from "@/components/dashboard/ScholarshipCard";

// Using a simplified type for the MatchReveal mock/types since we are in onboarding
export type ScholarshipWithMatch = {
  id: string;
  title: string;
  provider: string;
  deadline: Date;
  matchScore: number;
  eligibleDegrees: string[];
};

interface MatchRevealProps {
  matchCount: number;
  topMatches: any[]; // Using any to be compatible with whatever the API returns for now
  onComplete: () => void;
}

const useCountUp = (target: number, duration: number = 1200) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      setCount(Math.round(target * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return count;
};

// A wrapper to handle counting up the match score for each card
function AnimatedScholarshipCard({ scholarship, index }: { scholarship: any, index: number }) {
  const rawScore = scholarship.matchScore ?? scholarship.matchPercentage ?? 0.85; 
  const displayScore = useCountUp(rawScore * 100);

  // We override the matchPercentage with our animated displayScore / 100
  const animatedScholarship = {
    ...scholarship,
    matchPercentage: displayScore / 100,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 48, scale: 0.96, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{ delay: index * 0.18, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <ScholarshipCard scholarship={animatedScholarship} />
    </motion.div>
  );
}

export default function MatchReveal({ matchCount, topMatches, onComplete }: MatchRevealProps) {
  const [phase, setPhase] = useState<'searching' | 'revealing' | 'cards' | 'done'>('searching');

  useEffect(() => {
    if (phase === 'searching') {
      const timer = setTimeout(() => {
        setPhase('revealing');
      }, 2400);
      return () => clearTimeout(timer);
    } else if (phase === 'revealing') {
      const timer = setTimeout(() => {
        setPhase('cards');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const overlayBg = phase === 'searching' 
    ? 'rgba(17, 17, 17, 0.94)' 
    : 'rgba(247, 244, 238, 0)'; // Transparent to reveal underlying page

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: overlayBg }}
      animate={{ backgroundColor: overlayBg }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <AnimatePresence>
        {phase === 'searching' && (
          <motion.div
            key="searching-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <h1 className="text-[28px] font-editorial text-white font-light italic">
              Finding your matches...
            </h1>
            <div className="flex items-center gap-2 mt-6">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-[6px] h-[6px] rounded-full bg-white/40"
                  animate={{ scale: [0.6, 1.0, 0.6] }}
                  transition={{ 
                    duration: 1.2, 
                    repeat: Infinity, 
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {(phase === 'cards' || phase === 'done') && (
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pt-24 pb-12 bg-bg max-w-4xl mx-auto w-full no-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <div className="text-[11px] font-ui font-bold text-moss uppercase tracking-widest mb-3">
              Your Matches
            </div>
            <h1 className="text-[clamp(2rem,4vw,3rem)] font-editorial font-light text-ink leading-tight">
              We found {matchCount} scholarships<br />aligned with your future.
            </h1>
            <p className="text-[14px] font-ui text-ink-secondary mt-3">
              Here are your top matches. Save the ones<br />that excite you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {topMatches.map((scholarship, index) => (
              <AnimatedScholarshipCard 
                key={scholarship.id} 
                scholarship={scholarship} 
                index={index} 
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.5 }}
            className="flex flex-col items-center gap-3"
          >
            <button
              onClick={onComplete}
              className="w-full sm:w-auto px-8 py-4 bg-moss text-white rounded-xl font-ui font-medium text-[15px] hover:bg-moss-dark transition-colors"
            >
              Explore all {matchCount} matches &rarr;
            </button>
            <p className="text-[12px] font-ui text-ink-tertiary text-center">
              Or save scholarships individually from the feed.
            </p>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

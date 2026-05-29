"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ReadinessScoreProps {
  score: number; // 0 to 100
}

export function ReadinessScore({ score }: ReadinessScoreProps) {
  const [currentScore, setCurrentScore] = useState(0);
  const prevScoreRef = React.useRef(0);

  useEffect(() => {
    const startScore = prevScoreRef.current;
    if (startScore === score) {
      setCurrentScore(score);
      return;
    }

    // Animate score counting up or down
    const duration = 1500;
    const steps = 60;
    const stepTime = duration / steps;
    const diff = score - startScore;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCurrentScore(Math.round(startScore + (diff * progress)));
      
      if (step >= steps) {
        clearInterval(timer);
        setCurrentScore(score);
        prevScoreRef.current = score;
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Calculate SVG stroke dash array
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  return (
    <div className="bg-surface border border-border rounded-[24px] p-6 flex flex-col items-center justify-center relative overflow-hidden group">
      {/* Background ambient glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full blur-[40px] opacity-20 transition-opacity duration-1000 group-hover:opacity-40"
        style={{ backgroundColor: score >= 80 ? '#10b981' : score >= 50 ? '#3b82f6' : '#f59e0b' }}
      />
      
      <div className="relative w-[120px] h-[120px] flex items-center justify-center">
        {/* Background Track */}
        <svg className="w-full h-full transform -rotate-90 absolute inset-0">
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-border"
          />
          {/* Progress Ring */}
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="60"
            cy="60"
            r={radius}
            stroke="url(#score-gradient)"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeLinecap="round"
            className="drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]"
          />
          <defs>
            <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              {score >= 80 ? (
                <>
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </>
              ) : score >= 50 ? (
                <>
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#2563eb" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#d97706" />
                </>
              )}
            </linearGradient>
          </defs>
        </svg>

        <div className="flex flex-col items-center justify-center relative z-10">
          <span className="font-editorial text-[36px] font-normal text-ink leading-none">
            {currentScore}
          </span>
          <span className="font-ui text-[11px] uppercase tracking-widest text-ink-tertiary mt-1 font-medium">
            Score
          </span>
        </div>
      </div>

      <div className="mt-5 text-center z-10">
        <h3 className="font-ui text-[14px] font-medium text-ink mb-1">Scholarship Readiness</h3>
        <p className="font-ui text-[12px] text-ink-secondary leading-relaxed max-w-[200px]">
          {score >= 80 
            ? "You are highly competitive for top global opportunities." 
            : score >= 50 
              ? "Good foundation. Adding more details will unlock more matches." 
              : "Complete your profile to unlock accurate matching."}
        </p>
      </div>
    </div>
  );
}

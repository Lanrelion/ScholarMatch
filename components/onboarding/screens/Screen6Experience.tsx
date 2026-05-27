"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OnboardingState } from "@/hooks/useOnboardingState";

interface Props {
  state: OnboardingState;
  updateField: <K extends keyof OnboardingState>(field: K, value: OnboardingState[K]) => void;
}

type DegreeValue = "UNDERGRADUATE" | "MASTERS" | "PHD";

const DEGREE_OPTIONS: {
  value: DegreeValue;
  name: string;
  description: string;
  badge?: string;
}[] = [
  {
    value: "UNDERGRADUATE",
    name: "Bachelor's degree",
    description: "BSc, BA, BEng, BEd — currently studying or applying",
  },
  {
    value: "MASTERS",
    name: "Master's degree",
    description: "MSc, MA, MBA, MEng — the most scholarship opportunities",
    badge: "Most opportunities",
  },
  {
    value: "PHD",
    name: "Doctoral degree",
    description: "PhD, DPhil — research-focused funding available",
  },
];

const MILESTONE_LABELS = [
  { value: 0, label: "Fresh" },
  { value: 2, label: "Some" },
  { value: 5, label: "Growing" },
  { value: 10, label: "Seasoned" },
] as const;

function getExperienceLabel(years: number): string {
  if (years === 0) return "No experience yet";
  if (years === 1) return "1 year";
  if (years >= 10) return "10+ years";
  return `${years} years`;
}

export default function Screen6Experience({ state, updateField }: Props) {
  const [showSlider, setShowSlider] = useState(state.currentDegree !== "");
  const sliderRef = useRef<HTMLInputElement>(null);

  // Delay slider reveal after degree is selected
  useEffect(() => {
    if (state.currentDegree !== "") {
      const timer = setTimeout(() => setShowSlider(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowSlider(false);
    }
  }, [state.currentDegree]);

  const handleDegreeSelect = useCallback(
    (value: DegreeValue) => {
      updateField("currentDegree", value);
    },
    [updateField]
  );

  const fillPercent = (state.workExperienceYears / 10) * 100;

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div>
        <h1
          className="font-editorial font-light text-ink leading-tight"
          style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}
        >
          Where are you in your academic journey?
        </h1>
        <p className="text-ink-secondary text-[16px] font-ui font-normal mt-3">
          This determines which scholarship types you qualify for.
        </p>
      </div>

      {/* Degree cards */}
      <div className="flex flex-col gap-3">
        {DEGREE_OPTIONS.map((opt) => {
          const isSelected = state.currentDegree === opt.value;
          return (
            <motion.button
              key={opt.value}
              onClick={() => handleDegreeSelect(opt.value)}
              animate={
                isSelected ? { scale: 1.01 } : { scale: 1 }
              }
              transition={
                isSelected
                  ? { duration: 0.25, ease: "easeOut" }
                  : { duration: 0.2 }
              }
              whileHover={{ y: -1 }}
              className={`
                relative w-full text-left px-6 py-5 rounded-xl border
                transition-colors duration-200 cursor-pointer
                flex items-center justify-between gap-4
                ${
                  isSelected
                    ? "border-moss bg-moss-light"
                    : "bg-surface border-border hover:border-border-strong hover:bg-surface-hover"
                }
              `}
            >
              {/* Badge */}
              {opt.badge && (
                <span
                  className="absolute -top-2.5 right-4 bg-gold-light text-clay font-ui text-[11px] font-medium px-3 py-0.5 rounded-full"
                >
                  {opt.badge}
                </span>
              )}

              {/* Left: text */}
              <div className="flex flex-col gap-0.5 min-w-0">
                <span
                  className={`font-ui text-[16px] font-medium ${
                    isSelected ? "text-moss" : "text-ink"
                  }`}
                >
                  {opt.name}
                </span>
                <span className="font-ui text-[13px] text-ink-secondary">
                  {opt.description}
                </span>
              </div>

              {/* Right: radio circle */}
              <div
                className={`
                  w-5 h-5 rounded-full border-2 shrink-0
                  flex items-center justify-center transition-colors
                  ${
                    isSelected
                      ? "border-moss bg-moss"
                      : "border-border"
                  }
                `}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Experience slider */}
      <AnimatePresence>
        {showSlider && (
          <motion.div
            key="experience-slider"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex flex-col gap-4"
          >
            <label className="font-ui text-[14px] text-ink-secondary">
              Years of work or research experience (optional)
            </label>

            {/* Current value label */}
            <p className="font-ui text-[14px] font-medium text-ink">
              {getExperienceLabel(state.workExperienceYears)}
            </p>

            {/* Slider */}
            <div className="relative pt-1 pb-1">
              <input
                ref={sliderRef}
                type="range"
                min={0}
                max={10}
                step={1}
                value={state.workExperienceYears}
                onChange={(e) =>
                  updateField("workExperienceYears", Number(e.target.value))
                }
                className="experience-slider w-full"
                style={
                  {
                    "--fill-percent": `${fillPercent}%`,
                  } as React.CSSProperties
                }
              />
            </div>

            {/* Milestone labels */}
            <div className="flex justify-between">
              {MILESTONE_LABELS.map((m) => (
                <span
                  key={m.value}
                  className="font-ui text-[11px] text-ink-secondary/60"
                  style={{
                    width:
                      m.value === 0
                        ? "auto"
                        : m.value === 10
                        ? "auto"
                        : undefined,
                  }}
                >
                  {m.label}
                </span>
              ))}
            </div>

            {/* Note */}
            <p className="font-ui text-[12px] text-ink-secondary/60 mt-1">
              Some scholarships require minimum experience. We&apos;ll always
              show you why you qualify or don&apos;t.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scoped slider styles */}
      <style jsx>{`
        .experience-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(
            to right,
            var(--color-moss) 0%,
            var(--color-moss) var(--fill-percent),
            var(--color-border) var(--fill-percent),
            var(--color-border) 100%
          );
          outline: none;
          cursor: pointer;
        }
        .experience-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--color-moss);
          border: 3px solid white;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .experience-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .experience-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--color-moss);
          border: 3px solid white;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
          cursor: pointer;
        }
        .experience-slider::-moz-range-track {
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(
            to right,
            var(--color-moss) 0%,
            var(--color-moss) var(--fill-percent),
            var(--color-border) var(--fill-percent),
            var(--color-border) 100%
          );
        }
      `}</style>
    </div>
  );
}

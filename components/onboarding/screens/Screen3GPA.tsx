"use client";

import { useMemo } from "react";
import { OnboardingState } from "@/hooks/useOnboardingState";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "@phosphor-icons/react";

interface Props {
  state: OnboardingState;
  updateField: <K extends keyof OnboardingState>(field: K, value: OnboardingState[K]) => void;
}

const SCALES = [
  { value: 4 as const, label: "4.0 scale" },
  { value: 5 as const, label: "5.0 scale" },
  { value: 7 as const, label: "7.0 scale" },
  { value: 100 as const, label: "Percentage" },
];

function getSliderConfig(scale: 4 | 5 | 7 | 100) {
  switch (scale) {
    case 4:
      return { min: 0, max: 4, step: 0.1 };
    case 5:
      return { min: 0, max: 5, step: 0.1 };
    case 7:
      return { min: 0, max: 7, step: 0.1 };
    case 100:
      return { min: 0, max: 100, step: 1 };
  }
}

function getConfidence(value: number | null, scale: 4 | 5 | 7 | 100) {
  if (value === null) return null;
  const ratio = value / scale;
  if (ratio >= 0.9) {
    return {
      color: "text-moss",
      text: "Excellent — opens most scholarship opportunities",
      showStar: true,
    };
  }
  if (ratio >= 0.7) {
    return {
      color: "text-clay",
      text: "Good — you qualify for the majority of scholarships",
      showStar: false,
    };
  }
  return {
    color: "text-ink-secondary",
    text: "Don't worry — many scholarships have no minimum GPA",
    showStar: false,
  };
}

export default function Screen3GPA({ state, updateField }: Props) {
  const { gpa, gpaScale } = state;
  const config = getSliderConfig(gpaScale);
  const currentValue = gpa ?? config.max * 0.75;
  const confidence = getConfidence(gpa, gpaScale);

  const displayValue = useMemo(() => {
    if (gpa === null) return "—";
    if (gpaScale === 100) return `${Math.round(gpa)}%`;
    return gpa.toFixed(1);
  }, [gpa, gpaScale]);

  const fillPercent = ((currentValue - config.min) / (config.max - config.min)) * 100;

  const handleScaleChange = (newScale: 4 | 5 | 7 | 100) => {
    updateField("gpaScale", newScale);
    // Reset GPA when scale changes to avoid out-of-range values
    if (gpa !== null) {
      const ratio = gpa / gpaScale;
      const converted = Math.round(ratio * newScale * 10) / 10;
      const clamped = Math.min(converted, newScale);
      updateField("gpa", newScale === 100 ? Math.round(clamped) : parseFloat(clamped.toFixed(1)));
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseFloat(e.target.value);
    const val = gpaScale === 100 ? Math.round(raw) : parseFloat(raw.toFixed(1));
    updateField("gpa", val);
  };

  return (
    <motion.div
      className="flex flex-col gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Question */}
      <div>
        <h1
          className="font-editorial text-ink font-light leading-tight mb-3"
          style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}
        >
          How are you performing academically?
        </h1>
        <p className="font-ui text-ink-secondary text-base font-normal">
          We use this to filter out scholarships you can&apos;t access. Don&apos;t worry — most
          scholarships have no GPA requirement.
        </p>
      </div>

      {/* Scale Selector */}
      <div className="flex flex-wrap gap-2">
        {SCALES.map((s) => (
          <button
            key={s.value}
            onClick={() => handleScaleChange(s.value)}
            className={`
              px-4 py-2 rounded-full text-sm font-ui transition-all duration-200
              ${
                gpaScale === s.value
                  ? "bg-moss text-white"
                  : "border border-border text-ink-secondary hover:border-border-strong hover:text-ink"
              }
            `}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Value Display */}
      <motion.div
        className="text-center"
        key={displayValue}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <span
          className="font-editorial text-ink font-light"
          style={{ fontSize: "32px" }}
        >
          {displayValue}
        </span>
      </motion.div>

      {/* Slider */}
      <div className="relative w-full px-1">
        <div className="relative h-6 flex items-center">
          {/* Track background */}
          <div className="absolute inset-x-0 h-1 rounded-full bg-border" />
          {/* Track fill */}
          <div
            className="absolute left-0 h-1 rounded-full bg-moss transition-[width] duration-75"
            style={{ width: `${fillPercent}%` }}
          />
          {/* Range input */}
          <input
            type="range"
            min={config.min}
            max={config.max}
            step={config.step}
            value={currentValue}
            onChange={handleSliderChange}
            className="gpa-slider absolute inset-0 w-full appearance-none bg-transparent cursor-pointer z-10"
            style={
              {
                "--fill-percent": `${fillPercent}%`,
              } as React.CSSProperties
            }
          />
        </div>
        {/* Min/Max labels */}
        <div className="flex justify-between mt-2 text-xs font-ui text-ink-secondary">
          <span>{config.min}</span>
          <span>{gpaScale === 100 ? "100%" : config.max.toFixed(1)}</span>
        </div>
      </div>

      {/* Confidence Indicator */}
      <AnimatePresence mode="wait">
        {confidence && (
          <motion.div
            key={confidence.text}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`flex items-center gap-2 ${confidence.color}`}
          >
            {confidence.showStar && <Star size={18} weight="fill" />}
            <span className="text-sm font-ui">{confidence.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom slider styles */}
      <style jsx>{`
        .gpa-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          margin-top: -10px;
          border-radius: 50%;
          background: white;
          border: 2px solid var(--color-moss);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .gpa-slider::-webkit-slider-thumb:active {
          transform: scale(1.2);
        }
        .gpa-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          border: 2px solid var(--color-moss);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .gpa-slider::-moz-range-thumb:active {
          transform: scale(1.2);
        }
        .gpa-slider::-webkit-slider-runnable-track {
          height: 4px;
          background: transparent;
        }
        .gpa-slider::-moz-range-track {
          height: 4px;
          background: transparent;
          border: none;
        }
      `}</style>
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { OnboardingState } from "@/hooks/useOnboardingState";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, GlobeHemisphereWest } from "@phosphor-icons/react";

interface Props {
  state: OnboardingState;
  updateField: <K extends keyof OnboardingState>(field: K, value: OnboardingState[K]) => void;
}

interface Destination {
  code: string;
  name: string;
  scholarships: number;
  gradient: string;
}

const FEATURED_DESTINATIONS: Destination[] = [
  {
    code: "GB",
    name: "United Kingdom",
    scholarships: 248,
    gradient: "linear-gradient(135deg, #1a3a4a 0%, #2d5a6e 100%)",
  },
  {
    code: "DE",
    name: "Germany",
    scholarships: 186,
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #2d2d4a 100%)",
  },
  {
    code: "SE",
    name: "Sweden",
    scholarships: 94,
    gradient: "linear-gradient(135deg, #1a2a4a 0%, #005f9e 100%)",
  },
  {
    code: "CA",
    name: "Canada",
    scholarships: 172,
    gradient: "linear-gradient(135deg, #8b1a1a 0%, #cc0000 100%)",
  },
];

const MORE_DESTINATIONS: Destination[] = [
  {
    code: "NL",
    name: "Netherlands",
    scholarships: 78,
    gradient: "linear-gradient(135deg, #1a3a6a 0%, #ff6600 60%)",
  },
  {
    code: "US",
    name: "United States",
    scholarships: 312,
    gradient: "linear-gradient(135deg, #1a2a5a 0%, #bf0a30 100%)",
  },
  {
    code: "FR",
    name: "France",
    scholarships: 105,
    gradient: "linear-gradient(135deg, #002395 0%, #ED2939 100%)",
  },
  {
    code: "AU",
    name: "Australia",
    scholarships: 134,
    gradient: "linear-gradient(135deg, #00843D 0%, #FFCD00 100%)",
  },
];

const ANYWHERE_CODE = "ANY";

export default function Screen4Destination({ state, updateField }: Props) {
  const [showMore, setShowMore] = useState(false);
  const { destinations } = state;

  const isAnywhere = destinations.includes(ANYWHERE_CODE);

  const toggleDestination = (code: string) => {
    if (code === ANYWHERE_CODE) {
      // Toggle anywhere — deselects all countries
      if (isAnywhere) {
        updateField("destinations", []);
      } else {
        updateField("destinations", [ANYWHERE_CODE]);
      }
      return;
    }

    // Selecting a country — remove 'anywhere' if set
    let next: string[];
    if (destinations.includes(code)) {
      next = destinations.filter((d) => d !== code);
    } else {
      next = [...destinations.filter((d) => d !== ANYWHERE_CODE), code];
    }
    updateField("destinations", next);
  };

  const isSelected = (code: string) => destinations.includes(code);

  const selectionCount = destinations.length;

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
          Where do you imagine yourself?
        </h1>
        <p className="font-ui text-ink-secondary text-base font-normal">
          Choose the countries you&apos;d love to study in. Or anywhere — we&apos;ll find funding
          for each.
        </p>
      </div>

      {/* Featured Destinations — 2x2 grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {FEATURED_DESTINATIONS.map((dest) => (
          <DestinationCard
            key={dest.code}
            destination={dest}
            selected={isSelected(dest.code)}
            onToggle={() => toggleDestination(dest.code)}
            height={160}
          />
        ))}
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setShowMore(!showMore)}
        className="text-sm font-ui text-moss hover:text-moss-dark transition-colors self-start"
      >
        {showMore ? "Show fewer ↑" : "Or explore more →"}
      </button>

      {/* More Destinations */}
      <AnimatePresence initial={false}>
        {showMore && (
          <motion.div
            key="more-destinations"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {MORE_DESTINATIONS.map((dest) => (
                <DestinationCard
                  key={dest.code}
                  destination={dest}
                  selected={isSelected(dest.code)}
                  onToggle={() => toggleDestination(dest.code)}
                  height={140}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Anywhere Option */}
      <motion.button
        onClick={() => toggleDestination(ANYWHERE_CODE)}
        className={`
          relative w-full rounded-xl p-5 flex items-center gap-4 cursor-pointer
          transition-all duration-300
          ${
            isAnywhere
              ? "bg-moss-light border-2 border-moss"
              : "bg-surface border-2 border-dashed border-border hover:border-border-strong"
          }
        `}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.99 }}
      >
        <div
          className={`
            w-10 h-10 rounded-full flex items-center justify-center shrink-0
            ${isAnywhere ? "bg-moss text-white" : "bg-surface-hover text-ink-secondary"}
          `}
        >
          <GlobeHemisphereWest size={22} weight={isAnywhere ? "fill" : "regular"} />
        </div>
        <div className="text-left">
          <span className="font-editorial text-lg text-ink">Open to anywhere</span>
          <p className="text-xs font-ui text-ink-secondary mt-0.5">
            We&apos;ll search scholarships across all countries
          </p>
        </div>
        {isAnywhere && (
          <motion.div
            className="ml-auto"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            <CheckCircle size={24} weight="fill" className="text-moss" />
          </motion.div>
        )}
      </motion.button>

      {/* Selection Summary */}
      <AnimatePresence>
        {selectionCount > 0 && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="text-sm font-ui text-ink-secondary"
          >
            {isAnywhere
              ? "Searching all countries"
              : `${selectionCount} ${selectionCount === 1 ? "country" : "countries"} selected`}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Destination Card ─────────────────────────────────────────── */

function DestinationCard({
  destination,
  selected,
  onToggle,
  height,
}: {
  destination: Destination;
  selected: boolean;
  onToggle: () => void;
  height: number;
}) {
  return (
    <motion.button
      onClick={onToggle}
      className="relative overflow-hidden rounded-xl cursor-pointer text-left w-full group"
      style={{
        height,
        background: destination.gradient,
        boxShadow: selected
          ? "0 0 0 2px var(--color-moss), 0 0 0 4px rgba(95,111,82,0.3)"
          : "none",
      }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      animate={selected ? { scale: 1 } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Dark overlay for unselected state */}
      <motion.div
        className="absolute inset-0 bg-black pointer-events-none"
        initial={false}
        animate={{ opacity: selected ? 0 : 0.2 }}
        transition={{ duration: 0.3 }}
      />

      {/* Hover lift — overlay fade on hover */}
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-0 pointer-events-none transition-opacity duration-200" />

      {/* Check icon (top-right) */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-moss flex items-center justify-center z-10"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            <CheckCircle size={18} weight="fill" className="text-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content (bottom) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <h3
          className="text-white font-editorial font-normal"
          style={{ fontSize: "20px" }}
        >
          {destination.name}
        </h3>
        <p
          className="font-ui"
          style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}
        >
          {destination.scholarships} scholarships
        </p>
      </div>
    </motion.button>
  );
}

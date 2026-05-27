"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import type { OnboardingState } from "@/hooks/useOnboardingState";

interface Props {
  state: OnboardingState;
  updateField: <K extends keyof OnboardingState>(
    field: K,
    value: OnboardingState[K]
  ) => void;
}

interface Country {
  name: string;
  code: string;
  flag: string;
}

const TOP_COUNTRIES: Country[] = [
  { name: "Nigeria", code: "NG", flag: "🇳🇬" },
  { name: "Kenya", code: "KE", flag: "🇰🇪" },
  { name: "Ghana", code: "GH", flag: "🇬🇭" },
  { name: "Ethiopia", code: "ET", flag: "🇪🇹" },
  { name: "South Africa", code: "ZA", flag: "🇿🇦" },
  { name: "Tanzania", code: "TZ", flag: "🇹🇿" },
  { name: "Uganda", code: "UG", flag: "🇺🇬" },
  { name: "Zimbabwe", code: "ZW", flag: "🇿🇼" },
];

const ALL_AFRICAN_COUNTRIES: Country[] = [
  { name: "Algeria", code: "DZ", flag: "🇩🇿" },
  { name: "Angola", code: "AO", flag: "🇦🇴" },
  { name: "Benin", code: "BJ", flag: "🇧🇯" },
  { name: "Botswana", code: "BW", flag: "🇧🇼" },
  { name: "Burkina Faso", code: "BF", flag: "🇧🇫" },
  { name: "Burundi", code: "BI", flag: "🇧🇮" },
  { name: "Cabo Verde", code: "CV", flag: "🇨🇻" },
  { name: "Cameroon", code: "CM", flag: "🇨🇲" },
  { name: "Central African Republic", code: "CF", flag: "🇨🇫" },
  { name: "Chad", code: "TD", flag: "🇹🇩" },
  { name: "Comoros", code: "KM", flag: "🇰🇲" },
  { name: "Congo", code: "CG", flag: "🇨🇬" },
  { name: "Côte d'Ivoire", code: "CI", flag: "🇨🇮" },
  { name: "Democratic Republic of the Congo", code: "CD", flag: "🇨🇩" },
  { name: "Djibouti", code: "DJ", flag: "🇩🇯" },
  { name: "Egypt", code: "EG", flag: "🇪🇬" },
  { name: "Equatorial Guinea", code: "GQ", flag: "🇬🇶" },
  { name: "Eritrea", code: "ER", flag: "🇪🇷" },
  { name: "Eswatini", code: "SZ", flag: "🇸🇿" },
  { name: "Ethiopia", code: "ET", flag: "🇪🇹" },
  { name: "Gabon", code: "GA", flag: "🇬🇦" },
  { name: "Gambia", code: "GM", flag: "🇬🇲" },
  { name: "Ghana", code: "GH", flag: "🇬🇭" },
  { name: "Guinea", code: "GN", flag: "🇬🇳" },
  { name: "Guinea-Bissau", code: "GW", flag: "🇬🇼" },
  { name: "Kenya", code: "KE", flag: "🇰🇪" },
  { name: "Lesotho", code: "LS", flag: "🇱🇸" },
  { name: "Liberia", code: "LR", flag: "🇱🇷" },
  { name: "Libya", code: "LY", flag: "🇱🇾" },
  { name: "Madagascar", code: "MG", flag: "🇲🇬" },
  { name: "Malawi", code: "MW", flag: "🇲🇼" },
  { name: "Mali", code: "ML", flag: "🇲🇱" },
  { name: "Mauritania", code: "MR", flag: "🇲🇷" },
  { name: "Mauritius", code: "MU", flag: "🇲🇺" },
  { name: "Morocco", code: "MA", flag: "🇲🇦" },
  { name: "Mozambique", code: "MZ", flag: "🇲🇿" },
  { name: "Namibia", code: "NA", flag: "🇳🇦" },
  { name: "Niger", code: "NE", flag: "🇳🇪" },
  { name: "Nigeria", code: "NG", flag: "🇳🇬" },
  { name: "Rwanda", code: "RW", flag: "🇷🇼" },
  { name: "São Tomé and Príncipe", code: "ST", flag: "🇸🇹" },
  { name: "Senegal", code: "SN", flag: "🇸🇳" },
  { name: "Seychelles", code: "SC", flag: "🇸🇨" },
  { name: "Sierra Leone", code: "SL", flag: "🇸🇱" },
  { name: "Somalia", code: "SO", flag: "🇸🇴" },
  { name: "South Africa", code: "ZA", flag: "🇿🇦" },
  { name: "South Sudan", code: "SS", flag: "🇸🇸" },
  { name: "Sudan", code: "SD", flag: "🇸🇩" },
  { name: "Tanzania", code: "TZ", flag: "🇹🇿" },
  { name: "Togo", code: "TG", flag: "🇹🇬" },
  { name: "Tunisia", code: "TN", flag: "🇹🇳" },
  { name: "Uganda", code: "UG", flag: "🇺🇬" },
  { name: "Zambia", code: "ZM", flag: "🇿🇲" },
  { name: "Zimbabwe", code: "ZW", flag: "🇿🇼" },
];

/* Scholarship count by country — mock data for the counting animation */
const SCHOLARSHIP_COUNTS: Record<string, number> = {
  NG: 247, KE: 189, GH: 156, ET: 132, ZA: 214, TZ: 98, UG: 112, ZW: 87,
  DZ: 64, AO: 42, BJ: 38, BW: 55, BF: 29, BI: 24, CV: 18, CM: 76,
  CF: 15, TD: 22, KM: 12, CG: 28, CI: 68, CD: 35, DJ: 14, EG: 142,
  GQ: 11, ER: 16, SZ: 19, GA: 23, GM: 21, GN: 31, GW: 10, LS: 17,
  LR: 26, LY: 33, MG: 44, MW: 39, ML: 27, MR: 20, MU: 48, MA: 95,
  MZ: 41, NA: 36, NE: 25, RW: 62, ST: 8, SN: 53, SC: 15, SL: 30,
  SO: 19, SS: 13, SD: 37, TG: 22, TN: 71, ZM: 58,
};

function getScholarshipCount(code: string): number {
  return SCHOLARSHIP_COUNTS[code] ?? 50;
}

/* Highlight matching characters */
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query) return <span>{text}</span>;
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const startIdx = lowerText.indexOf(lowerQuery);

  if (startIdx === -1) return <span>{text}</span>;

  const before = text.slice(0, startIdx);
  const match = text.slice(startIdx, startIdx + query.length);
  const after = text.slice(startIdx + query.length);

  return (
    <span>
      {before}
      <span className="font-semibold text-ink">{match}</span>
      {after}
    </span>
  );
}

/* Counter that animates from 0 to target */
function AnimatedCounter({ target }: { target: number }) {
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v));
  const [value, setValue] = useState(0);

  useEffect(() => {
    spring.set(target);
    const unsubscribe = display.on("change", (v) => setValue(v));
    return unsubscribe;
  }, [target, spring, display]);

  return <span>{value}</span>;
}

export default function Screen2Nationality({ state, updateField }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isSelected = state.nationality.length > 0;

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return ALL_AFRICAN_COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery]);

  // Show dropdown when there are results
  useEffect(() => {
    setShowDropdown(filteredCountries.length > 0 && isFocused);
  }, [filteredCountries, isFocused]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function selectCountry(country: Country) {
    updateField("nationality", country.code);
    updateField("nationalityName", country.name);
    setSearchQuery("");
    setShowDropdown(false);
  }

  function clearSelection() {
    updateField("nationality", "");
    updateField("nationalityName", "");
    setSearchQuery("");
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  const selectedCountry = ALL_AFRICAN_COUNTRIES.find(
    (c) => c.code === state.nationality
  );

  return (
    <div className="flex flex-col gap-10">
      {/* Question */}
      <div>
        <h1
          className="font-editorial font-light text-ink leading-tight"
          style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}
        >
          Where are you from?
        </h1>
        <p className="font-ui text-[16px] font-normal text-ink-secondary mt-3">
          Your nationality determines which scholarships you can access. Be
          specific — it matters.
        </p>
      </div>

      {/* Quick-Select Countries */}
      <div className="flex flex-wrap gap-3">
          {ALL_AFRICAN_COUNTRIES.map((country) => {
            const isActive = state.nationality === country.code;
            return (
              <motion.button
                key={country.code}
                type="button"
                onClick={() =>
                  isActive ? clearSelection() : selectCountry(country)
                }
                whileHover={{
                  y: -1,
                  transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
                }}
                whileTap={{ scale: 0.97 }}
                animate={
                  isActive
                    ? { scale: 1.04 }
                    : { scale: 1 }
                }
                transition={
                  isActive
                    ? { duration: 0.3, ease: "easeOut" }
                    : { duration: 0.2 }
                }
                className={`
                  flex items-center gap-2 rounded-lg cursor-pointer select-none
                  transition-colors duration-200
                  ${
                    isActive
                      ? "bg-moss-light border-moss text-moss border"
                      : "bg-surface border border-border hover:border-border-strong"
                  }
                `}
                style={{ padding: "8px 12px" }}
              >
                <span className="font-ui font-semibold text-xs tracking-wider opacity-60 uppercase">{country.code}</span>
                <span className="font-ui text-[13px] font-normal">
                  {country.name}
                </span>
              </motion.button>
            );
          })}
      </div>

      {/* Selected State or Search */}
      <AnimatePresence mode="wait">
        {isSelected && selectedCountry ? (
          <motion.div
            key="selected"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4"
          >
            {/* Selected Card */}
            <motion.div
              className="bg-moss-light border border-moss rounded-xl flex items-center gap-4 cursor-pointer"
              style={{ padding: "16px 20px" }}
              onClick={clearSelection}
              whileHover={{ scale: 1.005 }}
              transition={{ duration: 0.15 }}
            >
              <span className="text-[28px] font-ui font-bold opacity-30 leading-none">
                {selectedCountry.code}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-editorial text-[24px] text-ink leading-tight">
                  {selectedCountry.name}
                </p>
                <p className="font-ui text-[13px] text-moss mt-0.5">
                  Scholarship access unlocked
                </p>
              </div>
              {/* Close / change */}
              <span className="font-ui text-xs text-ink-secondary opacity-60">
                Change
              </span>
            </motion.div>

            {/* Scholarship count message */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="font-ui text-[15px] text-ink-secondary"
            >
              We have{" "}
              <span className="font-semibold text-moss">
                <AnimatedCounter
                  target={getScholarshipCount(selectedCountry.code)}
                />
              </span>{" "}
              scholarships available for {selectedCountry.name} students.
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="search"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Search Input */}
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  // Delay to allow dropdown click
                  setTimeout(() => setIsFocused(false), 200);
                }}
                placeholder="Search your country..."
                className="w-full bg-transparent border-0 border-b-2 border-border rounded-none
                           font-ui text-[20px] text-ink placeholder:text-ink-secondary/50
                           py-3 px-0 outline-none focus:ring-0
                           transition-colors duration-200"
                autoComplete="off"
              />
              {/* Animated bottom line */}
              <motion.div
                className="absolute bottom-0 left-0 h-[2px] bg-moss"
                initial={{ width: "0%" }}
                animate={{ width: isFocused ? "100%" : "0%" }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            {/* Dropdown Results */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  ref={dropdownRef}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute top-full left-0 right-0 mt-2 z-50
                             bg-surface border border-border rounded-lg shadow-lg
                             overflow-hidden"
                >
                  {filteredCountries.map((country, i) => (
                    <motion.button
                      key={country.code}
                      type="button"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: i * 0.04,
                        duration: 0.2,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      onClick={() => selectCountry(country)}
                      className="w-full flex items-center gap-3 px-4 py-3
                                 hover:bg-surface-hover transition-colors duration-150
                                 cursor-pointer text-left"
                    >
                      <span className="font-ui font-semibold text-xs tracking-wider opacity-60 uppercase w-8">{country.code}</span>
                      <span className="font-ui text-[15px] text-ink-secondary">
                        <HighlightMatch
                          text={country.name}
                          query={searchQuery}
                        />
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

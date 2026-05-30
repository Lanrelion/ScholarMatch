"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OnboardingState } from "@/hooks/useOnboardingState";

interface Props {
  state: OnboardingState;
  updateField: <K extends keyof OnboardingState>(field: K, value: OnboardingState[K]) => void;
}

export const FIELD_CATEGORIES: { label: string; fields: string[] }[] = [
  {
    label: "Technology & Engineering",
    fields: [
      "Computer Science", "Software Engineering", "Data Science",
      "AI & Machine Learning", "Electrical Engineering",
      "Mechanical Engineering", "Civil Engineering", "Robotics",
    ],
  },
  {
    label: "Medicine & Health",
    fields: [
      "Medicine", "Nursing", "Public Health", "Pharmacy",
      "Biomedical Science", "Dentistry", "Physiotherapy",
    ],
  },
  {
    label: "Business & Economics",
    fields: [
      "Business Administration", "Economics", "Finance",
      "Entrepreneurship", "Marketing", "Accounting", "MBA",
    ],
  },
  {
    label: "Sciences",
    fields: [
      "Biology", "Chemistry", "Physics", "Environmental Science",
      "Microbiology", "Biochemistry", "Marine Science",
    ],
  },
  {
    label: "Social Sciences & Arts",
    fields: [
      "Law", "Political Science", "International Relations",
      "Psychology", "Sociology", "Education", "Journalism",
      "Architecture", "Fine Arts", "Communication",
    ],
  },
  {
    label: "Agriculture & Environment",
    fields: [
      "Agriculture", "Food Science", "Forestry",
      "Climate Science", "Urban Planning",
    ],
  },
];

export const ALL_FIELDS = FIELD_CATEGORIES.flatMap((c) => c.fields);

export default function Screen5Field({ state, updateField }: Props) {
  const [search, setSearch] = useState("");

  const selected = state.fields;

  const toggle = (field: string) => {
    const next = selected.includes(field)
      ? selected.filter((f) => f !== field)
      : [...selected, field];
    updateField("fields", next);
  };

  const addCustomField = (text: string) => {
    const trimmed = text.trim();
    if (trimmed && !selected.includes(trimmed)) {
      updateField("fields", [...selected, trimmed]);
    }
    setSearch("");
  };

  const normalizedSearch = search.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    if (!normalizedSearch) return FIELD_CATEGORIES;
    return FIELD_CATEGORIES.map((cat) => ({
      ...cat,
      fields: cat.fields.filter((f) =>
        f.toLowerCase().includes(normalizedSearch)
      ),
    })).filter((cat) => cat.fields.length > 0);
  }, [normalizedSearch]);

  const hasChipMatch = useMemo(() => {
    if (!normalizedSearch) return true;
    return ALL_FIELDS.some((f) =>
      f.toLowerCase().includes(normalizedSearch)
    );
  }, [normalizedSearch]);

  // Selection feedback text
  const feedbackText = useMemo(() => {
    if (selected.length === 0) return null;
    const shown = selected.slice(0, 3);
    const remaining = selected.length - 3;
    const joined =
      shown.length === 1
        ? shown[0]
        : shown.length === 2
        ? `${shown[0]} and ${shown[1]}`
        : `${shown[0]}, ${shown[1]}, and ${shown[2]}`;
    const suffix = remaining > 0 ? ` + ${remaining} more` : "";
    return `You're focused on ${joined}${suffix}`;
  }, [selected]);

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div>
        <h1
          className="font-editorial font-light text-ink leading-tight"
          style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}
        >
          What are you studying — or planning to?
        </h1>
        <p className="text-ink-secondary text-[16px] font-ui font-normal mt-3">
          Pick everything that applies. We&apos;ll find scholarships across all
          your interests.
        </p>
      </div>

      {/* Search input */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Or search a specific field..."
          className="w-full bg-transparent border-b border-border focus:border-moss
                     text-ink font-ui text-[14px] pb-2 outline-none
                     placeholder:text-ink-secondary/60 transition-colors"
        />
      </div>

      {/* Chip grid by category */}
      <div className="flex flex-col gap-6">
        {filteredCategories.map((category) => (
          <div key={category.label}>
            <span
              className="font-ui text-[11px] uppercase tracking-[0.08em] text-ink-secondary/70 mb-3 block"
            >
              {category.label}
            </span>
            <div className="flex flex-wrap gap-2.5">
              {category.fields.map((field) => {
                const isSelected = selected.includes(field);
                return (
                  <motion.button
                    key={field}
                    onClick={() => toggle(field)}
                    animate={
                      isSelected
                        ? { scale: 1.02 }
                        : { scale: 1 }
                    }
                    whileHover={{ y: -1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className={`
                      px-[18px] py-[10px] rounded-full font-ui text-[14px]
                      border transition-colors duration-200 cursor-pointer
                      ${
                        isSelected
                          ? "bg-moss border-moss text-white font-medium"
                          : "bg-surface border-border text-ink-secondary hover:border-border-strong hover:text-ink hover:bg-surface-hover"
                      }
                    `}
                  >
                    {isSelected ? `✓ ${field}` : field}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Free-text add option */}
        <AnimatePresence>
          {normalizedSearch && !hasChipMatch && (
            <motion.button
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2 }}
              onClick={() => addCustomField(search)}
              className="text-left font-ui text-[14px] text-moss hover:text-moss-dark
                         transition-colors cursor-pointer py-2"
            >
              Add &lsquo;{search.trim()}&rsquo; as your field
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Selection feedback */}
      <AnimatePresence>
        {feedbackText && (
          <motion.p
            key="feedback"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.25 }}
            className="font-ui text-[14px] text-ink-secondary italic"
          >
            {feedbackText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

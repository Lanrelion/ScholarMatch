"use client";

import { OnboardingState } from "@/hooks/useOnboardingState";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

interface Props {
  state?: OnboardingState;
  updateField?: (field: any, value: any) => void;
  value?: string;
  onChange?: (val: string) => void;
  hideHeader?: boolean;
}

const COMMON_FIELDS = [
  "Microbiology", "Computer Science", "Engineering", "Medicine",
  "Business", "Law", "Education", "Agriculture", "Public Health",
  "Economics", "Environmental Science", "Architecture"
];

export default function StepFieldOfStudy({ state, updateField, value, onChange, hideHeader }: Props) {
  const currentVal = value ?? state?.fieldOfStudy ?? "";
  const handleUpdate = (val: string) => {
    if (onChange) onChange(val);
    else if (updateField) updateField("fieldOfStudy", val);
  };
  return (
    <div className="flex flex-col gap-10">
      {!hideHeader && (
        <div>
          <h1 className="text-4xl font-editorial text-ink mb-3 leading-tight">What will you be studying?</h1>
          <p className="text-ink-secondary text-base font-ui">Enter your field or choose from common options</p>
        </div>
      )}

      <Input
        label="Field of Study"
        type="text"
        value={currentVal}
        onChange={(e) => handleUpdate(e.target.value)}
      />

      <div className="flex flex-wrap gap-3">
        {COMMON_FIELDS.map((field) => {
          const isSelected = currentVal.toLowerCase() === field.toLowerCase();
          return (
            <button
              key={field}
              onClick={() => handleUpdate(field)}
              className={cn(
                "px-5 py-2.5 rounded-pill text-sm border transition-all duration-200 font-ui",
                isSelected
                  ? "bg-moss text-white border-moss shadow-sm scale-[1.02]"
                  : "border-border text-ink hover:border-border-strong hover:bg-surface-hover bg-surface"
              )}
            >
              {field}
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { OnboardingState } from "@/hooks/useOnboardingState";
import { Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface Props {
  state?: OnboardingState;
  updateField?: (field: any, value: any) => void;
  value?: string;
  onChange?: (val: string) => void;
  hideHeader?: boolean;
}

const OPTIONS = [
  { value: "UNDERGRADUATE", label: "Undergraduate", desc: "Bachelor's degree (BSc / BA / BEng)" },
  { value: "MASTERS", label: "Masters", desc: "Master's degree (MSc / MA / MBA / MEng)" },
  { value: "PHD", label: "PhD", desc: "Doctoral degree (PhD / DPhil)" },
] as const;

export default function StepDegreeLevel({ state, updateField, value, onChange, hideHeader }: Props) {
  const currentVal = value ?? state?.currentDegree ?? "";
  const handleUpdate = (val: any) => {
    if (onChange) onChange(val);
    else if (updateField) updateField("currentDegree", val);
  };
  return (
    <div className="flex flex-col gap-10">
      {!hideHeader && (
        <div>
          <h1 className="text-4xl font-editorial text-ink mb-3 leading-tight">What level are you studying for?</h1>
          <p className="text-ink-secondary text-base font-ui">This helps us match you to the right scholarships</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {OPTIONS.map((opt) => {
          const isSelected = currentVal === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => handleUpdate(opt.value)}
              className={cn(
                "w-full text-left p-6 rounded-2xl border transition-all duration-300 ease-in-out group",
                isSelected
                  ? "border-moss bg-moss-light shadow-sm scale-[1.01]"
                  : "border-border bg-surface hover:border-border-strong hover:bg-surface-hover"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors mt-0.5",
                  isSelected ? "border-moss bg-moss" : "border-border group-hover:border-border-strong"
                )}>
                  <Check weight="bold" size={14} className={cn(
                    "text-white transition-opacity",
                    isSelected ? "opacity-100" : "opacity-0"
                  )} />
                </div>
                <div>
                  <div className="font-editorial text-xl font-medium text-ink">{opt.label}</div>
                  <div className="text-sm font-ui text-ink-secondary mt-1">{opt.desc}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

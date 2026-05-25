"use client";

import { OnboardingState } from "@/hooks/useOnboardingState";
import { Input } from "@/components/ui/Input";
import { Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface Props {
  state?: OnboardingState;
  updateField?: (field: any, value: any) => void;
  gpa?: string;
  gpaScale?: number;
  needsFinancialAid?: boolean | null;
  onChange?: (field: "gpa" | "gpaScale" | "needsFinancialAid", value: any) => void;
  hideHeader?: boolean;
  hideGPA?: boolean;
  hideFinancial?: boolean;
}

const SCALES = [4, 5, 7, 100] as const;

export default function StepGPA({ 
  state, 
  updateField, 
  gpa, 
  gpaScale, 
  needsFinancialAid, 
  onChange,
  hideHeader,
  hideGPA,
  hideFinancial
}: Props) {
  const currentGpa = gpa ?? state?.gpa ?? "";
  const currentScale = gpaScale ?? state?.gpaScale ?? 4;
  const currentFinancial = needsFinancialAid ?? state?.needsFinancialAid ?? null;

  const handleUpdate = (field: "gpa" | "gpaScale" | "needsFinancialAid", value: any) => {
    if (onChange) onChange(field, value);
    else if (updateField) updateField(field, value);
  };

  return (
    <div className="flex flex-col gap-10 pb-12">
      {/* SECTION A — GPA */}
      {!hideGPA && (
        <div className="flex flex-col gap-6">
          {!hideHeader && (
            <div>
              <h1 className="text-4xl font-editorial text-ink mb-3 leading-tight">What's your current GPA?</h1>
              <p className="text-ink-secondary text-base font-ui">Optional — helps us filter out scholarships you won't qualify for</p>
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                label="GPA (e.g. 3.8)"
                type="number"
                step="0.01"
                value={currentGpa}
                onChange={(e) => handleUpdate("gpa", e.target.value)}
              />
            </div>
            <div className="flex items-center rounded-2xl border border-border p-1 bg-surface h-14">
              {SCALES.map((s) => (
                <button
                  key={s}
                  onClick={() => handleUpdate("gpaScale", s)}
                  className={cn(
                    "px-4 h-full text-sm font-ui transition-all duration-200 rounded-xl",
                    currentScale === s 
                      ? "bg-bg shadow-sm border border-border text-ink font-medium" 
                      : "text-ink-secondary hover:text-ink"
                  )}
                >
                  /{s}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm font-ui text-ink-secondary">
            Not sure how to convert? [Your GPA / Max scale × 4.0 = 4.0 equivalent]
          </p>
        </div>
      )}

      {!hideGPA && !hideFinancial && <hr className="border-border" />}

      {/* SECTION B — Financial need */}
      {!hideFinancial && (
        <div className="flex flex-col gap-6">
          {!hideHeader && (
            <div>
              <h1 className="text-4xl font-editorial text-ink mb-3 leading-tight">Do you need financial support?</h1>
              <p className="text-ink-secondary text-base font-ui">Some scholarships are need-based — this helps us match correctly</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => handleUpdate("needsFinancialAid", true)}
              className={cn(
                "flex-1 text-left p-6 rounded-2xl border transition-all duration-300 ease-in-out group",
                currentFinancial === true
                  ? "border-moss bg-moss-light shadow-sm scale-[1.01]"
                  : "border-border bg-surface hover:border-border-strong hover:bg-surface-hover"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors mt-0.5",
                  currentFinancial === true ? "border-moss bg-moss" : "border-border group-hover:border-border-strong"
                )}>
                  <Check weight="bold" size={14} className={cn(
                    "text-white transition-opacity",
                    currentFinancial === true ? "opacity-100" : "opacity-0"
                  )} />
                </div>
                <div className="font-editorial text-xl font-medium text-ink">I need financial support</div>
              </div>
            </button>
            <button
              onClick={() => handleUpdate("needsFinancialAid", false)}
              className={cn(
                "flex-1 text-left p-6 rounded-2xl border transition-all duration-300 ease-in-out group",
                currentFinancial === false
                  ? "border-moss bg-moss-light shadow-sm scale-[1.01]"
                  : "border-border bg-surface hover:border-border-strong hover:bg-surface-hover"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors mt-0.5",
                  currentFinancial === false ? "border-moss bg-moss" : "border-border group-hover:border-border-strong"
                )}>
                  <Check weight="bold" size={14} className={cn(
                    "text-white transition-opacity",
                    currentFinancial === false ? "opacity-100" : "opacity-0"
                  )} />
                </div>
                <div className="font-editorial text-xl font-medium text-ink">I can self-fund if needed</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

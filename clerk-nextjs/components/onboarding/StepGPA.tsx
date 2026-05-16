"use client";

import { OnboardingState } from "@/hooks/useOnboardingState";

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
    <div className="flex flex-col gap-8 pb-4">
      {/* SECTION A — GPA */}
      {!hideGPA && (
        <div className="flex flex-col gap-4">
          {!hideHeader && (
            <div>
              <h1 className="text-2xl font-medium text-gray-900 mb-2">What's your current GPA?</h1>
              <p className="text-gray-500 text-sm font-normal">Optional — helps us filter out scholarships you won't qualify for</p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              type="number"
              step="0.01"
              placeholder="e.g. 3.8"
              value={currentGpa}
              onChange={(e) => handleUpdate("gpa", e.target.value)}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#1D9E75] min-h-[44px]"
            />
            <div className="flex items-center rounded-xl border border-gray-200 p-1 bg-gray-50 min-h-[44px]">
              {SCALES.map((s) => (
                <button
                  key={s}
                  onClick={() => handleUpdate("gpaScale", s)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    currentScale === s ? "bg-white shadow-sm border border-gray-200 text-gray-900" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  /{s}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-500 font-normal">
            Not sure how to convert? [Your GPA / Max scale × 4.0 = 4.0 equivalent]
          </p>

          {!hideHeader && (
            <button
              onClick={() => handleUpdate("gpa", "")}
              className="self-start text-sm text-[#1D9E75] font-medium hover:underline p-1 -ml-1 min-h-[44px]"
            >
              Skip GPA for now
            </button>
          )}
        </div>
      )}

      {!hideGPA && !hideFinancial && <hr className="border-gray-100" />}

      {/* SECTION B — Financial need */}
      {!hideFinancial && (
        <div className="flex flex-col gap-4">
          {!hideHeader && (
            <div>
              <h1 className="text-2xl font-medium text-gray-900 mb-2">Do you need financial support?</h1>
              <p className="text-gray-500 text-sm font-normal">Some scholarships are need-based — this helps us match correctly</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleUpdate("needsFinancialAid", true)}
              className={`flex-1 text-left p-4 rounded-xl border min-h-[44px] transition-colors ${
                currentFinancial === true
                  ? "border-[#1D9E75] bg-[#E1F5EE]"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className={`font-medium ${currentFinancial === true ? "text-[#0F6E56]" : "text-gray-900"}`}>
                I need financial support
              </div>
            </button>
            <button
              onClick={() => handleUpdate("needsFinancialAid", false)}
              className={`flex-1 text-left p-4 rounded-xl border min-h-[44px] transition-colors ${
                currentFinancial === false
                  ? "border-[#1D9E75] bg-[#E1F5EE]"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className={`font-medium ${currentFinancial === false ? "text-[#0F6E56]" : "text-gray-900"}`}>
                I can self-fund if needed
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

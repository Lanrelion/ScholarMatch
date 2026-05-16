"use client";

import { OnboardingState } from "@/hooks/useOnboardingState";

interface Props {
  state?: OnboardingState;
  updateField?: (field: any, value: any) => void;
  value?: string;
  onChange?: (val: string) => void;
  hideHeader?: boolean;
}

const OPTIONS = [
  { value: "UNDERGRADUATE", label: "UNDERGRADUATE", desc: "Bachelor's degree (BSc / BA / BEng)" },
  { value: "MASTERS", label: "MASTERS", desc: "Master's degree (MSc / MA / MBA / MEng)" },
  { value: "PHD", label: "PHD", desc: "Doctoral degree (PhD / DPhil)" },
] as const;

export default function StepDegreeLevel({ state, updateField, value, onChange, hideHeader }: Props) {
  const currentVal = value ?? state?.currentDegree ?? "";
  const handleUpdate = (val: any) => {
    if (onChange) onChange(val);
    else if (updateField) updateField("currentDegree", val);
  };
  return (
    <div className="flex flex-col gap-6">
      {!hideHeader && (
        <div>
          <h1 className="text-2xl font-medium text-gray-900 mb-2">What level are you studying for?</h1>
          <p className="text-gray-500 text-sm font-normal">This helps us match you to the right scholarships</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {OPTIONS.map((opt) => {
          const isSelected = currentVal === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => handleUpdate(opt.value)}
              className={`w-full text-left flex items-center justify-between p-4 rounded-xl border transition-colors min-h-[44px] ${
                isSelected
                  ? "border-[#1D9E75] bg-[#E1F5EE]"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div>
                <div className="font-medium text-gray-900">{opt.label}</div>
                <div className="text-sm text-gray-500 mt-1 font-normal">{opt.desc}</div>
              </div>
              <div className={`shrink-0 ml-4 ${isSelected ? "text-[#1D9E75]" : "text-gray-300"}`}>
                {isSelected ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

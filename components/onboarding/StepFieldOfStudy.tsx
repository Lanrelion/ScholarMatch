"use client";

import { OnboardingState } from "@/hooks/useOnboardingState";

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
    <div className="flex flex-col gap-6">
      {!hideHeader && (
        <div>
          <h1 className="text-2xl font-medium text-gray-900 mb-2">What will you be studying?</h1>
          <p className="text-gray-500 text-sm font-normal">Enter your field or choose from common options</p>
        </div>
      )}

      <input
        type="text"
        placeholder="e.g. Computer Science"
        value={currentVal}
        onChange={(e) => handleUpdate(e.target.value)}
        className="rounded-xl border border-gray-200 px-4 py-3 w-full text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#1D9E75] min-h-[44px]"
      />

      <div className="flex flex-wrap gap-2">
        {COMMON_FIELDS.map((field) => {
          const isSelected = currentVal.toLowerCase() === field.toLowerCase();
          return (
            <button
              key={field}
              onClick={() => handleUpdate(field)}
              className={`min-h-[44px] px-3 py-1 rounded-full text-sm border cursor-pointer transition-colors font-normal ${
                isSelected
                  ? "bg-[#E1F5EE] border-[#1D9E75] text-[#0F6E56] font-medium"
                  : "border-gray-200 text-gray-700 hover:border-gray-300 bg-white"
              }`}
            >
              {field}
            </button>
          );
        })}
      </div>
    </div>
  );
}

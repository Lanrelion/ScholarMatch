"use client";

import { OnboardingState } from "@/hooks/useOnboardingState";

interface Props {
  state?: OnboardingState;
  updateField?: (field: any, value: any) => void;
  firstName?: string;
  lastName?: string;
  onChange?: (field: "firstName" | "lastName", value: string) => void;
}

export default function StepName({ state, updateField, firstName, lastName, onChange }: Props) {
  const currentFirstName = firstName ?? state?.firstName ?? "";
  const currentLastName = lastName ?? state?.lastName ?? "";
  const handleUpdate = (field: "firstName" | "lastName", value: string) => {
    if (onChange) onChange(field, value);
    else if (updateField) updateField(field, value);
  };
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-medium text-gray-900 mb-2">What's your name?</h1>
        <p className="text-gray-500 text-sm font-normal">This personalises your experience</p>
      </div>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="First name"
          value={currentFirstName}
          onChange={(e) => handleUpdate("firstName", e.target.value)}
          autoFocus={!firstName}
          className="rounded-xl border border-gray-200 px-4 py-3 w-full text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#1D9E75] min-h-[44px]"
        />
        <input
          type="text"
          placeholder="Last name"
          value={currentLastName}
          onChange={(e) => handleUpdate("lastName", e.target.value)}
          className="rounded-xl border border-gray-200 px-4 py-3 w-full text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#1D9E75] min-h-[44px]"
        />
      </div>
    </div>
  );
}

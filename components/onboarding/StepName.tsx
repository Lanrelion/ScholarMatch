"use client";

import { OnboardingState } from "@/hooks/useOnboardingState";
import { Input } from "@/components/ui/Input";

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
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-4xl font-editorial text-ink mb-3 leading-tight">What's your name?</h1>
        <p className="text-ink-secondary text-base font-ui">This personalizes your experience</p>
      </div>

      <div className="flex flex-col gap-6">
        <Input
          label="First Name"
          type="text"
          value={currentFirstName}
          onChange={(e) => handleUpdate("firstName", e.target.value)}
          autoFocus={!firstName}
        />
        <Input
          label="Last Name"
          type="text"
          value={currentLastName}
          onChange={(e) => handleUpdate("lastName", e.target.value)}
        />
      </div>
    </div>
  );
}

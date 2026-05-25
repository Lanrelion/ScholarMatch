"use client";

import { OnboardingState } from "@/hooks/useOnboardingState";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { Briefcase, Flask, Gear, Stethoscope, PaintBrush, Scales } from "@phosphor-icons/react";

interface Props {
  state?: OnboardingState;
  updateField?: (field: any, value: any) => void;
  firstName?: string;
  lastName?: string;
  onChange?: (field: "firstName" | "lastName", value: string) => void;
}

const ASPIRATIONS = [
  { id: "founder", label: "Founder", icon: Briefcase },
  { id: "researcher", label: "Researcher", icon: Flask },
  { id: "engineer", label: "Engineer", icon: Gear },
  { id: "doctor", label: "Doctor", icon: Stethoscope },
  { id: "creative", label: "Creative", icon: PaintBrush },
  { id: "policymaker", label: "Policymaker", icon: Scales },
];

export default function StepDreams({ state, updateField, firstName, lastName, onChange }: Props) {
  const currentFirstName = firstName ?? state?.firstName ?? "";
  const currentLastName = lastName ?? state?.lastName ?? "";
  const currentAspiration = state?.aspiration ?? null;

  const handleUpdate = (field: keyof OnboardingState, value: any) => {
    if (onChange && (field === "firstName" || field === "lastName")) {
      onChange(field, value);
    } else if (updateField) {
      updateField(field, value);
    }
  };

  return (
    <div className="flex flex-col gap-10 pb-12">
      <div>
        <h1 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-editorial text-ink mb-3 leading-tight font-normal">
          What's your name, and what are you hoping to become?
        </h1>
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

      <div className="mt-2">
        <h2 className="text-[14px] text-ink-secondary font-ui mb-4">I see myself as...</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {ASPIRATIONS.map((asp) => {
            const isSelected = currentAspiration === asp.id;
            const Icon = asp.icon;
            return (
              <button
                key={asp.id}
                onClick={() => handleUpdate("aspiration", asp.id)}
                className={cn(
                  "h-[80px] flex flex-col items-center justify-center gap-2 rounded-xl border transition-all duration-300 ease-in-out group",
                  isSelected
                    ? "border-moss bg-moss-light shadow-sm scale-[1.02]"
                    : "border-border bg-surface hover:border-border-strong hover:bg-surface-hover"
                )}
              >
                <Icon size={24} className={isSelected ? "text-moss" : "text-moss"} weight={isSelected ? "fill" : "regular"} />
                <span className={cn(
                  "text-[13px] font-ui font-medium",
                  isSelected ? "text-ink" : "text-ink-secondary group-hover:text-ink"
                )}>
                  {asp.label}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex justify-end">
          <button 
            onClick={() => handleUpdate("aspiration", null)}
            className="text-[12px] text-ink-tertiary hover:text-ink-secondary font-ui transition-colors"
          >
            Skip for now &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

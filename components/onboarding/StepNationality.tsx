"use client";

import { useState } from "react";
import { OnboardingState } from "@/hooks/useOnboardingState";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

const COMMON_COUNTRIES = [
  { name: "Nigeria", code: "NG" },
  { name: "Kenya", code: "KE" },
  { name: "Ghana", code: "GH" },
  { name: "Ethiopia", code: "ET" },
  { name: "South Africa", code: "ZA" },
  { name: "Tanzania", code: "TZ" },
  { name: "Uganda", code: "UG" },
  { name: "Egypt", code: "EG" },
  { name: "Cameroon", code: "CM" },
  { name: "Zimbabwe", code: "ZW" },
];

export const ALL_AFRICAN_COUNTRIES = [
  ...COMMON_COUNTRIES,
  { name: "Algeria", code: "DZ" },
  { name: "Angola", code: "AO" },
  { name: "Benin", code: "BJ" },
  { name: "Botswana", code: "BW" },
  { name: "Burkina Faso", code: "BF" },
  { name: "Burundi", code: "BI" },
  { name: "Cabo Verde", code: "CV" },
  { name: "Central African Republic", code: "CF" },
  { name: "Chad", code: "TD" },
  { name: "Comoros", code: "KM" },
  { name: "Congo (Brazzaville)", code: "CG" },
  { name: "Congo (Kinshasa)", code: "CD" },
  { name: "Djibouti", code: "DJ" },
  { name: "Equatorial Guinea", code: "GQ" },
  { name: "Eritrea", code: "ER" },
  { name: "Eswatini", code: "SZ" },
  { name: "Gabon", code: "GA" },
  { name: "Gambia", code: "GM" },
  { name: "Guinea", code: "GN" },
  { name: "Guinea-Bissau", code: "GW" },
  { name: "Ivory Coast", code: "CI" },
  { name: "Lesotho", code: "LS" },
  { name: "Liberia", code: "LR" },
  { name: "Libya", code: "LY" },
  { name: "Madagascar", code: "MG" },
  { name: "Malawi", code: "MW" },
  { name: "Mali", code: "ML" },
  { name: "Mauritania", code: "MR" },
  { name: "Mauritius", code: "MU" },
  { name: "Morocco", code: "MA" },
  { name: "Mozambique", code: "MZ" },
  { name: "Namibia", code: "NA" },
  { name: "Niger", code: "NE" },
  { name: "Rwanda", code: "RW" },
  { name: "Sao Tome and Principe", code: "ST" },
  { name: "Senegal", code: "SN" },
  { name: "Seychelles", code: "SC" },
  { name: "Sierra Leone", code: "SL" },
  { name: "Somalia", code: "SO" },
  { name: "South Sudan", code: "SS" },
  { name: "Sudan", code: "SD" },
  { name: "Togo", code: "TG" },
  { name: "Tunisia", code: "TN" },
  { name: "Zambia", code: "ZM" },
];

interface Props {
  state?: OnboardingState;
  updateField?: (field: any, value: any) => void;
  value?: string;
  onChange?: (val: string) => void;
  hideHeader?: boolean;
}

export default function StepNationality({ state, updateField, value, onChange, hideHeader }: Props) {
  const currentVal = value ?? state?.nationality ?? "";
  const [search, setSearch] = useState(() => {
    const found = ALL_AFRICAN_COUNTRIES.find(c => c.code === currentVal);
    return found ? found.name : "";
  });

  const handleUpdate = (val: string, name: string) => {
    if (onChange) onChange(val);
    else if (updateField) updateField("nationality", val);
    setSearch(name);
  };

  const filtered = ALL_AFRICAN_COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-10 pb-12">
      {!hideHeader && (
        <div>
          <h1 className="text-4xl font-editorial text-ink mb-3 leading-tight">Where are you from?</h1>
          <p className="text-ink-secondary text-base font-ui">We use this to match you to eligible scholarships</p>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {COMMON_COUNTRIES.map((country) => {
          const isSelected = currentVal === country.code;
          return (
            <button
              key={country.code}
              onClick={() => handleUpdate(country.code, country.name)}
              className={cn(
                "px-5 py-2.5 rounded-pill text-sm border transition-all duration-200 font-ui",
                isSelected
                  ? "bg-moss text-white border-moss shadow-sm scale-[1.02]"
                  : "border-border text-ink hover:border-border-strong hover:bg-surface-hover bg-surface"
              )}
            >
              {country.name}
            </button>
          );
        })}
      </div>

      <div className="relative mt-2">
        <Input
          label="Search other countries..."
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (e.target.value === "") {
              if (onChange) onChange("");
              else if (updateField) updateField("nationality", "");
            }
          }}
        />
        {search && !ALL_AFRICAN_COUNTRIES.find(c => c.name.toLowerCase() === search.toLowerCase()) && (
          <div className="absolute top-full left-0 right-0 mt-2 max-h-48 overflow-y-auto bg-surface border border-border rounded-xl shadow-lg z-10 no-scrollbar">
            {filtered.length > 0 ? (
              filtered.map((country) => (
                <button
                  key={country.code}
                  className="w-full text-left px-4 py-3 text-sm font-ui text-ink hover:bg-surface-hover focus:bg-surface-hover focus:outline-none transition-colors border-b border-border/50 last:border-0"
                  onClick={() => handleUpdate(country.code, country.name)}
                >
                  {country.name}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm font-ui text-ink-secondary">No countries found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

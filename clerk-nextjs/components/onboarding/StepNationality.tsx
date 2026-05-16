"use client";

import { useState } from "react";
import { OnboardingState } from "@/hooks/useOnboardingState";

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
    <div className="flex flex-col gap-6">
      {!hideHeader && (
        <div>
          <h1 className="text-2xl font-medium text-gray-900 mb-2">Where are you from?</h1>
          <p className="text-gray-500 text-sm font-normal">We use this to match you to eligible scholarships</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {COMMON_COUNTRIES.map((country) => {
          const isSelected = currentVal === country.code;
          return (
            <button
              key={country.code}
              onClick={() => handleUpdate(country.code, country.name)}
              className={`min-h-[44px] px-3 py-1 rounded-full text-sm border cursor-pointer transition-colors font-normal ${
                isSelected
                  ? "bg-[#E1F5EE] border-[#1D9E75] text-[#0F6E56] font-medium"
                  : "border-gray-200 text-gray-700 hover:border-gray-300 bg-white"
              }`}
            >
              {country.name}
            </button>
          );
        })}
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search country..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (e.target.value === "") {
              if (onChange) onChange("");
              else if (updateField) updateField("nationality", "");
            }
          }}
          className="rounded-xl border border-gray-200 px-4 py-3 w-full text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#1D9E75] min-h-[44px]"
        />
        {search && !ALL_AFRICAN_COUNTRIES.find(c => c.name.toLowerCase() === search.toLowerCase()) && (
          <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg z-10">
            {filtered.length > 0 ? (
              filtered.map((country) => (
                <button
                  key={country.code}
                  className="w-full text-left px-4 py-3 text-sm font-normal hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                  onClick={() => handleUpdate(country.code, country.name)}
                >
                  {country.name}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm font-normal text-gray-500">No countries found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

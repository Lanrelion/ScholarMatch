"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export function BackButton({ label }: { label?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const getLabel = () => {
    if (label) return label;
    if (from === "saved") return "Back to Saved";
    if (from === "feed") return "Back to Feed";
    return "Back";
  };

  const handleBack = () => {
    if (from === "saved") {
      router.push("/saved");
    } else if (from === "feed") {
      router.push("/dashboard");
    } else if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard");
    }
  };

  const displayLabel = getLabel();

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-1 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-all text-[11px] font-black uppercase tracking-wider py-2 pr-4 -ml-1 group"
      style={{ minHeight: "44px" }}
    >
      <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
      {displayLabel}
    </button>
  );
}

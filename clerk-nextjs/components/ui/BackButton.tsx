"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export function BackButton({ label = "Back" }: { label?: string }) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-1 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors text-sm py-2 pr-4 -ml-1"
      style={{ minHeight: "44px" }}
    >
      <ChevronLeft size={16} />
      {label}
    </button>
  );
}

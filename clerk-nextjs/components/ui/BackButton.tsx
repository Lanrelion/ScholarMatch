"use client";

import { useRouter } from "next/navigation";
import { CaretLeft } from "@phosphor-icons/react";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="btn-icon"
      aria-label="Go back"
    >
      <CaretLeft size={20} />
    </button>
  );
}

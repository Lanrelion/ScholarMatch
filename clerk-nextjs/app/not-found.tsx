"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-bg relative px-6 text-center">
      {/* Grain overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay grain-overlay" />
      
      <div className="max-w-[480px] w-full z-10 flex flex-col items-center">
        <div 
          className="font-editorial font-light text-border-strong leading-none mb-6"
          style={{ fontSize: "clamp(6rem, 15vw, 10rem)" }}
        >
          404
        </div>
        
        <h1 className="text-[36px] font-editorial font-light text-ink leading-tight">
          This page doesn't exist.
        </h1>
        
        <p className="text-[15px] font-ui text-ink-secondary mt-[12px] leading-relaxed max-w-[320px]">
          The scholarship or page you're looking for may have moved or been removed.
        </p>

        <button 
          onClick={() => router.push("/")}
          className="mt-[32px] h-12 px-8 bg-moss text-white rounded-full font-ui font-medium text-[15px] hover:bg-moss-dark transition-colors shadow-lg shadow-moss/20"
        >
          Return home &rarr;
        </button>
      </div>
    </div>
  );
}

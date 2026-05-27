"use client";

import React, { useState, useEffect } from "react";
import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-bg">
      
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-center px-16 xl:px-24">
        {/* Background gradient */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: "linear-gradient(150deg, var(--color-moss-dark) 0%, #2C3A24 50%, #1A2214 100%)"
          }}
        />
        {/* Grain overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.06] mix-blend-overlay grain-overlay" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col h-full py-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-moss-light flex items-center justify-center">
              <span className="text-white font-editorial text-[14px] leading-none tracking-wider font-medium">SM</span>
            </div>
            <span className="text-white/90 font-editorial text-[20px]">ScholarMatch</span>
          </div>

          <div className="mt-auto max-w-md">
            <h1 className="text-white font-editorial text-[32px] font-light italic leading-tight">
              "The right funding<br />changes everything."
            </h1>
            <p className="text-white/60 font-ui text-[13px] mt-6">
              Trusted by students across 54 African nations.
            </p>
          </div>
        </div>

        {/* Floating Decorative Card */}
        <div 
          className="absolute bottom-16 right-16 z-10 rounded-xl p-4 w-[280px] shadow-2xl animate-[float_6s_ease-in-out_infinite]"
          style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.1)"
          }}
        >
          <div className="text-[14px] font-ui font-medium text-white/90 mb-1">
            Chevening Scholarship
          </div>
          <div className="text-[12px] font-ui text-white/70">
            91% match
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col items-center justify-center p-6 md:p-12">
        
        {/* Mobile Logo Mark */}
        <div className="w-10 h-10 rounded-xl bg-moss-light flex items-center justify-center mb-6 lg:hidden">
          <span className="text-moss font-editorial text-[16px] leading-none tracking-wider font-bold">SM</span>
        </div>

        <div className="w-full flex justify-center">
          {mounted ? (
            <SignUp 
              forceRedirectUrl="/onboarding/step/1"
              appearance={{
                variables: {
                  colorPrimary: '#5F6F52',
                  colorBackground: 'var(--color-surface)',
                  colorText: 'var(--color-ink)',
                  colorInputBackground: 'var(--color-bg)',
                  colorInputText: 'var(--color-ink)',
                  colorTextSecondary: 'var(--color-ink-secondary)',
                  colorBorder: 'var(--color-border)',
                  borderRadius: '12px',
                  fontFamily: 'var(--font-ui)',
                },
                elements: {
                  rootBox: { width: "100%" },
                  card: { 
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)', 
                    border: '1px solid var(--color-border)', 
                    padding: '32px',
                    width: "100%",
                    backgroundColor: "var(--color-surface)"
                  },
                  formButtonPrimary: {
                    background: 'var(--color-moss)',
                    borderRadius: '9999px',
                    fontFamily: 'var(--font-ui)',
                    textTransform: 'none',
                    fontSize: '14px',
                    fontWeight: 500,
                    height: '40px',
                    '&:hover': {
                      background: 'var(--color-moss-dark)'
                    }
                  },
                  socialButtonsBlockButton: {
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-surface)',
                    '&:hover': {
                      backgroundColor: 'var(--color-bg-hover)'
                    }
                  },
                }
              }}
            />
          ) : (
            <div className="w-full flex flex-col items-center justify-center py-12 bg-surface border border-border rounded-xl p-8 shadow-sm">
              <div className="w-8 h-8 rounded-full border-2 border-moss border-t-transparent animate-spin mb-4" />
              <span className="text-[13px] font-ui text-ink-secondary">Loading secure registration...</span>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}

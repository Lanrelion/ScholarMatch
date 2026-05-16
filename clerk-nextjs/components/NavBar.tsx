"use client";

import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export function CtaButton() {
  return (
    <SignUpButton mode="modal">
      <button className="min-h-[44px] px-8 py-3.5 rounded-full text-lg font-semibold bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] active:scale-[0.98] transition-all shadow-[var(--shadow-raised)]">
        Get Started — it&apos;s free
      </button>
    </SignUpButton>
  );
}

interface NavBarProps {
  isSignedIn: boolean;
}

export default function NavBar({ isSignedIn }: NavBarProps) {
  return (
    <nav className="fixed top-0 inset-x-0 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur border-b border-[var(--color-border)] z-50">
      <span className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
        ScholarMatch
      </span>

      <div className="flex items-center gap-3">
        {isSignedIn ? (
          <UserButton />
        ) : (
          <>
            <SignInButton mode="modal">
              <button className="min-h-[44px] px-5 rounded-full text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-colors">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="min-h-[44px] px-5 rounded-full text-sm font-semibold bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors">
                Get started
              </button>
            </SignUpButton>
          </>
        )}
      </div>
    </nav>
  );
}

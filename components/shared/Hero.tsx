import { SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function Hero() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] px-6 py-16 text-center md:px-12 lg:px-24">
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl max-w-4xl mb-6 leading-tight">
        Stop searching. Get matched to university-specific scholarships for African students.
      </h1>
      <p className="text-lg sm:text-xl text-muted-foreground font-medium max-w-2xl mb-10">
        AI-powered matching, automated deadline tracking, and verified opportunities.
      </p>
      
      <SignedOut>
        <SignUpButton mode="modal">
          <button className="bg-primary text-primary-foreground min-h-[44px] min-w-[44px] px-8 py-3.5 rounded-full font-semibold text-lg transition-colors hover:bg-primary/90 active:bg-primary/80">
            Get Started Now
          </button>
        </SignUpButton>
      </SignedOut>

      <SignedIn>
        <div className="flex flex-col items-center gap-4">
          <Link href="/dashboard">
            <button className="bg-primary text-primary-foreground min-h-[44px] min-w-[44px] px-8 py-3.5 rounded-full font-semibold text-lg transition-colors hover:bg-primary/90 active:bg-primary/80">
              Go to Dashboard
            </button>
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
    </section>
  );
}

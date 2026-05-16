import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import { db } from "@/lib/db";
import { SignUpButton } from "@clerk/nextjs";

export default async function Home() {
  const { userId } = await auth();
  
  if (userId) {
    redirect("/dashboard");
  }

  const featured = await db.scholarship.findMany({
    where: { isActive: true, verified: true },
    take: 3,
    orderBy: { savedBy: { _count: 'desc' } },
    select: {
      id: true, title: true, provider: true,
      deadline: true, eligibleDegrees: true,
      eligibilityParsed: true
    }
  });

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
      <NavBar isSignedIn={false} />

      {/* Hero Section */}
      <main className="relative flex-1 flex flex-col items-center justify-center pt-24 pb-16 px-4 md:pt-32 md:pb-24 overflow-hidden">
        {/* Animated gradient mesh background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-60" style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% -10%, rgba(29, 158, 117, 0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 110%, rgba(29, 158, 117, 0.08) 0%, transparent 60%),
            #ffffff
          `,
          animation: 'meshShift 8s ease-in-out infinite'
        }}>
          <style>{`
            @keyframes meshShift {
              0%, 100% { background-position: 0% 0%; }
              50% { background-position: 5% 5%; }
            }
          `}</style>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl gap-6">
          <span className="text-sm font-medium text-[var(--color-primary-dark)] bg-[var(--color-primary-surface)] px-3 py-1 rounded-full uppercase tracking-wider">
            For African students
          </span>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-[var(--color-text-primary)]">
            Stop searching.<br />
            Get matched.
          </h1>

          <p className="text-base sm:text-lg text-[var(--color-text-secondary)] max-w-xl leading-relaxed">
            Tell us who you are. We surface every scholarship you qualify for — from Chevening to Uppsala's biology department.
          </p>

          <SignUpButton mode="modal">
            <button className="mt-4 min-h-[56px] px-8 rounded-[var(--radius-xl)] text-lg font-medium bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] active:scale-[0.98] transition-all shadow-[var(--shadow-raised)]">
              Find my scholarships &rarr;
            </button>
          </SignUpButton>

          <p className="text-xs text-[var(--color-text-tertiary)] mt-2">
            Join 5,000+ students across 54 African countries
          </p>
        </div>
      </main>

      {/* Stats Bar */}
      <section className="bg-[var(--color-surface)] border-y border-[var(--color-border)] py-8 px-4 relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-around items-center gap-8 sm:gap-4 text-center">
          <div className="stagger-children">
            <div className="text-3xl font-bold text-[var(--color-primary)]">12,000+</div>
            <div className="text-sm text-[var(--color-text-secondary)] mt-1">Scholarships indexed</div>
          </div>
          <div className="stagger-children" style={{ animationDelay: '100ms' }}>
            <div className="text-3xl font-bold text-[var(--color-primary)]">54</div>
            <div className="text-sm text-[var(--color-text-secondary)] mt-1">African countries</div>
          </div>
          <div className="stagger-children" style={{ animationDelay: '200ms' }}>
            <div className="text-3xl font-bold text-[var(--color-primary)]">$2.3M+</div>
            <div className="text-sm text-[var(--color-text-secondary)] mt-1">In matched funding</div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row gap-12 relative">
          {/* Connecting line on desktop */}
          <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-px border-t border-dashed border-[var(--color-primary-border)] z-0"></div>
          
          <div className="flex-1 flex flex-col items-center text-center relative z-10 bg-white group">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary-surface)] flex items-center justify-center mb-6 shadow-sm border border-[var(--color-primary-border)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-3 text-[var(--color-text-primary)]">Tell us about yourself</h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-[260px]">
              Build your profile in under 3 minutes. Nationality, degree, field, GPA.
            </p>
          </div>
          
          <div className="flex-1 flex flex-col items-center text-center relative z-10 bg-white group">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary-surface)] flex items-center justify-center mb-6 shadow-sm border border-[var(--color-primary-border)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-3 text-[var(--color-text-primary)]">We match you</h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-[260px]">
              AI scores every scholarship against your profile. See exactly why you qualify.
            </p>
          </div>
          
          <div className="flex-1 flex flex-col items-center text-center relative z-10 bg-white group">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary-surface)] flex items-center justify-center mb-6 shadow-sm border border-[var(--color-primary-border)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-3 text-[var(--color-text-primary)]">Save and track</h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-[260px]">
              Save scholarships. Get deadline reminders 30, 7, and 1 day before closing.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Scholarships Preview */}
      <section className="py-16 px-4 bg-[var(--color-surface)] border-t border-[var(--color-border)] relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">Opportunities waiting for you</h2>
            <p className="text-[var(--color-text-secondary)] mt-2">Just a sample of what you could match with</p>
          </div>
          
          <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 pb-8 md:pb-0 snap-x">
            {featured.length > 0 ? featured.map((item) => (
              <div key={item.id} className="min-w-[280px] md:min-w-0 snap-start bg-white rounded-[var(--radius-md)] p-5 border border-[var(--color-border)] shadow-[var(--shadow-card)] flex flex-col h-full shrink-0">
                <div className="flex-1">
                  <h3 className="font-bold text-[var(--color-text-primary)] line-clamp-2 leading-tight mb-1">{item.title}</h3>
                  <p className="text-xs text-[var(--color-text-secondary)] mb-4">{item.provider}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-[var(--color-primary-surface)] text-[var(--color-primary-dark)] text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full">
                      {item.eligibleDegrees[0] || 'Any Degree'}
                    </span>
                    <span className="bg-[var(--color-green-surface)] text-[var(--color-green-dark)] text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full">
                      Fully funded
                    </span>
                    {item.deadline && (
                      <span className="bg-[var(--color-amber-surface)] text-[var(--color-amber-dark)] text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full">
                        Due {new Date(item.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>
                
                <SignUpButton mode="modal">
                  <button className="w-full mt-4 min-h-[44px] rounded-lg border border-[var(--color-border-strong)] text-sm font-medium hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)] transition-colors">
                    View details
                  </button>
                </SignUpButton>
              </div>
            )) : (
              <div className="col-span-3 text-center py-12 text-[var(--color-text-tertiary)]">
                More scholarships being added. Check back soon.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-8 px-6 bg-white relative z-10 text-center">
        <div className="font-bold text-[var(--color-text-primary)] mb-2">ScholarMatch</div>
        <p className="text-xs text-[var(--color-text-secondary)] mb-4">Built for African students</p>
        <Link href="/privacy" className="text-xs text-[var(--color-text-secondary)] underline hover:text-[var(--color-primary)]">
          Privacy Policy
        </Link>
      </footer>
    </div>
  );
}

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import { db } from "@/lib/db";
import { SignUpButton } from "@clerk/nextjs";
import { ArrowRight, Sparkles, ShieldCheck, GraduationCap, Globe2, Compass } from "lucide-react";

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
    <div className="flex flex-col min-h-screen bg-white font-sans text-[var(--color-text-primary)] selection:bg-[var(--color-primary)] selection:text-white">
      <NavBar isSignedIn={false} />

      {/* Premium Hero Section */}
      <main className="relative flex-1 flex flex-col items-center justify-center pt-32 pb-24 px-4 md:pt-40 md:pb-32 overflow-hidden">
        {/* Advanced Mesh Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[var(--color-primary)] opacity-[0.07] blur-[120px] rounded-full animate-pulse" />
          <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-blue-400 opacity-[0.05] blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-[20%] w-[50%] h-[50%] bg-[var(--color-primary)] opacity-[0.03] blur-[150px] rounded-full" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl gap-8 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
            <Sparkles size={14} className="text-[var(--color-primary)]" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
              Exclusive for African Students
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[0.95] text-[var(--color-text-primary)] animate-in fade-in slide-in-from-top-8 duration-1000 delay-100">
            Your Future,<br />
            <span className="text-[var(--color-primary)]">Fully Funded.</span>
          </h1>

          <p className="text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-2xl leading-relaxed font-medium animate-in fade-in slide-in-from-top-12 duration-1000 delay-200">
            ScholarMatch AI analyzes thousands of global opportunities to surface the ones you're 100% eligible for. No more searching. Just matching.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 animate-in fade-in slide-in-from-top-16 duration-1000 delay-300">
            <SignUpButton mode="modal">
              <button className="h-16 px-10 rounded-[var(--radius-xl)] text-[15px] font-black bg-[var(--color-text-primary)] text-white hover:bg-black active:scale-[0.98] transition-all shadow-xl flex items-center gap-3">
                Get Started for Free
                <ArrowRight size={20} strokeWidth={3} />
              </button>
            </SignUpButton>
            
            <div className="flex items-center -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
              ))}
              <span className="pl-4 text-xs font-bold text-[var(--color-text-tertiary)]">
                Joined by 12k+ students
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* High-Trust Stats */}
      <section className="bg-white py-20 px-4 relative z-10 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center group">
            <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center mb-6 group-hover:border-[var(--color-primary-border)] transition-colors">
              <Globe2 size={28} className="text-[var(--color-primary)]" />
            </div>
            <div className="text-4xl font-black text-[var(--color-text-primary)] mb-2 tracking-tight">12,000+</div>
            <div className="text-xs font-black uppercase tracking-widest text-[var(--color-text-tertiary)]">Opportunities Indexed</div>
          </div>
          
          <div className="flex flex-col items-center text-center group">
            <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center mb-6 group-hover:border-[var(--color-primary-border)] transition-colors">
              <ShieldCheck size={28} className="text-[var(--color-primary)]" />
            </div>
            <div className="text-4xl font-black text-[var(--color-text-primary)] mb-2 tracking-tight">100%</div>
            <div className="text-xs font-black uppercase tracking-widest text-[var(--color-text-tertiary)]">Verified Sources</div>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center mb-6 group-hover:border-[var(--color-primary-border)] transition-colors">
              <GraduationCap size={28} className="text-[var(--color-primary)]" />
            </div>
            <div className="text-4xl font-black text-[var(--color-text-primary)] mb-2 tracking-tight">$2.3M</div>
            <div className="text-xs font-black uppercase tracking-widest text-[var(--color-text-tertiary)]">Funding Matched</div>
          </div>
        </div>
      </section>

      {/* Featured Preview — Glassmorphism */}
      <section className="py-24 px-4 bg-[var(--color-surface)] relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-[var(--color-text-primary)] tracking-tight">Active Opportunities</h2>
              <p className="text-[var(--color-text-secondary)] font-medium mt-2">Surface high-impact scholarships currently open for application.</p>
            </div>
            <SignUpButton mode="modal">
              <button className="flex items-center gap-2 text-sm font-bold text-[var(--color-primary)] hover:underline">
                View all matches <ArrowRight size={16} />
              </button>
            </SignUpButton>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.map((item) => (
              <div key={item.id} className="group bg-white rounded-[var(--radius-xl)] p-6 border border-[var(--color-border)] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-surface)] flex items-center justify-center">
                      <Compass size={20} className="text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--color-text-primary)] line-clamp-1 text-sm">{item.provider}</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)]">
                        {item.deadline ? `Due ${new Date(item.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : "Open"}
                      </p>
                    </div>
                  </div>
                  
                  <h4 className="text-[17px] font-black text-[var(--color-text-primary)] leading-tight mb-4 group-hover:text-[var(--color-primary)] transition-colors">
                    {item.title}
                  </h4>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-[var(--color-surface)] text-[var(--color-text-secondary)] text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-[var(--color-border)]">
                      {item.eligibleDegrees[0] || 'Any Degree'}
                    </span>
                    <span className="bg-[var(--color-primary-surface)] text-[var(--color-primary)] text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-[var(--color-primary-border)]">
                      Full Funding
                    </span>
                  </div>
                </div>
                
                <SignUpButton mode="modal">
                  <button className="w-full h-12 rounded-[var(--radius-lg)] border-2 border-[var(--color-text-primary)] text-[13px] font-black hover:bg-[var(--color-text-primary)] hover:text-white transition-all active:scale-95">
                    Unlock details
                  </button>
                </SignUpButton>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-white relative z-10 overflow-hidden text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-[var(--color-text-primary)] leading-[1.1]">
            Your education shouldn't be limited by your budget.
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] font-medium max-w-xl mx-auto">
            Join thousands of African students who have already found their match. Start your application journey today.
          </p>
          <SignUpButton mode="modal">
            <button className="h-16 px-12 rounded-[var(--radius-xl)] text-[15px] font-black bg-[var(--color-primary)] text-white hover:brightness-105 active:scale-[0.98] transition-all shadow-2xl">
              Create My Profile
            </button>
          </SignUpButton>
        </div>
      </section>

      {/* Minimalist Footer */}
      <footer className="border-t border-[var(--color-border)] py-12 px-6 bg-white relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <div className="font-black text-xl text-[var(--color-text-primary)] tracking-tight mb-1">ScholarMatch</div>
            <p className="text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest">Built for African Excellence</p>
          </div>
          
          <div className="flex items-center gap-8">
            <Link href="/privacy" className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest hover:text-[var(--color-primary)] transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest hover:text-[var(--color-primary)] transition-colors">Terms</Link>
            <Link href="mailto:support@scholarmatch.af" className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest hover:text-[var(--color-primary)] transition-colors">Contact</Link>
          </div>
          
          <div className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest">
            © 2026 ScholarMatch. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

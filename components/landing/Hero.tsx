"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { ScholarshipCard } from "@/components/dashboard/ScholarshipCard";

const MOCK_SCHOLARSHIPS = [
  {
    id: "hero-1",
    title: "Mastercard Foundation Scholars Program",
    provider: "University of Edinburgh",
    deadline: new Date(Date.now() + 86400000 * 30),
    matchScore: 0.98,
    eligibleDegrees: ["MASTERS", "UNDERGRADUATE"],
    currency: "GBP",
    amount: null,
    eligibilityParsed: { fundingType: "full" },
    sourceUrl: "",
    sourceDomain: "ed.ac.uk",
    description: null,
    eligibleNationalities: ["African"],
    fieldsOfStudy: [],
    eligibilityRaw: null,
    verified: true,
    isActive: true,
    lastCrawledAt: null,
    lastChangedAt: null,
    matchBreakdown: {
      nationality: { pass: true, label: "African citizens" },
      degreeLevel: { pass: true, label: "Masters" },
      field: { pass: true, label: "Any" },
      gpa: { pass: true, label: "Required" },
      financialNeed: { pass: true, label: "Required" },
      workExperience: { pass: true, label: "Not required" },
    }
  },
  {
    id: "hero-2",
    title: "Chevening Scholarships",
    provider: "UK Government",
    deadline: new Date(Date.now() + 86400000 * 45),
    matchScore: 0.95,
    eligibleDegrees: ["MASTERS"],
    currency: "GBP",
    amount: null,
    eligibilityParsed: { fundingType: "full" },
    sourceUrl: "",
    sourceDomain: "chevening.org",
    description: null,
    eligibleNationalities: ["Global"],
    fieldsOfStudy: [],
    eligibilityRaw: null,
    verified: true,
    isActive: true,
    lastCrawledAt: null,
    lastChangedAt: null,
    matchBreakdown: {
      nationality: { pass: true, label: "Global" },
      degreeLevel: { pass: true, label: "Masters" },
      field: { pass: true, label: "Any" },
      gpa: { pass: true, label: "Required" },
      financialNeed: { pass: true, label: "Not strictly need-based" },
      workExperience: { pass: true, label: "2 years required" },
    }
  },
  {
    id: "hero-3",
    title: "Rhodes Scholarship",
    provider: "Oxford University",
    deadline: new Date(Date.now() + 86400000 * 60),
    matchScore: 0.92,
    eligibleDegrees: ["MASTERS", "PHD"],
    currency: "GBP",
    amount: null,
    eligibilityParsed: { fundingType: "full" },
    sourceUrl: "",
    sourceDomain: "ox.ac.uk",
    description: null,
    eligibleNationalities: ["Global"],
    fieldsOfStudy: [],
    eligibilityRaw: null,
    verified: true,
    isActive: true,
    lastCrawledAt: null,
    lastChangedAt: null,
    matchBreakdown: {
      nationality: { pass: true, label: "Global" },
      degreeLevel: { pass: true, label: "Masters, PhD" },
      field: { pass: true, label: "Any" },
      gpa: { pass: true, label: "Required" },
      financialNeed: { pass: true, label: "Not required" },
      workExperience: { pass: true, label: "Not required" },
    }
  }
];

export default function Hero() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const cardsY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <section ref={heroRef} className="relative min-h-screen pt-24 pb-16 flex items-center overflow-hidden">
      <div className="max-w-[1440px] mx-auto w-full px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-[55%_45%] items-center">
        {/* Left Side: Editorial Content */}
        <div className="flex flex-col pt-12 lg:pt-0 z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          >
            <div className="text-[11px] font-ui font-medium text-moss tracking-[0.12em] uppercase mb-8">
              Scholarship Discovery
            </div>
            
            <h1 className="text-[clamp(2.5rem,8vw,3.5rem)] lg:text-[clamp(3rem,6vw,5.5rem)] font-editorial font-light text-ink leading-[0.95] tracking-[-0.02em] whitespace-pre-line">
              {"Your next chapter\nbegins somewhere\nunexpected."}
            </h1>
            
            <p className="text-[1.125rem] font-ui font-normal text-ink-secondary leading-[1.6] max-w-[420px] mt-[28px]">
              Discover scholarships curated around your ambitions, background, and future.
            </p>

            <div className="flex items-center gap-4 mt-[40px]">
              <button
                onClick={() => router.push('/sign-up')}
                className="h-12 px-8 bg-moss text-white rounded-full font-ui font-medium text-[15px] hover:bg-moss-dark transition-colors"
              >
                Start matching &rarr;
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("how-it-works");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="h-12 px-6 text-ink hover:text-moss transition-colors font-ui font-medium text-[15px]"
              >
                See how it works
              </button>
            </div>

            <div className="flex items-center gap-[32px] mt-[48px] text-[13px] font-ui text-ink-secondary">
              <span>4M+ African students</span>
              <div className="h-4 w-px bg-border" />
              <span>500+ scholarships</span>
              <div className="h-4 w-px bg-border" />
              <span>Free forever</span>
            </div>
          </motion.div>
          
          {/* Mobile Single Card Feature */}
          <div className="lg:hidden mt-16 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
            >
              <ScholarshipCard scholarship={MOCK_SCHOLARSHIPS[0] as any} />
            </motion.div>
          </div>
        </div>

        {/* Right Side: Floating Cards (Desktop Only) */}
        <div className="hidden lg:block relative h-[600px] w-full mt-[-60px]">
          <motion.div 
            style={{ y: glowY }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
            initial={{ background: "radial-gradient(circle, rgba(95,111,82,0) 0%, rgba(201,168,106,0) 40%, transparent 70%)" }}
            animate={{ background: "radial-gradient(circle, rgba(95,111,82,0.15) 0%, rgba(201,168,106,0.08) 40%, transparent 70%)" }}
            transition={{ duration: 2 }}
          />

          <motion.div style={{ y: cardsY }} className="relative w-full h-full">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
              className="absolute pointer-events-none scale-90"
              style={{ top: "160px", right: "80px", zIndex: 10, width: "320px" }}
            >
              <ScholarshipCard scholarship={MOCK_SCHOLARSHIPS[2] as any} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
              className="absolute pointer-events-none scale-95"
              style={{ top: "80px", right: "40px", zIndex: 20, width: "320px" }}
            >
              <ScholarshipCard scholarship={MOCK_SCHOLARSHIPS[1] as any} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
              className="absolute pointer-events-none"
              style={{ top: "0px", right: "0px", zIndex: 30, width: "320px" }}
            >
              <ScholarshipCard scholarship={MOCK_SCHOLARSHIPS[0] as any} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

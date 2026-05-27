"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowsClockwise } from "@phosphor-icons/react";
import { ScholarshipCard } from "@/components/dashboard/ScholarshipCard";

const MOCK_SCHOLARSHIP = {
  id: "bento-1",
  title: "Commonwealth Masters Scholarships",
  provider: "UK Foreign, Commonwealth & Development Office",
  deadline: new Date(Date.now() + 86400000 * 50),
  matchScore: 0.96,
  eligibleDegrees: ["MASTERS"],
  currency: "GBP",
  amount: null,
  eligibilityParsed: { fundingType: "full" },
  sourceUrl: "",
  sourceDomain: "cscuk.fcdo.gov.uk",
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
};

export default function BentoFeatures() {
  const scrollVariants = {
    hidden: { opacity: 0, y: 48, filter: 'blur(4px)' },
    visible: { 
      opacity: 1, y: 0, filter: 'blur(0px)',
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as any, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } }
  };

  return (
    <section 
      id="features"
      data-section="light"
      className="bg-surface py-[clamp(80px,12vw,140px)] px-6 overflow-hidden relative"
    >
      <div className="max-w-[1180px] mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={scrollVariants}
          className="text-center mb-[60px] md:mb-[80px]"
        >
          <div className="font-ui text-[11px] font-medium uppercase tracking-[0.12em] text-moss mb-4">
            WHAT YOU GET
          </div>
          <h2 className="font-editorial text-[clamp(2.5rem,5vw,48px)] font-light text-ink leading-tight mb-4">
            Everything between you<br className="hidden sm:block"/> and your scholarship.
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={scrollVariants}
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          {/* ROW 1 */}
          {/* LARGE CARD: AI Matching Engine (8 col) */}
          <motion.div variants={itemVariants} className="md:col-span-8 bg-[#0A0A0A] border border-white/5 rounded-[20px] p-[40px] min-h-[320px] relative overflow-hidden group hover:-translate-y-1 hover:border-moss/30 transition-all duration-300">
            <div className="relative z-10">
              <div className="font-ui text-[11px] font-medium uppercase tracking-[0.1em] text-moss mb-[24px]">
                MATCHING ENGINE
              </div>
              <h3 className="font-editorial text-[32px] font-normal text-white leading-tight mb-[16px]">
                See exactly why you qualify.
              </h3>
              <p className="font-ui text-[15px] text-white/55 max-w-[360px] leading-[1.6]">
                Every match shows you the full breakdown. Pass, fail, or partial — with the original text from the source.
              </p>
            </div>
            
            {/* Visual (Bottom Right) */}
            <div className="absolute right-[-20px] bottom-[-20px] w-[340px] bg-[#171717] border border-white/10 rounded-tl-[16px] p-6 shadow-[inset_0_0_80px_rgba(95,111,82,0.08)]">
              <div className="flex items-center gap-3 py-1.5">
                <div className="w-5 h-5 rounded-full bg-[#1E2B1A] flex items-center justify-center text-[#8DA67D] text-[12px]">✓</div>
                <span className="text-[13px] font-ui text-white/60">Nigerian nationality eligible</span>
              </div>
              <div className="flex items-center gap-3 py-1.5">
                <div className="w-5 h-5 rounded-full bg-[#1E2B1A] flex items-center justify-center text-[#8DA67D] text-[12px]">✓</div>
                <span className="text-[13px] font-ui text-white/60">Masters level confirmed</span>
              </div>
            </div>
          </motion.div>

          {/* SMALL CARD: Freshness Monitoring (4 col) */}
          <motion.div variants={itemVariants} className="md:col-span-4 bg-bg border border-border rounded-[20px] p-[32px] min-h-[320px] relative group hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-[40px] h-[40px] rounded-full bg-moss-light flex items-center justify-center mb-6">
                <ArrowsClockwise size={20} className="text-moss" />
              </div>
              <div className="font-ui text-[11px] font-medium uppercase tracking-[0.1em] text-moss mb-2">
                FRESHNESS MONITORING
              </div>
              <h3 className="font-editorial text-[26px] font-normal text-ink leading-tight mb-2">
                Always up to date.
              </h3>
              <p className="font-ui text-[14px] text-ink-secondary leading-[1.6]">
                Saved scholarships re-checked every 72 hours. We alert you the moment anything changes.
              </p>
            </div>
            
            {/* Visual */}
            <div className="mt-8 bg-warning-surface border border-warning/30 p-3 rounded-[10px]">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-ui font-medium text-warning">⚠ Deadline moved to Mar 15</span>
              </div>
            </div>
          </motion.div>


          {/* ROW 2 */}
          {/* SMALL CARD: Deadline Reminders (4 col) */}
          <motion.div variants={itemVariants} className="md:col-span-4 bg-moss rounded-[20px] p-[32px] min-h-[320px] relative group hover:bg-moss-dark transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="font-ui text-[11px] font-medium uppercase tracking-[0.1em] text-white/60 mb-2">
                NEVER MISS A DEADLINE
              </div>
              <h3 className="font-editorial text-[26px] font-normal text-white leading-tight mb-2">
                30, 7, 1 day ahead.
              </h3>
              <p className="font-ui text-[14px] text-white/70 leading-[1.6]">
                Email and push reminders timed exactly right.
              </p>
            </div>
            
            {/* Visual */}
            <div className="space-y-2 mt-8">
              <div className="bg-white rounded-[10px] py-2.5 px-3.5 shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-moss" />
                <span className="text-[13px] font-ui text-ink">30 days — Chevening</span>
              </div>
              <div className="bg-white/90 rounded-[10px] py-2.5 px-3.5 shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-warning" />
                <span className="text-[13px] font-ui text-ink">7 days — Swedish Inst.</span>
              </div>
              <div className="bg-white/80 rounded-[10px] py-2.5 px-3.5 shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-urgent" />
                <span className="text-[13px] font-ui text-ink">1 day — DAAD</span>
              </div>
            </div>
          </motion.div>

          {/* SMALL CARD: Long-tail Matching (4 col) */}
          <motion.div variants={itemVariants} className="md:col-span-4 bg-surface border border-border rounded-[20px] p-[32px] min-h-[320px] relative group hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="font-ui text-[11px] font-medium uppercase tracking-[0.1em] text-moss mb-2">
                UNIVERSITY-SPECIFIC
              </div>
              <h3 className="font-editorial text-[26px] font-normal text-ink leading-tight mb-2">
                Scholarships others miss.
              </h3>
              <p className="font-ui text-[14px] text-ink-secondary leading-[1.6]">
                Department-level awards buried in university websites, surfaced for your exact programme.
              </p>
            </div>
            
            {/* Visual */}
            <div className="mt-8 bg-clay-light border border-clay/20 p-4 rounded-[12px]">
              <div className="text-[12px] font-ui text-clay font-medium mb-1">Uppsala University</div>
              <div className="text-[14px] font-editorial text-ink mb-2">Microbiology Masters Award</div>
              <div className="inline-flex bg-white px-2 py-1 rounded text-[11px] font-ui text-ink-secondary shadow-sm">
                Less than 40 applicants last cycle
              </div>
            </div>
          </motion.div>

          {/* SMALL CARD: African-First (4 col) */}
          <motion.div variants={itemVariants} className="md:col-span-4 bg-[#0A0A0A] border border-white/5 rounded-[20px] p-[32px] min-h-[320px] relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div className="relative z-10">
              <div className="font-ui text-[11px] font-medium uppercase tracking-[0.1em] text-white mb-2">
                BUILT FOR AFRICA
              </div>
              <h3 className="font-editorial text-[26px] font-normal text-white leading-tight mb-2">
                54 countries. All of us.
              </h3>
              <p className="font-ui text-[14px] text-white/55 leading-[1.6]">
                The only matching platform built from the ground up for African students.
              </p>
            </div>
            
            {/* Visual: Abstract SVG of Africa (decorative) */}
            <svg 
              className="absolute right-[-20%] bottom-[-10%] w-[200px] h-[200px] text-moss opacity-30" 
              viewBox="0 0 100 100" 
              fill="currentColor"
            >
              <path d="M46.7,11.2C44.6,9.5,41.9,8,38.8,7.9c-2.3,0-4.8,0.7-6.8,1.9C28.2,12,25.9,15.6,24.3,19.3 c-2,4.8-2.6,10.2-2.5,15.4c0,3.1,0.6,6.1,1.5,9.1c1.3,4.6,3.3,9,5.7,13.1c3.1,5.2,7,10,11.5,14.2c3.5,3.3,7.4,6.2,11.7,8.6 c3.3,1.9,7.1,3.4,10.9,3.7c3.9,0.3,7.9-0.5,11.4-2.2c3.5-1.7,6.6-4.3,9.1-7.4c2.6-3.2,4.6-7,5.8-11c1.6-5.3,1.6-11,0-16.3 c-1.2-4.1-3.2-7.9-5.8-11.2c-2.6-3.3-5.7-6.1-9.3-8.3c-4.4-2.6-9.4-4.2-14.5-4.5c-4.6-0.3-9.3,0.7-13.6,2.5 C44.8,25.4,45,20.6,46.7,11.2z" />
            </svg>
          </motion.div>


          {/* ROW 3 */}
          {/* MEDIUM CARD: Live Preview (6 col) */}
          <motion.div variants={itemVariants} className="md:col-span-6 bg-surface border border-border rounded-[20px] p-[40px] min-h-[380px] relative group hover:-translate-y-1 transition-all duration-300">
            <div className="font-ui text-[11px] font-medium uppercase tracking-[0.1em] text-moss mb-2">
              THE CARD
            </div>
            <h3 className="font-editorial text-[26px] font-normal text-ink leading-tight mb-8">
              Every detail you need.
            </h3>
            
            <div className="w-full max-w-[420px] mx-auto pointer-events-none transform scale-95 group-hover:scale-100 transition-transform duration-500 ease-out">
              <ScholarshipCard scholarship={MOCK_SCHOLARSHIP as any} />
            </div>
          </motion.div>

          {/* MEDIUM CARD: Mobile/PWA (6 col) */}
          <motion.div variants={itemVariants} className="md:col-span-6 bg-moss-light border border-moss/20 rounded-[20px] p-[40px] min-h-[380px] relative group hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between">
            <div>
              <div className="font-ui text-[11px] font-medium uppercase tracking-[0.1em] text-moss mb-2">
                WORKS EVERYWHERE
              </div>
              <h3 className="font-editorial text-[26px] font-normal text-ink leading-tight mb-2">
                Offline. On any phone.
              </h3>
              <p className="font-ui text-[15px] text-ink-secondary leading-[1.6] max-w-[320px]">
                Installs like an app. Works without signal. Built for African networks.
              </p>
            </div>
            
            {/* Visual: Phone Outline */}
            <div className="mt-8 mx-auto w-[220px] h-[340px] rounded-t-[32px] border-[6px] border-ink bg-white relative translate-y-[20px] group-hover:translate-y-[10px] transition-transform duration-500">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] h-[16px] bg-ink rounded-b-[10px]" />
              
              {/* Install Prompt Mockup */}
              <div className="absolute bottom-[40px] left-1/2 -translate-x-1/2 w-[180px] bg-surface border border-border shadow-md rounded-[12px] p-3 text-center">
                <div className="w-[32px] h-[32px] bg-moss rounded-md mx-auto mb-2" />
                <div className="text-[12px] font-ui font-medium text-ink">ScholarMatch</div>
                <div className="text-[10px] font-ui text-ink-secondary mb-2">Install App</div>
                <div className="bg-moss text-white text-[11px] py-1.5 rounded-full font-medium">Add to Home Screen</div>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}

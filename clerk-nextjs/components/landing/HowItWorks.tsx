"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Mockup components for visuals
const ProfileMockup = () => (
  <div className="w-full bg-surface border border-border rounded-[20px] shadow-[0_24px_64px_rgba(22,21,20,0.08)] p-6 overflow-hidden">
    <div className="text-sm font-ui font-medium text-ink mb-4">Degree Level</div>
    <div className="space-y-3">
      <div className="flex items-center justify-between p-4 rounded-[12px] border border-border">
        <span className="font-ui text-[14px] text-ink-secondary">Undergraduate</span>
        <div className="w-5 h-5 rounded-full border border-border" />
      </div>
      <div className="flex items-center justify-between p-4 rounded-[12px] border-2 border-moss bg-moss/5">
        <span className="font-ui text-[14px] font-medium text-moss">Masters</span>
        <div className="w-5 h-5 rounded-full border-4 border-moss flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-moss rounded-full" />
        </div>
      </div>
      <div className="flex items-center justify-between p-4 rounded-[12px] border border-border">
        <span className="font-ui text-[14px] text-ink-secondary">PhD</span>
        <div className="w-5 h-5 rounded-full border border-border" />
      </div>
    </div>
  </div>
);

const MatchMockup = () => (
  <div className="w-full bg-surface border border-border rounded-[20px] shadow-[0_24px_64px_rgba(22,21,20,0.08)] p-6 overflow-hidden">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-[48px] h-[48px] rounded-[10px] bg-moss-light flex items-center justify-center">
        <span className="text-moss font-ui font-bold text-[18px]">95%</span>
      </div>
      <div>
        <div className="text-[16px] font-editorial font-medium text-ink">DAAD Scholarship</div>
        <div className="text-[13px] font-ui text-ink-secondary">German Academic Exchange</div>
      </div>
    </div>
    
    <div className="space-y-2 mt-6">
      <div className="text-[11px] font-ui uppercase tracking-wider text-ink-tertiary mb-3">Eligibility Breakdown</div>
      
      <div className="flex items-center gap-3 py-1.5">
        <div className="w-5 h-5 rounded-full bg-success-surface flex items-center justify-center text-success text-[12px]">✓</div>
        <span className="text-[13px] font-ui text-ink-secondary">Nigerian nationality eligible</span>
      </div>
      <div className="flex items-center gap-3 py-1.5">
        <div className="w-5 h-5 rounded-full bg-success-surface flex items-center justify-center text-success text-[12px]">✓</div>
        <span className="text-[13px] font-ui text-ink-secondary">Masters level confirmed</span>
      </div>
      <div className="flex items-center gap-3 py-1.5">
        <div className="w-5 h-5 rounded-full bg-success-surface flex items-center justify-center text-success text-[12px]">✓</div>
        <span className="text-[13px] font-ui text-ink-secondary">Open to all fields</span>
      </div>
      <div className="flex items-start gap-3 py-1.5 bg-urgent-surface/30 p-2 -mx-2 rounded-md">
        <div className="w-5 h-5 rounded-full bg-urgent-surface flex items-center justify-center text-urgent text-[12px] mt-0.5">✕</div>
        <div>
          <span className="text-[13px] font-ui text-ink-secondary line-through">No work experience</span>
          <div className="text-[12px] font-ui text-urgent mt-0.5">Requires 2 years professional experience</div>
        </div>
      </div>
    </div>
  </div>
);

const AlertsMockup = () => (
  <div className="w-full bg-surface border border-border rounded-[20px] shadow-[0_24px_64px_rgba(22,21,20,0.08)] p-6 overflow-hidden space-y-4">
    {/* Change Alert */}
    <div className="bg-warning-surface border-l-2 border-warning p-3 rounded-r-md">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-4 h-4 rounded-full bg-warning flex items-center justify-center text-white text-[10px]">!</span>
        <span className="text-[12px] font-ui font-medium text-warning">Update Detected</span>
      </div>
      <div className="text-[13px] font-ui text-ink-secondary">Deadline moved to March 15th for Swedish Institute.</div>
    </div>
    
    {/* Saved Items */}
    <div className="border border-border rounded-[12px] p-4 flex justify-between items-center">
      <div>
        <div className="text-[14px] font-ui font-medium text-ink">Chevening Scholarship</div>
        <div className="text-[12px] font-ui text-ink-secondary">UK Government</div>
      </div>
      <div className="px-2 py-1 rounded-full bg-urgent-surface text-urgent text-[11px] font-medium">
        8 days left
      </div>
    </div>
    
    <div className="border border-border rounded-[12px] p-4 flex justify-between items-center">
      <div>
        <div className="text-[14px] font-ui font-medium text-ink">Rhodes Scholarship</div>
        <div className="text-[12px] font-ui text-ink-secondary">Oxford University</div>
      </div>
      <div className="px-2 py-1 rounded-full bg-warning-surface text-warning text-[11px] font-medium">
        24 days left
      </div>
    </div>
  </div>
);

const Chip = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex items-center bg-moss-light text-moss border border-moss-light rounded-full px-3 py-1 font-ui text-[12px]">
    {children}
  </div>
);

export default function HowItWorks() {
  const scrollVariants = {
    hidden: { opacity: 0, y: 48, filter: 'blur(4px)' },
    visible: { 
      opacity: 1, y: 0, filter: 'blur(0px)',
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as any }
    }
  };

  return (
    <section 
      id="how-it-works"
      data-section="light"
      className="bg-bg py-[clamp(80px,12vw,160px)] px-6 overflow-hidden relative"
    >
      <div className="max-w-[1180px] mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={scrollVariants}
          className="text-center mb-[80px] md:mb-[120px]"
        >
          <div className="font-ui text-[11px] font-medium uppercase tracking-[0.12em] text-moss mb-4">
            THE PROCESS
          </div>
          <h2 className="font-editorial text-[clamp(2.5rem,5vw,4rem)] font-light text-ink leading-tight mb-4">
            From zero to matched<br className="hidden sm:block"/> in 8 minutes.
          </h2>
          <p className="font-ui text-[17px] text-ink-secondary">
            Three steps. No jargon. No wasted time.
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Central Line (Desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-[10%] bottom-[10%] w-[1px] -translate-x-1/2 border-l border-dashed border-border" />

          {/* Step 1 */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            variants={scrollVariants}
            className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative mb-[120px] lg:mb-[160px]"
          >
            <div className="lg:w-1/2 flex justify-end relative">
              <div className="max-w-[460px] w-full relative">
                {/* Number Circle for mobile / Absolute number for desktop */}
                <div className="absolute -top-16 -left-8 font-editorial text-[96px] font-light text-border-strong opacity-40 select-none z-[-1] leading-none">
                  01
                </div>
                
                <div className="font-ui text-[11px] font-medium uppercase text-moss mb-3">
                  STEP ONE
                </div>
                <h3 className="font-editorial text-[36px] font-normal text-ink leading-tight mb-4">
                  Build your profile once.
                </h3>
                <p className="font-ui text-[16px] text-ink-secondary leading-[1.7] mb-6">
                  Tell us your nationality, degree level, field of study, GPA, and where you want to study. Takes under 3 minutes. Everything else is automatic.
                </p>
                <div className="flex flex-wrap gap-2 mt-[20px]">
                  <Chip>✓ Nationality detection</Chip>
                  <Chip>✓ GPA scale converter</Chip>
                  <Chip>✓ 54 African countries</Chip>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 flex justify-start w-full relative">
              <div className="max-w-[460px] w-full">
                <ProfileMockup />
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            variants={scrollVariants}
            className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-24 relative mb-[120px] lg:mb-[160px]"
          >
            <div className="lg:w-1/2 flex justify-start relative">
              <div className="max-w-[460px] w-full relative">
                <div className="absolute -top-16 -left-8 font-editorial text-[96px] font-light text-border-strong opacity-40 select-none z-[-1] leading-none">
                  02
                </div>
                
                <div className="font-ui text-[11px] font-medium uppercase text-moss mb-3">
                  STEP TWO
                </div>
                <h3 className="font-editorial text-[36px] font-normal text-ink leading-tight mb-4">
                  See exactly why you match.
                </h3>
                <p className="font-ui text-[16px] text-ink-secondary leading-[1.7] mb-6">
                  Our AI scores every scholarship against your profile — with full transparency. You see every pass and every fail before you spend a minute reading.
                </p>
                <div className="flex flex-wrap gap-2 mt-[20px]">
                  <Chip>✓ 7-criterion scoring</Chip>
                  <Chip>✓ GPA normalisation</Chip>
                  <Chip>✓ Original eligibility text always visible</Chip>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 flex justify-end w-full relative">
              <div className="max-w-[460px] w-full">
                <MatchMockup />
              </div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            variants={scrollVariants}
            className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative"
          >
            <div className="lg:w-1/2 flex justify-end relative">
              <div className="max-w-[460px] w-full relative">
                <div className="absolute -top-16 -left-8 font-editorial text-[96px] font-light text-border-strong opacity-40 select-none z-[-1] leading-none">
                  03
                </div>
                
                <div className="font-ui text-[11px] font-medium uppercase text-moss mb-3">
                  STEP THREE
                </div>
                <h3 className="font-editorial text-[36px] font-normal text-ink leading-tight mb-4">
                  Track it. We'll remind you.
                </h3>
                <p className="font-ui text-[16px] text-ink-secondary leading-[1.7] mb-6">
                  Save scholarships and we monitor them for you. Every 72 hours we re-check for deadline changes, closures, or updates. You get an alert before anything changes.
                </p>
                <div className="flex flex-wrap gap-2 mt-[20px]">
                  <Chip>✓ 30, 7, and 1-day reminders</Chip>
                  <Chip>✓ Freshness monitoring</Chip>
                  <Chip>✓ Push + email alerts</Chip>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 flex justify-start w-full relative">
              <div className="max-w-[460px] w-full">
                <AlertsMockup />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Hero() {
  const router = useRouter();

  return (
    <section 
      data-section="dark"
      className="relative min-h-screen bg-[#080808] flex flex-col items-center justify-center pt-[120px] px-6 pb-[80px] overflow-hidden"
    >
      {/* Ambient gradient mesh */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 40%, rgba(95,111,82,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 60%, rgba(201,168,106,0.08) 0%, transparent 60%)
          `
        }}
      />
      {/* Grain texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          mixBlendMode: "multiply",
          backgroundSize: "200px"
        }}
      />

      <div className="w-full max-w-[900px] z-10 text-center flex flex-col items-center">
        {/* Step 1: Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-ui text-[12px] font-medium text-white/45 tracking-[0.14em] uppercase mb-[28px]"
        >
          AI-POWERED SCHOLARSHIP MATCHING FOR AFRICAN STUDENTS
        </motion.div>

        {/* Step 2: Headline */}
        <h1 className="font-editorial font-light text-[clamp(3.5rem,8vw,7rem)] leading-[0.93] tracking-[-0.025em] text-[#F4F1EB] max-w-[820px]">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
          >
            Your future
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
          >
            already has
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <span className="text-[#8DA67D]">funding.</span>
          </motion.div>
        </h1>

        {/* Step 3: Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="font-ui text-[18px] font-normal text-[#F4F1EB]/55 leading-[1.6] max-w-[520px] mx-auto mt-[24px]"
        >
          Discover fully funded scholarships matched to your nationality, degree, and ambitions. Built for Africa.
        </motion.p>

        {/* Step 4: CTA Row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-[12px] mt-[40px]"
        >
          <button
            onClick={() => router.push('/sign-up')}
            className="px-[28px] py-[14px] bg-moss text-white rounded-full font-ui text-[15px] font-medium transition-all duration-300 hover:bg-[#3F4F38] hover:-translate-y-[2px] shadow-[0_12px_32px_rgba(95,111,82,0.4)]"
          >
            Find my scholarships &rarr;
          </button>
          <button
            onClick={() => {
              const el = document.getElementById("how-it-works");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-[24px] py-[14px] bg-transparent text-white/60 border border-white/20 rounded-full font-ui text-[15px] font-normal transition-all duration-300 hover:border-white/50 hover:text-white hover:bg-white/5"
          >
            See how it works
          </button>
        </motion.div>

        {/* Step 5: Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-[32px] mt-[56px] font-ui text-[13px] text-white/35"
        >
          <span>4M+ African students</span>
          <div className="w-[1px] h-[14px] bg-white/10" />
          <span>500+ scholarships</span>
          <div className="w-[1px] h-[14px] bg-white/10" />
          <span>54 countries</span>
          <div className="w-[1px] h-[14px] bg-white/10" />
          <span>Free forever</span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[32px] left-1/2 -translate-x-1/2 text-white/25"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </motion.div>
    </section>
  );
}

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function FinalCTA() {
  const router = useRouter();

  const scrollVariants = {
    hidden: { opacity: 0, y: 48, filter: 'blur(4px)' },
    visible: { 
      opacity: 1, y: 0, filter: 'blur(0px)',
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as any, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } }
  };

  return (
    <section 
      data-section="dark"
      className="bg-[#080808] border-t border-white/[0.06] py-[clamp(100px,15vw,160px)] px-6 overflow-hidden relative"
    >
      {/* Ambient gradient */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 80% at 50% 100%, rgba(95,111,82,0.08) 0%, transparent 70%)`
        }}
      />

      <div className="max-w-[800px] mx-auto text-center relative z-10 flex flex-col items-center">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={scrollVariants}
          className="flex flex-col items-center w-full"
        >
          <motion.div variants={itemVariants} className="font-ui text-[11px] font-medium uppercase tracking-[0.14em] text-moss mb-8">
            READY?
          </motion.div>
          
          <motion.h2 variants={itemVariants} className="font-editorial text-[clamp(3.5rem,8vw,6rem)] font-light text-[#F4F1EB] leading-[0.95] tracking-[-0.02em] mb-12">
            Stop searching.<br />
            Start applying.
          </motion.h2>

          <motion.div variants={itemVariants} className="flex flex-col items-center">
            <button
              onClick={() => router.push('/sign-up')}
              className="px-[32px] py-[16px] bg-moss text-white rounded-full font-ui text-[16px] font-medium transition-all duration-300 hover:bg-[#3F4F38] hover:-translate-y-[2px] shadow-[0_12px_32px_rgba(95,111,82,0.4)] mb-4"
            >
              Find my scholarships &rarr;
            </button>
            <p className="font-ui text-[13px] text-white/30">
              No account required to explore.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

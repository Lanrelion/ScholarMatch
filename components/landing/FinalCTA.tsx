"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function FinalCTA() {
  const router = useRouter();

  // Temporary increase grain overlay opacity
  useEffect(() => {
    const grain = document.querySelector('.grain-overlay') as HTMLElement;
    if (grain) {
      // It's technically better to use a localized grain or CSS class,
      // but since the grain is global we can just rely on the component mount.
      // We'll just render a localized grain here to keep it strictly contained to the moss section.
    }
  }, []);

  return (
    <section className="relative py-[clamp(80px,12vw,140px)] bg-moss w-full text-white overflow-hidden text-center">
      {/* Localized stronger grain for this section only */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      <div className="max-w-[1440px] mx-auto w-full px-6 lg:px-12 relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
        >
          <div className="text-[11px] font-ui font-medium tracking-[0.12em] uppercase mb-6 text-white/90">
            Start Free Today
          </div>
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-editorial font-light leading-[1.1] mb-6 max-w-2xl mx-auto">
            {"Your scholarship is out there.\nLet's find it."}
          </h2>
          <p className="text-[18px] font-ui font-normal text-white/80 mb-10 max-w-md mx-auto">
            Join thousands of African students already matched.
          </p>
          
          <button
            onClick={() => router.push('/sign-up')}
            className="h-14 px-8 bg-white text-moss rounded-full font-ui font-medium text-[15px] hover:bg-bg transition-colors inline-flex items-center gap-2 shadow-xl shadow-black/10 hover:scale-[1.02] active:scale-[0.98]"
          >
            Find my scholarships &rarr;
          </button>
        </motion.div>
      </div>
    </section>
  );
}

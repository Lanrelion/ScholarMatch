"use client";

import React from "react";
import { motion } from "framer-motion";

const TRUSTED_SCHOLARSHIPS = [
  "Chevening",
  "DAAD",
  "Mastercard Foundation",
  "Swedish Institute",
  "Commonwealth",
  "Erasmus Mundus"
];

export default function TrustBar() {
  return (
    <section 
      style={{
        background: "linear-gradient(to bottom, #080808 0%, var(--color-bg) 100%)"
      }}
      className="w-full pt-[48px] px-6 pb-[64px] flex flex-col items-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as any }}
        className="w-full max-w-[1180px] mx-auto flex flex-col items-center"
      >
        <h3 className="font-ui text-[11px] font-medium uppercase tracking-[0.12em] text-ink-tertiary mb-[32px] text-center">
          TRUSTED BY STUDENTS APPLYING TO
        </h3>
        
        <div className="flex flex-wrap items-center justify-center gap-[40px]">
          {TRUSTED_SCHOLARSHIPS.map((name, idx) => (
            <React.Fragment key={name}>
              <span className="font-ui text-[14px] font-medium text-ink-tertiary transition-colors duration-200 hover:text-ink-secondary cursor-default">
                {name}
              </span>
              {idx < TRUSTED_SCHOLARSHIPS.length - 1 && (
                <span className="text-[16px] text-border leading-none select-none">
                  &middot;
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

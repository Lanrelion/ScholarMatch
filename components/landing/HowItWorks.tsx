"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    num: "01",
    title: "Build your profile",
    body: "Tell us your nationality, degree level, field, and goals. Takes 3 minutes."
  },
  {
    num: "02",
    title: "Get matched instantly",
    body: "Our AI scores every scholarship against your profile — with full transparency on why."
  },
  {
    num: "03",
    title: "Track and apply",
    body: "Save scholarships. Get deadline reminders. Never miss an opportunity again."
  }
];

export default function HowItWorks() {
  return (
    <section 
      id="how-it-works" 
      className="py-[clamp(80px,12vw,140px)] px-6 lg:px-12 max-w-[1440px] mx-auto w-full"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
        className="mb-16 lg:mb-24"
      >
        <div className="text-[11px] font-ui font-medium text-moss tracking-[0.12em] uppercase mb-4">
          The Process
        </div>
        <h2 className="text-[48px] font-editorial font-light text-ink leading-tight whitespace-pre-line">
          {"From search to scholarship\nin under 8 minutes."}
        </h2>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-0 relative">
        {/* Horizontal connecting line on desktop */}
        <div className="hidden lg:block absolute top-[40px] left-0 right-[20%] h-[1px] bg-border z-0" />

        {STEPS.map((step, index) => (
          <motion.div 
            key={step.num}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: index * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
            className={cn(
              "flex-1 relative z-10",
              index !== STEPS.length - 1 && "lg:pr-12"
            )}
          >
            <div className="text-[80px] font-editorial font-light text-border-strong leading-none mb-6">
              {step.num}
            </div>
            <h3 className="text-[24px] font-editorial font-normal text-ink mb-3">
              {step.title}
            </h3>
            <p className="text-[15px] font-ui font-normal text-ink-secondary leading-[1.6] max-w-[320px]">
              {step.body}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

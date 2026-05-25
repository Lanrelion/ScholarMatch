"use client";

import React from "react";
import { motion } from "framer-motion";

const STORIES = [
  {
    quote: "I found the Swedish Institute Scholarship in 8 minutes. Three months later, I was packing for Stockholm.",
    name: "Amara",
    origin: "Nigeria",
  },
  {
    quote: "I'd spent weeks on spreadsheets. ScholarMatch showed me opportunities I didn't know existed for my field.",
    name: "Kwame",
    origin: "Ghana",
  },
  {
    quote: "The deadline reminder saved me. I almost missed Chevening. Now I'm in London.",
    name: "Fatima",
    origin: "Kenya",
  }
];

export default function StudentStories() {
  return (
    <section className="py-[clamp(80px,12vw,140px)] bg-bg w-full">
      <div className="max-w-[1440px] mx-auto w-full px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
          className="mb-16 lg:mb-20 text-center"
        >
          <div className="text-[11px] font-ui font-medium text-moss tracking-[0.12em] uppercase mb-4">
            Student Voices
          </div>
          <h2 className="text-[40px] font-editorial font-light italic text-ink leading-tight">
            Real students. Real scholarships.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STORIES.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
              className="bg-bg border border-border rounded-xl p-8 flex flex-col h-full relative"
            >
              <div className="text-[80px] font-editorial font-light text-moss opacity-40 leading-none absolute top-4 left-6 pointer-events-none">
                "
              </div>
              <p className="text-[20px] font-editorial font-normal italic text-ink leading-[1.6] mb-8 relative z-10 pt-4">
                {story.quote}
              </p>
              
              <div className="mt-auto">
                <div className="text-[13px] font-ui font-medium text-moss">
                  — {story.name}
                </div>
                <div className="text-[12px] font-ui font-normal text-ink-secondary mt-1">
                  {story.origin}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

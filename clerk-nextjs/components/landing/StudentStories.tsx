"use client";

import React from "react";
import { motion } from "framer-motion";

const STORIES = [
  {
    id: "amara",
    name: "Amara O.",
    country: "Nigeria",
    destination: "UK",
    quote: "I almost didn't apply because I thought I needed 5 years of experience. ScholarMatch showed me I only needed 2.",
    scholarship: "Chevening Scholarship",
    university: "University of Warwick",
    gradient: "linear-gradient(135deg, #C8102E 0%, #FFFFFF 50%, #012169 100%)" // UK flag vibe
  },
  {
    id: "kwame",
    name: "Kwame A.",
    country: "Ghana",
    destination: "Germany",
    quote: "The freshness monitor saved me. DAAD changed their deadline by two weeks, and I got the alert before anyone else.",
    scholarship: "DAAD Scholarship",
    university: "TU Munich",
    gradient: "linear-gradient(135deg, #000000 0%, #DD0000 50%, #FFCC00 100%)" // Germany flag vibe
  },
  {
    id: "fatima",
    name: "Fatima M.",
    country: "Kenya",
    destination: "Sweden",
    quote: "Finding fully-funded programs for Environmental Science felt impossible. The matching engine found four.",
    scholarship: "Swedish Institute",
    university: "Lund University",
    gradient: "linear-gradient(135deg, #005293 0%, #005293 40%, #FECC02 50%, #005293 60%, #005293 100%)" // Sweden flag vibe
  }
];

export default function StudentStories() {
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
      id="stories"
      data-section="light"
      className="bg-bg py-[clamp(80px,12vw,140px)] px-6 overflow-hidden relative"
    >
      <div className="max-w-[1180px] mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={scrollVariants}
          className="text-center mb-[60px] md:mb-[100px]"
        >
          <div className="font-ui text-[11px] font-medium uppercase tracking-[0.12em] text-moss mb-4">
            PROVING IT WORKS
          </div>
          <h2 className="font-editorial text-[clamp(2.5rem,5vw,48px)] font-light text-ink leading-tight">
            Next stop: the world.
          </h2>
        </motion.div>

        {/* Stories Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={scrollVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {STORIES.map((story) => (
            <motion.div 
              key={story.id} 
              variants={itemVariants}
              className="bg-surface border border-border rounded-[20px] overflow-hidden group hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Destination Strip */}
              <div 
                className="h-[8px] w-full"
                style={{ background: story.gradient }}
              />
              
              <div className="p-[32px] flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-[32px]">
                  <div>
                    <div className="font-ui text-[15px] font-medium text-ink">{story.name}</div>
                    <div className="font-ui text-[13px] text-ink-secondary">From {story.country}</div>
                  </div>
                  <div className="px-3 py-1 bg-moss-light text-moss border border-moss/20 rounded-full font-ui text-[11px] font-medium tracking-[0.06em]">
                    ACCEPTED
                  </div>
                </div>
                
                <p className="font-editorial text-[20px] font-light italic text-ink leading-[1.6] mb-[40px] flex-grow">
                  "{story.quote}"
                </p>
                
                <div className="pt-[24px] border-t border-border">
                  <div className="font-ui text-[14px] font-medium text-ink mb-1">
                    {story.scholarship}
                  </div>
                  <div className="font-ui text-[13px] text-ink-secondary">
                    {story.university} · {story.destination}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

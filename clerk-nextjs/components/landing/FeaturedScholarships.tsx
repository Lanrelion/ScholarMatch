"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ScholarshipCard } from "@/components/dashboard/ScholarshipCard";
import { motion } from "framer-motion";

export default function FeaturedScholarships() {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch("/api/scholarships?limit=6");
        if (res.ok) {
          const data = await res.json();
          setScholarships(data.scholarships || []);
        }
      } catch (err) {
        console.error("Failed to fetch featured scholarships", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <section id="featured-scholarships" className="py-[clamp(80px,12vw,140px)] bg-surface w-full overflow-hidden">
      <div className="max-w-[1440px] mx-auto w-full px-6 lg:px-12 mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any as any }}
          >
            <div className="text-[11px] font-ui font-medium text-moss tracking-[0.12em] uppercase mb-4">
              Open Now
            </div>
            <h2 className="text-[40px] font-editorial font-light text-ink leading-tight">
              Scholarships waiting for you.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Link 
              href="/sign-up" 
              className="text-[14px] font-ui font-medium text-moss hover:text-moss-dark transition-colors flex items-center gap-1"
            >
              View all scholarships &rarr;
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto w-full pl-6 lg:pl-12">
        <div className="flex gap-[20px] overflow-x-auto pb-8 pt-2 px-2 -mx-2 snap-x snap-mandatory no-scrollbar">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div 
                key={i} 
                className="w-[320px] h-[380px] shrink-0 bg-bg rounded-2xl border border-border animate-pulse snap-start" 
              />
            ))
          ) : (
            scholarships.map((scholarship, i) => (
              <div key={scholarship.id} className="w-[320px] shrink-0 snap-start">
                <ScholarshipCard scholarship={scholarship} delay={i * 0.1} />
              </div>
            ))
          )}
          
          {/* Spacer for right padding on horizontal scroll */}
          <div className="w-[24px] lg:w-[48px] shrink-0" />
        </div>
      </div>
    </section>
  );
}

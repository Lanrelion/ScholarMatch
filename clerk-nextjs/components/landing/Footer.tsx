"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-white/[0.06] pt-[64px] pb-[40px] px-6">
      <div className="max-w-[1180px] mx-auto">
        
        {/* Top Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-[48px] lg:gap-0">
          
          {/* Left Column */}
          <div className="flex flex-col max-w-[280px]">
            <Link href="/" className="font-editorial text-[20px] text-white/80 hover:text-white transition-colors mb-3">
              ScholarMatch
            </Link>
            <p className="font-ui text-[13px] text-white/30 leading-[1.6]">
              AI-powered scholarship matching for African students.
            </p>
          </div>

          {/* Right Columns Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-[64px] gap-y-[40px]">
            
            {/* Product Column */}
            <div className="flex flex-col">
              <span className="font-ui text-[11px] font-medium uppercase tracking-[0.1em] text-white/30 mb-6">
                Product
              </span>
              <div className="flex flex-col gap-4">
                <Link href="/discover" className="font-ui text-[14px] text-white/50 hover:text-white/80 transition-colors duration-180">
                  Discover
                </Link>
                <Link href="/saved" className="font-ui text-[14px] text-white/50 hover:text-white/80 transition-colors duration-180">
                  Saved
                </Link>
                <Link href="#how-it-works" className="font-ui text-[14px] text-white/50 hover:text-white/80 transition-colors duration-180">
                  How it works
                </Link>
              </div>
            </div>

            {/* Company Column */}
            <div className="flex flex-col">
              <span className="font-ui text-[11px] font-medium uppercase tracking-[0.1em] text-white/30 mb-6">
                Company
              </span>
              <div className="flex flex-col gap-4">
                <Link href="/about" className="font-ui text-[14px] text-white/50 hover:text-white/80 transition-colors duration-180">
                  About
                </Link>
                <Link href="/privacy" className="font-ui text-[14px] text-white/50 hover:text-white/80 transition-colors duration-180">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="font-ui text-[14px] text-white/50 hover:text-white/80 transition-colors duration-180">
                  Terms of Service
                </Link>
              </div>
            </div>

            {/* Connect Column */}
            <div className="flex flex-col">
              <span className="font-ui text-[11px] font-medium uppercase tracking-[0.1em] text-white/30 mb-6">
                Connect
              </span>
              <div className="flex flex-col gap-4">
                <a href="https://twitter.com/scholarmatch" target="_blank" rel="noopener noreferrer" className="font-ui text-[14px] text-white/50 hover:text-white/80 transition-colors duration-180">
                  Twitter/X
                </a>
                <a href="https://linkedin.com/company/scholarmatch" target="_blank" rel="noopener noreferrer" className="font-ui text-[14px] text-white/50 hover:text-white/80 transition-colors duration-180">
                  LinkedIn
                </a>
                <a href="mailto:support@scholarmatch.app" className="font-ui text-[14px] text-white/50 hover:text-white/80 transition-colors duration-180">
                  support@scholarmatch.app
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Row */}
        <div className="mt-[48px] pt-[24px] border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-ui text-[12px] text-white/25">
            &copy; 2026 ScholarMatch. All rights reserved.
          </div>
          <div className="font-ui text-[12px] text-white/25">
            Built for Africa 🌍
          </div>
        </div>

      </div>
    </footer>
  );
}

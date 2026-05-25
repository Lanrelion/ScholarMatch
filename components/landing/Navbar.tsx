"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 w-full h-[64px] z-50 transition-all duration-300 ease-[var(--ease-primary)] flex items-center justify-between px-6 lg:px-12",
        scrolled
          ? "bg-bg/90 backdrop-blur border-b border-border"
          : "bg-transparent border-b-transparent"
      )}
    >
      <div className="flex-none">
        <Link 
          href="/"
          className="text-[20px] font-editorial font-normal text-ink"
        >
          ScholarMatch
        </Link>
      </div>

      <div className="flex items-center justify-end">
        <div className="hidden md:flex items-center gap-8 mr-8">
          <button 
            onClick={() => {
              const el = document.getElementById("how-it-works");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-[14px] font-ui font-medium text-ink-secondary hover:text-ink transition-colors"
          >
            How it works
          </button>
          <button 
            onClick={() => {
              const el = document.getElementById("featured-scholarships");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-[14px] font-ui font-medium text-ink-secondary hover:text-ink transition-colors"
          >
            Scholarships
          </button>
        </div>
        
        <button
          onClick={() => router.push("/sign-up")}
          className="h-10 px-6 bg-moss text-white rounded-full font-ui font-medium text-[14px] hover:bg-moss-dark transition-colors"
        >
          Get started
        </button>
      </div>
    </nav>
  );
}

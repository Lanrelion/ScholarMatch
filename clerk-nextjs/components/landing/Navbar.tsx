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
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 w-full h-[64px] z-50 transition-all duration-300 ease-[var(--ease-primary)] flex items-center justify-between px-6 lg:px-12",
        scrolled
          ? "bg-bg/92 backdrop-blur-md border-b border-border"
          : "bg-transparent border-b-transparent"
      )}
    >
      <div className="flex-none">
        <Link 
          href="/"
          className={cn(
            "text-[20px] font-editorial font-normal transition-colors duration-300",
            scrolled ? "text-ink" : "text-white"
          )}
        >
          ScholarMatch
        </Link>
      </div>

      <div className="flex items-center justify-end gap-8">
        <div className="hidden lg:flex items-center gap-8">
          <button 
            onClick={() => {
              const el = document.getElementById("how-it-works");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className={cn(
              "text-[14px] font-ui font-normal transition-colors duration-300 hover:text-white",
              scrolled ? "text-ink-secondary hover:text-ink" : "text-white/70"
            )}
          >
            How it works
          </button>
          <button 
            onClick={() => router.push("/sign-in")}
            className={cn(
              "text-[14px] font-ui font-normal transition-colors duration-300 hover:text-white",
              scrolled ? "text-ink-secondary hover:text-ink" : "text-white/70"
            )}
          >
            Sign in
          </button>
        </div>
        
        <button
          onClick={() => router.push("/sign-up")}
          className={cn(
            "h-10 px-6 rounded-full font-ui font-medium text-[14px] transition-all duration-300",
            scrolled
              ? "bg-moss text-white hover:bg-moss-dark shadow-sm"
              : "bg-transparent border border-white/50 text-white hover:bg-white/10"
          )}
        >
          Get started &rarr;
        </button>
      </div>
    </nav>
  );
}

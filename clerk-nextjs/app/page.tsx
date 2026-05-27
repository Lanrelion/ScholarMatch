"use client";

import { ReactLenis } from 'lenis/react';
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import TrustBar from "@/components/landing/TrustBar";
import HowItWorks from "@/components/landing/HowItWorks";
import BentoFeatures from "@/components/landing/BentoFeatures";
import StudentStories from "@/components/landing/StudentStories";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <ReactLenis root>
      <main className="min-h-screen">
        <Navbar />
        
        {/* Dark sections */}
        <Hero />
        <TrustBar />
        
        {/* Light sections — parchment */}
        <HowItWorks />
        <BentoFeatures />
        <StudentStories />
        
        {/* Dark close */}
        <FinalCTA />
        <Footer />
      </main>
    </ReactLenis>
  );
}

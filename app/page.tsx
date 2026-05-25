"use client";

import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import FeaturedScholarships from "@/components/landing/FeaturedScholarships";
import StudentStories from "@/components/landing/StudentStories";
import FinalCTA from "@/components/landing/FinalCTA";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-bg flex flex-col">
      <Navbar />
      <Hero />
      <HowItWorks />
      <FeaturedScholarships />
      <StudentStories />
      <FinalCTA />
    </main>
  );
}

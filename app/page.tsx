"use client";

import { FloatingParticles } from "@/components/landing/floating-particles";
import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { PipelineShowcaseSection } from "@/components/landing/pipeline-showcase-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { ArchitectureSection } from "@/components/landing/architecture-section";
import { PerformanceSection } from "@/components/landing/performance-section";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <FloatingParticles />
      <Navbar />
      <HeroSection />
      <PipelineShowcaseSection />
      <ProblemSection />
      <FeaturesSection />
      <ArchitectureSection />
      <PerformanceSection />
      <CTASection />
      <Footer />
    </div>
  );
}

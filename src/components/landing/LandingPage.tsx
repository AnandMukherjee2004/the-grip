"use client";

import { useRevlineEffects } from "@/hooks/useRevlineEffects";
import { Navbar } from "./Navbar";
import { BeforeAfterSection } from "./BeforeAfterSection";
import { CtaSection } from "./CtaSection";
import { Footer } from "./Footer";
import { HeroSection } from "./HeroSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { Preloader } from "./Preloader";
import { PricingSection } from "./PricingSection";
import { ProblemSection } from "./ProblemSection";
import { ProofSection } from "./ProofSection";
import { SolutionSection } from "./SolutionSection";

export function LandingPage() {
  useRevlineEffects();

  return (
    <>
      <Preloader />
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <ProofSection />
      <BeforeAfterSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </>
  );
}

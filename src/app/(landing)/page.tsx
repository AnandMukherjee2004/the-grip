import Navbar from "@/components/landing/navbar";
import HeroSection from "@/components/landing/hero-section";
import InteractiveShowcase from "@/components/landing/interactive-showcase";
import { IntegrationsSection } from "@/components/landing/integrations-section";
import PlatformSection from "@/components/landing/platform-section";
import { PricingSection } from "@/components/landing/PricingSection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <InteractiveShowcase />
      <IntegrationsSection />
      <PlatformSection />
      <PricingSection />
      <Footer />
    </div>
  );
}

import { GripLogo } from "./GripLogo";
import { HeroCtas } from "./HeroCtas";

export function HeroSection() {
  return (
    <header
      className="hero hero-grip hero-premium"
      data-screen-label="01 Hero"
    >
      <div className="hero-ambient hero-ambient--nav" aria-hidden="true" />
      <div className="hero-ambient hero-ambient--title" aria-hidden="true" />
      <div className="hero-ambient hero-ambient--cta" aria-hidden="true" />
      <div className="hero-inner grip-hero">
        <p className="grip-slogan">
          Don&apos;t have <em>grip</em> on your System<span className="q">?</span>{" "}
          Use
        </p>
        <GripLogo />
        <HeroCtas />
      </div>
      <div className="scroll-hint" aria-hidden>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 6l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </header>
  );
}

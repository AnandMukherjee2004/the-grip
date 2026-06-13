"use client";

import { GripLogo } from "./GripLogo";

export function HeroSection() {
  return (
    <header className="hero hero-grip" data-screen-label="01 Hero">
      <div className="blob blob-indigo" />
      <div className="blob blob-rose" />
      <div className="hero-inner grip-hero">
        <p className="grip-slogan">
          Don&apos;t have <em>grip</em> on your System<span className="q">?</span>{" "}
          Use
        </p>
        <GripLogo />
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

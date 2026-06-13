"use client";

import { useEffect, useState } from "react";

export function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Background styling trigger
      if (currentScrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Hide/Show navbar behavior
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down -> hide
        setIsVisible(false);
      } else {
        // Scrolling up -> show
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* Floating Centered Navbar */}
      <nav
        className={`fixed left-1/2 z-50 w-[90%] max-w-[480px] rounded-full border bg-[#0d0d1a]/45 backdrop-blur-[20px] py-3 px-7 flex items-center justify-center transition-all duration-500 ease-out shadow-[0_8px_32px_rgba(0,0,0,0.5)] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] ${isScrolled
          ? "bg-[#0d0d1a]/65 border-white/20 shadow-[0_16px_48px_rgba(0,0,0,0.7)] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]"
          : "border-white/15"
          }`}
        style={{
          top: isVisible ? "24px" : "-80px",
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? "auto" : "none",
          transform: "translate3d(-50%, 0, 0)",
        }}
      >
        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <a
            href="#solution"
            className="font-sans text-sm font-medium text-[#9a9ac0] hover:text-white transition-colors duration-200"
          >
            Product
          </a>
          <a
            href="#pricing"
            className="font-sans text-sm font-medium text-[#9a9ac0] hover:text-white transition-colors duration-200"
          >
            Pricing
          </a>
          <a
            href="#blog"
            className="font-sans text-sm font-medium text-[#9a9ac0] hover:text-white transition-colors duration-200"
          >
            Blog
          </a>
          <a
            href="#docs"
            className="font-sans text-sm font-medium text-[#9a9ac0] hover:text-white transition-colors duration-200"
          >
            Docs
          </a>
        </div>
      </nav>

      {/* Floating Get Started Button (Top Right) */}
      <a
        href="/onboarding/tools"
        className={`fixed right-6 md:right-12 z-50 rounded-full border bg-[#0d0d1a]/45 backdrop-blur-[20px] py-3 px-6 flex items-center justify-center transition-all duration-500 ease-out font-sans text-sm font-medium text-white hover:text-indigo-200 active:scale-95 shadow-[0_8px_32px_rgba(0,0,0,0.5)] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] ${isScrolled
          ? "bg-[#0d0d1a]/65 border-white/20 shadow-[0_16px_48px_rgba(0,0,0,0.7)] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]"
          : "border-white/15"
          }`}
        style={{
          top: isVisible ? "24px" : "-80px",
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? "auto" : "none",
          transform: "translate3d(0, 0, 0)",
        }}
      >
        Get Started<span className="ml-2 inline-block">{"->"}</span>
      </a>
    </>
  );
}

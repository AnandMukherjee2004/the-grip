"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("opacity-0", "translate-y-8");
          entry.target.classList.add("opacity-100", "translate-y-0");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="pt-36 pb-16 bg-white relative overflow-hidden font-sans opacity-0 translate-y-8 transition-all duration-1000 ease-out"
    >
      {/* Subtle ambient light theme glows */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-indigo-50/20 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-sky-50/15 rounded-full blur-[110px] pointer-events-none -z-10" />

      <div className="max-w-[1440px] mx-auto px-8 lg:px-12 w-full">
        {/* The Split Hero Layout replicating Mora.com */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Left Column: Title & Watch Demo */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-normal tracking-tight text-gray-900 leading-[1.08]">
              <span className="text-gray-400">Your </span>data tools,
              <br />
              <span className="text-gray-400">finally in </span>one place.
            </h1>

            {/* Watch Demo button replicating Mora's thumbnail styling */}
            <button className="group mt-10 inline-flex items-center gap-3 p-1.5 pr-4 rounded-full border border-gray-200/80 hover:border-gray-300 hover:bg-gray-50/50 transition-all text-sm font-medium text-gray-800 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              {/* Fake Video Thumbnail preview */}
              <div className="relative w-12 h-8 rounded-lg overflow-hidden bg-gray-950 flex items-center justify-center shrink-0 shadow-inner">
                {/* Simulated screenshot thumbnail with blue gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-sky-400/20 opacity-90" />
                <div className="h-2 w-7 bg-white/30 rounded animate-pulse" />
                {/* Play icon overlay */}
                <div className="absolute w-4 h-4 rounded-full bg-white/95 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <svg className="w-2 h-2 text-gray-900 fill-current translate-x-[0.5px]" viewBox="0 0 8 8">
                    <path d="M1 0 L7 4 L1 8 Z" />
                  </svg>
                </div>
              </div>
              <span className="text-gray-700">
                Watch demo <span className="text-gray-400 font-normal">(2m)</span>
              </span>
            </button>
          </div>

          {/* Right Column: Subtext & CTAs */}
          <div className="lg:col-span-5 flex flex-col items-start justify-center pt-2 lg:pt-6 text-left">
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed">
              Explore your data, build your dashboard, bring your team together. GRIP connects Razorpay, Shopify, LeadSquared, Meta Ads, and more into your all-in-one revenue dashboard.
            </p>

            <div className="flex items-center gap-3.5 mt-8">
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center bg-gray-900 hover:bg-gray-800 !text-white font-medium rounded-full h-11 px-5 text-sm transition-all shadow-sm"
              >
                Get started free
              </Link>

              {/* Outline Book Demo CTA with Mora's stacked avatars */}
              <Link
                href="/onboarding?mode=demo"
                className="inline-flex items-center justify-center bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800 font-medium rounded-full h-11 px-5 text-sm transition-all gap-2"
              >
                <span>Book a demo</span>
                <div className="flex items-center -space-x-1.5 ml-1">
                  <div className="w-5 h-5 rounded-full border border-white bg-indigo-500 flex items-center justify-center overflow-hidden text-[7px] font-bold text-white shrink-0 shadow-sm">
                    AM
                  </div>
                  <div className="w-5 h-5 rounded-full border border-white bg-emerald-500 flex items-center justify-center overflow-hidden text-[7px] font-bold text-white shrink-0 shadow-sm">
                    JD
                  </div>
                </div>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

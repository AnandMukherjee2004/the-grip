"use client";

import React, { useEffect, useRef } from "react";

const integrations = [
  { name: "Razorpay", category: "Payments" },
  { name: "Shopify", category: "E-commerce" },
  { name: "LeadSquared", category: "CRM" },
  { name: "Meta Ads", category: "Advertising" },
  { name: "Google Ads", category: "Advertising" },
  { name: "LimeChat", category: "Communication" },
  { name: "WhatsApp Business", category: "Communication" },
  { name: "Cashfree", category: "Payments" },
  { name: "WooCommerce", category: "E-commerce" },
  { name: "Zoho CRM", category: "CRM" },
  { name: "HubSpot", category: "CRM" },
  { name: "Salesforce", category: "CRM" },
  { name: "Freshsales", category: "CRM" },
  { name: "Stripe", category: "Payments" },
];

export function IntegrationsSection() {
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
      id="integrations"
      className="relative pt-12 pb-24 bg-white border-t border-gray-150 overflow-hidden font-sans opacity-0 translate-y-8 transition-all duration-1000 ease-out"
    >

      {/* CSS style block updates */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee-loop {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-loop-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-track {
          display: flex;
          gap: 1.5rem;
          width: max-content;
          animation: marquee-loop 35s linear infinite;
        }
        .marquee-track-reverse {
          display: flex;
          gap: 1.5rem;
          width: max-content;
          animation: marquee-loop-reverse 35s linear infinite;
        }
        /* Pause both tracks simultaneously if the group container is hovered */
        .marquee-group:hover .marquee-track,
        .marquee-group:hover .marquee-track-reverse {
          animation-play-state: paused;
        }
      `}} />

      <div className="max-w-[1440px] mx-auto px-8 lg:px-12">
        {/* Header matching Mora aesthetics */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20 space-y-4">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 bg-gray-50/50 text-[11px] font-medium text-gray-500 shadow-sm select-none">
            <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Connectors
          </div>

          <h2 className="text-4xl sm:text-5xl font-normal tracking-tight text-gray-900 leading-[1.12]">
            <span className="text-gray-400">Connects to the </span>tools
            <br />
            <span className="text-gray-400">Indian SMBs </span>already use
          </h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            14 native connectors and growing. No data warehouse, no engineers, no waiting.
          </p>
        </div>
      </div>

      {/* Marquee Group Wrapper for hover control */}
      <div className="marquee-group space-y-6">
        {/* Full-width marquee */}
        <div className="w-full relative overflow-hidden">
          <div className="marquee-track">
            {[...Array(2)].map((_, setIndex) => (
              <div key={setIndex} className="flex gap-6 shrink-0">
                {integrations.map((integration, idx) => (
                  <div
                    key={`${integration.name}-${setIndex}-${idx}`}
                    className="shrink-0 px-8 py-5 border border-gray-150 hover:border-gray-300 hover:bg-gray-50/50 transition-all duration-300 group rounded-md bg-white min-w-[190px]"
                  >
                    <div className="text-base font-medium text-gray-900 group-hover:translate-x-1 transition-transform">
                      {integration.name}
                    </div>
                    <div className="text-xs text-gray-400 font-medium mt-1">{integration.category}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Reverse marquee */}
        <div className="w-full relative overflow-hidden">
          <div className="marquee-track-reverse">
            {[...Array(2)].map((_, setIndex) => (
              <div key={setIndex} className="flex gap-6 shrink-0">
                {[...integrations].reverse().map((integration, idx) => (
                  <div
                    key={`${integration.name}-reverse-${setIndex}-${idx}`}
                    className="shrink-0 px-8 py-5 border border-gray-150 hover:border-gray-300 hover:bg-gray-50/50 transition-all duration-300 group rounded-md bg-white min-w-[190px]"
                  >
                    <div className="text-base font-medium text-gray-900 group-hover:translate-x-1 transition-transform">
                      {integration.name}
                    </div>
                    <div className="text-xs text-gray-400 font-medium mt-1">{integration.category}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

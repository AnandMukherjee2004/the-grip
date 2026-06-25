"use client";

import React, { useEffect, useRef } from "react";

const integrations = [
  { name: "Razorpay", category: "Payments", logo: "/assets/crm-logos/razorpay.svg" },
  { name: "Shopify", category: "E-commerce", logo: "/assets/crm-logos/shopify.svg" },
  { name: "LeadSquared", category: "CRM", logo: "/assets/crm-logos/leadsquared.png" },
  { name: "Meta Ads", category: "Advertising", logo: "/assets/crm-logos/meta-ads.png" },
  { name: "Google Ads", category: "Advertising", logo: "/assets/crm-logos/google-ads.png" },
  { name: "LimeChat", category: "Communication", logo: "/assets/crm-logos/limechat.jpeg" },
  { name: "WhatsApp Business", category: "Communication", logo: "/assets/crm-logos/whatsapp.svg" },
  { name: "Cashfree", category: "Payments", logo: "/assets/crm-logos/Cashfree.svg" },
  { name: "WooCommerce", category: "E-commerce", logo: "/assets/crm-logos/WooCommerce_Logo.svg" },
  { name: "Zoho CRM", category: "CRM", logo: "/assets/crm-logos/zoho_logo_icon_169675.svg" },
  { name: "HubSpot", category: "CRM", logo: "/assets/crm-logos/hubspot.svg" },
  { name: "Salesforce", category: "CRM", logo: "/assets/crm-logos/salesforce.svg" },
  { name: "Freshsales", category: "CRM", logo: "/assets/crm-logos/freshsales.svg" },
  { name: "Stripe", category: "Payments", logo: "/assets/crm-logos/stripe.svg" },
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
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Header matching Grip aesthetics */}
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
                    className="shrink-0 px-6 py-4 border border-gray-150 hover:border-gray-300 hover:bg-gray-50/50 transition-all duration-300 group rounded-md bg-white min-w-[220px] flex items-center gap-4"
                  >
                    <div className="w-8 h-8 rounded border border-gray-100 flex items-center justify-center p-1 bg-white shrink-0 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={integration.logo} alt={integration.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 group-hover:translate-x-0.5 transition-transform">
                        {integration.name}
                      </div>
                      <div className="text-[11px] text-gray-400 font-medium">{integration.category}</div>
                    </div>
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
                    className="shrink-0 px-6 py-4 border border-gray-150 hover:border-gray-300 hover:bg-gray-50/50 transition-all duration-300 group rounded-md bg-white min-w-[220px] flex items-center gap-4"
                  >
                    <div className="w-8 h-8 rounded border border-gray-100 flex items-center justify-center p-1 bg-white shrink-0 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={integration.logo} alt={integration.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 group-hover:translate-x-0.5 transition-transform">
                        {integration.name}
                      </div>
                      <div className="text-[11px] text-gray-400 font-medium">{integration.category}</div>
                    </div>
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

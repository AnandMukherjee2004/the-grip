"use client";

import { useState, useEffect, useRef } from "react";

const plans = [
  {
    name: "Starter",
    description: "For founders just getting started",
    price: { monthly: 0, annual: 0 },
    features: [
      "2 connectors",
      "500 leads synced per month",
      "90-day data history",
      "1 workspace",
      "Unified orders + leads view",
      "Community support",
    ],
    cta: "Get started free",
    popular: false,
  },
  {
    name: "Growth",
    description: "For growing Indian SMBs",
    price: { monthly: 1999, annual: 1666 },
    features: [
      "6 connectors",
      "Unlimited leads synced",
      "1-year data history",
      "3 workspaces",
      "Pipeline tracking + attribution",
      "Meta Ads + Google Ads ROAS",
      "API access",
      "Email support",
    ],
    cta: "Start free trial",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For teams scaling fast",
    price: { monthly: null, annual: null },
    features: [
      "All 14+ connectors",
      "Unlimited workspaces",
      "Unlimited data history",
      "Multi-user with roles",
      "Custom pipeline stages",
      "White-label reports",
      "Priority support",
      "SLA guarantee",
    ],
    cta: "Talk to us",
    popular: false,
  },
];

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);
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
      id="pricing"
      className="relative pt-16 pb-32 lg:pt-20 lg:pb-40 border-t border-gray-100 bg-white font-sans opacity-0 translate-y-8 transition-all duration-1000 ease-out"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-20">
          <span className="font-mono text-xs tracking-widest text-gray-500 uppercase block mb-6">
            Pricing
          </span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl tracking-tight text-gray-900 mb-6 font-normal">
            Simple, transparent
            <br />
            <span className="[-webkit-text-stroke:1px_#111111] text-transparent">pricing</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-xl">
            Start free and scale as you grow. No hidden fees, no surprises.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center gap-4 mb-16 select-none">
          <span
            className={`text-sm font-medium transition-colors ${!isAnnual ? "text-gray-900" : "text-gray-400"
              }`}
          >
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-14 h-7 bg-gray-100 rounded-full p-1 transition-colors hover:bg-gray-200/80"
          >
            <div
              className={`w-5 h-5 bg-gray-900 rounded-full transition-transform duration-300 ${isAnnual ? "translate-x-7" : "translate-x-0"
                }`}
            />
          </button>
          <span
            className={`text-sm font-medium transition-colors ${isAnnual ? "text-gray-900" : "text-gray-400"
              }`}
          >
            Annual
          </span>
          {isAnnual && (
            <span className="ml-2 px-2.5 py-0.5 bg-gray-900 !text-white text-[10px] font-medium font-mono rounded">
              Save 17%
            </span>
          )}
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-px bg-gray-100 border border-gray-100">
          {plans.map((plan, idx) => (
            <div
              key={plan.name}
              className={`relative p-8 lg:p-12 bg-white ${plan.popular ? "md:-my-4 md:py-12 lg:py-16 border-2 border-gray-900 z-10 shadow-lg" : ""
                }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-8 px-3 py-1 bg-gray-900 !text-white text-[10px] font-medium font-mono uppercase tracking-widest rounded-sm">
                  Most Popular
                </span>
              )}

              {/* Plan Header */}
              <div className="mb-8">
                <span className="font-mono text-xs text-gray-400 font-normal">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="text-3xl text-gray-900 mt-2 font-normal">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-2 font-normal leading-relaxed">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-8 pb-8 border-b border-gray-100">
                {plan.price.monthly !== null ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl lg:text-6xl text-gray-900 font-semibold">
                      ₹{isAnnual ? plan.price.annual : plan.price.monthly}
                    </span>
                    <span className="text-gray-400 text-sm font-medium">/month</span>
                  </div>
                ) : (
                  <span className="text-4xl text-gray-900 font-semibold">Custom</span>
                )}
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-10">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 text-gray-900 mt-0.5 shrink-0"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-sm text-gray-500 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <a
                href="/sign-up"
                className={`w-full py-4 flex items-center justify-center gap-2 text-sm font-semibold transition-all group rounded-lg ${plan.popular
                  ? "bg-gray-900 !text-white hover:bg-gray-800"
                  : "border border-gray-200 text-gray-900 hover:border-gray-900 hover:bg-gray-50"
                  }`}
              >
                {plan.cta}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <p className="mt-12 text-center text-sm text-gray-400 font-medium">
          All plans include automatic updates, HTTPS, and DDoS protection.{" "}
          <a href="#" className="underline underline-offset-4 text-gray-500 hover:text-gray-900 transition-colors">
            Compare all features
          </a>
        </p>
      </div>
    </section>
  );
}

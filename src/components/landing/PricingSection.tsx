"use client";

import { useState, useEffect, useRef } from "react";

const plans = [
  {
    name: "Starter",
    description: "For founders just getting started",
    price: { monthly: 0, annual: 0 },
    usage: [
      "2 connectors",
      "500 leads synced per month",
      "90-day data history",
      "1 workspace",
    ],
    features: ["Unified orders + leads view", "Community support"],
    featuresLabel: "Key features",
    cta: "Get started free",
    popular: false,
  },
  {
    name: "Growth",
    description: "For growing Indian SMBs",
    price: { monthly: 1999, annual: 1666 },
    usage: [
      "6 connectors",
      "Unlimited leads synced",
      "1-year data history",
      "3 workspaces",
    ],
    features: [
      "Pipeline tracking + attribution",
      "Meta Ads + Google Ads ROAS",
      "API access",
      "Email support",
    ],
    featuresLabel: "All Starter features, plus",
    cta: "Start free trial",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For teams scaling fast",
    price: { monthly: null, annual: null },
    usage: [
      "All 14+ connectors",
      "Unlimited workspaces",
      "Unlimited data history",
    ],
    features: [
      "Multi-user with roles",
      "Custom pipeline stages",
      "White-label reports",
      "Priority support",
      "SLA guarantee",
    ],
    featuresLabel: "All Growth features, plus",
    cta: "Talk to us",
    popular: false,
  },
];

function CheckIcon() {
  return (
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((feature) => (
        <li key={feature} className="flex items-start gap-3">
          <CheckIcon />
          <span className="text-sm text-gray-500 font-medium leading-snug">{feature}</span>
        </li>
      ))}
    </ul>
  );
}

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
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-20 max-w-3xl">
          <p className="mb-6 pl-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
            Pricing
          </p>
          <h2 className="mb-6 text-5xl font-normal tracking-tight text-gray-900 md:text-6xl lg:text-7xl leading-[1.05]">
            Simple, transparent
            <br />
            <span className="[-webkit-text-stroke:1px_#111111] text-transparent">pricing</span>
          </h2>
          <p className="max-w-xl text-lg text-gray-500">
            Start free and scale as you grow. No hidden fees, no surprises.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center gap-4 mb-16 select-none">
          <span
            className={`text-sm font-medium transition-colors ${
              !isAnnual ? "text-gray-900" : "text-gray-400"
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-14 h-7 bg-gray-100 rounded-full p-1 transition-colors hover:bg-gray-200/80"
          >
            <div
              className={`w-5 h-5 bg-gray-900 rounded-full transition-transform duration-300 ${
                isAnnual ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium transition-colors ${
              isAnnual ? "text-gray-900" : "text-gray-400"
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

        {/* Pricing Cards — Glide-style separate bordered cards */}
        <div className="grid md:grid-cols-3 gap-4 lg:gap-5 items-stretch">
          {plans.map((plan) => {
            const displayPrice =
              plan.price.monthly !== null
                ? isAnnual
                  ? plan.price.annual
                  : plan.price.monthly
                : null;
            const isFree = displayPrice === 0;

            return (
              <div
                key={plan.name}
                className={`relative flex flex-col h-full rounded-2xl border bg-white p-6 lg:p-8 ${
                  plan.popular
                    ? "border-gray-900 shadow-sm"
                    : "border-gray-200"
                }`}
              >
                {plan.popular && (
                  <>
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-28 rounded-t-2xl bg-gradient-to-b from-gray-50 to-transparent" />
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900 !text-white text-[10px] font-medium font-mono uppercase tracking-widest rounded-sm whitespace-nowrap z-10">
                      Most Popular
                    </span>
                  </>
                )}

                <div className="relative flex flex-col flex-grow">
                  {/* Plan header */}
                  <div className="min-h-[5.5rem]">
                    <h3 className="text-3xl text-gray-900 font-normal">{plan.name}</h3>
                    <p className="text-sm text-gray-500 mt-2 font-normal leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price — fixed height keeps CTAs aligned across cards */}
                  <div className="mt-8 mb-6 min-h-[8.5rem] flex flex-col justify-end">
                    {displayPrice !== null ? (
                      isFree ? (
                        <span className="text-5xl lg:text-6xl text-gray-900 font-semibold leading-none">Free</span>
                      ) : (
                        <div>
                          <p className="text-sm text-gray-500 font-medium mb-1">Starting at</p>
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-5xl lg:text-6xl text-gray-900 font-semibold leading-none">
                              ₹{displayPrice}
                            </span>
                            <span className="text-gray-400 text-sm font-medium">per month</span>
                          </div>
                          <p className={`text-sm text-gray-400 font-medium mt-1 ${isAnnual ? "visible" : "invisible"}`}>
                            billed yearly
                          </p>
                        </div>
                      )
                    ) : (
                      <span className="text-4xl lg:text-5xl text-gray-900 font-semibold leading-none">Custom</span>
                    )}
                  </div>

                  {/* CTA — above feature sections, Glide-style */}
                  <a
                    href="/sign-up"
                    className={`mb-8 w-full py-3.5 flex items-center justify-center gap-2 text-sm font-semibold transition-all group rounded-lg ${
                      plan.popular
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
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>

                  {/* Usage section */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-900">Usage</h4>
                    <FeatureList items={plan.usage} />
                  </div>

                  {/* Key features section */}
                  <div className="mt-8 space-y-3">
                    <h4 className="text-sm font-semibold text-gray-900">{plan.featuresLabel}</h4>
                    <FeatureList items={plan.features} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <p className="mt-12 text-center text-sm text-gray-400 font-medium">
          All plans include automatic updates, HTTPS, and DDoS protection.{" "}
          <a
            href="#"
            className="underline underline-offset-4 text-gray-500 hover:text-gray-900 transition-colors"
          >
            Compare all features
          </a>
        </p>
      </div>
    </section>
  );
}

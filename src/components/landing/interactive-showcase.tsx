"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

const LIVE_ACTIVITIES = [
  {
    id: 1,
    type: "fail",
    text: "Razorpay payment of ₹950 failed (customer cancelled).",
    time: "Just now",
  },
  {
    id: 2,
    type: "success",
    text: "Payment of ₹1,800 received via Razorpay.",
    time: "2m ago",
  },
  {
    id: 3,
    type: "order",
    text: "Order #SH-1025 placed in Shopify.",
    time: "10m ago",
  },
  {
    id: 4,
    type: "sync",
    text: "New Lead Kavya Reddy synced from HubSpot.",
    time: "12m ago",
  },
  {
    id: 5,
    type: "deal",
    text: "Deal for Arjun Mehta marked Won in Salesforce.",
    time: "45m ago",
  },
  {
    id: 6,
    type: "sync",
    text: "HubSpot CRM database sync completed.",
    time: "1h ago",
  },
  {
    id: 7,
    type: "fail",
    text: "Stripe payment failed for Sanjay Kumar (₹2,400).",
    time: "2h ago",
  },
  {
    id: 8,
    type: "success",
    text: "Order #SH-1021 marked Fulfilled in Shopify.",
    time: "3h ago",
  },
] as const;

function ShowcaseFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-full p-3 sm:p-4 border border-gray-200/80 rounded-2xl bg-gray-50/50 shadow-[0_12px_40px_rgba(0,0,0,0.03)] overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="relative z-10 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden h-full">
        {children}
      </div>
    </div>
  );
}


function ShowcaseDashboardContent() {
  return (
    <ShowcaseFrame>
      <div className="flex h-full min-h-[22rem] flex-col divide-y divide-gray-100 lg:flex-row lg:divide-x lg:divide-y-0">
        {/* Left Sidebar */}
        <div className="flex w-full shrink-0 flex-col justify-between bg-[#fbfbfc]/85 p-3 text-xs font-medium text-gray-500 select-none lg:w-48">
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-tr from-indigo-500 to-sky-500 text-[10px] font-bold text-white shadow-sm">
                G
              </div>
              <span className="text-sm font-semibold tracking-tight text-gray-900">
                GRIP
              </span>
            </div>

            <div className="space-y-3">
              <div className="space-y-0.5">
                <span className="mb-1 block px-2 text-[9px] font-bold uppercase tracking-wider text-gray-400">
                  Overview
                </span>
                <div className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-gray-500 hover:bg-gray-100/70">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Dashboard</span>
                </div>
                <div className="flex cursor-pointer items-center gap-2 rounded-lg bg-gray-100 px-2 py-1.5 font-semibold text-gray-900">
                  <svg className="h-3.5 w-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Analytics</span>
                </div>
              </div>

              <div className="space-y-0.5">
                <span className="mb-1 block px-2 text-[9px] font-bold uppercase tracking-wider text-gray-400">
                  Revenue
                </span>
                <div className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100/70">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>Orders</span>
                </div>
                <div className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 hover:bg-gray-100/70">
                  <div className="flex items-center gap-2">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span>Payments</span>
                  </div>
                  <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800">
                    3
                  </span>
                </div>
              </div>

              <div className="space-y-0.5">
                <span className="mb-1 block px-2 text-[9px] font-bold uppercase tracking-wider text-gray-400">
                  Sales
                </span>
                <div className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100/70">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Leads</span>
                </div>
                <div className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100/70">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 15H19M9 11l3 3L22 4" />
                  </svg>
                  <span>Pipeline</span>
                </div>
              </div>

              <div className="space-y-0.5">
                <span className="mb-1 block px-2 text-[9px] font-bold uppercase tracking-wider text-gray-400">
                  Ops
                </span>
                <div className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100/70">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  <span>Automations</span>
                </div>
                <div className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 hover:bg-gray-100/70">
                  <div className="flex items-center gap-2">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span>Connectors</span>
                  </div>
                  <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700">
                    2
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Content */}
        <div className="flex-grow space-y-4 overflow-hidden bg-[#fafbfd] p-4">
          <div className="flex flex-col gap-3 border-b border-gray-200/60 pb-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-baseline gap-2">
              <h2 className="text-base font-bold text-gray-900">Analytics</h2>
              <span className="text-[10px] font-medium text-gray-400">
                Deep-dive analytics
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
                Last 30 days
              </button>
              <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-medium text-gray-500 shadow-sm">
                <div className="relative h-3.5 w-6 cursor-pointer rounded-full bg-gray-200 p-0.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-white shadow-sm" />
                </div>
                <span>Compare</span>
              </div>
              <button className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
                Export CSV
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
            {[
              { title: "TOTAL REVENUE", value: "₹3,98,000" },
              { title: "AVG DAILY REVENUE", value: "₹56,857" },
              { title: "HIGHEST SINGLE DAY", value: "₹97,000" },
              { title: "TOTAL TRANSACTIONS", value: "318" },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-gray-200/80 bg-white p-3 shadow-[0_1px_3px_rgba(0,0,0,0.01)]"
              >
                <span className="block text-[7px] font-bold uppercase tracking-widest text-gray-450">
                  {card.title}
                </span>
                <span className="mt-1 block text-lg font-bold text-gray-900">
                  {card.value}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-3 rounded-xl border border-gray-200/80 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold text-gray-950">
                Revenue Breakdown & Timeline
              </span>
              <div className="flex rounded-lg bg-gray-100/80 p-0.5 text-[9px] font-semibold text-gray-500 shadow-inner">
                {["Razorpay", "Stripe", "Cashfree", "All"].map((brand) => (
                  <span
                    key={brand}
                    className={`cursor-pointer rounded-md px-2 py-0.5 ${
                      brand === "All"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "hover:text-gray-900"
                    }`}
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
            <svg
              className="h-auto w-full text-gray-300"
              viewBox="0 0 700 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.04" />
                </linearGradient>
              </defs>
              <line x1="50" y1="140" x2="650" y2="140" stroke="#e2e8f0" strokeOpacity="0.8" />
              <rect x="48" y="121" width="24" height="19" rx="2" fill="url(#barGrad)" />
              <rect x="145" y="102" width="24" height="38" rx="2" fill="url(#barGrad)" />
              <rect x="241" y="111" width="24" height="29" rx="2" fill="url(#barGrad)" />
              <rect x="338" y="89" width="24" height="51" rx="2" fill="url(#barGrad)" />
              <rect x="435" y="50" width="24" height="90" rx="2" fill="url(#barGrad)" />
              <rect x="531" y="41" width="24" height="99" rx="2" fill="url(#barGrad)" />
              <rect x="628" y="15" width="24" height="125" rx="2" fill="url(#barGrad)" />
              <path
                d="M 60 130 L 157 115 L 253 100 L 350 75 L 447 45 L 543 20 L 640 10"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden w-56 shrink-0 flex-col bg-[#fbfbfc]/85 p-4 lg:flex">
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-400">
                Connected Tools
              </span>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded border border-gray-150 bg-white p-1 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/crm-logos/razorpay.svg"
                    alt="Razorpay"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded border border-gray-150 bg-white p-1 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/crm-logos/shopify.svg"
                    alt="Shopify"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex h-7 w-7 cursor-pointer items-center justify-center rounded border border-gray-200/80 bg-white text-xs text-gray-400 shadow-sm hover:border-gray-300">
                  +
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-400">
                Live Activity
              </span>
              <div className="max-h-[220px] space-y-2 overflow-y-auto pr-1">
                {LIVE_ACTIVITIES.slice(0, 5).map((act) => (
                  <div
                    key={act.id}
                    className="flex items-start gap-2 rounded-lg border border-gray-100 bg-white p-2 shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                  >
                    <div className="mt-0.5 shrink-0">
                      {act.type === "fail" ? (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-500">
                          ✕
                        </span>
                      ) : act.type === "success" ? (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-[8px] text-emerald-600">
                          ✓
                        </span>
                      ) : act.type === "order" ? (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-50 text-[8px] font-semibold text-indigo-500">
                          🛒
                        </span>
                      ) : (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-50 text-[8px] font-semibold text-blue-500">
                          ⇅
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-grow">
                      <p className="text-[9px] font-medium leading-relaxed text-gray-700">
                        {act.text}
                      </p>
                      <span className="mt-0.5 block text-[8px] text-gray-400">
                        {act.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ShowcaseFrame>
  );
}

export default function InteractiveShowcase() {
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

  const titleComponent = (
    <>
      <p className="text-sm font-medium uppercase tracking-widest text-gray-400">
        Analytics dashboard
      </p>
      <h2 className="mt-2 text-3xl font-semibold text-black md:text-5xl">
        Your revenue, unified
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-base text-gray-500">
        Deep-dive analytics across Razorpay, Stripe, Shopify, and every
        connector in one live workspace.
      </p>
    </>
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white pb-12 font-sans opacity-0 translate-y-8 transition-all duration-1000 ease-out"
    >
      <ContainerScroll titleComponent={titleComponent}>
        <ShowcaseDashboardContent />
      </ContainerScroll>
    </section>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";

type Tab = "demo" | "dashboard";

export default function InteractiveShowcase() {
  const [activeTab, setActiveTab] = useState<Tab>("demo");
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

  // Mock data for Live Activity
  const liveActivities = [
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
  ];

  return (
    <section
      ref={sectionRef}
      className="bg-white pb-12 font-sans relative overflow-hidden opacity-0 translate-y-8 transition-all duration-1000 ease-out"
    >
      <div className="max-w-[1440px] mx-auto px-8 lg:px-12 w-full">
        {/* Tab Selection Row */}
        <div className="border-t border-b border-gray-200/80 grid grid-cols-2">
          {/* Watch Demo Tab */}
          <button
            onClick={() => setActiveTab("demo")}
            className={`py-5 flex items-center justify-center gap-3 text-sm font-semibold transition-all border-b-2 border-gray-300 border-r-2
              ${activeTab === "demo"
                ? "border-black text-black bg-gray-50/30"
                : "border-transparent text-gray-400 hover:text-gray-900"
              }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Watch Demo
          </button>

          {/* Dashboard Tab */}
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`py-5 flex items-center justify-center gap-3 text-sm font-semibold transition-all border-b-2 ${activeTab === "dashboard"
              ? "border-black text-black bg-gray-50/30"
              : "border-transparent text-gray-400 hover:text-gray-900"
              }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            Dashboard
          </button>
        </div>

        {/* Outer showcase container with faint grid background */}
        <div className="relative mt-12 p-4 sm:p-6 border border-gray-200/80 rounded-2xl bg-gray-50/50 shadow-[0_12px_40px_rgba(0,0,0,0.03)] overflow-hidden">
          {/* Subtle background grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          <div className="relative z-10 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden flex flex-col min-h-[600px] lg:min-h-[700px]">
            {activeTab === "demo" ? (
              /* TAB CONTENT: DEMO VIDEO PLACEHOLDER (EMPTY FOR NOW) */
              <div className="flex-grow flex items-center justify-center bg-slate-950 min-h-[600px] lg:min-h-[700px] relative">
                <div className="flex flex-col items-center justify-center space-y-4 text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all duration-300 shadow-2xl backdrop-blur-md cursor-pointer group">
                    <svg
                      className="w-7 h-7 text-white translate-x-0.5 group-hover:scale-110 transition-transform"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-white/90 tracking-wide">Watch GRIP Platform Demo</span>
                  <span className="text-xs text-white/40 max-w-xs leading-relaxed">
                    Learn how GRIP maps, cleanses, and synchronizes your SMB revenue metrics in under 5 minutes.
                  </span>
                </div>
              </div>
            ) : (
              /* TAB CONTENT: GRIP ACTUAL ANALYTICS DASHBOARD */
              <div className="flex flex-col lg:flex-row flex-grow divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                {/* 1. Left Sidebar */}
                <div className="w-full lg:w-56 shrink-0 bg-[#fbfbfc]/85 p-4 flex flex-col justify-between text-xs text-gray-500 font-medium select-none">
                  <div className="space-y-6">
                    {/* Brand / Logo Placeholder */}
                    <div className="flex items-center gap-2 px-2 py-1">
                      <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-500 to-sky-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm shrink-0">
                        G
                      </div>
                      <span className="font-semibold text-gray-900 text-sm tracking-tight">
                        GRIP
                      </span>
                    </div>

                    {/* Navigation Menu */}
                    <div className="space-y-4">
                      {/* Overview */}
                      <div className="space-y-0.5">
                        <span className="px-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                          Overview
                        </span>
                        <div className="px-2.5 py-2 rounded-lg hover:bg-gray-100/70 cursor-pointer flex items-center gap-2.5 text-gray-500">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          <span>Dashboard</span>
                        </div>
                        <div className="px-2.5 py-2 rounded-lg bg-gray-100 text-gray-900 font-semibold cursor-pointer flex items-center gap-2.5">
                          <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <span>Analytics</span>
                        </div>
                      </div>

                      {/* Revenue */}
                      <div className="space-y-0.5">
                        <span className="px-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                          Revenue
                        </span>
                        <div className="px-2.5 py-2 rounded-lg hover:bg-gray-100/70 cursor-pointer flex items-center gap-2.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          <span>Orders</span>
                        </div>
                        <div className="px-2.5 py-2 rounded-lg hover:bg-gray-100/70 cursor-pointer flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            <span>Payments</span>
                          </div>
                          <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-800 rounded-md">3</span>
                        </div>
                      </div>

                      {/* Sales */}
                      <div className="space-y-0.5">
                        <span className="px-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                          Sales
                        </span>
                        <div className="px-2.5 py-2 rounded-lg hover:bg-gray-100/70 cursor-pointer flex items-center gap-2.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>Leads</span>
                        </div>
                        <div className="px-2.5 py-2 rounded-lg hover:bg-gray-100/70 cursor-pointer flex items-center gap-2.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 15H19M9 11l3 3L22 4" />
                          </svg>
                          <span>Pipeline</span>
                        </div>
                      </div>

                      {/* Ops */}
                      <div className="space-y-0.5">
                        <span className="px-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                          Ops
                        </span>
                        <div className="px-2.5 py-2 rounded-lg hover:bg-gray-100/70 cursor-pointer flex items-center gap-2.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                          <span>Automations</span>
                        </div>
                        <div className="px-2.5 py-2 rounded-lg hover:bg-gray-100/70 cursor-pointer flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            <span>Connectors</span>
                          </div>
                          <span className="px-1.5 py-0.5 text-[9px] font-bold bg-indigo-50 text-indigo-750 rounded-md">2</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Footer (Profile / Settings) */}
                  <div className="pt-4 border-t border-gray-200/60 space-y-3.5">
                    <div className="space-y-1">
                      <div className="px-2.5 py-1.5 rounded-lg hover:bg-gray-100/70 cursor-pointer flex items-center gap-2.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span>Alerts</span>
                      </div>
                      <div className="px-2.5 py-1.5 rounded-lg hover:bg-gray-100/70 cursor-pointer flex items-center gap-2.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Settings</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Center Content (Actual Dashboard Analytics) */}
                <div className="flex-grow p-6 bg-[#fafbfd] space-y-6 overflow-y-auto">
                  {/* Inner Page Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200/60">
                    <div className="flex items-baseline gap-3">
                      <h2 className="text-lg font-bold text-gray-900">Analytics</h2>
                      <span className="text-xs text-gray-400 font-medium">
                        Deep-dive analytics
                      </span>
                    </div>
                    {/* Controls */}
                    <div className="flex flex-wrap items-center gap-3">
                      <button className="bg-white border border-gray-200 hover:bg-gray-50 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-gray-700 shadow-sm">
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Last 30 days
                      </button>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium bg-white px-3 py-1.5 border border-gray-200 rounded-lg shadow-sm">
                        <div className="w-6 h-3.5 bg-gray-200 rounded-full relative p-0.5 cursor-pointer">
                          <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />
                        </div>
                        <span>Compare</span>
                      </div>
                      <button className="bg-white border border-gray-200 hover:bg-gray-50 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 text-gray-700 shadow-sm">
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export CSV
                      </button>
                    </div>
                  </div>

                  {/* Revenue Header block */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Revenue</h3>
                      <p className="text-xs text-gray-400">Total revenue collected across all payment sources</p>
                    </div>
                    <span className="text-xs font-semibold text-gray-800 hover:underline cursor-pointer flex items-center gap-1">
                      View full report
                      <svg className="w-3.5 h-3.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </div>

                  {/* 4 Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[
                      { title: "TOTAL REVENUE", value: "₹3,98,000", desc: "Total for the period" },
                      { title: "AVG DAILY REVENUE", value: "₹56,857", desc: "Average daily sales" },
                      { title: "HIGHEST SINGLE DAY", value: "₹97,000", desc: "Peak daily revenue" },
                      { title: "TOTAL TRANSACTIONS", value: "318", desc: "Total checkout volume" },
                    ].map((card, i) => (
                      <div key={i} className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col justify-between">
                        <span className="text-[8px] font-bold text-gray-450 uppercase tracking-widest">{card.title}</span>
                        <span className="text-xl font-bold text-gray-900 mt-1 block">{card.value}</span>
                        <span className="text-[9px] text-gray-400/80 mt-0.5 block">{card.desc}</span>
                      </div>
                    ))}
                  </div>

                  {/* Revenue Breakdown & Timeline Chart */}
                  <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <span className="text-xs font-bold text-gray-950">
                        Revenue Breakdown & Timeline
                      </span>
                      {/* Brand selector */}
                      <div className="bg-gray-100/80 p-0.5 rounded-lg flex text-[10px] font-semibold text-gray-500 shadow-inner select-none">
                        {["Razorpay", "Stripe", "Cashfree", "All"].map((brand) => (
                          <span
                            key={brand}
                            className={`px-3 py-1 rounded-md cursor-pointer transition-all ${brand === "All"
                              ? "bg-white text-gray-900 shadow-sm"
                              : "hover:text-gray-900"
                              }`}
                          >
                            {brand}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Chart Graphic Area */}
                    <div className="w-full pt-4 overflow-hidden">
                      <svg
                        className="w-full h-auto text-gray-300"
                        viewBox="0 0 700 240"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Definitions for Gradients */}
                        <defs>
                          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.22" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.04" />
                          </linearGradient>
                        </defs>

                        {/* Grid Lines */}
                        <line x1="50" y1="45" x2="650" y2="45" stroke="#e2e8f0" strokeOpacity="0.4" strokeDasharray="3 3" />
                        <line x1="50" y1="83" x2="650" y2="83" stroke="#e2e8f0" strokeOpacity="0.4" strokeDasharray="3 3" />
                        <line x1="50" y1="122" x2="650" y2="122" stroke="#e2e8f0" strokeOpacity="0.4" strokeDasharray="3 3" />
                        <line x1="50" y1="161" x2="650" y2="161" stroke="#e2e8f0" strokeOpacity="0.4" strokeDasharray="3 3" />
                        <line x1="50" y1="200" x2="650" y2="200" stroke="#e2e8f0" strokeOpacity="0.8" />

                        {/* Left Y-axis labels */}
                        <text x="25" y="48" fill="#9ca3af" fontSize="9" fontWeight="600" textAnchor="end">1.0L</text>
                        <text x="25" y="86" fill="#9ca3af" fontSize="9" fontWeight="600" textAnchor="end">75k</text>
                        <text x="25" y="125" fill="#9ca3af" fontSize="9" fontWeight="600" textAnchor="end">50k</text>
                        <text x="25" y="164" fill="#9ca3af" fontSize="9" fontWeight="600" textAnchor="end">25k</text>
                        <text x="25" y="203" fill="#9ca3af" fontSize="9" fontWeight="600" textAnchor="end">₹0</text>

                        {/* Right Y-axis labels */}
                        <text x="675" y="48" fill="#9ca3af" fontSize="9" fontWeight="600" textAnchor="start">4.0L</text>
                        <text x="675" y="86" fill="#9ca3af" fontSize="9" fontWeight="600" textAnchor="start">3.0L</text>
                        <text x="675" y="125" fill="#9ca3af" fontSize="9" fontWeight="600" textAnchor="start">2.0L</text>
                        <text x="675" y="164" fill="#9ca3af" fontSize="9" fontWeight="600" textAnchor="start">1.0L</text>
                        <text x="675" y="203" fill="#9ca3af" fontSize="9" fontWeight="600" textAnchor="start">₹0</text>

                        {/* X-axis date labels */}
                        <text x="60" y="222" fill="#9ca3af" fontSize="9" fontWeight="600" textAnchor="middle">06-01</text>
                        <text x="157" y="222" fill="#9ca3af" fontSize="9" fontWeight="600" textAnchor="middle">06-05</text>
                        <text x="253" y="222" fill="#9ca3af" fontSize="9" fontWeight="600" textAnchor="middle">06-10</text>
                        <text x="350" y="222" fill="#9ca3af" fontSize="9" fontWeight="600" textAnchor="middle">06-15</text>
                        <text x="447" y="222" fill="#9ca3af" fontSize="9" fontWeight="600" textAnchor="middle">06-20</text>
                        <text x="543" y="222" fill="#9ca3af" fontSize="9" fontWeight="600" textAnchor="middle">06-25</text>
                        <text x="640" y="222" fill="#9ca3af" fontSize="9" fontWeight="600" textAnchor="middle">06-30</text>

                        {/* Bars representing Daily Revenue */}
                        <rect x="48" y="181" width="24" height="19" rx="2" fill="url(#barGrad)" stroke="#6366f1" strokeOpacity="0.25" strokeWidth="1" />
                        <rect x="145" y="162" width="24" height="38" rx="2" fill="url(#barGrad)" stroke="#6366f1" strokeOpacity="0.25" strokeWidth="1" />
                        <rect x="241" y="171" width="24" height="29" rx="2" fill="url(#barGrad)" stroke="#6366f1" strokeOpacity="0.25" strokeWidth="1" />
                        <rect x="338" y="149" width="24" height="51" rx="2" fill="url(#barGrad)" stroke="#6366f1" strokeOpacity="0.25" strokeWidth="1" />
                        <rect x="435" y="110" width="24" height="90" rx="2" fill="url(#barGrad)" stroke="#6366f1" strokeOpacity="0.25" strokeWidth="1" />
                        <rect x="531" y="101" width="24" height="99" rx="2" fill="url(#barGrad)" stroke="#6366f1" strokeOpacity="0.25" strokeWidth="1" />
                        <rect x="628" y="75" width="24" height="125" rx="2" fill="url(#barGrad)" stroke="#6366f1" strokeOpacity="0.25" strokeWidth="1" />

                        {/* Cumulative Line Path */}
                        <path
                          d="M 60 190 L 157 175 L 253 160 L 350 135 L 447 105 L 543 80 L 640 45"
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Circular Nodes on Timeline */}
                        <circle cx="60" cy="190" r="3.5" fill="white" stroke="#38bdf8" strokeWidth="2" />
                        <circle cx="157" cy="175" r="3.5" fill="white" stroke="#38bdf8" strokeWidth="2" />
                        <circle cx="253" cy="160" r="3.5" fill="white" stroke="#38bdf8" strokeWidth="2" />
                        <circle cx="350" cy="135" r="3.5" fill="white" stroke="#38bdf8" strokeWidth="2" />
                        <circle cx="447" cy="105" r="3.5" fill="white" stroke="#38bdf8" strokeWidth="2" />
                        <circle cx="543" cy="80" r="3.5" fill="white" stroke="#38bdf8" strokeWidth="2" />
                        <circle cx="640" cy="45" r="3.5" fill="#38bdf8" stroke="white" strokeWidth="2.5" />
                        <circle cx="640" cy="45" r="6" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.6" className="animate-ping" style={{ transformOrigin: "640px 45px" }} />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 3. Right Sidebar (Connected Tools & Live Activity) */}
                <div className="w-full lg:w-80 shrink-0 bg-[#fbfbfc]/85 p-5 flex flex-col justify-between min-h-[400px] lg:h-auto select-none">
                  <div className="space-y-6 flex-grow flex flex-col min-h-0">
                    {/* Connected Tools */}
                    <div className="space-y-3 shrink-0">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">
                        Connected Tools
                      </span>
                      {/* Logo badges */}
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded bg-white border border-gray-150 p-1 flex items-center justify-center shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/assets/crm-logos/razorpay.svg"
                            alt="Razorpay"
                            className="w-full h-full object-contain select-none"
                          />
                        </div>
                        <div className="w-7 h-7 rounded bg-white border border-gray-150 p-1 flex items-center justify-center shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/assets/crm-logos/shopify.svg"
                            alt="Shopify"
                            className="w-full h-full object-contain select-none"
                          />
                        </div>
                        <div className="w-7 h-7 rounded border border-gray-200/80 bg-white text-gray-400 flex items-center justify-center text-xs shadow-sm cursor-pointer hover:border-gray-300 select-none">
                          +
                        </div>
                      </div>
                    </div>

                    {/* Live Activity Stream */}
                    <div className="space-y-3.5 flex-grow flex flex-col min-h-0">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">
                        Live Activity
                      </span>

                      {/* Feed container */}
                      <div className="space-y-3 overflow-y-auto flex-grow max-h-[360px] pr-1">
                        {liveActivities.map((act) => (
                          <div key={act.id} className="flex items-start gap-2.5 p-2 rounded-lg bg-white border border-gray-100 hover:border-gray-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-colors">
                            {/* Icon depending on activity type */}
                            <div className="shrink-0 mt-0.5">
                              {act.type === "fail" ? (
                                <span className="w-4 h-4 rounded-full bg-red-150 text-red-500 flex items-center justify-center text-[10px] font-bold">
                                  ✕
                                </span>
                              ) : act.type === "success" ? (
                                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[8px]">
                                  ✓
                                </span>
                              ) : act.type === "order" ? (
                                <span className="w-4 h-4 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center text-[8px] font-semibold">
                                  🛒
                                </span>
                              ) : (
                                <span className="w-4 h-4 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-[8px] font-semibold">
                                  ⇅
                                </span>
                              )}
                            </div>
                            <div className="flex-grow min-w-0">
                              <p className="text-[10px] text-gray-700 font-medium leading-relaxed break-words">
                                {act.text}
                              </p>
                              <span className="text-[8px] text-gray-400 block mt-0.5">
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

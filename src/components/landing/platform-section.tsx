"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { date: "06-01", barVal: 12000, lineVal: 40000 },
  { date: "06-05", barVal: 24000, lineVal: 110000 },
  { date: "06-10", barVal: 18000, lineVal: 150000 },
  { date: "06-15", barVal: 32000, lineVal: 220000 },
  { date: "06-20", barVal: 58000, lineVal: 290000 },
  { date: "06-25", barVal: 64000, lineVal: 340000 },
  { date: "06-30", barVal: 80000, lineVal: 390000 },
];

const formatLeftYAxis = (tick: number) => {
  if (tick === 0) return "₹0";
  if (tick >= 1000) return `₹${(tick / 1000).toFixed(0)}k`;
  return `₹${tick}`;
};

const formatRightYAxis = (tick: number) => {
  if (tick === 0) return "₹0";
  return `${(tick / 100000).toFixed(1).replace(".0", "")}L`;
};

const CustomDot = (props: any) => {
  const { cx, cy, payload, index } = props;
  const isLast = index === chartData.length - 1;
  return (
    <g key={`dot-${index}`}>
      {isLast && (
        <>
          <circle cx={cx} cy={cy} r={9} fill="#38bdf8" fillOpacity={0.25} className="animate-ping" />
          <circle cx={cx} cy={cy} r={6} fill="#0284c7" fillOpacity={0.4} />
        </>
      )}
      <circle cx={cx} cy={cy} r={3.5} fill={isLast ? "#0284c7" : "#ffffff"} stroke="#38bdf8" strokeWidth={2.5} />
    </g>
  );
};

function PlatformFeatureCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState(
    "perspective(1200px) rotateX(0deg) rotateY(0deg) translateX(0px) translateY(0px) scale(1)"
  );

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const moveX = ((x - centerX) / centerX) * 10;
    const moveY = ((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 4;
    const rotateX = ((centerY - y) / centerY) * 4;

    setTransform(
      `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateX(${moveX}px) translateY(${moveY}px) scale(1.01)`
    );
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransform(
      "perspective(1200px) rotateX(0deg) rotateY(0deg) translateX(0px) translateY(0px) scale(1)"
    );
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`rounded-2xl border border-gray-200/90 bg-white p-6 md:p-8 lg:p-10 shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-[transform,box-shadow] duration-300 ease-out will-change-transform hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)] ${className}`}
      style={{ transform }}
    >
      {children}
    </div>
  );
}

export default function PlatformSection() {
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
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
      className="bg-white pt-24 pb-12 border-t border-gray-150 font-sans relative overflow-hidden opacity-0 translate-y-8 transition-all duration-1000 ease-out"
    >
      <div className="max-w-[1440px] mx-auto px-8 lg:px-12 w-full space-y-16">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 bg-gray-50/50 text-[11px] font-medium text-gray-500 shadow-sm select-none">
            <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Platform
          </div>

          {/* Title */}
          <h2 className="text-4xl sm:text-5xl font-normal tracking-tight text-gray-900 leading-[1.12] max-w-2xl">
            <span className="text-gray-400">Built for </span>teams
            <br />
            <span className="text-gray-400">that take data </span>seriously
          </h2>

          {/* Subtitle */}
          <p className="text-sm text-gray-500 max-w-md leading-relaxed">
            GRIP is built from the ground up to be fast, powerful and delightful to use.
          </p>
        </div>

        {/* 2-Column Mockup Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Column 1: Unified Revenue View */}
          <PlatformFeatureCard className="flex flex-col justify-between space-y-12 min-h-[440px]">
            {/* Chart Mockup (No x padding, stretches full width) */}
            <div className="w-full flex flex-col relative select-none">
              
              {/* Header with Title and Tabs */}
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-bold text-gray-900 tracking-tight">Revenue Breakdown & Timeline</span>
                <div className="flex bg-gray-100/80 rounded-xl p-0.5 border border-gray-200/50">
                  <button type="button" className="px-2.5 py-1 rounded-lg text-[9px] font-semibold text-gray-400 hover:text-gray-950 transition-colors cursor-pointer">Razorpay</button>
                  <button type="button" className="px-2.5 py-1 rounded-lg text-[9px] font-semibold text-gray-400 hover:text-gray-950 transition-colors cursor-pointer">Stripe</button>
                  <button type="button" className="px-2.5 py-1 rounded-lg text-[9px] font-semibold text-gray-400 hover:text-gray-950 transition-colors cursor-pointer">Cashfree</button>
                  <button type="button" className="px-3 py-1 rounded-lg text-[9px] font-bold bg-white text-gray-950 shadow-sm transition-colors border border-gray-200/50 cursor-pointer">All</button>
                </div>
              </div>

              {/* Recharts Wrapper (Full width, zero padding) */}
              <div className="w-full h-48 relative overflow-visible text-[9px] font-semibold text-gray-400">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 10, right: -5, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#e0e7ff" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#f5f3ff" stopOpacity={0.2} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                      <XAxis
                        dataKey="date"
                        stroke="#9ca3af"
                        fontSize={9}
                        dy={8}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        yAxisId="left"
                        stroke="#9ca3af"
                        fontSize={9}
                        domain={[0, 100000]}
                        tickFormatter={formatLeftYAxis}
                        tickLine={false}
                        axisLine={false}
                        ticks={[0, 25000, 50000, 75000, 100000]}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#9ca3af"
                        fontSize={9}
                        domain={[0, 400000]}
                        tickFormatter={formatRightYAxis}
                        tickLine={false}
                        axisLine={false}
                        ticks={[0, 100000, 200000, 300000, 400000]}
                      />
                      <Bar
                        yAxisId="left"
                        dataKey="barVal"
                        fill="url(#barGrad)"
                        stroke="#c7d2fe"
                        strokeWidth={1}
                        radius={[2, 2, 0, 0]}
                        barSize={18}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="lineVal"
                        stroke="#38bdf8"
                        strokeWidth={2.5}
                        dot={<CustomDot />}
                        activeDot={false}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300">
                    Loading revenue breakdown viz...
                  </div>
                )}
              </div>

            </div>

            {/* Description */}
            <div className="space-y-3 max-w-[480px]">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                </svg>
                <span>Unified Revenue View</span>
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Unified revenue view so you see Razorpay payments, Shopify orders, and CRM deals in one chart — not three tabs.
              </p>
            </div>
          </PlatformFeatureCard>

          {/* Column 2: Advanced Customization Controls */}
          <PlatformFeatureCard className="flex flex-col justify-between space-y-12 min-h-[440px]">
            {/* Card Widget Mockup */}
            <div className="w-full flex items-center justify-center">
              <div className="w-full max-w-[290px] border border-gray-200/80 rounded-2xl bg-white shadow-sm p-4 text-[11px] space-y-4">
                
                {/* Y-axis section */}
                <div className="space-y-2.5">
                  <span className="text-gray-400 font-semibold block text-[10px]">Y-axis</span>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800 font-medium">GMV</span>
                    <span className="w-3.5 h-3.5 rounded-full border border-gray-300 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-800 font-medium">Operating Profit</span>
                    <span className="w-3.5 h-3.5 rounded-full border border-amber-500/30 bg-amber-50 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-800 font-medium">Event Ads</span>
                    <span className="w-3.5 h-3.5 rounded-full border border-gray-300 flex items-center justify-center bg-gray-900">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 my-1" />

                {/* Appearance Section */}
                <div className="space-y-3">
                  <span className="text-gray-400 font-semibold block text-[10px]">Appearance</span>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800 font-medium">Bar Orientation</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-500 border border-gray-200 px-2 py-0.5 rounded-md bg-gray-50/50 cursor-pointer">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      Vertical
                    </span>
                  </div>

                  {/* Toggle switches (Custom CSS styling layout) */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 font-medium">Date range</span>
                    <div className="w-7 h-4 bg-gray-150 rounded-full p-0.5 transition-colors cursor-pointer flex items-center justify-start">
                      <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 font-medium">Show values on graph</span>
                    <div className="w-7 h-4 bg-gray-150 rounded-full p-0.5 transition-colors cursor-pointer flex items-center justify-start">
                      <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-850 font-semibold">Show legend</span>
                    <div className="w-7 h-4 bg-gray-900 rounded-full p-0.5 transition-colors cursor-pointer flex items-center justify-end">
                      <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Description */}
            <div className="space-y-3 max-w-[480px]">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span>Advanced customization</span>
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                with comprehensive controls to match your brand and tune colors, axes, labels and more.
              </p>
            </div>
          </PlatformFeatureCard>

        </div>
      </div>
    </section>
  );
}

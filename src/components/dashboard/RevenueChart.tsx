"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import EmptyState from "./EmptyState";
import { PaymentsIcon } from "@/components/ui/Icons";

interface RevenueChartProps {
  connectedTools: string[];
  dateRange: string; // global dateRange selection e.g. "Last 30 days"
}

// Daily Mock Data
const dailyData = [
  { date: "Jun 01", Razorpay: 12000, Stripe: 8000, Shopify: 15000 },
  { date: "Jun 05", Razorpay: 18000, Stripe: 14000, Shopify: 22000 },
  { date: "Jun 10", Razorpay: 15000, Stripe: 11000, Shopify: 19000 },
  { date: "Jun 15", Razorpay: 24000, Stripe: 19000, Shopify: 29000 },
  { date: "Jun 20", Razorpay: 32000, Stripe: 25000, Shopify: 38000 },
  { date: "Jun 25", Razorpay: 28000, Stripe: 22000, Shopify: 34000 },
  { date: "Jun 30", Razorpay: 42000, Stripe: 35000, Shopify: 48000 },
];

// Weekly Mock Data
const weeklyData = [
  { date: "Week 1", Razorpay: 80000, Stripe: 62000, Shopify: 95000 },
  { date: "Week 2", Razorpay: 95000, Stripe: 78000, Shopify: 115000 },
  { date: "Week 3", Razorpay: 110000, Stripe: 90000, Shopify: 130000 },
  { date: "Week 4", Razorpay: 142000, Stripe: 115000, Shopify: 168000 },
];

// Monthly Mock Data
const monthlyData = [
  { date: "Apr 2026", Razorpay: 320000, Stripe: 250000, Shopify: 420000 },
  { date: "May 2026", Razorpay: 380000, Stripe: 310000, Shopify: 490000 },
  { date: "Jun 2026", Razorpay: 427000, Stripe: 358000, Shopify: 541000 },
];

export default function RevenueChart({ connectedTools, dateRange }: RevenueChartProps) {
  const [mounted, setMounted] = useState(false);
  const [groupBy, setGroupBy] = useState<"Daily" | "Weekly" | "Monthly">("Daily");

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasPayments = connectedTools.some((t) =>
    ["razorpay", "stripe", "shopify", "woocommerce", "payu", "cashfree"].includes(t)
  );

  if (!hasPayments) {
    return (
      <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-6 h-[400px] flex flex-col justify-between">
        <h3 className="text-sm font-semibold text-white/90">Revenue over time</h3>
        <div className="flex-grow flex items-center justify-center">
          <EmptyState
            title="Connect payments to track revenue"
            description="Integrate Stripe, Razorpay, or Shopify to view your payment stats and revenue timeline charts."
            icon={<PaymentsIcon size={28} className="text-white/60" />}
          />
        </div>
      </div>
    );
  }

  // Determine active keys based on actual connected tools
  const activeSources = [
    { key: "Razorpay", label: "Razorpay", color: "#6366F1", active: connectedTools.includes("razorpay") },
    { key: "Stripe", label: "Stripe", color: "#38BDF8", active: connectedTools.includes("stripe") },
    { key: "Shopify", label: "Shopify", color: "#34D399", active: connectedTools.includes("shopify") },
  ];

  // If none of the main mock ones is specifically chosen, but say 'woocommerce' is connected, mock stripe/razorpay as defaults
  const anySpecificMockConnected = activeSources.some(s => s.active);
  if (!anySpecificMockConnected) {
    activeSources[0].active = true; // Default Razorpay active
  }

  const data = groupBy === "Daily" ? dailyData : groupBy === "Weekly" ? weeklyData : monthlyData;

  const formatYAxis = (value: number) => {
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
    return `₹${value}`;
  };

  return (
    <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-6 select-none font-sans relative overflow-hidden flex flex-col h-[400px]">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.01] to-transparent pointer-events-none" />

      {/* Header controls */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h3 className="text-sm font-semibold text-white/90">Revenue over time</h3>
          <p className="text-[10px] text-[#70709a]">Showing data for {dateRange}</p>
        </div>

        {/* Group Selector Toggle */}
        <div className="flex bg-white/5 border border-white/10 rounded-lg p-0.5">
          {(["Daily", "Weekly", "Monthly"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setGroupBy(mode)}
              className={`px-3 py-1 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                groupBy === mode
                  ? "bg-indigo-600/20 text-indigo-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] border border-indigo-500/20"
                  : "text-white/50 hover:text-white border border-transparent"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Chart container */}
      <div className="flex-grow w-full min-h-0 relative z-10 text-xs text-[#70709a]">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                {activeSources.map(
                  (s) =>
                    s.active && (
                      <linearGradient key={`grad-${s.key}`} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={s.color} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                      </linearGradient>
                    )
                )}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(208,208,232,0.02)" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="rgba(208,208,232,0.3)"
                tickLine={false}
                axisLine={false}
                dy={10}
                style={{ fontSize: 9, fontWeight: 500 }}
              />
              <YAxis
                stroke="rgba(208,208,232,0.3)"
                tickFormatter={formatYAxis}
                tickLine={false}
                axisLine={false}
                style={{ fontSize: 9, fontWeight: 500 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0d0d1a",
                  borderColor: "rgba(208, 208, 232, 0.08)",
                  borderRadius: 8,
                  fontSize: 11,
                  color: "#d0d0e8",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                }}
                formatter={(value: any, name?: any) => [`₹${Number(value).toLocaleString("en-IN")}`, name || ""]}
                labelStyle={{ fontWeight: "bold", color: "#fff", marginBottom: 4 }}
              />
              {activeSources.map(
                (s) =>
                  s.active && (
                    <Area
                      key={s.key}
                      type="monotone"
                      dataKey={s.key}
                      name={s.label}
                      stroke={s.color}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill={`url(#grad-${s.key})`}
                    />
                  )
              )}
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] text-white/20">
            Loading chart visualizations...
          </div>
        )}
      </div>

      {/* Sources Legend */}
      <div className="mt-4 flex items-center gap-4 relative z-10">
        {activeSources.map(
          (s) =>
            s.active && (
              <div key={s.key} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-[10px] font-semibold text-white/70">{s.label}</span>
              </div>
            )
        )}
      </div>
    </div>
  );
}

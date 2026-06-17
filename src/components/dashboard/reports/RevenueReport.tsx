"use client";

import React, { useEffect, useState } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ReportSectionHeader from "./ReportSectionHeader";
import ReportKPICard from "./ReportKPICard";
import { useChartColors } from "@/hooks/useChartColors";

interface RevenueReportProps {
  dateRange: string;
  compareMode: boolean;
}

interface DailyItem {
  date: string;
  Razorpay: number;
  Stripe: number;
  Cashfree: number;
  All: number;
  Cumulative: number;
}

// Generate mock data for the charts
const generateMockData = (paymentSource: "Razorpay" | "Stripe" | "Cashfree" | "All"): DailyItem[] => {
  const data = [
    { date: "06-01", Razorpay: 15000, Stripe: 10000, Cashfree: 5000 },
    { date: "06-05", Razorpay: 22000, Stripe: 15000, Cashfree: 8000 },
    { date: "06-10", Razorpay: 18000, Stripe: 12000, Cashfree: 6000 },
    { date: "06-15", Razorpay: 25000, Stripe: 18000, Cashfree: 10000 },
    { date: "06-20", Razorpay: 35000, Stripe: 25000, Cashfree: 15000 },
    { date: "06-25", Razorpay: 30000, Stripe: 20000, Cashfree: 12000 },
    { date: "06-30", Razorpay: 45000, Stripe: 32000, Cashfree: 20000 },
  ];

  let cumulativeSum = 0;
  return data.map((item) => {
    const allVal = item.Razorpay + item.Stripe + item.Cashfree;
    const value =
      paymentSource === "Razorpay"
        ? item.Razorpay
        : paymentSource === "Stripe"
        ? item.Stripe
        : paymentSource === "Cashfree"
        ? item.Cashfree
        : allVal;

    cumulativeSum += value;
    return {
      date: item.date,
      Razorpay: item.Razorpay,
      Stripe: item.Stripe,
      Cashfree: item.Cashfree,
      All: allVal,
      Cumulative: cumulativeSum,
    };
  });
};

export default function RevenueReport({ dateRange, compareMode }: RevenueReportProps) {
  const { colors, axis } = useChartColors();
  const [loading, setLoading] = useState(true);
  const [paymentSource, setPaymentSource] = useState<"Razorpay" | "Stripe" | "Cashfree" | "All">("All");

  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setLoading(true);
    }, 0);
    // Simulate API loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => {
      clearTimeout(loadTimer);
      clearTimeout(timer);
    };
  }, [dateRange, paymentSource]);

  const data = generateMockData(paymentSource);

  // Compute metrics based on selected source
  const totalRevenue = data[data.length - 1].Cumulative;
  const avgDailyRevenue = Math.round(totalRevenue / data.length);
  const highestSingleDay = Math.max(...data.map((d) => d[paymentSource]));
  const totalTransactions = Math.round(totalRevenue / 1250); // mock tx count

  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString("en-IN")}`;
  };

  const formatYAxis = (value: number) => {
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
    return `₹${value}`;
  };

  if (loading) {
    return (
      <div className="bg-[#0d0d1a]/20 border border-white/[0.03] rounded-xl p-6 space-y-6 animate-pulse min-h-[480px] flex flex-col justify-between">
        <div className="h-10 bg-white/5 rounded w-1/3" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-white/5" />
          ))}
        </div>
        <div className="h-[250px] bg-white/[0.02] rounded-lg flex-grow" />
      </div>
    );
  }

  return (
    <section className="bg-[#0d0d1a]/20 border border-white/[0.03] rounded-xl p-6 space-y-6">
      <ReportSectionHeader
        title="Revenue"
        subtitle="Total revenue collected across all payment sources"
      />

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ReportKPICard
          label="Total Revenue"
          value={formatCurrency(totalRevenue)}
          delta="+14.2%"
          isUp={true}
          compareMode={compareMode}
          subtitle="Total for the period"
        />
        <ReportKPICard
          label="Avg Daily Revenue"
          value={formatCurrency(avgDailyRevenue)}
          delta="+8.4%"
          isUp={true}
          compareMode={compareMode}
          subtitle="Average daily sales"
        />
        <ReportKPICard
          label="Highest Single Day"
          value={formatCurrency(highestSingleDay)}
          delta="+19.1%"
          isUp={true}
          compareMode={compareMode}
          subtitle="Peak daily revenue"
        />
        <ReportKPICard
          label="Total Transactions"
          value={totalTransactions.toLocaleString()}
          delta="+11.5%"
          isUp={true}
          compareMode={compareMode}
          subtitle="Total checkout volume"
        />
      </div>

      {/* Breakdown Filter & Chart */}
      <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <span className="text-xs font-semibold text-white/80">Revenue Breakdown & Timeline</span>
          {/* Payment Source Filter Toggle */}
          <div className="flex bg-white/5 border border-white/10 rounded-lg p-0.5 self-start sm:self-auto">
            {(["Razorpay", "Stripe", "Cashfree", "All"] as const).map((source) => (
              <button
                key={source}
                onClick={() => setPaymentSource(source)}
                className={`px-3 py-1 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                  paymentSource === source
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/20"
                    : "text-white/50 hover:text-white border border-transparent"
                }`}
              >
                {source}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Container */}
        <div className="h-[300px] w-full text-xs text-[#70709a]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: -5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
              <XAxis dataKey="date" {...axis} dy={10} />
              <YAxis yAxisId="left" {...axis} tickFormatter={formatYAxis} />
              <YAxis
                yAxisId="right"
                orientation="right"
                {...axis}
                tickFormatter={formatYAxis}
              />
              <Tooltip
                contentStyle={colors.tooltip}
                formatter={(value: unknown, name?: string | number) => [
                  formatCurrency(Number(value)),
                  name === "All" || name === "Razorpay" || name === "Stripe" || name === "Cashfree"
                    ? "Daily Revenue"
                    : "Cumulative Revenue",
                ]}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={colors.legend} />
              <Bar
                yAxisId="left"
                dataKey={paymentSource}
                name="Daily revenue"
                fill="url(#revenueGrad)"
                radius={[4, 4, 0, 0]}
                barSize={32}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="Cumulative"
                name="Cumulative"
                stroke="#38BDF8"
                strokeWidth={2.5}
                dot={{ r: 4, strokeWidth: 1.5, fill: colors.dotFill }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

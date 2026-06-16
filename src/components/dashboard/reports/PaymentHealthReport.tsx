"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import EmptyState from "@/components/dashboard/EmptyState";
import ReportSectionHeader from "./ReportSectionHeader";
import ReportKPICard from "./ReportKPICard";
import { PaymentsIcon } from "@/components/ui/Icons";
import { useChartColors } from "@/hooks/useChartColors";

interface PaymentHealthReportProps {
  connectedTools: string[];
  dateRange: string;
  compareMode: boolean;
}

interface FailureReason {
  reason: string;
  count: number;
  pct: string;
  lostAmount: number;
}

const mockFailureReasons: FailureReason[] = [
  { reason: "Insufficient funds", count: 42, pct: "35.0%", lostAmount: 84000 },
  { reason: "Card declined", count: 35, pct: "29.2%", lostAmount: 70000 },
  { reason: "UPI failure", count: 22, pct: "18.3%", lostAmount: 44000 },
  { reason: "Bank timeout", count: 13, pct: "10.8%", lostAmount: 26000 },
  { reason: "Net banking error", count: 8, pct: "6.7%", lostAmount: 16000 },
];

const mockDailyHealth = [
  { date: "06-01", rate: 96.2 },
  { date: "06-05", rate: 94.8 }, // below benchmark
  { date: "06-10", rate: 97.1 },
  { date: "06-15", rate: 93.5 }, // below benchmark
  { date: "06-20", rate: 98.2 },
  { date: "06-25", rate: 96.5 },
  { date: "06-30", rate: 95.8 },
];

// Custom Dot renderer for days below 95%
const CustomizedDot = (props: { cx?: number; cy?: number; payload?: { rate: number } }) => {
  const { cx, cy, payload } = props;
  if (payload && payload.rate < 95) {
    return (
      <circle cx={cx} cy={cy} r={5} fill="#EF4444" stroke="#FFF" strokeWidth={1.5} style={{ filter: "drop-shadow(0px 0px 4px rgba(239, 68, 68, 0.6))" }} />
    );
  }
  return (
    <circle cx={cx} cy={cy} r={3.5} fill="#10B981" stroke="#0d0d1a" strokeWidth={1} />
  );
};

export default function PaymentHealthReport({
  connectedTools,
  dateRange,
  compareMode,
}: PaymentHealthReportProps) {
  const { colors, axis } = useChartColors();
  const [loading, setLoading] = useState(true);

  const hasPayments = connectedTools.some((t) =>
    ["razorpay", "stripe", "payu", "cashfree"].includes(t)
  );

  useEffect(() => {
    if (!hasPayments) return;
    const loadTimer = setTimeout(() => {
      setLoading(true);
    }, 0);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => {
      clearTimeout(loadTimer);
      clearTimeout(timer);
    };
  }, [dateRange, hasPayments]);

  if (!hasPayments) {
    return (
      <div className="bg-[#0d0d1a]/20 border border-white/[0.03] rounded-xl p-6 min-h-[320px] flex flex-col justify-between">
        <ReportSectionHeader
          title="Payment health"
          subtitle="Transaction success rates and failure analysis"
        />
        <div className="flex-grow flex items-center justify-center">
          <EmptyState
            title="Connect Payment Gateways to view Health details"
            description="Integrate Razorpay, Stripe, PayU, or Cashfree to view transaction logs, failure analytics, and refunds."
            buttonText="Connect Payments"
            href="/dashboard/connectors"
            icon={<PaymentsIcon size={28} className="text-white/60" />}
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-[#0d0d1a]/20 border border-white/[0.03] rounded-xl p-6 space-y-6 animate-pulse min-h-[480px] flex flex-col justify-between">
        <div className="h-10 bg-white/5 rounded w-1/3" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-white/5" />
          ))}
        </div>
        <div className="h-[200px] bg-white/[0.02] rounded-lg" />
      </div>
    );
  }

  return (
    <section className="bg-[#0d0d1a]/20 border border-white/[0.03] rounded-xl p-6 space-y-6 select-none font-sans">
      <ReportSectionHeader
        title="Payment health"
        subtitle="Transaction success rates and failure analysis"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ReportKPICard
          label="Success Rate %"
          value="95.82%"
          delta="+1.2%"
          isUp={true}
          compareMode={compareMode}
          subtitle="Successful transactions"
        />
        <ReportKPICard
          label="Failed Transactions"
          value="120"
          delta="-14.4%"
          isUp={true}
          compareMode={compareMode}
          subtitle="Unsuccessful attempts"
        />
        <ReportKPICard
          label="Total Refunds"
          value="₹2,40,000"
          delta="+4.5%"
          isUp={false}
          compareMode={compareMode}
          subtitle="Returned to customers"
        />
        <ReportKPICard
          label="Refund Rate %"
          value="1.86%"
          delta="-0.2%"
          isUp={true}
          compareMode={compareMode}
          subtitle="Refunds of total volume"
        />
      </div>

      {/* Success Rate Timeline Chart */}
      <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-semibold text-white/80">Daily Transaction Success Rate</span>
          <span className="text-[10px] text-rose-400 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Below 95% Benchmark
          </span>
        </div>
        <div className="h-[250px] w-full text-xs text-[#70709a]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockDailyHealth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
              <XAxis dataKey="date" {...axis} />
              <YAxis
                {...axis}
                domain={[90, 100]}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip
                contentStyle={colors.tooltip}
                formatter={(val) => [`${val}%`, "Success Rate"]}
              />
              <ReferenceLine y={95} stroke="#EF4444" strokeDasharray="3 3" label={{ value: "95% Benchmark", fill: "#EF4444", position: "top", fontSize: 9 }} />
              <Line
                type="monotone"
                dataKey="rate"
                name="Success Rate"
                stroke="#10B981"
                strokeWidth={2}
                dot={<CustomizedDot />}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Failure Reasons Breakdown Table */}
      <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-5 space-y-4">
        <span className="text-xs font-semibold text-white/80 block">Failure Reason Breakdown</span>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-white/40 font-semibold">
                <th className="py-2 px-1">Failure Reason</th>
                <th className="py-2 px-1">Count</th>
                <th className="py-2 px-1">% of Failures</th>
                <th className="py-2 px-1 text-right">Total ₹ Lost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02] text-white/80">
              {mockFailureReasons.map((fail, idx) => (
                <tr key={idx} className="hover:bg-white/[0.01]">
                  <td className="py-2.5 px-1 font-semibold text-white/95">{fail.reason}</td>
                  <td className="py-2.5 px-1">{fail.count}</td>
                  <td className="py-2.5 px-1 text-white/60">{fail.pct}</td>
                  <td className="py-2.5 px-1 text-right font-mono text-rose-400">
                    ₹{fail.lostAmount.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

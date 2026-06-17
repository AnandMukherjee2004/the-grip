"use client";

import React, { useEffect, useState } from "react";
import {
  FunnelChart,
  Funnel,
  LabelList,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import EmptyState from "@/components/dashboard/EmptyState";
import ReportSectionHeader from "./ReportSectionHeader";
import ReportKPICard from "./ReportKPICard";
import { LeadsIcon } from "@/components/ui/Icons";
import { useChartColors } from "@/hooks/useChartColors";

interface SalesFunnelReportProps {
  connectedTools: string[];
  dateRange: string;
  compareMode: boolean;
}

// Funnel Mock Data
const funnelData = [
  { value: 680, name: "New lead", fill: "#6366F1", pipeline: 8500000, dropoff: "0%" },
  { value: 420, name: "Qualified", fill: "#818CF8", pipeline: 6300000, dropoff: "38.2%" },
  { value: 250, name: "Demo done", fill: "#4F46E5", pipeline: 4800000, dropoff: "40.5%" },
  { value: 130, name: "Proposal sent", fill: "#312E81", pipeline: 3200000, dropoff: "48.0%" },
  { value: 65, name: "Won", fill: "#10B981", pipeline: 1625000, dropoff: "50.0%" },
];

// Line Chart Mock Data: leads created per day
const dailyLeadsData = [
  { date: "06-01", "New leads": 15, "Deals won": 2 },
  { date: "06-05", "New leads": 24, "Deals won": 3 },
  { date: "06-10", "New leads": 20, "Deals won": 4 },
  { date: "06-15", "New leads": 28, "Deals won": 3 },
  { date: "06-20", "New leads": 35, "Deals won": 6 },
  { date: "06-25", "New leads": 31, "Deals won": 5 },
  { date: "06-30", "New leads": 45, "Deals won": 8 },
];

export default function SalesFunnelReport({
  connectedTools,
  dateRange,
  compareMode,
}: SalesFunnelReportProps) {
  const { colors, axis } = useChartColors();
  const [loading, setLoading] = useState(true);

  const hasCrm = connectedTools.some((t) =>
    ["hubspot", "salesforce", "leadsquared", "freshsales", "zoho-crm", "pipedrive"].includes(t)
  );

  useEffect(() => {
    if (!hasCrm) return;
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
  }, [dateRange, hasCrm]);

  if (!hasCrm) {
    return (
      <div className="bg-[#0d0d1a]/20 border border-white/[0.03] rounded-xl p-6 min-h-[320px] flex flex-col justify-between">
        <ReportSectionHeader
          title="Sales funnel"
          subtitle="Lead to revenue conversion across all CRMs"
        />
        <div className="flex-grow flex items-center justify-center">
          <EmptyState
            title="Connect a CRM to see your sales funnel"
            description="Integrate Hubspot, Salesforce, or Zoho CRM to start tracking leads, opportunities, and overall conversion rates."
            buttonText="Connect CRM"
            href="/dashboard/connectors"
            icon={<LeadsIcon size={28} className="text-white/60" />}
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-[#0d0d1a]/20 border border-white/[0.03] rounded-xl p-6 space-y-6 animate-pulse min-h-[500px] flex flex-col justify-between">
        <div className="h-10 bg-white/5 rounded w-1/3" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-white/5" />
          ))}
        </div>
        <div className="h-[300px] bg-white/[0.02] rounded-lg flex-grow" />
      </div>
    );
  }

  return (
    <section className="bg-[#0d0d1a]/20 border border-white/[0.03] rounded-xl p-6 space-y-6">
      <ReportSectionHeader
        title="Sales funnel"
        subtitle="Lead to revenue conversion across all CRMs"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ReportKPICard
          label="Total Leads"
          value="680"
          delta="+9.2%"
          isUp={true}
          compareMode={compareMode}
          subtitle="Leads captured"
        />
        <ReportKPICard
          label="Qualified Leads"
          value="420"
          delta="+6.4%"
          isUp={true}
          compareMode={compareMode}
          subtitle="61.7% of total leads"
        />
        <ReportKPICard
          label="Deals Won"
          value="65"
          delta="+12.1%"
          isUp={true}
          compareMode={compareMode}
          subtitle="Closed-won opportunities"
        />
        <ReportKPICard
          label="Overall Conversion Rate"
          value="9.56%"
          delta="+0.8%"
          isUp={true}
          compareMode={compareMode}
          subtitle="New lead to won conversion"
        />
      </div>

      {/* Funnel chart and Lead chart grid */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Recharts Funnel visualization */}
        <div className="lg:col-span-5 bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-5 flex flex-col h-[380px]">
          <span className="text-xs font-semibold text-white/80 mb-4">Pipeline Stages</span>
          <div className="flex-grow w-full relative min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0d0d1a",
                    borderColor: "rgba(208, 208, 232, 0.08)",
                    borderRadius: 8,
                    fontSize: 11,
                    color: "#d0d0e8",
                  }}
                  formatter={(value: unknown, name?: string | number, props?: unknown) => {
                    const typedProps = props as { payload?: { pipeline?: number; dropoff?: string } } | undefined;
                    const pipelineVal = typedProps?.payload?.pipeline ?? 0;
                    const dropoffVal = typedProps?.payload?.dropoff ?? "0%";
                    return [
                      `Leads: ${value} | Value: ₹${(pipelineVal / 100000).toFixed(1)}L | Drop-off: ${dropoffVal}`,
                      name ?? "",
                    ];
                  }}
                />
                <Funnel dataKey="value" data={funnelData} isAnimationActive>
                  <LabelList position="right" fill={colors.labelFill} stroke="none" dataKey="name" style={{ fontSize: 10 }} />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Generation Timeline */}
        <div className="lg:col-span-5 bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-5 flex flex-col h-[380px]">
          <span className="text-xs font-semibold text-white/80 mb-4">Daily Leads Created vs Won</span>
          <div className="flex-grow w-full relative min-h-0 text-xs text-[#70709a]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyLeadsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                <XAxis dataKey="date" {...axis} dy={10} />
                <YAxis {...axis} />
                <Tooltip contentStyle={colors.tooltip} />
                <Legend verticalAlign="top" height={36} wrapperStyle={colors.legend} />
                <Line
                  type="monotone"
                  dataKey="New leads"
                  stroke="#6366F1"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="Deals won"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}

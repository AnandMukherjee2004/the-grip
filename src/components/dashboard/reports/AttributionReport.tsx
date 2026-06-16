"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
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
import { DashboardIcon } from "@/components/ui/Icons";

interface AttributionReportProps {
  connectedTools: string[];
  dateRange: string;
  compareMode: boolean;
}

interface CampaignItem {
  name: string;
  channel: "Meta" | "Google" | "Organic" | "Direct" | "WhatsApp";
  spend: number;
  leads: number;
  revenue: number;
  roas: number;
  cac: number;
}

const mockCampaigns: CampaignItem[] = [
  { name: "Meta — Summer Sale", channel: "Meta", spend: 120000, leads: 450, revenue: 384000, roas: 3.2, cac: 266 },
  { name: "Google — Brand Search", channel: "Google", spend: 80000, leads: 280, revenue: 416000, roas: 5.2, cac: 285 },
  { name: "Meta — Retargeting Pro", channel: "Meta", spend: 60000, leads: 180, revenue: 150000, roas: 2.5, cac: 333 },
  { name: "Google — Display Non-brand", channel: "Google", spend: 90000, leads: 150, revenue: 72000, roas: 0.8, cac: 600 },
  { name: "Meta — Lookalike LTV", channel: "Meta", spend: 75000, leads: 110, revenue: 67500, roas: 0.9, cac: 681 },
];

const mockChannelPerformance = [
  { channel: "Meta", Spend: 255000, Revenue: 601500 },
  { channel: "Google", Spend: 170000, Revenue: 488000 },
  { channel: "Organic", Spend: 0, Revenue: 220000 },
  { channel: "Direct", Spend: 0, Revenue: 180000 },
  { channel: "WhatsApp", Spend: 15000, Revenue: 95000 },
];

type SortKey = keyof CampaignItem;

export default function AttributionReport({
  connectedTools,
  dateRange,
  compareMode,
}: AttributionReportProps) {
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(mockCampaigns);
  const [sortKey, setSortKey] = useState<SortKey>("roas");
  const [sortAsc, setSortAsc] = useState(false);

  const hasAds = connectedTools.some((t) =>
    ["meta-ads", "google-ads"].includes(t)
  );

  useEffect(() => {
    if (!hasAds) return;
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
  }, [dateRange, hasAds]);

  const handleSort = (key: SortKey) => {
    const isAsc = sortKey === key ? !sortAsc : false;
    setSortKey(key);
    setSortAsc(isAsc);

    const sorted = [...campaigns].sort((a, b) => {
      const valA = a[key];
      const valB = b[key];
      if (typeof valA === "string") {
        return isAsc
          ? (valA as string).localeCompare(valB as string)
          : (valB as string).localeCompare(valA as string);
      }
      return isAsc
        ? (valA as number) - (valB as number)
        : (valB as number) - (valA as number);
    });
    setCampaigns(sorted);
  };

  const renderSortIndicator = (key: SortKey) => {
    if (sortKey !== key) return <span className="text-white/20 ml-1">⇅</span>;
    return sortAsc ? <span className="text-indigo-400 ml-1">▲</span> : <span className="text-indigo-400 ml-1">▼</span>;
  };

  if (!hasAds) {
    return (
      <div className="bg-[#0d0d1a]/20 border border-white/[0.03] rounded-xl p-6 min-h-[320px] flex flex-col justify-between">
        <ReportSectionHeader
          title="Attribution"
          subtitle="Ad spend to revenue mapping by channel"
        />
        <div className="flex-grow flex items-center justify-center">
          <EmptyState
            title="Connect Ads platforms to see Attribution"
            description="Integrate Meta Ads or Google Ads to view campaign ROAS, CAC, and channel-level profitability."
            buttonText="Connect Ads"
            href="/dashboard/connectors"
            icon={<DashboardIcon size={28} className="text-white/60" />}
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
        title="Attribution"
        subtitle="Ad spend to revenue mapping by channel"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ReportKPICard
          label="Total Ad Spend"
          value="₹4,40,000"
          delta="+16.4%"
          isUp={true}
          compareMode={compareMode}
          subtitle="Meta + Google Ads cost"
        />
        <ReportKPICard
          label="Attributed Revenue"
          value="₹10,89,500"
          delta="+22.8%"
          isUp={true}
          compareMode={compareMode}
          subtitle="Revenue driven by campaigns"
        />
        <ReportKPICard
          label="Blended ROAS"
          value="2.48x"
          delta="+5.5%"
          isUp={true}
          compareMode={compareMode}
          subtitle="Return on Ad Spend"
        />
        <ReportKPICard
          label="Blended CAC"
          value="₹376"
          delta="-8.2%"
          isUp={true}
          compareMode={compareMode}
          subtitle="Customer Acquisition Cost"
        />
      </div>

      {/* Channel Performance Chart */}
      <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-5">
        <span className="text-xs font-semibold text-white/80 block mb-4">Ad Spend vs Attributed Revenue by Channel</span>
        <div className="h-[250px] w-full text-xs text-[#70709a]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockChannelPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(208,208,232,0.02)" vertical={false} />
              <XAxis dataKey="channel" stroke="rgba(208,208,232,0.3)" tickLine={false} axisLine={false} />
              <YAxis
                stroke="rgba(208,208,232,0.3)"
                tickFormatter={(val) => `₹${val / 1000}k`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0d0d1a",
                  borderColor: "rgba(208, 208, 232, 0.08)",
                  borderRadius: 8,
                  fontSize: 11,
                  color: "#d0d0e8",
                }}
                formatter={(val: unknown) => `₹${Number(val).toLocaleString("en-IN")}`}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="Spend" fill="#EC4899" radius={[4, 4, 0, 0]} barSize={24} />
              <Bar dataKey="Revenue" fill="#10B981" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Campaign List Table */}
      <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-5 space-y-4">
        <span className="text-xs font-semibold text-white/80 block">Campaign Performance Breakdown</span>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-white/40 font-semibold cursor-pointer">
                <th className="py-2 px-1 hover:text-white" onClick={() => handleSort("name")}>
                  Campaign Name {renderSortIndicator("name")}
                </th>
                <th className="py-2 px-1 hover:text-white" onClick={() => handleSort("channel")}>
                  Channel {renderSortIndicator("channel")}
                </th>
                <th className="py-2 px-1 hover:text-white" onClick={() => handleSort("spend")}>
                  Spend {renderSortIndicator("spend")}
                </th>
                <th className="py-2 px-1 hover:text-white" onClick={() => handleSort("leads")}>
                  Leads {renderSortIndicator("leads")}
                </th>
                <th className="py-2 px-1 hover:text-white" onClick={() => handleSort("revenue")}>
                  Revenue {renderSortIndicator("revenue")}
                </th>
                <th className="py-2 px-1 hover:text-white" onClick={() => handleSort("roas")}>
                  ROAS {renderSortIndicator("roas")}
                </th>
                <th className="py-2 px-1 hover:text-white" onClick={() => handleSort("cac")}>
                  CAC {renderSortIndicator("cac")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02] text-white/80">
              {campaigns.map((camp, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors duration-150 ${
                    camp.roas < 1
                      ? "bg-rose-500/10 hover:bg-rose-500/15 text-rose-200"
                      : "hover:bg-white/[0.01]"
                  }`}
                >
                  <td className="py-2.5 px-1 font-semibold">{camp.name}</td>
                  <td className="py-2.5 px-1">
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 text-white/60">
                      {camp.channel}
                    </span>
                  </td>
                  <td className="py-2.5 px-1">₹{camp.spend.toLocaleString("en-IN")}</td>
                  <td className="py-2.5 px-1">{camp.leads}</td>
                  <td className="py-2.5 px-1">₹{camp.revenue.toLocaleString("en-IN")}</td>
                  <td className="py-2.5 px-1 font-bold">{camp.roas.toFixed(2)}x</td>
                  <td className="py-2.5 px-1">₹{camp.cac}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import TopBar, { DEFAULT_DATE_RANGE } from "@/components/layout/TopBar";
import type { DateRangeSelection } from "@/lib/dateRange";
import { useChartColors } from "@/hooks/useChartColors";

interface Lead {
  id: string;
  externalId: string;
  sourceTool: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  stageRaw: string | null;
  dealValueInr: number | null;
  adPlatform: string | null;
  campaignId: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  agentId: string | null;
  createdAt: string;
  stageUpdatedAt: string | null;
}

// TODO: wire to real data
const SOURCE_PIE_DATA = [
  { name: "Meta", value: 38, count: 762, color: "#534AB7" },
  { name: "Google", value: 29, count: 582, color: "#1D9E75" },
  { name: "Organic", value: 18, count: 361, color: "#F59E0B" },
  { name: "Referral", value: 10, count: 201, color: "#3B82F6" },
  { name: "Other", value: 5, count: 100, color: "#6B7280" },
];

// TODO: wire to real data
const MOCK_VELOCITY_DATA = [
  { date: "May 22", count: 12 },
  { date: "May 23", count: 15 },
  { date: "May 24", count: 9 },
  { date: "May 25", count: 18 },
  { date: "May 26", count: 14 },
  { date: "May 27", count: 22 },
  { date: "May 28", count: 17 },
  { date: "May 29", count: 20 },
  { date: "May 30", count: 25 },
  { date: "May 31", count: 21 },
  { date: "Jun 01", count: 30 },
  { date: "Jun 02", count: 28 },
  { date: "Jun 03", count: 32 },
  { date: "Jun 04", count: 35 },
  { date: "Jun 05", count: 29 },
  { date: "Jun 06", count: 38 },
  { date: "Jun 07", count: 41 },
  { date: "Jun 08", count: 36 },
  { date: "Jun 09", count: 45 },
  { date: "Jun 10", count: 48 },
  { date: "Jun 11", count: 42 },
  { date: "Jun 12", count: 50 },
  { date: "Jun 13", count: 55 },
  { date: "Jun 14", count: 49 },
  { date: "Jun 15", count: 52 },
  { date: "Jun 16", count: 58 },
  { date: "Jun 17", count: 54 },
  { date: "Jun 18", count: 62 },
  { date: "Jun 19", count: 65 },
  { date: "Jun 20", count: 68 },
];

// Helper to format currency using Indian standard
const formatINR = (value: number) => {
  return "₹" + new Intl.NumberFormat("en-IN").format(value);
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function LeadsPage() {
  const { colors, axis } = useChartColors();
  const [dateRange, setDateRange] = useState<DateRangeSelection>(DEFAULT_DATE_RANGE);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [mounted, setMounted] = useState(false);

  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<{
    totalLeads: number;
    newThisMonth: number;
    stageBreakdown: { stageRaw: string; count: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Load workspaceId and mount status
  useEffect(() => {
    const id = localStorage.getItem("workspaceId") || localStorage.getItem("grip_workspace_id");
    setWorkspaceId(id);
    setMounted(true);
  }, []);

  // Fetch Stats
  useEffect(() => {
    if (!workspaceId) return;

    async function fetchStats() {
      setStatsLoading(true);
      try {
        const url = `${API_URL}/api/v1/leads/stats?workspaceId=${workspaceId}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch lead statistics");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch lead stats:", err);
      } finally {
        setStatsLoading(false);
      }
    }

    fetchStats();
  }, [workspaceId]);

  // Fetch Leads
  useEffect(() => {
    if (!workspaceId) {
      setLoading(false);
      return;
    }

    async function fetchLeads() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          workspaceId: workspaceId as string,
          page: '1',
          limit: '50',
        });
        if (debouncedSearch) {
          params.append('search', debouncedSearch);
        }
        if (stageFilter && stageFilter !== 'All') {
          params.append('stage', stageFilter);
        }

        const url = `${API_URL}/api/v1/leads?${params.toString()}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to load leads from the server");
        const data = await res.json();
        setLeads(data.leads || []);
      } catch (err: any) {
        console.error("Failed to load leads:", err);
        setError(err.message || "An error occurred while loading leads");
      } finally {
        setLoading(false);
      }
    }

    fetchLeads();
  }, [workspaceId, debouncedSearch, stageFilter]);

  const STAGE_BAR_DATA = stats?.stageBreakdown.map((item) => ({
    name: item.stageRaw,
    count: item.count,
  })) || [];

  return (
    <div className="flex-grow flex flex-col overflow-hidden bg-[#040409]">
      <TopBar dateRange={dateRange} onDateRangeChange={setDateRange} />

      {/* Main Content Area */}
      <main className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin text-[#d0d0e8] font-sans">
        {/* Page Header */}
        <div className="flex items-center justify-between select-none">
          <div>
            <h1 className="text-sm font-bold text-white tracking-wider font-display uppercase">Leads</h1>
            <p className="text-[10px] text-[#70709a] font-medium">Analyze lead stages, platform spending attributes, and sales pipeline performance</p>
          </div>
        </div>

        {/* 5-Column KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 w-full select-none">
          {/* Card 1: Total Leads */}
          <div className="p-4 rounded-xl bg-[#0d0d1a]/40 border border-white/[0.04] backdrop-blur-md relative overflow-hidden flex flex-col justify-between group transition-all hover:border-white/[0.08]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#70709a]">
                Total Leads
              </span>
              <div className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">
                {statsLoading ? (
                  <div className="h-5 w-12 bg-white/10 animate-pulse rounded my-0.5" />
                ) : stats ? (
                  new Intl.NumberFormat("en-IN").format(stats.totalLeads)
                ) : (
                  "—"
                )}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ▲ +14.2%
              </span>
              <span className="text-[9px] text-[#70709a] truncate">vs last month</span>
            </div>
          </div>

          {/* Card 2: New This Month */}
          <div className="p-4 rounded-xl bg-[#0d0d1a]/40 border border-white/[0.04] backdrop-blur-md relative overflow-hidden flex flex-col justify-between group transition-all hover:border-white/[0.08]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#70709a]">
                New This Month
              </span>
              <div className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">
                {statsLoading ? (
                  <div className="h-5 w-12 bg-white/10 animate-pulse rounded my-0.5" />
                ) : stats ? (
                  new Intl.NumberFormat("en-IN").format(stats.newThisMonth)
                ) : (
                  "—"
                )}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ▲ +18%
              </span>
              <span className="text-[9px] text-[#70709a] truncate">vs last month</span>
            </div>
          </div>

          {/* Card 3: Total Pipeline Value */}
          <div className="p-4 rounded-xl bg-[#0d0d1a]/40 border border-white/[0.04] backdrop-blur-md relative overflow-hidden flex flex-col justify-between group transition-all hover:border-white/[0.08]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#70709a]">
                Pipeline Value
              </span>
              <div className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">
                {statsLoading ? <div className="h-5 w-16 bg-white/10 animate-pulse rounded my-0.5" /> : "—"}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ▲ +22.4%
              </span>
              <span className="text-[9px] text-[#70709a] truncate">vs last month</span>
            </div>
          </div>

          {/* Card 4: Avg Deal Size */}
          <div className="p-4 rounded-xl bg-[#0d0d1a]/40 border border-white/[0.04] backdrop-blur-md relative overflow-hidden flex flex-col justify-between group transition-all hover:border-white/[0.08]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#70709a]">
                Avg Deal Size
              </span>
              <div className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">
                {statsLoading ? <div className="h-5 w-16 bg-white/10 animate-pulse rounded my-0.5" /> : "—"}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ▲ +3.2%
              </span>
              <span className="text-[9px] text-[#70709a] truncate">vs last month</span>
            </div>
          </div>

          {/* Card 5: Conversion Rate */}
          <div className="p-4 rounded-xl bg-[#0d0d1a]/40 border border-white/[0.04] backdrop-blur-md relative overflow-hidden flex flex-col justify-between group transition-all hover:border-white/[0.08] col-span-2 lg:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#70709a]">
                Conversion Rate
              </span>
              <div className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">
                {statsLoading ? <div className="h-5 w-12 bg-white/10 animate-pulse rounded my-0.5" /> : "—"}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ▲ +1.1%
              </span>
              <span className="text-[9px] text-[#70709a] truncate">vs last month</span>
            </div>
          </div>
        </div>

        {/* Double Recharts Stage vs Source */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leads by Stage - Horizontal Bar Chart */}
          <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-6 select-none relative overflow-hidden flex flex-col justify-between backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.01] to-transparent pointer-events-none" />
            <div className="mb-4 relative z-10">
              <h3 className="text-sm font-semibold text-white/90">Leads by Stage</h3>
              <p className="text-[10px] text-[#70709a]">Lead quantity distribution across stages</p>
            </div>
            <div className="w-full h-[260px] text-xs relative z-10 text-[#70709a]">
              {mounted && !statsLoading ? (
                STAGE_BAR_DATA.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={STAGE_BAR_DATA}
                      layout="vertical"
                      margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} horizontal={false} />
                      <XAxis type="number" {...axis} style={{ fontSize: 9, fontWeight: 500 }} />
                      <YAxis
                        dataKey="name"
                        type="category"
                        {...axis}
                        style={{ fontSize: 9, fontWeight: 500 }}
                      />
                      <Tooltip contentStyle={colors.tooltip} />
                      <Bar dataKey="count" fill="#534AB7" radius={[0, 4, 4, 0]} name="Leads" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-white/20">
                    No stage data found
                  </div>
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-white/20">
                  Loading stage breakdown...
                </div>
              )}
            </div>
          </div>

          {/* Leads by Source - Pie Chart */}
          <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-6 select-none relative overflow-hidden flex flex-col justify-between backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.01] to-transparent pointer-events-none" />
            <div className="mb-4 relative z-10">
              <h3 className="text-sm font-semibold text-white/90">Leads by Source</h3>
              <p className="text-[10px] text-[#70709a]">Lead acquisition sources breakdown</p>
            </div>
            <div className="w-full h-[210px] text-xs relative z-10 flex items-center justify-center">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={SOURCE_PIE_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {SOURCE_PIE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={colors.tooltip}
                      formatter={(value: number) => [`${value}%`, "Acquisition share"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-white/20">
                  Loading source share...
                </div>
              )}
            </div>

            {/* Custom Pie Legend with platform, percentage, count */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-2 relative z-10 select-none">
              {SOURCE_PIE_DATA.map((item) => (
                <div key={item.name} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[9px] font-semibold text-white/70">
                    {item.name} ({item.value}% — {item.count})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lead Velocity — New Leads per Day */}
        <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-6 select-none relative overflow-hidden flex flex-col justify-between backdrop-blur-md">
          <div className="absolute inset-0 bg-gradient-to-b from-[#534AB7]/[0.01] to-transparent pointer-events-none" />
          <div className="mb-4 relative z-10">
            <h3 className="text-sm font-semibold text-white/90">Lead Velocity — New Leads per Day</h3>
            <p className="text-[10px] text-[#70709a]">Daily acquisition trend over the last 30 days</p>
          </div>
          <div className="w-full h-[200px] text-xs relative z-10 text-[#70709a]">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_VELOCITY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                     <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#534AB7" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#534AB7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                  <XAxis
                    dataKey="date"
                    {...axis}
                    dy={10}
                    style={{ fontSize: 9, fontWeight: 500 }}
                  />
                  <YAxis
                    {...axis}
                    style={{ fontSize: 9, fontWeight: 500 }}
                  />
                  <Tooltip
                    contentStyle={colors.tooltip}
                    formatter={(value: number) => [value, "New Leads"]}
                    labelStyle={{ fontWeight: "bold", color: "#534AB7", marginBottom: 4 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="Leads Created"
                    stroke="#534AB7"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#velocityGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-white/20">
                Loading lead velocity analytics...
              </div>
            )}
          </div>
        </div>

        {/* All Leads Table Section */}
        <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-6 select-none relative overflow-hidden backdrop-blur-md">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />

          <div className="mb-6 relative z-10">
            <h3 className="text-sm font-semibold text-white/90">All Leads</h3>
            <p className="text-[10px] text-[#70709a]">Monitor deal flows, assigned agents, and attribution sources</p>
          </div>

          {/* Filter Bar (2 Controls) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 relative z-10 items-center text-xs">
            <div>
              <input
                type="text"
                placeholder="Search by name, email or phone…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 hover:border-white/20 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-sans"
              />
            </div>
            <div>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="w-full h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-white hover:border-white/20 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-sans appearance-none cursor-pointer"
              >
                <option value="All" className="bg-[#0d0d1a] text-white">Stage: All</option>
                <option value="New" className="bg-[#0d0d1a] text-white">New</option>
                <option value="Contacted" className="bg-[#0d0d1a] text-white">Contacted</option>
                <option value="Demo Scheduled" className="bg-[#0d0d1a] text-white">Demo Scheduled</option>
                <option value="Proposal Sent" className="bg-[#0d0d1a] text-white">Proposal Sent</option>
                <option value="Negotiation" className="bg-[#0d0d1a] text-white">Negotiation</option>
                <option value="Won" className="bg-[#0d0d1a] text-white">Won</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto w-full rounded-xl border border-white/[0.04] bg-[#0d0d1a]/20 relative z-10">
            <table className="w-full border-collapse text-left text-xs text-[#d0d0e8]/85">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02] text-white/60 font-semibold">
                  <th className="p-3">Lead</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Stage</th>
                  <th className="p-3">Source Tool</th>
                  <th className="p-3">Ad Platform</th>
                  <th className="p-3">Deal Value</th>
                  <th className="p-3">Agent</th>
                  <th className="p-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-red-400 font-medium">
                      {error}
                    </td>
                  </tr>
                ) : leads.length > 0 ? (
                  leads.map((lead) => {
                    // Colored dot matching source pie colors
                    let dotColor = "bg-[#6B7280]"; // other grey
                    if (lead.adPlatform === "meta") {
                      dotColor = "bg-[#534AB7]"; // meta purple
                    } else if (lead.adPlatform === "google") {
                      dotColor = "bg-[#1D9E75]"; // google teal
                    } else if (lead.adPlatform === "instagram") {
                      dotColor = "bg-[#3B82F6]"; // instagram blue (or amber)
                    } else if (lead.adPlatform === "linkedin") {
                      dotColor = "bg-[#F59E0B]"; // linkedin amber
                    }

                    // Stage styles
                    let stageBadgeClass = "bg-white/5 text-white/60 border border-white/10"; // New
                    if (lead.stageRaw === "Won") {
                      stageBadgeClass = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
                    } else if (
                      lead.stageRaw === "Demo Scheduled" ||
                      lead.stageRaw === "Proposal Sent" ||
                      lead.stageRaw === "Negotiation"
                    ) {
                      stageBadgeClass = "bg-[#534AB7]/10 text-indigo-400 border border-[#534AB7]/20";
                    } else if (lead.stageRaw === "Contacted") {
                      stageBadgeClass = "bg-amber-500/10 text-amber-400 border border-amber-500/20";
                    }

                    return (
                      <tr key={lead.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="p-3">
                          <div className="flex flex-col">
                            <span className="font-semibold text-white/95">{lead.name || <span className="text-white/20">—</span>}</span>
                            <span className="text-white/50 text-[10px]">{lead.email || ""}</span>
                          </div>
                        </td>
                        <td className="p-3">{lead.phone || <span className="text-white/20">—</span>}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold ${stageBadgeClass}`}>
                            {lead.stageRaw || "New"}
                          </span>
                        </td>
                        <td className="p-3 capitalize">{lead.sourceTool}</td>
                        <td className="p-3">
                          {lead.adPlatform ? (
                            <div className="flex items-center gap-1.5 capitalize">
                              <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                              <span>{lead.adPlatform}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 capitalize text-white/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                              <span>Organic</span>
                            </div>
                          )}
                        </td>
                        <td className="p-3 font-semibold text-white/90">
                          {lead.dealValueInr !== null && lead.dealValueInr !== undefined ? formatINR(lead.dealValueInr) : <span className="text-white/20">—</span>}
                        </td>
                        <td className="p-3">
                          {lead.agentId ? lead.agentId : <span className="text-white/20">—</span>}
                        </td>
                        <td className="p-3">
                          {new Date(lead.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-white/20 font-medium">
                      No leads found matching the filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}


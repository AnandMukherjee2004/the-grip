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
} from "recharts";
import TopBar, { DEFAULT_DATE_RANGE } from "@/components/layout/TopBar";
import type { DateRangeSelection } from "@/lib/dateRange";
import { useChartColors } from "@/hooks/useChartColors";

interface KanbanLead {
  id: string;
  name: string;
  email: string;
  dealValueInr: number | null;
  adPlatform: "meta" | "google" | "instagram" | "linkedin" | null;
  agentName: string | null;
  daysInStage: number; // custom days computed mock
}

interface Stage {
  id: string;
  name: string;
  position: number;
  leads: KanbanLead[];
}

// 6 Mock Stages with 3-6 mock leads each
const MOCK_STAGES: Stage[] = [
  {
    id: "stage_new",
    name: "New",
    position: 1,
    leads: [
      {
        id: "l_1",
        name: "Aman Sen",
        email: "aman.sen@gmail.com",
        dealValueInr: 15000,
        adPlatform: "meta",
        agentName: "Aman",
        daysInStage: 2,
      },
      {
        id: "l_2",
        name: "Meera Krishnan",
        email: "meera.k@yahoo.co.in",
        dealValueInr: null,
        adPlatform: null,
        agentName: null,
        daysInStage: 4,
      },
      {
        id: "l_3",
        name: "Rohit Deshmukh",
        email: "rohit.d@gmail.com",
        dealValueInr: 32000,
        adPlatform: "google",
        agentName: "Neha",
        daysInStage: 1,
      },
    ],
  },
  {
    id: "stage_contacted",
    name: "Contacted",
    position: 2,
    leads: [
      {
        id: "l_4",
        name: "Kavya Iyer",
        email: "kavya.i@outlook.com",
        dealValueInr: 45000,
        adPlatform: "instagram",
        agentName: "Rahul",
        daysInStage: 8,
      },
      {
        id: "l_5",
        name: "Vikram Malhotra",
        email: "vikram.m@gmail.com",
        dealValueInr: 80000,
        adPlatform: "linkedin",
        agentName: "Pooja",
        daysInStage: 12,
      },
      {
        id: "l_6",
        name: "Sneha Nair",
        email: "sneha.n@hotmail.com",
        dealValueInr: 25000,
        adPlatform: "meta",
        agentName: "Aman",
        daysInStage: 6,
      },
    ],
  },
  {
    id: "stage_demo",
    name: "Demo Scheduled",
    position: 3,
    leads: [
      {
        id: "l_7",
        name: "Arjun Gupta",
        email: "arjun.g@gmail.com",
        dealValueInr: 120000,
        adPlatform: "google",
        agentName: "Neha",
        daysInStage: 3,
      },
      {
        id: "l_8",
        name: "Deepika Padukone",
        email: "deepika.p@gmail.com",
        dealValueInr: 180000,
        adPlatform: "instagram",
        agentName: "Rahul",
        daysInStage: 16,
      },
      {
        id: "l_9",
        name: "Rajesh Ram",
        email: "rajesh.r@gmail.com",
        dealValueInr: 95000,
        adPlatform: "linkedin",
        agentName: "Pooja",
        daysInStage: 11,
      },
    ],
  },
  {
    id: "stage_proposal",
    name: "Proposal Sent",
    position: 4,
    leads: [
      {
        id: "l_10",
        name: "Priyanka Chopra",
        email: "priyanka.c@yahoo.com",
        dealValueInr: 230000,
        adPlatform: "meta",
        agentName: "Aman",
        daysInStage: 5,
      },
      {
        id: "l_11",
        name: "Virat Kohli",
        email: "virat.k@cricket.in",
        dealValueInr: 450000,
        adPlatform: "instagram",
        agentName: "Neha",
        daysInStage: 9,
      },
      {
        id: "l_12",
        name: "Divya Nair",
        email: "divya.n@outlook.com",
        dealValueInr: 110000,
        adPlatform: null,
        agentName: "Rahul",
        daysInStage: 18,
      },
      {
        id: "l_13",
        name: "Anil Kapoor",
        email: "anil.k@gmail.com",
        dealValueInr: 85000,
        adPlatform: "linkedin",
        agentName: "Pooja",
        daysInStage: 13,
      },
    ],
  },
  {
    id: "stage_negotiation",
    name: "Negotiation",
    position: 5,
    leads: [
      {
        id: "l_14",
        name: "Rani Mukerji",
        email: "rani.m@apple.com",
        dealValueInr: 320000,
        adPlatform: "google",
        agentName: "Aman",
        daysInStage: 4,
      },
      {
        id: "l_15",
        name: "MS Dhoni",
        email: "mahi.7@csk.com",
        dealValueInr: 600000,
        adPlatform: "meta",
        agentName: "Neha",
        daysInStage: 15,
      },
      {
        id: "l_16",
        name: "Jasprit Bumrah",
        email: "bumrah@gmail.com",
        dealValueInr: 290000,
        adPlatform: "linkedin",
        agentName: "Rahul",
        daysInStage: 10,
      },
    ],
  },
  {
    id: "stage_won",
    name: "Won",
    position: 6,
    leads: [
      {
        id: "l_17",
        name: "Rohit Sharma",
        email: "rohit.s@gmail.com",
        dealValueInr: 800000,
        adPlatform: "google",
        agentName: "Pooja",
        daysInStage: 3,
      },
      {
        id: "l_18",
        name: "Shubman Gill",
        email: "shubman.g@gujarat.com",
        dealValueInr: 520000,
        adPlatform: "instagram",
        agentName: "Rahul",
        daysInStage: 5,
      },
      {
        id: "l_19",
        name: "KL Rahul",
        email: "kl.rahul@yahoo.co.in",
        dealValueInr: 340000,
        adPlatform: "meta",
        agentName: "Aman",
        daysInStage: 8,
      },
    ],
  },
];

// Velocity Graph data (horizontal BarChart)
const VELOCITY_DATA = [
  { name: "New", days: 2 },
  { name: "Contacted", days: 5 },
  { name: "Demo Scheduled", days: 8 },
  { name: "Proposal Sent", days: 12 },
  { name: "Negotiation", days: 9 },
];

// Funnel Drop-off stages
const FUNNEL_DATA = [
  { name: "New", count: 890, drop: "" },
  { name: "Contacted", count: 520, drop: "-41.5%" },
  { name: "Demo Scheduled", count: 310, drop: "-40.3%" },
  { name: "Proposal Sent", count: 180, drop: "-41.9%" },
  { name: "Negotiation", count: 95, drop: "-47.2%" },
  { name: "Won", count: 73, drop: "-23.1%" },
];

interface MovementEvent {
  id: string;
  leadName: string;
  fromStage: string;
  toStage: string;
  agentName: string;
  timeAgo: string;
}

// 15 Lead Stage History Movements
const MOCK_MOVEMENTS: MovementEvent[] = [
  { id: "e1", leadName: "Aarav Sharma", fromStage: "Negotiation", toStage: "Won", agentName: "Aman", timeAgo: "10 mins ago" },
  { id: "e2", leadName: "Deepika Padukone", fromStage: "Proposal Sent", toStage: "Negotiation", agentName: "Rahul", timeAgo: "45 mins ago" },
  { id: "e3", leadName: "Meera Krishnan", fromStage: "New", toStage: "Contacted", agentName: "Neha", timeAgo: "2 hours ago" },
  { id: "e4", leadName: "Virat Kohli", fromStage: "Demo Scheduled", toStage: "Proposal Sent", agentName: "Neha", timeAgo: "4 hours ago" },
  { id: "e5", leadName: "Vikram Malhotra", fromStage: "Contacted", toStage: "Demo Scheduled", agentName: "Pooja", timeAgo: "1 day ago" },
  { id: "e6", leadName: "Rohit Sharma", fromStage: "Negotiation", toStage: "Won", agentName: "Pooja", timeAgo: "1 day ago" },
  { id: "e7", leadName: "Kavya Iyer", fromStage: "New", toStage: "Contacted", agentName: "Rahul", timeAgo: "2 days ago" },
  { id: "e8", leadName: "Rajesh Ram", fromStage: "Contacted", toStage: "Demo Scheduled", agentName: "Pooja", timeAgo: "2 days ago" },
  { id: "e9", leadName: "Arjun Gupta", fromStage: "Demo Scheduled", toStage: "Proposal Sent", agentName: "Neha", timeAgo: "3 days ago" },
  { id: "e10", leadName: "Sneha Nair", fromStage: "New", toStage: "Contacted", agentName: "Aman", timeAgo: "3 days ago" },
  { id: "e11", leadName: "Jasprit Bumrah", fromStage: "Proposal Sent", toStage: "Negotiation", agentName: "Rahul", timeAgo: "4 days ago" },
  { id: "e12", leadName: "KL Rahul", fromStage: "Negotiation", toStage: "Won", agentName: "Aman", timeAgo: "4 days ago" },
  { id: "e13", leadName: "Shubman Gill", fromStage: "Negotiation", toStage: "Won", agentName: "Rahul", timeAgo: "5 days ago" },
  { id: "e14", leadName: "Divya Nair", fromStage: "Demo Scheduled", toStage: "Proposal Sent", agentName: "Rahul", timeAgo: "5 days ago" },
  { id: "e15", leadName: "Aman Sen", fromStage: "New", toStage: "Contacted", agentName: "Aman", timeAgo: "6 days ago" },
];

// Helper to format currency using Indian standard
const formatINR = (value: number) => {
  return "₹" + new Intl.NumberFormat("en-IN").format(value);
};

export default function PipelinePage() {
  const { colors, axis } = useChartColors();
  const [dateRange, setDateRange] = useState<DateRangeSelection>(DEFAULT_DATE_RANGE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex-grow flex flex-col overflow-hidden bg-[#040409]">
      <TopBar dateRange={dateRange} onDateRangeChange={setDateRange} />

      {/* Main Content Area */}
      <main className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin text-[#d0d0e8] font-sans">
        {/* Page Header */}
        <div className="flex items-center justify-between select-none">
          <div>
            <h1 className="text-sm font-bold text-white tracking-wider font-display uppercase">Pipeline</h1>
            <p className="text-[10px] text-[#70709a] font-medium">Manage and track deal progressions, stages, and velocity</p>
          </div>
        </div>

        {/* 4-Column KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full select-none">
          {/* Card 1: Total Pipeline Value */}
          <div className="p-4 rounded-xl bg-[#0d0d1a]/40 border border-white/[0.04] backdrop-blur-md relative overflow-hidden flex flex-col justify-between group transition-all hover:border-white/[0.08]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#70709a]">
                Pipeline Value
              </span>
              <div className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">
                {formatINR(21845000)}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ▲ +16.2%
              </span>
              <span className="text-[9px] text-[#70709a] truncate">vs last month</span>
            </div>
          </div>

          {/* Card 2: Leads in Pipeline */}
          <div className="p-4 rounded-xl bg-[#0d0d1a]/40 border border-white/[0.04] backdrop-blur-md relative overflow-hidden flex flex-col justify-between group transition-all hover:border-white/[0.08]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#70709a]">
                Leads in Pipeline
              </span>
              <div className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">
                342
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 bg-[#1D9E75]/10 text-[#1D9E75] border border-[#1D9E75]/20">
                Stable
              </span>
              <span className="text-[9px] text-[#70709a] truncate">vs last week</span>
            </div>
          </div>

          {/* Card 3: Avg Time to Close */}
          <div className="p-4 rounded-xl bg-[#0d0d1a]/40 border border-white/[0.04] backdrop-blur-md relative overflow-hidden flex flex-col justify-between group transition-all hover:border-white/[0.08]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#70709a] flex items-center gap-1">
                <svg className="w-3.5 h-3.5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Avg Time to Close
              </span>
              <div className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">
                18 days
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ▼ -2d faster
              </span>
              <span className="text-[9px] text-[#70709a] truncate">vs last month</span>
            </div>
          </div>

          {/* Card 4: Win Rate */}
          <div className="p-4 rounded-xl bg-[#0d0d1a]/40 border border-white/[0.04] backdrop-blur-md relative overflow-hidden flex flex-col justify-between group transition-all hover:border-white/[0.08]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#70709a]">
                Win Rate
              </span>
              <div className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight group-hover:text-[#1D9E75] transition-colors">
                21.4%
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ▲ +1.5%
              </span>
              <span className="text-[9px] text-[#70709a] truncate">vs last month</span>
            </div>
          </div>
        </div>

        {/* Main Kanban Board (Horizontal scrollable columns) */}
        <div className="w-full flex flex-col space-y-3 select-none">
          <h3 className="text-sm font-semibold text-white/90">Deals Kanban Board</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin w-full">
            {MOCK_STAGES.map((stage) => {
              // Calculate Stage Totals
              const totalVal = stage.leads.reduce((sum, lead) => sum + (lead.dealValueInr || 0), 0);
              
              // Column subtle header background colors:
              // grey for New, teal for Won, purple for mid-stages
              let headerBg = "bg-white/[0.03]";
              let textAccent = "text-white/70";
              if (stage.id === "stage_won") {
                headerBg = "bg-[#1D9E75]/10 border border-[#1D9E75]/25";
                textAccent = "text-[#1D9E75]";
              } else if (stage.id !== "stage_new") {
                headerBg = "bg-[#534AB7]/10 border border-[#534AB7]/25";
                textAccent = "text-indigo-400";
              }

              return (
                <div key={stage.id} className="min-w-[260px] w-[260px] flex flex-col space-y-3">
                  {/* Column Header */}
                  <div className={`p-3.5 rounded-xl flex flex-col space-y-1 backdrop-blur-sm ${headerBg}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold tracking-wide uppercase ${textAccent}`}>{stage.name}</span>
                      <span className="text-[9px] font-semibold bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-white/50">
                        {stage.leads.length} leads
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-white/40">{formatINR(totalVal)}</span>
                  </div>

                  {/* Column Cards Container */}
                  <div className="flex flex-col gap-3 flex-grow overflow-y-auto max-h-[460px] pr-1 scrollbar-thin">
                    {stage.leads.map((lead) => {
                      // Platform Color code mapping
                      let platformDot = "bg-[#6B7280]"; // none/grey
                      let platformName = "Organic";
                      if (lead.adPlatform === "meta") {
                        platformDot = "bg-[#3B82F6]"; // blue
                        platformName = "Meta";
                      } else if (lead.adPlatform === "google") {
                        platformDot = "bg-[#EF4444]"; // red
                        platformName = "Google";
                      } else if (lead.adPlatform === "instagram") {
                        platformDot = "bg-[#EC4899]"; // pink
                        platformName = "Instagram";
                      } else if (lead.adPlatform === "linkedin") {
                        platformDot = "bg-[#1D9E75]"; // teal
                        platformName = "LinkedIn";
                      }

                      // Velocity days color pill mapping
                      let daysPill = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
                      if (lead.daysInStage > 14) {
                        daysPill = "bg-rose-500/10 text-rose-400 border border-rose-500/20";
                      } else if (lead.daysInStage >= 7) {
                        daysPill = "bg-amber-500/10 text-amber-400 border border-amber-500/20";
                      }

                      return (
                        <div
                          key={lead.id}
                          className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-4 cursor-pointer hover:border-white/25 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all flex flex-col justify-between space-y-3 select-none backdrop-blur-sm relative"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none rounded-xl" />
                          <div className="relative z-10 space-y-1">
                            <h4 className="font-semibold text-xs text-white tracking-wide truncate">{lead.name}</h4>
                            <p className="text-white/50 text-[10px] truncate">{lead.email}</p>
                          </div>

                          <div className="relative z-10 flex items-center justify-between text-[10px]">
                            <span className="font-bold text-white/80">
                              {lead.dealValueInr ? formatINR(lead.dealValueInr) : <span className="text-white/20">—</span>}
                            </span>
                            <div className="flex items-center gap-1 capitalize text-white/50 font-medium">
                              <span className={`w-1.5 h-1.5 rounded-full ${platformDot}`} />
                              <span>{platformName}</span>
                            </div>
                          </div>

                          <div className="relative z-10 flex items-center justify-between text-[9px] pt-1.5 border-t border-white/[0.03]">
                            <span className="text-white/30">Agent: {lead.agentName || "Unassigned"}</span>
                            <span className={`px-1.5 py-0.5 rounded font-bold ${daysPill}`}>
                              {lead.daysInStage}d here
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Funnel & Velocity Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 select-none">
          {/* Funnel Drop-off Horizontal Funnel Chart */}
          <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-6 relative overflow-hidden flex flex-col justify-between backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.01] to-transparent pointer-events-none" />
            <div className="mb-4 relative z-10">
              <h3 className="text-sm font-semibold text-white/90">Funnel Drop-off</h3>
              <p className="text-[10px] text-[#70709a]">Lead conversions and drop-off rates across sales stages</p>
            </div>
            
            {/* Custom Horizontal SVG/CSS funnel */}
            <div className="flex-grow flex flex-col justify-center space-y-2.5 h-[280px] relative z-10 pr-2">
              {FUNNEL_DATA.map((stage, index) => {
                // Calculate percentage widths for horizontal bars based on top stage (New = 890 is 100%)
                const pct = (stage.count / 890) * 100;
                
                // Color scaling from purple to teal
                // index 0: #534AB7, index 5: #1D9E75
                const colorsArr = ["#534AB7", "#4A5AC1", "#416BCB", "#387CD5", "#2F8DDF", "#1D9E75"];
                const color = colorsArr[index];

                return (
                  <div key={stage.name} className="flex items-center w-full">
                    {/* Stage Title */}
                    <span className="text-[10px] font-semibold text-white/60 w-28 truncate">{stage.name}</span>
                    
                    {/* Funnel Bar + Counts */}
                    <div className="flex-grow flex items-center gap-3">
                      <div className="h-4 rounded-md transition-all duration-500 shadow-md relative" style={{ width: `${pct * 0.7}%`, backgroundColor: color }}>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.08] to-transparent rounded-md pointer-events-none" />
                      </div>
                      <span className="text-[10px] font-bold text-white/90">{stage.count}</span>
                      {stage.drop && (
                        <span className="text-[9px] font-bold text-rose-400 ml-1.5 flex items-center">
                          {stage.drop}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stage Velocity - horizontal BarChart */}
          <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-6 relative overflow-hidden flex flex-col justify-between backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.01] to-transparent pointer-events-none" />
            <div className="mb-4 relative z-10">
              <h3 className="text-sm font-semibold text-white/90">Stage Velocity — Avg Days per Stage</h3>
              <p className="text-[10px] text-[#70709a]">Average number of days spent in stage before progressing</p>
            </div>
            <div className="w-full h-[280px] text-xs relative z-10 text-[#70709a]">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={VELOCITY_DATA}
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
                    <Tooltip
                      contentStyle={colors.tooltip}
                      formatter={(value: number) => [`${value} days`, "Average Stay"]}
                    />
                    <Bar dataKey="days" fill="#F59E0B" radius={[0, 4, 4, 0]} name="Average Days" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-white/20">
                  Loading velocity breakdown...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Stage Movements History List */}
        <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-6 select-none relative overflow-hidden backdrop-blur-md">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
          
          <div className="mb-4 relative z-10">
            <h3 className="text-sm font-semibold text-white/90">Recent Stage Movements</h3>
            <p className="text-[10px] text-[#70709a]">Live transition feed from lead stage histories</p>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/[0.04] bg-[#0d0d1a]/20 relative z-10 w-full text-xs">
            <div className="flex flex-col divide-y divide-white/[0.02]">
              {MOCK_MOVEMENTS.map((evt, idx) => (
                <div
                  key={evt.id}
                  className={`flex items-center justify-between p-3 transition-colors ${
                    idx % 2 === 1 ? "bg-white/[0.01]" : "bg-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-white/95">{evt.leadName}</span>
                    <span className="text-[#70709a] text-[10px] font-medium flex items-center gap-1.5">
                      <span>{evt.fromStage}</span>
                      <span>→</span>
                      <span className="text-indigo-400 font-semibold">{evt.toStage}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-[10px]">
                    <span className="text-white/40">Moved by {evt.agentName}</span>
                    <span className="text-[#70709a] font-medium">{evt.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

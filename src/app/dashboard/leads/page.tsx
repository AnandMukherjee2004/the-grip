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
  sourceTool: "leadsquared" | "hubspot" | "typeform" | "webform";
  name: string;
  email: string;
  phone: string;
  stageRaw: "New" | "Contacted" | "Demo Scheduled" | "Proposal Sent" | "Negotiation" | "Won";
  dealValueInr: number | null;
  adPlatform: "meta" | "google" | "instagram" | "linkedin" | "other" | null;
  campaignId: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  agentId: string | null;
  agentName: string | null;
  createdAt: string;
  stageUpdatedAt: string;
  isAttributed: boolean;
}

// 20 Mock Leads with realistic Indian names, emails, and phone numbers
const MOCK_LEADS: Lead[] = [
  {
    id: "lead_1",
    externalId: "ext_lsq_928374",
    sourceTool: "leadsquared",
    name: "Aarav Sharma",
    email: "aarav.sharma@gmail.com",
    phone: "9876543210",
    stageRaw: "Won",
    dealValueInr: 75000,
    adPlatform: "meta",
    campaignId: "camp_meta_1",
    utmSource: "facebook",
    utmMedium: "cpc",
    utmCampaign: "leads_gen_q2",
    agentId: "agent_1",
    agentName: "Aman",
    createdAt: "2026-06-19T14:32:00Z",
    stageUpdatedAt: "2026-06-20T10:00:00Z",
    isAttributed: true,
  },
  {
    id: "lead_2",
    externalId: "ext_hub_837481",
    sourceTool: "hubspot",
    name: "Aditi Rao",
    email: "aditi.rao@yahoo.co.in",
    phone: "9123456789",
    stageRaw: "Proposal Sent",
    dealValueInr: 45000,
    adPlatform: "google",
    campaignId: "camp_google_1",
    utmSource: "google",
    utmMedium: "search",
    utmCampaign: "brand_intent",
    agentId: "agent_2",
    agentName: "Neha",
    createdAt: "2026-06-18T18:20:00Z",
    stageUpdatedAt: "2026-06-19T12:00:00Z",
    isAttributed: true,
  },
  {
    id: "lead_3",
    externalId: "ext_tf_092837",
    sourceTool: "typeform",
    name: "Rohan Mehta",
    email: "rohan.mehta@outlook.com",
    phone: "8234567890",
    stageRaw: "New",
    dealValueInr: null,
    adPlatform: null,
    campaignId: null,
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
    agentId: null,
    agentName: null,
    createdAt: "2026-06-18T11:05:00Z",
    stageUpdatedAt: "2026-06-18T11:05:00Z",
    isAttributed: false,
  },
  {
    id: "lead_4",
    externalId: "ext_web_102938",
    sourceTool: "webform",
    name: "Kavya Reddy",
    email: "kavya.reddy@gmail.com",
    phone: "9345678901",
    stageRaw: "Demo Scheduled",
    dealValueInr: 60000,
    adPlatform: "instagram",
    campaignId: "camp_insta_3",
    utmSource: "instagram",
    utmMedium: "social",
    utmCampaign: "retargeting_leads",
    agentId: "agent_3",
    agentName: "Rahul",
    createdAt: "2026-06-17T09:15:00Z",
    stageUpdatedAt: "2026-06-18T14:30:00Z",
    isAttributed: true,
  },
  {
    id: "lead_5",
    externalId: "ext_lsq_293847",
    sourceTool: "leadsquared",
    name: "Vikram Malhotra",
    email: "vikram.m@rediffmail.com",
    phone: "8456789012",
    stageRaw: "Negotiation",
    dealValueInr: 95000,
    adPlatform: "linkedin",
    campaignId: "camp_link_5",
    utmSource: "linkedin",
    utmMedium: "inmail",
    utmCampaign: "b2b_execs",
    agentId: "agent_4",
    agentName: "Pooja",
    createdAt: "2026-06-16T16:45:00Z",
    stageUpdatedAt: "2026-06-18T10:15:00Z",
    isAttributed: true,
  },
  {
    id: "lead_6",
    externalId: "ext_hub_384710",
    sourceTool: "hubspot",
    name: "Sneha Nair",
    email: "sneha.nair@hotmail.com",
    phone: "9567890123",
    stageRaw: "Contacted",
    dealValueInr: 25000,
    adPlatform: "other",
    campaignId: null,
    utmSource: "newsletter",
    utmMedium: "email",
    utmCampaign: "weekly_digest",
    agentId: "agent_1",
    agentName: "Aman",
    createdAt: "2026-06-15T13:10:00Z",
    stageUpdatedAt: "2026-06-16T09:00:00Z",
    isAttributed: false,
  },
  {
    id: "lead_7",
    externalId: "ext_tf_471029",
    sourceTool: "typeform",
    name: "Arjun Gupta",
    email: "arjun.gupta@gmail.com",
    phone: "8678901234",
    stageRaw: "Won",
    dealValueInr: 120000,
    adPlatform: "meta",
    campaignId: "camp_meta_1",
    utmSource: "facebook",
    utmMedium: "cpc",
    utmCampaign: "leads_gen_q2",
    agentId: "agent_2",
    agentName: "Neha",
    createdAt: "2026-06-14T21:30:00Z",
    stageUpdatedAt: "2026-06-16T15:20:00Z",
    isAttributed: true,
  },
  {
    id: "lead_8",
    externalId: "ext_web_710293",
    sourceTool: "webform",
    name: "Deepika Padukone",
    email: "deepika.p@gmail.com",
    phone: "9789012345",
    stageRaw: "Proposal Sent",
    dealValueInr: 55000,
    adPlatform: "google",
    campaignId: "camp_google_2",
    utmSource: "google",
    utmMedium: "gdn",
    utmCampaign: "display_banner",
    agentId: "agent_3",
    agentName: "Rahul",
    createdAt: "2026-06-13T10:00:00Z",
    stageUpdatedAt: "2026-06-14T11:45:00Z",
    isAttributed: true,
  },
  {
    id: "lead_9",
    externalId: "ext_lsq_102938",
    sourceTool: "leadsquared",
    name: "Rajesh Koothrappali",
    email: "rajesh.k@gmail.com",
    phone: "8890123456",
    stageRaw: "Demo Scheduled",
    dealValueInr: 40000,
    adPlatform: "linkedin",
    campaignId: "camp_link_1",
    utmSource: "linkedin",
    utmMedium: "organic",
    utmCampaign: "thought_leadership",
    agentId: "agent_4",
    agentName: "Pooja",
    createdAt: "2026-06-12T08:50:00Z",
    stageUpdatedAt: "2026-06-13T16:10:00Z",
    isAttributed: true,
  },
  {
    id: "lead_10",
    externalId: "ext_hub_837461",
    sourceTool: "hubspot",
    name: "Priyanka Chopra",
    email: "priyanka.c@yahoo.com",
    phone: "9901234567",
    stageRaw: "Contacted",
    dealValueInr: 30000,
    adPlatform: "instagram",
    campaignId: "camp_insta_2",
    utmSource: "instagram",
    utmMedium: "influencer",
    utmCampaign: "collab_posts",
    agentId: "agent_1",
    agentName: "Aman",
    createdAt: "2026-06-11T17:40:00Z",
    stageUpdatedAt: "2026-06-12T10:00:00Z",
    isAttributed: true,
  },
  {
    id: "lead_11",
    externalId: "ext_tf_948372",
    sourceTool: "typeform",
    name: "Sanjay Dutt",
    email: "sanjay.dutt@gmail.com",
    phone: "9012345678",
    stageRaw: "New",
    dealValueInr: null,
    adPlatform: null,
    campaignId: null,
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
    agentId: null,
    agentName: null,
    createdAt: "2026-06-10T12:25:00Z",
    stageUpdatedAt: "2026-06-10T12:25:00Z",
    isAttributed: false,
  },
  {
    id: "lead_12",
    externalId: "ext_web_748392",
    sourceTool: "webform",
    name: "Divya Nair",
    email: "divya.nair@outlook.com",
    phone: "8123456789",
    stageRaw: "Negotiation",
    dealValueInr: 85000,
    adPlatform: "meta",
    campaignId: "camp_meta_2",
    utmSource: "facebook",
    utmMedium: "cpc",
    utmCampaign: "retargeting_custom",
    agentId: "agent_2",
    agentName: "Neha",
    createdAt: "2026-06-09T15:15:00Z",
    stageUpdatedAt: "2026-06-11T11:00:00Z",
    isAttributed: true,
  },
  {
    id: "lead_13",
    externalId: "ext_lsq_293840",
    sourceTool: "leadsquared",
    name: "Anil Kapoor",
    email: "anil.kapoor@gmail.com",
    phone: "9234567890",
    stageRaw: "Won",
    dealValueInr: 150000,
    adPlatform: "google",
    campaignId: "camp_google_1",
    utmSource: "google",
    utmMedium: "search",
    utmCampaign: "brand_intent",
    agentId: "agent_3",
    agentName: "Rahul",
    createdAt: "2026-06-08T11:55:00Z",
    stageUpdatedAt: "2026-06-10T16:30:00Z",
    isAttributed: true,
  },
  {
    id: "lead_14",
    externalId: "ext_hub_482930",
    sourceTool: "hubspot",
    name: "Rani Mukerji",
    email: "rani.m@apple.com",
    phone: "8345678901",
    stageRaw: "Proposal Sent",
    dealValueInr: 42000,
    adPlatform: "linkedin",
    campaignId: "camp_link_1",
    utmSource: "linkedin",
    utmMedium: "cpc",
    utmCampaign: "lead_gen_b2b",
    agentId: "agent_4",
    agentName: "Pooja",
    createdAt: "2026-06-07T09:00:00Z",
    stageUpdatedAt: "2026-06-08T14:50:00Z",
    isAttributed: true,
  },
  {
    id: "lead_15",
    externalId: "ext_tf_582930",
    sourceTool: "typeform",
    name: "Virat Kohli",
    email: "virat.kohli@cricket.in",
    phone: "9456789012",
    stageRaw: "Demo Scheduled",
    dealValueInr: 70000,
    adPlatform: "instagram",
    campaignId: "camp_insta_1",
    utmSource: "instagram",
    utmMedium: "story",
    utmCampaign: "profile_visit",
    agentId: "agent_1",
    agentName: "Aman",
    createdAt: "2026-06-06T14:10:00Z",
    stageUpdatedAt: "2026-06-08T11:20:00Z",
    isAttributed: true,
  },
  {
    id: "lead_16",
    externalId: "ext_web_582931",
    sourceTool: "webform",
    name: "MS Dhoni",
    email: "mahi.7@csk.com",
    phone: "9567890123",
    stageRaw: "Contacted",
    dealValueInr: 50000,
    adPlatform: "google",
    campaignId: "camp_google_1",
    utmSource: "google",
    utmMedium: "search",
    utmCampaign: "brand_intent",
    agentId: "agent_2",
    agentName: "Neha",
    createdAt: "2026-06-05T16:10:00Z",
    stageUpdatedAt: "2026-06-06T12:00:00Z",
    isAttributed: true,
  },
  {
    id: "lead_17",
    externalId: "ext_lsq_293841",
    sourceTool: "leadsquared",
    name: "Rohit Sharma",
    email: "rohit.hitman@gmail.com",
    phone: "8678901234",
    stageRaw: "New",
    dealValueInr: null,
    adPlatform: null,
    campaignId: null,
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
    agentId: null,
    agentName: null,
    createdAt: "2026-06-04T10:00:00Z",
    stageUpdatedAt: "2026-06-04T10:00:00Z",
    isAttributed: false,
  },
  {
    id: "lead_18",
    externalId: "ext_hub_482931",
    sourceTool: "hubspot",
    name: "Jasprit Bumrah",
    email: "boom.boom@gmail.com",
    phone: "9789012345",
    stageRaw: "Negotiation",
    dealValueInr: 110000,
    adPlatform: "meta",
    campaignId: "camp_meta_1",
    utmSource: "facebook",
    utmMedium: "cpc",
    utmCampaign: "leads_gen_q2",
    agentId: "agent_3",
    agentName: "Rahul",
    createdAt: "2026-06-03T11:45:00Z",
    stageUpdatedAt: "2026-06-05T14:30:00Z",
    isAttributed: true,
  },
  {
    id: "lead_19",
    externalId: "ext_tf_582932",
    sourceTool: "typeform",
    name: "KL Rahul",
    email: "kl.rahul@yahoo.co.in",
    phone: "8890123456",
    stageRaw: "Won",
    dealValueInr: 80000,
    adPlatform: "linkedin",
    campaignId: "camp_link_1",
    utmSource: "linkedin",
    utmMedium: "cpc",
    utmCampaign: "lead_gen_b2b",
    agentId: "agent_4",
    agentName: "Pooja",
    createdAt: "2026-06-02T13:20:00Z",
    stageUpdatedAt: "2026-06-04T09:10:00Z",
    isAttributed: true,
  },
  {
    id: "lead_20",
    externalId: "ext_web_582933",
    sourceTool: "webform",
    name: "Shubman Gill",
    email: "shubman.g@gujarat.com",
    phone: "9901234567",
    stageRaw: "Proposal Sent",
    dealValueInr: 48000,
    adPlatform: "instagram",
    campaignId: "camp_insta_1",
    utmSource: "instagram",
    utmMedium: "story",
    utmCampaign: "profile_visit",
    agentId: "agent_1",
    agentName: "Aman",
    createdAt: "2026-06-01T15:00:00Z",
    stageUpdatedAt: "2026-06-03T10:30:00Z",
    isAttributed: true,
  },
];

// Horizontal Bar Chart breakdown data
const STAGE_BAR_DATA = [
  { name: "New", count: 3 },
  { name: "Contacted", count: 3 },
  { name: "Demo Scheduled", count: 3 },
  { name: "Proposal Sent", count: 4 },
  { name: "Negotiation", count: 3 },
  { name: "Won", count: 4 },
];

// Pie Chart split data: Meta (38%), Google (29%), Organic (18%), Referral (10%), Other (5%)
const SOURCE_PIE_DATA = [
  { name: "Meta", value: 38, count: 762, color: "#534AB7" },
  { name: "Google", value: 29, count: 582, color: "#1D9E75" },
  { name: "Organic", value: 18, count: 361, color: "#F59E0B" },
  { name: "Referral", value: 10, count: 201, color: "#3B82F6" },
  { name: "Other", value: 5, count: 100, color: "#6B7280" },
];

// 30 Days of mock daily new lead counts
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

export default function LeadsPage() {
  const { colors, axis } = useChartColors();
  const [dateRange, setDateRange] = useState<DateRangeSelection>(DEFAULT_DATE_RANGE);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [agentFilter, setAgentFilter] = useState("All");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter Logic: Composed across all 5 filters
  const filteredLeads = MOCK_LEADS.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search);

    const matchesStage = stageFilter === "All" || lead.stageRaw === stageFilter;
    const matchesSource = sourceFilter === "All" || lead.sourceTool === sourceFilter;
    
    // Ad platform filter
    let matchesPlatform = true;
    if (platformFilter !== "All") {
      matchesPlatform = lead.adPlatform === platformFilter;
    }

    // Agent filter
    let matchesAgent = true;
    if (agentFilter !== "All") {
      matchesAgent = lead.agentName === agentFilter;
    }

    return matchesSearch && matchesStage && matchesSource && matchesPlatform && matchesAgent;
  });

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
                2,847
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
                384
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
                {formatINR(12438000)}
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
                {formatINR(43680)}
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
                14.2%
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
              {mounted ? (
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

          {/* Filter Bar (5 Controls) */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-6 relative z-10 items-center text-xs">
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
            <div>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="w-full h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-white hover:border-white/20 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-sans appearance-none cursor-pointer"
              >
                <option value="All" className="bg-[#0d0d1a] text-white">Source Tool: All</option>
                <option value="leadsquared" className="bg-[#0d0d1a] text-white">leadsquared</option>
                <option value="hubspot" className="bg-[#0d0d1a] text-white">hubspot</option>
                <option value="typeform" className="bg-[#0d0d1a] text-white">typeform</option>
                <option value="webform" className="bg-[#0d0d1a] text-white">webform</option>
              </select>
            </div>
            <div>
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="w-full h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-white hover:border-white/20 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-sans appearance-none cursor-pointer"
              >
                <option value="All" className="bg-[#0d0d1a] text-white">Ad Platform: All</option>
                <option value="meta" className="bg-[#0d0d1a] text-white">meta</option>
                <option value="google" className="bg-[#0d0d1a] text-white">google</option>
                <option value="instagram" className="bg-[#0d0d1a] text-white">instagram</option>
                <option value="linkedin" className="bg-[#0d0d1a] text-white">linkedin</option>
                <option value="other" className="bg-[#0d0d1a] text-white">other</option>
              </select>
            </div>
            <div>
              <select
                value={agentFilter}
                onChange={(e) => setAgentFilter(e.target.value)}
                className="w-full h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-white hover:border-white/20 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-sans appearance-none cursor-pointer"
              >
                <option value="All" className="bg-[#0d0d1a] text-white">Agent: All</option>
                <option value="Aman" className="bg-[#0d0d1a] text-white">Aman</option>
                <option value="Neha" className="bg-[#0d0d1a] text-white">Neha</option>
                <option value="Rahul" className="bg-[#0d0d1a] text-white">Rahul</option>
                <option value="Pooja" className="bg-[#0d0d1a] text-white">Pooja</option>
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
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => {
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
                            <span className="font-semibold text-white/95">{lead.name}</span>
                            <span className="text-white/50 text-[10px]">{lead.email}</span>
                          </div>
                        </td>
                        <td className="p-3">{lead.phone}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold ${stageBadgeClass}`}>
                            {lead.stageRaw}
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
                          {lead.dealValueInr !== null ? formatINR(lead.dealValueInr) : <span className="text-white/20">—</span>}
                        </td>
                        <td className="p-3">
                          {lead.agentName ? lead.agentName : <span className="text-white/20">—</span>}
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

"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import TopBar, { DEFAULT_DATE_RANGE } from "@/components/layout/TopBar";
import type { DateRangeSelection } from "@/lib/dateRange";
import { useChartColors } from "@/hooks/useChartColors";

interface Transaction {
  id: string;
  externalId: string;
  sourceTool: "razorpay" | "cashfree" | "payu";
  customerEmail: string;
  amountInr: number;
  status: "completed" | "refunded" | "cancelled";
  orderedAt: string;
  isAttributed: boolean;
  attributionMethod: string | null;
}

// 18 Mock Transactions with realistic INR amounts between 500 and 85,000
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx_1",
    externalId: "ext_rzp_984729384",
    sourceTool: "razorpay",
    customerEmail: "aditya.sen@gmail.com",
    amountInr: 12500,
    status: "completed",
    orderedAt: "2026-06-19T10:15:00Z",
    isAttributed: true,
    attributionMethod: "First Touch",
  },
  {
    id: "tx_2",
    externalId: "ext_cf_283948293",
    sourceTool: "cashfree",
    customerEmail: "meera.krishnan@yahoo.co.in",
    amountInr: 45000,
    status: "completed",
    orderedAt: "2026-06-19T08:45:00Z",
    isAttributed: true,
    attributionMethod: "Linear",
  },
  {
    id: "tx_3",
    externalId: "ext_pu_837492837",
    sourceTool: "payu",
    customerEmail: "john.doe@gmail.com",
    amountInr: 850,
    status: "completed",
    orderedAt: "2026-06-18T16:30:00Z",
    isAttributed: false,
    attributionMethod: null,
  },
  {
    id: "tx_4",
    externalId: "ext_rzp_748293847",
    sourceTool: "razorpay",
    customerEmail: "priya.nair@outlook.com",
    amountInr: 28000,
    status: "refunded",
    orderedAt: "2026-06-18T11:20:00Z",
    isAttributed: true,
    attributionMethod: "Last Touch",
  },
  {
    id: "tx_5",
    externalId: "ext_cf_938472019",
    sourceTool: "cashfree",
    customerEmail: "steve.rogers@shield.gov",
    amountInr: 64000,
    status: "completed",
    orderedAt: "2026-06-17T15:10:00Z",
    isAttributed: true,
    attributionMethod: "Time Decay",
  },
  {
    id: "tx_6",
    externalId: "ext_pu_102938475",
    sourceTool: "payu",
    customerEmail: "vikram.malhotra@gmail.com",
    amountInr: 3200,
    status: "cancelled",
    orderedAt: "2026-06-17T09:05:00Z",
    isAttributed: false,
    attributionMethod: null,
  },
  {
    id: "tx_7",
    externalId: "ext_rzp_839482910",
    sourceTool: "razorpay",
    customerEmail: "sania.mirza@rediffmail.com",
    amountInr: 78000,
    status: "completed",
    orderedAt: "2026-06-16T17:40:00Z",
    isAttributed: true,
    attributionMethod: "First Touch",
  },
  {
    id: "tx_8",
    externalId: "ext_cf_382910293",
    sourceTool: "cashfree",
    customerEmail: "bruce.wayne@waynecorp.com",
    amountInr: 85000,
    status: "completed",
    orderedAt: "2026-06-15T14:22:00Z",
    isAttributed: true,
    attributionMethod: "W-Shaped",
  },
  {
    id: "tx_9",
    externalId: "ext_pu_473928102",
    sourceTool: "payu",
    customerEmail: "dev.karan@gmail.com",
    amountInr: 1200,
    status: "refunded",
    orderedAt: "2026-06-14T10:15:00Z",
    isAttributed: false,
    attributionMethod: null,
  },
  {
    id: "tx_10",
    externalId: "ext_rzp_293847192",
    sourceTool: "razorpay",
    customerEmail: "kiara.advani@yahoo.com",
    amountInr: 5400,
    status: "completed",
    orderedAt: "2026-06-13T12:00:00Z",
    isAttributed: true,
    attributionMethod: "Linear",
  },
  {
    id: "tx_11",
    externalId: "ext_cf_948371920",
    sourceTool: "cashfree",
    customerEmail: "clark.kent@dailyplanet.com",
    amountInr: 9500,
    status: "completed",
    orderedAt: "2026-06-12T16:35:00Z",
    isAttributed: true,
    attributionMethod: "Last Touch",
  },
  {
    id: "tx_12",
    externalId: "ext_pu_748392019",
    sourceTool: "payu",
    customerEmail: "isha.ambani@reliance.com",
    amountInr: 32000,
    status: "completed",
    orderedAt: "2026-06-11T13:50:00Z",
    isAttributed: true,
    attributionMethod: "Time Decay",
  },
  {
    id: "tx_13",
    externalId: "ext_rzp_482910394",
    sourceTool: "razorpay",
    customerEmail: "tony.stark@starkindustries.com",
    amountInr: 75000,
    status: "completed",
    orderedAt: "2026-06-10T11:15:00Z",
    isAttributed: true,
    attributionMethod: "First Touch",
  },
  {
    id: "tx_14",
    externalId: "ext_cf_583920192",
    sourceTool: "cashfree",
    customerEmail: "rachel.green@ralphlauren.com",
    amountInr: 1500,
    status: "refunded",
    orderedAt: "2026-06-09T09:45:00Z",
    isAttributed: false,
    attributionMethod: null,
  },
  {
    id: "tx_15",
    externalId: "ext_pu_293847109",
    sourceTool: "payu",
    customerEmail: "harpreet.singh@gmail.com",
    amountInr: 18000,
    status: "completed",
    orderedAt: "2026-06-08T18:10:00Z",
    isAttributed: true,
    attributionMethod: "Last Touch",
  },
  {
    id: "tx_16",
    externalId: "ext_rzp_839401923",
    sourceTool: "razorpay",
    customerEmail: "chandler.bing@chanandler.bong",
    amountInr: 2200,
    status: "cancelled",
    orderedAt: "2026-06-07T14:30:00Z",
    isAttributed: false,
    attributionMethod: null,
  },
  {
    id: "tx_17",
    externalId: "ext_cf_482910293",
    sourceTool: "cashfree",
    customerEmail: "monica.geller@chef.org",
    amountInr: 14500,
    status: "completed",
    orderedAt: "2026-06-06T11:00:00Z",
    isAttributed: true,
    attributionMethod: "Linear",
  },
  {
    id: "tx_18",
    externalId: "ext_pu_582910293",
    sourceTool: "payu",
    customerEmail: "ross.geller@museum.edu",
    amountInr: 27500,
    status: "completed",
    orderedAt: "2026-06-05T15:20:00Z",
    isAttributed: true,
    attributionMethod: "Time Decay",
  },
];

// Mock 30 Days of Collections vs Refunds
const MOCK_BAR_DATA = [
  { date: "May 22", collected: 45000, refunded: 2500 },
  { date: "May 24", collected: 52000, refunded: 0 },
  { date: "May 26", collected: 49000, refunded: 8000 },
  { date: "May 28", collected: 61000, refunded: 0 },
  { date: "May 30", collected: 58000, refunded: 4500 },
  { date: "Jun 01", collected: 63000, refunded: 1200 },
  { date: "Jun 03", collected: 72000, refunded: 0 },
  { date: "Jun 05", collected: 68000, refunded: 15000 },
  { date: "Jun 07", collected: 75000, refunded: 0 },
  { date: "Jun 09", collected: 82000, refunded: 9000 },
  { date: "Jun 11", collected: 95000, refunded: 0 },
  { date: "Jun 13", collected: 89000, refunded: 3400 },
  { date: "Jun 15", collected: 104000, refunded: 12000 },
  { date: "Jun 17", collected: 112000, refunded: 0 },
  { date: "Jun 19", collected: 125000, refunded: 28000 },
];

// Pie Chart breakdown: Razorpay (62%), Cashfree (24%), PayU (14%)
const PIE_DATA = [
  { name: "Razorpay", value: 62, color: "#534AB7" },
  { name: "Cashfree", value: 24, color: "#1D9E75" },
  { name: "PayU", value: 14, color: "#F59E0B" },
];

// Helper to format currency using Indian standard
const formatINR = (value: number) => {
  return "₹" + new Intl.NumberFormat("en-IN").format(value);
};

// Helper for Indian number abbreviations for Y-axis (L, k)
const formatIndianAbbreviation = (value: number) => {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(0)}k`;
  }
  return `₹${value}`;
};

export default function PaymentsPage() {
  const { colors, axis } = useChartColors();
  const [dateRange, setDateRange] = useState<DateRangeSelection>(DEFAULT_DATE_RANGE);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [gatewayFilter, setGatewayFilter] = useState("All");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter Logic
  const filteredTransactions = MOCK_TRANSACTIONS.filter((tx) => {
    const matchesSearch =
      tx.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      tx.externalId.toLowerCase().includes(search.toLowerCase()) ||
      tx.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "All" || tx.status === statusFilter;
    const matchesGateway = gatewayFilter === "All" || tx.sourceTool === gatewayFilter;

    return matchesSearch && matchesStatus && matchesGateway;
  });

  return (
    <div className="flex-grow flex flex-col overflow-hidden bg-[#040409]">
      <TopBar dateRange={dateRange} onDateRangeChange={setDateRange} />

      {/* Main Content Area */}
      <main className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin text-[#d0d0e8] font-sans">
        {/* Page Header */}
        <div className="flex items-center justify-between select-none">
          <div>
            <h1 className="text-sm font-bold text-white tracking-wider font-display uppercase">Payments</h1>
            <p className="text-[10px] text-[#70709a] font-medium">Monitor your global payment gateway performance and net revenue</p>
          </div>
        </div>

        {/* 5-Column KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 w-full select-none">
          {/* Card 1: Total Collected */}
          <div className="p-4 rounded-xl bg-[#0d0d1a]/40 border border-white/[0.04] backdrop-blur-md relative overflow-hidden flex flex-col justify-between group transition-all hover:border-white/[0.08]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#70709a]">
                Total Collected
              </span>
              <div className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">
                {formatINR(1842300)}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ▲ +9.2%
              </span>
              <span className="text-[9px] text-[#70709a] truncate">vs last month</span>
            </div>
          </div>

          {/* Card 2: Total Refunded */}
          <div className="p-4 rounded-xl bg-[#0d0d1a]/40 border border-white/[0.04] backdrop-blur-md relative overflow-hidden flex flex-col justify-between group transition-all hover:border-white/[0.08]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#70709a]">
                Total Refunded
              </span>
              <div className="text-lg md:text-xl font-bold text-rose-400 tracking-tight leading-tight transition-colors">
                {formatINR(124500)}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20">
                ▼ -1.5%
              </span>
              <span className="text-[9px] text-[#70709a] truncate">vs last month</span>
            </div>
          </div>

          {/* Card 3: Net Revenue */}
          <div className="p-4 rounded-xl bg-[#0d0d1a]/40 border border-white/[0.04] backdrop-blur-md relative overflow-hidden flex flex-col justify-between group transition-all hover:border-white/[0.08]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#70709a]">
                Net Revenue
              </span>
              <div className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">
                {formatINR(1717800)}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ▲ +10.1%
              </span>
              <span className="text-[9px] text-[#70709a] truncate">vs last month</span>
            </div>
          </div>

          {/* Card 4: Success Rate */}
          <div className="p-4 rounded-xl bg-[#0d0d1a]/40 border border-white/[0.04] backdrop-blur-md relative overflow-hidden flex flex-col justify-between group transition-all hover:border-white/[0.08]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#70709a]">
                Success Rate
              </span>
              <div className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">
                91.3%
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ▲ +0.5%
              </span>
              <span className="text-[9px] text-[#70709a] truncate">vs last month</span>
            </div>
          </div>

          {/* Card 5: Transactions Count */}
          <div className="p-4 rounded-xl bg-[#0d0d1a]/40 border border-white/[0.04] backdrop-blur-md relative overflow-hidden flex flex-col justify-between group transition-all hover:border-white/[0.08] col-span-2 lg:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#70709a]">
                Transactions
              </span>
              <div className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">
                1,047
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ▲ +14.2%
              </span>
              <span className="text-[9px] text-[#70709a] truncate">vs last month</span>
            </div>
          </div>
        </div>

        {/* Double Recharts Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Collections vs Refunds */}
          <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-6 select-none relative overflow-hidden flex flex-col justify-between backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.01] to-transparent pointer-events-none" />
            <div className="mb-4 relative z-10">
              <h3 className="text-sm font-semibold text-white/90">Daily Collections vs Refunds</h3>
              <p className="text-[10px] text-[#70709a]">Collections and refund amounts breakdown over 30 days</p>
            </div>
            <div className="w-full h-[240px] text-xs relative z-10 text-[#70709a]">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_BAR_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                    <XAxis
                      dataKey="date"
                      {...axis}
                      style={{ fontSize: 9, fontWeight: 500 }}
                    />
                    <YAxis
                      {...axis}
                      tickFormatter={formatIndianAbbreviation}
                      style={{ fontSize: 9, fontWeight: 500 }}
                    />
                    <Tooltip
                      contentStyle={colors.tooltip}
                      formatter={(value: number, name: string) => [
                        formatINR(value),
                        name === "collected" ? "Collected" : "Refunded",
                      ]}
                    />
                    <Bar dataKey="collected" fill="#1D9E75" radius={[4, 4, 0, 0]} name="Collected" />
                    <Bar dataKey="refunded" fill="#EF4444" radius={[4, 4, 0, 0]} name="Refunded" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-white/20">
                  Loading collections statistics...
                </div>
              )}
            </div>
          </div>

          {/* Payment Gateway Breakdown */}
          <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-6 select-none relative overflow-hidden flex flex-col justify-between backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.01] to-transparent pointer-events-none" />
            <div className="mb-4 relative z-10">
              <h3 className="text-sm font-semibold text-white/90">Payment Gateway Breakdown</h3>
              <p className="text-[10px] text-[#70709a]">Gateway volume distribution share</p>
            </div>
            <div className="w-full h-[210px] text-xs relative z-10 flex items-center justify-center">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={PIE_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {PIE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={colors.tooltip}
                      formatter={(value: number) => [`${value}%`, "Volume Share"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-white/20">
                  Loading gateway share breakdown...
                </div>
              )}
            </div>

            {/* Custom Pie Legend */}
            <div className="flex items-center justify-center gap-6 mt-2 relative z-10">
              {PIE_DATA.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-semibold text-white/80">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All Payments Table Section */}
        <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-6 select-none relative overflow-hidden backdrop-blur-md">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />

          <div className="mb-6 relative z-10">
            <h3 className="text-sm font-semibold text-white/90">Transaction History</h3>
            <p className="text-[10px] text-[#70709a]">Monitor transaction flow, gateways, and processing status</p>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6 relative z-10 items-center">
            <div>
              <input
                type="text"
                placeholder="Search by email or transaction ID…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 hover:border-white/20 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-sans text-xs"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-white hover:border-white/20 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-sans text-xs appearance-none cursor-pointer"
              >
                <option value="All" className="bg-[#0d0d1a] text-white">Filter by Status: All</option>
                <option value="completed" className="bg-[#0d0d1a] text-white">completed</option>
                <option value="refunded" className="bg-[#0d0d1a] text-white">refunded</option>
                <option value="cancelled" className="bg-[#0d0d1a] text-white">cancelled</option>
              </select>
            </div>
            <div>
              <select
                value={gatewayFilter}
                onChange={(e) => setGatewayFilter(e.target.value)}
                className="w-full h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-white hover:border-white/20 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-sans text-xs appearance-none cursor-pointer"
              >
                <option value="All" className="bg-[#0d0d1a] text-white">Filter by Gateway: All</option>
                <option value="razorpay" className="bg-[#0d0d1a] text-white">razorpay</option>
                <option value="cashfree" className="bg-[#0d0d1a] text-white">cashfree</option>
                <option value="payu" className="bg-[#0d0d1a] text-white">payu</option>
              </select>
            </div>
            <div className="flex justify-start sm:justify-end">
              <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-[10px] font-semibold bg-white/5 border border-white/10 text-white/40">
                Last 30 days
              </span>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto w-full rounded-xl border border-white/[0.04] bg-[#0d0d1a]/20 relative z-10">
            <table className="w-full border-collapse text-left text-xs text-[#d0d0e8]/85">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02] text-white/60 font-semibold">
                  <th className="p-3">Transaction ID</th>
                  <th className="p-3">Customer Email</th>
                  <th className="p-3">Gateway</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => {
                    const cleanExternalId = tx.externalId.replace("ext_", "");
                    const displayId = `#${cleanExternalId.slice(-8)}`;

                    // Gateway label colored dot matching prompt:
                    // teal for razorpay, purple for cashfree, amber for payu
                    let dotColor = "bg-[#1D9E75]"; // razorpay teal
                    if (tx.sourceTool === "cashfree") {
                      dotColor = "bg-[#534AB7]"; // cashfree purple
                    } else if (tx.sourceTool === "payu") {
                      dotColor = "bg-[#F59E0B]"; // payu amber
                    }

                    // Status style badges
                    let statusBadgeClass = "bg-white/5 text-white/30 border border-white/10";
                    if (tx.status === "completed") {
                      statusBadgeClass = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
                    } else if (tx.status === "refunded") {
                      statusBadgeClass = "bg-rose-500/10 text-rose-400 border border-rose-500/20";
                    }

                    // Type formatting: show "Refund" in red if status is refunded, else "Payment" in teal
                    const isRefund = tx.status === "refunded";

                    return (
                      <tr key={tx.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="p-3 font-mono font-medium text-white/95">{displayId}</td>
                        <td className="p-3">{tx.customerEmail}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5 capitalize">
                            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                            <span>{tx.sourceTool}</span>
                          </div>
                        </td>
                        <td className="p-3 font-semibold text-white/90">{formatINR(tx.amountInr)}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold ${statusBadgeClass}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="p-3">
                          {isRefund ? (
                            <span className="text-rose-400 font-semibold text-[10px]">Refund</span>
                          ) : (
                            <span className="text-emerald-400 font-semibold text-[10px]">Payment</span>
                          )}
                        </td>
                        <td className="p-3">
                          {new Date(tx.orderedAt).toLocaleDateString("en-GB", {
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
                    <td colSpan={7} className="p-8 text-center text-white/20 font-medium">
                      No transactions found matching the filter criteria.
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

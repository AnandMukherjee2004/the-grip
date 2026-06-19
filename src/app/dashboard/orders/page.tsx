"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import TopBar, { DEFAULT_DATE_RANGE } from "@/components/layout/TopBar";
import type { DateRangeSelection } from "@/lib/dateRange";
import { useChartColors } from "@/hooks/useChartColors";

// Types matching the unified_orders table shape
interface Order {
  id: string;
  externalId: string;
  sourceTool: "shopify" | "razorpay" | "woocommerce";
  customerEmail: string;
  amountInr: number;
  status: "pending" | "confirmed" | "completed" | "refunded" | "cancelled";
  orderedAt: string;
  isAttributed: boolean;
  attributionMethod: string | null;
  leadId: string | null;
}

// 15+ Mock Orders covering all statuses and source tools
const MOCK_ORDERS: Order[] = [
  {
    id: "ord_1",
    externalId: "ext_sh_92837482",
    sourceTool: "shopify",
    customerEmail: "john.doe@gmail.com",
    amountInr: 2450,
    status: "completed",
    orderedAt: "2026-06-19T14:32:00Z",
    isAttributed: true,
    attributionMethod: "First Touch",
    leadId: "lead_101",
  },
  {
    id: "ord_2",
    externalId: "ext_rzp_83748192",
    sourceTool: "razorpay",
    customerEmail: "priya.sharma@yahoo.co.in",
    amountInr: 12500,
    status: "completed",
    orderedAt: "2026-06-18T18:20:00Z",
    isAttributed: true,
    attributionMethod: "Last Touch",
    leadId: "lead_102",
  },
  {
    id: "ord_3",
    externalId: "ext_wc_09283746",
    sourceTool: "woocommerce",
    customerEmail: "mike.jones@outlook.com",
    amountInr: 890,
    status: "pending",
    orderedAt: "2026-06-18T11:05:00Z",
    isAttributed: false,
    attributionMethod: null,
    leadId: null,
  },
  {
    id: "ord_4",
    externalId: "ext_sh_10293847",
    sourceTool: "shopify",
    customerEmail: "amit.patel@gmail.com",
    amountInr: 4500,
    status: "confirmed",
    orderedAt: "2026-06-17T09:15:00Z",
    isAttributed: true,
    attributionMethod: "Linear",
    leadId: "lead_103",
  },
  {
    id: "ord_5",
    externalId: "ext_rzp_29384710",
    sourceTool: "razorpay",
    customerEmail: "sara.connor@sky.net",
    amountInr: 18999,
    status: "refunded",
    orderedAt: "2026-06-16T16:45:00Z",
    isAttributed: false,
    attributionMethod: null,
    leadId: null,
  },
  {
    id: "ord_6",
    externalId: "ext_wc_38471029",
    sourceTool: "woocommerce",
    customerEmail: "david.miller@hotmail.com",
    amountInr: 1200,
    status: "cancelled",
    orderedAt: "2026-06-15T13:10:00Z",
    isAttributed: false,
    attributionMethod: null,
    leadId: null,
  },
  {
    id: "ord_7",
    externalId: "ext_sh_47102938",
    sourceTool: "shopify",
    customerEmail: "neha.gupta@rediffmail.com",
    amountInr: 6200,
    status: "completed",
    orderedAt: "2026-06-14T21:30:00Z",
    isAttributed: true,
    attributionMethod: "Time Decay",
    leadId: "lead_104",
  },
  {
    id: "ord_8",
    externalId: "ext_rzp_71029384",
    sourceTool: "razorpay",
    customerEmail: "robert.lang@gmail.com",
    amountInr: 3400,
    status: "completed",
    orderedAt: "2026-06-13T10:00:00Z",
    isAttributed: true,
    attributionMethod: "Last Touch",
    leadId: "lead_105",
  },
  {
    id: "ord_9",
    externalId: "ext_wc_10293856",
    sourceTool: "woocommerce",
    customerEmail: "rahul.verma@gmail.com",
    amountInr: 750,
    status: "confirmed",
    orderedAt: "2026-06-12T08:50:00Z",
    isAttributed: false,
    attributionMethod: null,
    leadId: null,
  },
  {
    id: "ord_10",
    externalId: "ext_sh_83746193",
    sourceTool: "shopify",
    customerEmail: "emily.watson@yahoo.com",
    amountInr: 1500,
    status: "pending",
    orderedAt: "2026-06-11T17:40:00Z",
    isAttributed: false,
    attributionMethod: null,
    leadId: null,
  },
  {
    id: "ord_11",
    externalId: "ext_rzp_94837261",
    sourceTool: "razorpay",
    customerEmail: "vikram.singh@gmail.com",
    amountInr: 25000,
    status: "completed",
    orderedAt: "2026-06-10T12:25:00Z",
    isAttributed: true,
    attributionMethod: "First Touch",
    leadId: "lead_106",
  },
  {
    id: "ord_12",
    externalId: "ext_wc_74839201",
    sourceTool: "woocommerce",
    customerEmail: "lisa.ann@outlook.com",
    amountInr: 3200,
    status: "completed",
    orderedAt: "2026-06-09T15:15:00Z",
    isAttributed: false,
    attributionMethod: null,
    leadId: null,
  },
  {
    id: "ord_13",
    externalId: "ext_sh_29384029",
    sourceTool: "shopify",
    customerEmail: "ajay.kumar@gmail.com",
    amountInr: 999,
    status: "refunded",
    orderedAt: "2026-06-08T11:55:00Z",
    isAttributed: false,
    attributionMethod: null,
    leadId: null,
  },
  {
    id: "ord_14",
    externalId: "ext_rzp_48293019",
    sourceTool: "razorpay",
    customerEmail: "steve.jobs@apple.com",
    amountInr: 142000,
    status: "cancelled",
    orderedAt: "2026-06-07T09:00:00Z",
    isAttributed: true,
    attributionMethod: "W-Shaped",
    leadId: "lead_107",
  },
  {
    id: "ord_15",
    externalId: "ext_wc_58293022",
    sourceTool: "woocommerce",
    customerEmail: "trent.bolt@cricket.nz",
    amountInr: 5400,
    status: "completed",
    orderedAt: "2026-06-06T14:10:00Z",
    isAttributed: true,
    attributionMethod: "Linear",
    leadId: "lead_108",
  },
];

// 30 Days of mock daily revenue data
const MOCK_REVENUE_DATA = [
  { date: "May 22", revenue: 45000 },
  { date: "May 23", revenue: 52000 },
  { date: "May 24", revenue: 49000 },
  { date: "May 25", revenue: 61000 },
  { date: "May 26", revenue: 58000 },
  { date: "May 27", revenue: 63000 },
  { date: "May 28", revenue: 72000 },
  { date: "May 29", revenue: 68000 },
  { date: "May 30", revenue: 75000 },
  { date: "May 31", revenue: 82000 },
  { date: "Jun 01", revenue: 95000 },
  { date: "Jun 02", revenue: 89000 },
  { date: "Jun 03", revenue: 104000 },
  { date: "Jun 04", revenue: 112000 },
  { date: "Jun 05", revenue: 98000 },
  { date: "Jun 06", revenue: 115000 },
  { date: "Jun 07", revenue: 125000 },
  { date: "Jun 08", revenue: 118000 },
  { date: "Jun 09", revenue: 132000 },
  { date: "Jun 10", revenue: 145000 },
  { date: "Jun 11", revenue: 138000 },
  { date: "Jun 12", revenue: 152000 },
  { date: "Jun 13", revenue: 165000 },
  { date: "Jun 14", revenue: 158000 },
  { date: "Jun 15", revenue: 172000 },
  { date: "Jun 16", revenue: 185000 },
  { date: "Jun 17", revenue: 178000 },
  { date: "Jun 18", revenue: 192000 },
  { date: "Jun 19", revenue: 205000 },
  { date: "Jun 20", revenue: 218500 },
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

export default function OrdersPage() {
  const { colors, axis } = useChartColors();
  const [dateRange, setDateRange] = useState<DateRangeSelection>(DEFAULT_DATE_RANGE);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter logic
  const filteredOrders = MOCK_ORDERS.filter((order) => {
    const matchesSearch =
      order.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      order.externalId.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    const matchesSource = sourceFilter === "All" || order.sourceTool === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div className="flex-grow flex flex-col overflow-hidden bg-[#040409]">
      <TopBar dateRange={dateRange} onDateRangeChange={setDateRange} />

      {/* Main Content Area */}
      <main className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin text-[#d0d0e8] font-sans">
        {/* Page Header */}
        <div className="flex items-center justify-between select-none">
          <div>
            <h1 className="text-sm font-bold text-white tracking-wider font-display uppercase">Orders</h1>
            <p className="text-[10px] text-[#70709a] font-medium">Manage your unified checkout transactions and attribution</p>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full select-none">
          {/* Card 1: Total Orders */}
          <div className="p-4 rounded-xl bg-[#0d0d1a]/40 border border-white/[0.04] backdrop-blur-md relative overflow-hidden flex flex-col justify-between group transition-all hover:border-white/[0.08]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#70709a]">
                Total Orders
              </span>
              <div className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">
                1,284
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ▲ +12%
              </span>
              <span className="text-[9px] text-[#70709a] truncate">vs last month</span>
            </div>
          </div>

          {/* Card 2: Total Revenue */}
          <div className="p-4 rounded-xl bg-[#0d0d1a]/40 border border-white/[0.04] backdrop-blur-md relative overflow-hidden flex flex-col justify-between group transition-all hover:border-white/[0.08]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#70709a]">
                Total Revenue
              </span>
              <div className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">
                {formatINR(2418500)}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ▲ +8.4%
              </span>
              <span className="text-[9px] text-[#70709a] truncate">vs last month</span>
            </div>
          </div>

          {/* Card 3: Attributed Orders */}
          <div className="p-4 rounded-xl bg-[#0d0d1a]/40 border border-white/[0.04] backdrop-blur-md relative overflow-hidden flex flex-col justify-between group transition-all hover:border-white/[0.08]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#70709a]">
                Attributed Orders
              </span>
              <div className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">
                847 <span className="text-white/40 text-sm font-normal">— 66%</span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ▲ +15.2%
              </span>
              <span className="text-[9px] text-[#70709a] truncate">vs last month</span>
            </div>
          </div>

          {/* Card 4: Average Order Value */}
          <div className="p-4 rounded-xl bg-[#0d0d1a]/40 border border-white/[0.04] backdrop-blur-md relative overflow-hidden flex flex-col justify-between group transition-all hover:border-white/[0.08]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#70709a]">
                Average Order Value
              </span>
              <div className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">
                {formatINR(1883)}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ▲ +3.1%
              </span>
              <span className="text-[9px] text-[#70709a] truncate">vs last month</span>
            </div>
          </div>
        </div>

        {/* Revenue Over Time Chart */}
        <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-6 select-none relative overflow-hidden flex flex-col justify-between backdrop-blur-md">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1D9E75]/[0.01] to-transparent pointer-events-none" />
          <div className="mb-4 relative z-10">
            <h3 className="text-sm font-semibold text-white/90">Revenue over time</h3>
            <p className="text-[10px] text-[#70709a]">Daily performance over the last 30 days</p>
          </div>
          <div className="w-full h-[260px] text-xs relative z-10 text-[#70709a]">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1D9E75" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#1D9E75" stopOpacity={0} />
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
                    tickFormatter={formatIndianAbbreviation}
                    style={{ fontSize: 9, fontWeight: 500 }}
                  />
                  <Tooltip
                    contentStyle={colors.tooltip}
                    formatter={(value: number) => [formatINR(value), "Revenue"]}
                    labelStyle={{ fontWeight: "bold", color: "#1D9E75", marginBottom: 4 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Daily Revenue"
                    stroke="#1D9E75"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#revenueGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-white/20">
                Loading revenue visualization...
              </div>
            )}
          </div>
        </div>

        {/* All Orders Table Section */}
        <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-6 select-none relative overflow-hidden backdrop-blur-md">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
          
          <div className="mb-6 relative z-10">
            <h3 className="text-sm font-semibold text-white/90">All Orders</h3>
            <p className="text-[10px] text-[#70709a]">Monitor, search, and filter transaction attributions</p>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 relative z-10">
            <div>
              <input
                type="text"
                placeholder="Search by email or order ID…"
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
                <option value="pending" className="bg-[#0d0d1a] text-white">pending</option>
                <option value="confirmed" className="bg-[#0d0d1a] text-white">confirmed</option>
                <option value="completed" className="bg-[#0d0d1a] text-white">completed</option>
                <option value="refunded" className="bg-[#0d0d1a] text-white">refunded</option>
                <option value="cancelled" className="bg-[#0d0d1a] text-white">cancelled</option>
              </select>
            </div>
            <div>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="w-full h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-white hover:border-white/20 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-sans text-xs appearance-none cursor-pointer"
              >
                <option value="All" className="bg-[#0d0d1a] text-white">Filter by Source: All</option>
                <option value="shopify" className="bg-[#0d0d1a] text-white">shopify</option>
                <option value="razorpay" className="bg-[#0d0d1a] text-white">razorpay</option>
                <option value="woocommerce" className="bg-[#0d0d1a] text-white">woocommerce</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto w-full rounded-xl border border-white/[0.04] bg-[#0d0d1a]/20 relative z-10">
            <table className="w-full border-collapse text-left text-xs text-[#d0d0e8]/85">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02] text-white/60 font-semibold">
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer Email</th>
                  <th className="p-3">Source</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Attribution</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const cleanExternalId = order.externalId.replace("ext_", "");
                    const displayId = `#${cleanExternalId.slice(-8)}`;

                    // Colored status badges matching recent leads/dashboard styles
                    let statusBadgeClass = "bg-amber-500/10 text-amber-400 border border-amber-500/20";
                    if (order.status === "completed") {
                      statusBadgeClass = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
                    } else if (order.status === "refunded" || order.status === "cancelled") {
                      statusBadgeClass = "bg-rose-500/10 text-rose-400 border border-rose-500/20";
                    }

                    return (
                      <tr key={order.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="p-3 font-mono font-medium text-white/95">{displayId}</td>
                        <td className="p-3">{order.customerEmail}</td>
                        <td className="p-3 capitalize">{order.sourceTool}</td>
                        <td className="p-3 font-semibold text-white/90">{formatINR(order.amountInr)}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold ${statusBadgeClass}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-3">
                          {order.isAttributed && order.attributionMethod ? (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#1D9E75]/10 text-[#1D9E75] border border-[#1D9E75]/20">
                              {order.attributionMethod}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-white/5 text-white/30 border border-white/10">
                              Unattributed
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          {new Date(order.orderedAt).toLocaleDateString("en-GB", {
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
                      No orders found matching the filter criteria.
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

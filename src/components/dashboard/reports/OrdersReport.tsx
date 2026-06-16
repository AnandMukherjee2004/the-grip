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
import EmptyState from "@/components/dashboard/EmptyState";
import ReportSectionHeader from "./ReportSectionHeader";
import ReportKPICard from "./ReportKPICard";
import { OrdersIcon } from "@/components/ui/Icons";

interface OrdersReportProps {
  connectedTools: string[];
  dateRange: string;
  compareMode: boolean;
}

interface ProductItem {
  name: string;
  orders: number;
  revenue: number;
  pctOfTotal: string;
}

const mockProducts: ProductItem[] = [
  { name: "Frido Orthopedic Seat Cushion", orders: 245, revenue: 367500, pctOfTotal: "28.5%" },
  { name: "Frido Back Support Belt", orders: 198, revenue: 297000, pctOfTotal: "23.1%" },
  { name: "Frido Coccyx Cushion", orders: 154, revenue: 231000, pctOfTotal: "17.9%" },
  { name: "Frido Memory Foam Pillow", orders: 120, revenue: 180000, pctOfTotal: "14.0%" },
  { name: "Frido Knee Sleeve (Pair)", orders: 95, revenue: 114000, pctOfTotal: "8.8%" },
  { name: "Frido Gel Insoles", orders: 82, revenue: 98400, pctOfTotal: "7.6%" },
];

const mockDailyOrders = [
  { date: "06-01", orders: 12, avgValue: 1450 },
  { date: "06-05", orders: 18, avgValue: 1520 },
  { date: "06-10", orders: 15, avgValue: 1490 },
  { date: "06-15", orders: 24, avgValue: 1610 },
  { date: "06-20", orders: 32, avgValue: 1580 },
  { date: "06-25", orders: 28, avgValue: 1650 },
  { date: "06-30", orders: 42, avgValue: 1720 },
];

export default function OrdersReport({ connectedTools, dateRange, compareMode }: OrdersReportProps) {
  const [loading, setLoading] = useState(true);

  const hasEcom = connectedTools.some((t) =>
    ["shopify", "woocommerce"].includes(t)
  );

  useEffect(() => {
    if (!hasEcom) return;
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
  }, [dateRange, hasEcom]);

  if (!hasEcom) {
    return (
      <div className="bg-[#0d0d1a]/20 border border-white/[0.03] rounded-xl p-6 min-h-[320px] flex flex-col justify-between">
        <ReportSectionHeader
          title="Orders"
          subtitle="Order volume and fulfilment breakdown"
        />
        <div className="flex-grow flex items-center justify-center">
          <EmptyState
            title="Connect your Store to see Order Analysis"
            description="Integrate Shopify or WooCommerce to pull live order counts, total GMV, fulfillment logs, and product performance."
            buttonText="Connect Store"
            href="/dashboard/connectors"
            icon={<OrdersIcon size={28} className="text-white/60" />}
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
        title="Orders"
        subtitle="Order volume and fulfilment breakdown"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ReportKPICard
          label="Total Orders"
          value="904"
          delta="+14.6%"
          isUp={true}
          compareMode={compareMode}
          subtitle="All received orders"
        />
        <ReportKPICard
          label="Total GMV"
          value="₹12,87,900"
          delta="+18.2%"
          isUp={true}
          compareMode={compareMode}
          subtitle="Gross Merchandise Value"
        />
        <ReportKPICard
          label="Fulfilled"
          value="872"
          delta="+15.1%"
          isUp={true}
          compareMode={compareMode}
          subtitle="96.4% fulfilment rate"
        />
        <ReportKPICard
          label="Cancelled"
          value="32"
          delta="-8.4%"
          isUp={true}
          compareMode={compareMode}
          subtitle="3.5% cancellation rate"
        />
      </div>

      {/* Daily Orders chart */}
      <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-5">
        <span className="text-xs font-semibold text-white/80 block mb-4">Daily Orders & Average Order Value (AOV)</span>
        <div className="h-[280px] w-full text-xs text-[#70709a]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={mockDailyOrders} margin={{ top: 10, right: -10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818CF8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#818CF8" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(208,208,232,0.02)" vertical={false} />
              <XAxis dataKey="date" stroke="rgba(208,208,232,0.3)" tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" stroke="rgba(208,208,232,0.3)" tickLine={false} axisLine={false} />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="rgba(208,208,232,0.3)"
                tickFormatter={(val) => `₹${val}`}
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
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 10 }} />
              <Bar
                yAxisId="left"
                dataKey="orders"
                name="Order Count"
                fill="url(#ordersGrad)"
                radius={[4, 4, 0, 0]}
                barSize={32}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgValue"
                name="Average Order Value"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-5 space-y-4">
        <span className="text-xs font-semibold text-white/80 block">Top 6 Products by Revenue</span>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-white/40 font-semibold">
                <th className="py-2 px-1">Product Name</th>
                <th className="py-2 px-1">Orders</th>
                <th className="py-2 px-1">Revenue</th>
                <th className="py-2 px-1 text-right">% of Total Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02] text-white/80">
              {mockProducts.map((prod, idx) => (
                <tr key={idx} className="hover:bg-white/[0.01]">
                  <td className="py-2.5 px-1 font-semibold text-white/95">{prod.name}</td>
                  <td className="py-2.5 px-1">{prod.orders}</td>
                  <td className="py-2.5 px-1 text-indigo-400 font-bold">
                    ₹{prod.revenue.toLocaleString("en-IN")}
                  </td>
                  <td className="py-2.5 px-1 text-right text-[#70709a]">{prod.pctOfTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useOnboarding } from "@/context/OnboardingContext";
import TopBar, { DEFAULT_DATE_RANGE } from "@/components/layout/TopBar";
import { getDateRangeLabel, type DateRangeSelection } from "@/lib/dateRange";
import KPIStrip from "@/components/dashboard/KPIStrip";
import PipelineFunnel from "@/components/dashboard/PipelineFunnel";
import RecentLeads from "@/components/dashboard/RecentLeads";
import OrdersSummary from "@/components/dashboard/OrdersSummary";
import PaymentsSummary from "@/components/dashboard/PaymentsSummary";
import AgentLeaderboard from "@/components/dashboard/AgentLeaderboard";

const RevenueChart = dynamic(() => import("@/components/dashboard/RevenueChart"), { ssr: false });
const AttributionChart = dynamic(() => import("@/components/dashboard/AttributionChart"), { ssr: false });

export default function DashboardPage() {
  const { connectedTools } = useOnboarding();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRangeSelection>(DEFAULT_DATE_RANGE);

  useEffect(() => {
    // Simulate async data fetching loading delay (800ms)
    // TODO: replace with real API call
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Skeleton Loader that mimics the structure of the dashboard layout
  if (loading) {
    return (
      <div className="flex-grow flex flex-col h-full overflow-hidden bg-[#040409]">
        {/* TopBar skeleton */}
        <div className="h-14 w-full bg-[#07070e]/80 border-b border-white/[0.04] px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-4 w-20 rounded bg-white/5 animate-pulse" />
            <div className="h-4 w-px bg-white/10" />
            <div className="h-7 w-28 rounded-lg bg-white/5 animate-pulse" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-7 w-48 rounded-lg bg-white/5 animate-pulse hidden sm:block" />
            <div className="h-7 w-7 rounded-lg bg-white/5 animate-pulse" />
            <div className="h-7 w-7 rounded-full bg-white/5 animate-pulse" />
          </div>
        </div>

        {/* Scrollable Center Content skeleton */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {/* Zone 1: KPI Strip (5 cards) */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-[#0d0d1a]/20 border border-white/[0.03] p-4 flex flex-col justify-between">
                <div className="h-3 w-16 rounded bg-white/5 animate-pulse" />
                <div className="h-6 w-24 rounded bg-white/5 animate-pulse" />
                <div className="h-3 w-12 rounded bg-white/5 animate-pulse" />
              </div>
            ))}
          </div>

          {/* Zone 2: Revenue Chart */}
          <div className="h-[400px] rounded-xl bg-[#0d0d1a]/20 border border-white/[0.03] p-6 flex flex-col justify-between">
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-white/5 animate-pulse" />
                <div className="h-3 w-24 rounded bg-white/5 animate-pulse" />
              </div>
              <div className="h-7 w-40 rounded-lg bg-white/5 animate-pulse" />
            </div>
            <div className="flex-grow flex items-center justify-center">
              <div className="h-3/4 w-full rounded bg-white/[0.02] animate-pulse" />
            </div>
          </div>

          {/* Zone 3: Funnel & Leads */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            <div className="lg:col-span-6 h-[400px] rounded-xl bg-[#0d0d1a]/20 border border-white/[0.03] p-6 animate-pulse" />
            <div className="lg:col-span-4 h-[400px] rounded-xl bg-[#0d0d1a]/20 border border-white/[0.03] p-6 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col h-full overflow-hidden bg-[#040409]">
      <TopBar dateRange={dateRange} onDateRangeChange={setDateRange} />

      {/* Scrollable Main Content Center Area */}
      <main className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin">
        {/* Zone 1 — KPI strip */}
        <KPIStrip connectedTools={connectedTools} />

        {/* Zone 2 — Revenue chart */}
        <RevenueChart connectedTools={connectedTools} dateRange={getDateRangeLabel(dateRange)} />

        {/* Zone 3 — Pipeline funnel (60%) + New leads (40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          <div className="lg:col-span-6">
            <PipelineFunnel connectedTools={connectedTools} />
          </div>
          <div className="lg:col-span-4">
            <RecentLeads connectedTools={connectedTools} />
          </div>
        </div>

        {/* Zone 4 — Orders (50%) + Payments (50%) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OrdersSummary connectedTools={connectedTools} />
          <PaymentsSummary connectedTools={connectedTools} />
        </div>

        {/* Zone 5 — Attribution (render conditional on ad connectors) */}
        <AttributionChart connectedTools={connectedTools} />

        {/* Zone 6 — Agent leaderboard (render conditional on CRM connector) */}
        <AgentLeaderboard connectedTools={connectedTools} />
      </main>
    </div>
  );
}

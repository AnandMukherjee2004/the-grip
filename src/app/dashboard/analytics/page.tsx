"use client";

import { useState } from "react";
import { useOnboarding } from "@/context/OnboardingContext";
import TopBar, { DateRangeOption } from "@/components/layout/TopBar";

// Report Sections
import RevenueReport from "@/components/dashboard/reports/RevenueReport";
import SalesFunnelReport from "@/components/dashboard/reports/SalesFunnelReport";
import AgentPerformanceReport from "@/components/dashboard/reports/AgentPerformanceReport";
import OrdersReport from "@/components/dashboard/reports/OrdersReport";
import AttributionReport from "@/components/dashboard/reports/AttributionReport";
import PaymentHealthReport from "@/components/dashboard/reports/PaymentHealthReport";

export type ReportsDateRange =
  | "Last 7 days"
  | "Last 30 days"
  | "Last 90 days"
  | "This month"
  | "Last month"
  | "This quarter"
  | "Custom range";

export type ComparisonRange =
  | "Previous equivalent period"
  | "Previous Year"
  | "Custom period";

export default function AnalyticsPage() {
  const { connectedTools } = useOnboarding();

  // Reports local date selection (independent of global TopBar date range option)
  const [dummyGlobalRange, setDummyGlobalRange] = useState<DateRangeOption>("Last 30 days");
  const [reportsRange, setReportsRange] = useState<ReportsDateRange>("Last 30 days");
  const [reportsRangeOpen, setReportsRangeOpen] = useState(false);

  // Compare mode states
  const [compareMode, setCompareMode] = useState(false);
  const [comparisonRange, setComparisonRange] = useState<ComparisonRange>("Previous equivalent period");
  const [comparisonOpen, setComparisonOpen] = useState(false);

  const reportsRangeOptions: ReportsDateRange[] = [
    "Last 7 days",
    "Last 30 days",
    "Last 90 days",
    "This month",
    "Last month",
    "This quarter",
    "Custom range",
  ];

  const comparisonOptions: ComparisonRange[] = [
    "Previous equivalent period",
    "Previous Year",
    "Custom period",
  ];

  const handleExport = () => {
    // TODO: wire to export endpoint
    console.log("Exporting current reports as CSV for period:", reportsRange, "compareMode:", compareMode);
    alert(`CSV export initiated for period: ${reportsRange}${compareMode ? ` compared to ${comparisonRange}` : ""}.\n(Mock export - API wireframe marked)`);
  };

  return (
    <div className="flex-grow flex flex-col h-full overflow-hidden bg-[#040409]">
      {/* TopBar with dummy state (standard dashboard layout shell) */}
      <TopBar selectedRange={dummyGlobalRange} onRangeChange={setDummyGlobalRange} />

      {/* Sticky sub-header */}
      <div className="sticky top-0 z-20 shrink-0 h-14 w-full bg-[#07070e]/95 border-b border-white/[0.04] backdrop-blur-md px-6 flex items-center justify-between select-none font-sans">
        {/* Left: page title */}
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-bold text-white tracking-wider font-display">Analytics</h1>
          <span className="h-4 w-px bg-white/10" />
          <span className="text-[10px] text-[#70709a] font-medium hidden sm:inline-block">Deep-dive analytics</span>
        </div>

        {/* Center: date range picker & compare toggle */}
        <div className="flex items-center gap-3">
          {/* Main reports date picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setReportsRangeOpen(!reportsRangeOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-white/70 hover:text-white bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>{reportsRange}</span>
              <span className="opacity-40 text-[8px]">▼</span>
            </button>

            {reportsRangeOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setReportsRangeOpen(false)} />
                <div className="absolute left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 mt-1.5 w-48 rounded-lg bg-[#0d0d1a] border border-white/[0.08] shadow-2xl p-1 z-20">
                  {reportsRangeOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setReportsRange(opt);
                        setReportsRangeOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                        reportsRange === opt
                          ? "bg-indigo-600/20 text-indigo-400 font-semibold"
                          : "text-white/60 hover:text-white hover:bg-white/[0.03]"
                      }`}
                    >
                      <span>{opt}</span>
                      {reportsRange === opt && <span>✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Compare to toggle */}
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={compareMode}
                onChange={(e) => setCompareMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-7 h-4 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600" />
              <span className="ml-1.5 text-[10px] font-semibold text-white/50 hover:text-white/80">Compare</span>
            </label>
          </div>

          {/* Comparison range picker */}
          {compareMode && (
            <div className="relative animate-fadeIn hidden md:block">
              <button
                type="button"
                onClick={() => setComparisonOpen(!comparisonOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-white/70 hover:text-white bg-indigo-900/10 border border-indigo-500/20 hover:border-indigo-500/40 transition-all cursor-pointer"
              >
                <span>vs {comparisonRange}</span>
                <span className="opacity-40 text-[8px]">▼</span>
              </button>

              {comparisonOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setComparisonOpen(false)} />
                  <div className="absolute right-0 mt-1.5 w-52 rounded-lg bg-[#0d0d1a] border border-white/[0.08] shadow-2xl p-1 z-20">
                    {comparisonOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setComparisonRange(opt);
                          setComparisonOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                          comparisonRange === opt
                            ? "bg-indigo-600/20 text-indigo-400 font-semibold"
                            : "text-white/60 hover:text-white hover:bg-white/[0.03]"
                        }`}
                      >
                        <span>{opt}</span>
                        {comparisonRange === opt && <span>✓</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right: Export button */}
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 h-8 px-3.5 rounded-lg text-[10px] font-semibold bg-white/5 hover:bg-indigo-600/25 border border-white/10 hover:border-indigo-500/30 text-white/70 hover:text-white transition-all active:scale-[0.98] cursor-pointer"
        >
          <svg className="w-3 h-3 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span>Export CSV</span>
        </button>
      </div>

      {/* Main content scroll area */}
      <main className="flex-grow overflow-y-auto p-6 space-y-8 scrollbar-thin">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Section 1 - Revenue */}
          <RevenueReport dateRange={reportsRange} compareMode={compareMode} />

          {/* Section 2 - Sales funnel */}
          <SalesFunnelReport
            connectedTools={connectedTools}
            dateRange={reportsRange}
            compareMode={compareMode}
          />

          {/* Section 3 - Agent performance */}
          <AgentPerformanceReport connectedTools={connectedTools} dateRange={reportsRange} />

          {/* Section 4 - Orders */}
          <OrdersReport
            connectedTools={connectedTools}
            dateRange={reportsRange}
            compareMode={compareMode}
          />

          {/* Section 5 - Attribution */}
          <AttributionReport
            connectedTools={connectedTools}
            dateRange={reportsRange}
            compareMode={compareMode}
          />

          {/* Section 6 - Payment health */}
          <PaymentHealthReport
            connectedTools={connectedTools}
            dateRange={reportsRange}
            compareMode={compareMode}
          />
        </div>
      </main>
    </div>
  );
}

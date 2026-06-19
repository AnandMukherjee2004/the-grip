"use client";

import React, { useState, useEffect } from "react";
import TopBar, { DEFAULT_DATE_RANGE } from "@/components/layout/TopBar";
import type { DateRangeSelection } from "@/lib/dateRange";

// Simple custom Lucide-like icons to avoid bundle imports issues
const BellIcon = () => (
  <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const MoreHorizontalIcon = () => (
  <svg className="w-4 h-4 text-white/40 hover:text-white transition-colors cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

const ZapIcon = () => (
  <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

interface AutomationRule {
  id: string;
  name: string;
  triggerName: string;
  actionName: string;
  sourceType: "razorpay" | "shopify" | "leadsquared" | "meta";
  description: string;
  isActive: boolean;
  lastTriggered: string;
  runCount: number;
}

interface RunLog {
  id: string;
  automationName: string;
  description: string;
  status: "success" | "failed";
  timestamp: string;
}

// 8 Mock Automations (5 active, 3 paused)
const INITIAL_AUTOMATIONS: AutomationRule[] = [
  {
    id: "auto_1",
    name: "Razorpay Failed Alert",
    triggerName: "Payment Failed",
    actionName: "Send WhatsApp",
    sourceType: "razorpay",
    description: "Razorpay payment fails → send WhatsApp notification to customer support",
    isActive: true,
    lastTriggered: "10 mins ago",
    runCount: 42,
  },
  {
    id: "auto_2",
    name: "Shopify First Order Move",
    triggerName: "Order Completed",
    actionName: "Move Lead Stage",
    sourceType: "shopify",
    description: "First Shopify order placed → auto-move lead to Contacted stage",
    isActive: true,
    lastTriggered: "2 hours ago",
    runCount: 112,
  },
  {
    id: "auto_3",
    name: "High Value Slack Alert",
    triggerName: "Lead Created",
    actionName: "Send Slack",
    sourceType: "leadsquared",
    description: "New lead with deal value above ₹1,00,000 → send Slack notification to sales group",
    isActive: true,
    lastTriggered: "Yesterday",
    runCount: 15,
  },
  {
    id: "auto_4",
    name: "Meta Budget Threshold Alert",
    triggerName: "Ad Spend Threshold",
    actionName: "Send Email",
    sourceType: "meta",
    description: "Daily Meta spend exceeds ₹10,000 → send warning email alert to admin",
    isActive: false,
    lastTriggered: "3 days ago",
    runCount: 4,
  },
  {
    id: "auto_5",
    name: "LeadSquared Status Sync",
    triggerName: "Lead Created",
    actionName: "Send Slack",
    sourceType: "leadsquared",
    description: "LeadSquared status update → post updates inside workspace channels",
    isActive: true,
    lastTriggered: "4 hours ago",
    runCount: 322,
  },
  {
    id: "auto_6",
    name: "Shopify Refund Notification",
    triggerName: "Payment Failed",
    actionName: "Send Email",
    sourceType: "shopify",
    description: "Shopify refund processed → send confirmation email to accounts",
    isActive: false,
    lastTriggered: "Never",
    runCount: 0,
  },
  {
    id: "auto_7",
    name: "Google Ads Daily Digest",
    triggerName: "Ad Spend Threshold",
    actionName: "Send Slack",
    sourceType: "meta",
    description: "Google daily ad stats compiled → send daily Slack report",
    isActive: true,
    lastTriggered: "Today, 9:00 AM",
    runCount: 88,
  },
  {
    id: "auto_8",
    name: "Typeform Onboarding Dispatch",
    triggerName: "Lead Created",
    actionName: "Send WhatsApp",
    sourceType: "leadsquared",
    description: "Typeform survey submission → trigger welcome WhatsApp flow to user",
    isActive: false,
    lastTriggered: "1 week ago",
    runCount: 14,
  },
];

// 15 Mock Run Logs (13 success, 2 failed)
const MOCK_RUNS: RunLog[] = [
  { id: "r1", automationName: "Razorpay Failed Alert", description: "Triggered by Razorpay payment #pay_abc123", status: "success", timestamp: "Today, 10:42 AM" },
  { id: "r2", automationName: "Shopify First Order Move", description: "Triggered by first Shopify order #ord_92384 for Priya Nair", status: "success", timestamp: "Today, 09:30 AM" },
  { id: "r3", automationName: "Google Ads Daily Digest", description: "Google ad performance metrics published", status: "success", timestamp: "Today, 09:00 AM" },
  { id: "r4", automationName: "Razorpay Failed Alert", description: "Triggered by Razorpay payment #pay_xyz987", status: "success", timestamp: "Today, 08:15 AM" },
  { id: "r5", automationName: "High Value Slack Alert", description: "Triggered by new LeadSquared lead — Amit Patel (₹1,25,000)", status: "success", timestamp: "Yesterday, 04:30 PM" },
  { id: "r6", automationName: "LeadSquared Status Sync", description: "LeadSquared lead stage synced for Vikram Malhotra", status: "success", timestamp: "Yesterday, 02:10 PM" },
  { id: "r7", automationName: "Meta Budget Threshold Alert", description: "Daily threshold validation failed — Network error", status: "failed", timestamp: "Yesterday, 12:00 PM" },
  { id: "r8", automationName: "Shopify First Order Move", description: "Triggered by first Shopify order #ord_92381 for Rohan Gupta", status: "success", timestamp: "Yesterday, 10:15 AM" },
  { id: "r9", automationName: "LeadSquared Status Sync", description: "LeadSquared lead stage synced for Kavya Iyer", status: "success", timestamp: "2 days ago" },
  { id: "r10", automationName: "Razorpay Failed Alert", description: "WhatsApp messaging gateway timeout", status: "failed", timestamp: "2 days ago" },
  { id: "r11", automationName: "High Value Slack Alert", description: "Triggered by new LeadSquared lead — Aarav Sharma (₹75,000)", status: "success", timestamp: "3 days ago" },
  { id: "r12", automationName: "LeadSquared Status Sync", description: "LeadSquared lead stage synced for Sanjay Dutt", status: "success", timestamp: "3 days ago" },
  { id: "r13", automationName: "Google Ads Daily Digest", description: "Google ad performance metrics published", status: "success", timestamp: "3 days ago" },
  { id: "r14", automationName: "Shopify First Order Move", description: "Triggered by first Shopify order #ord_92376 for Anil Kapoor", status: "success", timestamp: "4 days ago" },
  { id: "r15", automationName: "Typeform Onboarding Dispatch", description: "Triggered by typeform submission — Virat Kohli", status: "success", timestamp: "4 days ago" },
];

export default function AutomationsPage() {
  const [dateRange, setDateRange] = useState<DateRangeSelection>(DEFAULT_DATE_RANGE);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [automations, setAutomations] = useState<AutomationRule[]>(INITIAL_AUTOMATIONS);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"new" | "template">("new");
  const [selectedTemplate, setSelectedTemplate] = useState<{ title: string; desc: string } | null>(null);

  // New automation form states
  const [newRuleName, setNewRuleName] = useState("");
  const [newRuleTrigger, setNewRuleTrigger] = useState("Lead Created");
  const [newRuleAction, setNewRuleAction] = useState("Send WhatsApp");

  // Toggle active/paused per row
  const toggleAutomationActive = (id: string) => {
    setAutomations((prev) =>
      prev.map((rule) =>
        rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
  };

  // Filter automations
  const filteredAutomations = automations.filter((rule) => {
    const matchesSearch = rule.name.toLowerCase().includes(search.toLowerCase()) ||
      rule.description.toLowerCase().includes(search.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === "Active") matchesStatus = rule.isActive;
    if (statusFilter === "Paused") matchesStatus = !rule.isActive;

    return matchesSearch && matchesStatus;
  });

  const openNewAutomationModal = () => {
    setNewRuleName("");
    setModalType("new");
    setIsModalOpen(true);
  };

  const openTemplateModal = (title: string, desc: string) => {
    setSelectedTemplate({ title, desc });
    setModalType("template");
    setIsModalOpen(true);
  };

  const handleCreateAutomation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName) return;

    const newRule: AutomationRule = {
      id: `auto_${Date.now()}`,
      name: newRuleName,
      triggerName: newRuleTrigger,
      actionName: newRuleAction,
      sourceType: "leadsquared",
      description: `${newRuleTrigger} → ${newRuleAction} (custom automation)`,
      isActive: true,
      lastTriggered: "Just now",
      runCount: 0,
    };

    setAutomations((prev) => [newRule, ...prev]);
    setIsModalOpen(false);
  };

  const handleActivateTemplate = () => {
    if (!selectedTemplate) return;

    const newRule: AutomationRule = {
      id: `auto_${Date.now()}`,
      name: selectedTemplate.title,
      triggerName: "Template Trigger",
      actionName: "Template Action",
      sourceType: "shopify",
      description: selectedTemplate.desc,
      isActive: true,
      lastTriggered: "Just now",
      runCount: 0,
    };

    setAutomations((prev) => [newRule, ...prev]);
    setIsModalOpen(false);
  };

  return (
    <div className="flex-grow flex flex-col overflow-hidden bg-[#040409]">
      <TopBar dateRange={dateRange} onDateRangeChange={setDateRange} />

      {/* Main Content Area */}
      <main className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin text-[#d0d0e8] font-sans">
        
        {/* Page Header Row */}
        <div className="flex items-center justify-between select-none">
          <div>
            <h1 className="text-sm font-bold text-white tracking-wider font-display uppercase">Automations</h1>
            <p className="text-[10px] text-[#70709a] font-medium">Build trigger workflows and operational alerts across platform pipelines</p>
          </div>
          <button
            onClick={openNewAutomationModal}
            className="text-xs font-semibold bg-[#534AB7] hover:bg-[#4339a0] text-white rounded-lg px-4 py-2 transition-colors active:scale-[0.98] cursor-pointer"
          >
            + New Automation
          </button>
        </div>

        {/* 3-Column KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full select-none">
          {/* Card 1: Active Automations */}
          <div className="p-4 rounded-xl bg-[#0d0d1a]/40 border border-white/[0.04] backdrop-blur-md relative overflow-hidden flex flex-col justify-between group transition-all hover:border-white/[0.08]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#70709a]">
                Active Automations
              </span>
              <div className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">
                7
              </div>
            </div>
            <span className="text-[9px] text-[#70709a] mt-2 block">rules currently running live</span>
          </div>

          {/* Card 2: Total Runs This Month */}
          <div className="p-4 rounded-xl bg-[#0d0d1a]/40 border border-white/[0.04] backdrop-blur-md relative overflow-hidden flex flex-col justify-between group transition-all hover:border-white/[0.08]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#70709a]">
                Total Runs This Month
              </span>
              <div className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">
                1,243
              </div>
            </div>
            <span className="text-[9px] text-[#70709a] mt-2 block">automated execution sequences</span>
          </div>

          {/* Card 3: Failed Runs */}
          <div className="p-4 rounded-xl bg-[#0d0d1a]/40 border border-white/[0.04] backdrop-blur-md relative overflow-hidden flex flex-col justify-between group transition-all hover:border-white/[0.08]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#70709a]">
                Failed Runs
              </span>
              <div className="text-lg md:text-xl font-bold text-rose-400 tracking-tight leading-tight transition-colors">
                18
              </div>
            </div>
            <span className="text-[9px] text-[#70709a] mt-2 block">failures needing attention</span>
          </div>
        </div>

        {/* Quick Templates Section */}
        <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-6 select-none relative overflow-hidden backdrop-blur-md">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
          
          <div className="mb-4 relative z-10">
            <h3 className="text-sm font-semibold text-white/90">Quick Templates</h3>
            <p className="text-[10px] text-[#70709a]">Deploy pre-configured workspace rules instantly</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
            {/* Template A */}
            <div
              onClick={() => openTemplateModal("Payment Failed Alert", "Razorpay payment fails → send WhatsApp notification")}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-purple-500/50 hover:shadow-[0_4px_20px_rgba(83,74,183,0.15)] transition-all cursor-pointer flex flex-col justify-between h-[160px]"
            >
              <div>
                <AlertTriangleIcon />
                <h4 className="font-semibold text-xs text-white mt-3 mb-1">Payment Failed Alert</h4>
                <p className="text-white/50 text-[10px] leading-tight">Razorpay payment fails → send WhatsApp notification</p>
              </div>
              <span className="text-[10px] font-bold text-[#1D9E75] hover:text-[#1D9E75]/80 transition-colors mt-2 block">+ Activate</span>
            </div>

            {/* Template B */}
            <div
              onClick={() => openTemplateModal("Lead Stage Advance", "First Shopify order placed → auto-move lead to Contacted stage")}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-purple-500/50 hover:shadow-[0_4px_20px_rgba(83,74,183,0.15)] transition-all cursor-pointer flex flex-col justify-between h-[160px]"
            >
              <div>
                <ArrowRightIcon />
                <h4 className="font-semibold text-xs text-white mt-3 mb-1">Lead Stage Advance</h4>
                <p className="text-white/50 text-[10px] leading-tight">First Shopify order placed → auto-move lead to Contacted stage</p>
              </div>
              <span className="text-[10px] font-bold text-[#1D9E75] hover:text-[#1D9E75]/80 transition-colors mt-2 block">+ Activate</span>
            </div>

            {/* Template C */}
            <div
              onClick={() => openTemplateModal("High Value Lead Alert", "New lead with deal value above ₹1,00,000 → send Slack notification")}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-purple-500/50 hover:shadow-[0_4px_20px_rgba(83,74,183,0.15)] transition-all cursor-pointer flex flex-col justify-between h-[160px]"
            >
              <div>
                <BellIcon />
                <h4 className="font-semibold text-xs text-white mt-3 mb-1">High Value Lead Alert</h4>
                <p className="text-white/50 text-[10px] leading-tight">New lead with deal value above ₹1,00,000 → send Slack notification</p>
              </div>
              <span className="text-[10px] font-bold text-[#1D9E75] hover:text-[#1D9E75]/80 transition-colors mt-2 block">+ Activate</span>
            </div>

            {/* Template D */}
            <div
              onClick={() => openTemplateModal("Ad Spend Threshold", "Daily Meta or Google spend exceeds ₹10,000 → send email alert to admin")}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-purple-500/50 hover:shadow-[0_4px_20px_rgba(83,74,183,0.15)] transition-all cursor-pointer flex flex-col justify-between h-[160px]"
            >
              <div>
                <TrendingUpIcon />
                <h4 className="font-semibold text-xs text-white mt-3 mb-1">Ad Spend Threshold</h4>
                <p className="text-white/50 text-[10px] leading-tight">Daily Meta or Google spend exceeds ₹10,000 → send email alert to admin</p>
              </div>
              <span className="text-[10px] font-bold text-[#1D9E75] hover:text-[#1D9E75]/80 transition-colors mt-2 block">+ Activate</span>
            </div>
          </div>
        </div>

        {/* Your Automations List */}
        <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-6 select-none relative overflow-hidden backdrop-blur-md">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
          
          <div className="mb-6 relative z-10">
            <h3 className="text-sm font-semibold text-white/90">Your Automations</h3>
            <p className="text-[10px] text-[#70709a]">Manage, edit, and toggle active trigger rules</p>
          </div>

          {/* Filters row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 relative z-10 items-center">
            <div>
              <input
                type="text"
                placeholder="Search automations…"
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
                <option value="All" className="bg-[#0d0d1a] text-white">Status: All</option>
                <option value="Active" className="bg-[#0d0d1a] text-white">Active</option>
                <option value="Paused" className="bg-[#0d0d1a] text-white">Paused</option>
              </select>
            </div>
          </div>

          {/* List Layout */}
          <div className="space-y-3 relative z-10">
            {filteredAutomations.length > 0 ? (
              filteredAutomations.map((rule) => {
                return (
                  <div
                    key={rule.id}
                    className="bg-white/[0.02] border border-white/10 rounded-xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {/* Left colored square icon badge */}
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                        <ZapIcon />
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs text-white">{rule.name}</h4>
                        <p className="text-white/50 text-[10px] mt-0.5">{rule.description}</p>
                      </div>
                    </div>

                    {/* Middle info */}
                    <div className="flex items-center gap-6 text-[10px] text-white/40 font-medium">
                      <span>Last run: {rule.lastTriggered}</span>
                      <span>Run {rule.runCount} times</span>
                    </div>

                    {/* Right action and options */}
                    <div className="flex items-center gap-3">
                      {/* Status toggle button */}
                      <button
                        onClick={() => toggleAutomationActive(rule.id)}
                        className={`px-3 py-1 rounded-full text-[9px] font-bold border transition-colors cursor-pointer ${
                          rule.isActive
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {rule.isActive ? "Active" : "Paused"}
                      </button>
                      <MoreHorizontalIcon />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-white/20 p-8 font-medium">
                No automations found matching the filter criteria.
              </div>
            )}
          </div>
        </div>

        {/* Recent Run History */}
        <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-6 select-none relative overflow-hidden backdrop-blur-md">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />

          <div className="mb-4 relative z-10">
            <h3 className="text-sm font-semibold text-white/90">Recent Run History</h3>
            <p className="text-[10px] text-[#70709a]">Log feed of automation rule executions</p>
          </div>

          <div className="relative z-10 divide-y divide-white/5">
            {MOCK_RUNS.map((run) => {
              const isSuccess = run.status === "success";

              return (
                <div key={run.id} className="flex items-start justify-between gap-3 py-3 text-xs">
                  <div className="flex items-start gap-3">
                    {/* Status dot on left */}
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${isSuccess ? "bg-emerald-500" : "bg-rose-500"}`} />
                    <div className="space-y-0.5">
                      <h5 className="font-semibold text-white/90">{run.automationName}</h5>
                      <p className="text-white/50 text-[10px]">{run.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[10px]">
                    {/* Outcome badge */}
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                      isSuccess
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}>
                      {isSuccess ? "Success" : "Failed"}
                    </span>
                    <span className="text-[#70709a] font-medium">{run.timestamp}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Modal Overlay Component */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-[#0F1623] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            
            {/* Modal Type: New Custom Automation */}
            {modalType === "new" && (
              <form onSubmit={handleCreateAutomation} className="space-y-4 font-sans">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Create Custom Automation</h3>
                  <p className="text-[10px] text-white/50 mt-1">Design trigger responses across pipelines</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Automation Name</label>
                  <input
                    type="text"
                    required
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                    placeholder="e.g. Lead Attributed Push"
                    className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-indigo-500/50 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Trigger Event</label>
                  <select
                    value={newRuleTrigger}
                    onChange={(e) => setNewRuleTrigger(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-indigo-500/50 focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="Lead Created" className="bg-[#0d0d1a]">Lead Created</option>
                    <option value="Order Completed" className="bg-[#0d0d1a]">Order Completed</option>
                    <option value="Payment Failed" className="bg-[#0d0d1a]">Payment Failed</option>
                    <option value="Ad Spend Threshold" className="bg-[#0d0d1a]">Ad Spend Threshold</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Response Action</label>
                  <select
                    value={newRuleAction}
                    onChange={(e) => setNewRuleAction(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-indigo-500/50 focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="Send WhatsApp" className="bg-[#0d0d1a]">Send WhatsApp</option>
                    <option value="Send Slack" className="bg-[#0d0d1a]">Send Slack</option>
                    <option value="Send Email" className="bg-[#0d0d1a]">Send Email</option>
                    <option value="Move Lead Stage" className="bg-[#0d0d1a]">Move Lead Stage</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="text-xs font-semibold text-white/50 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-xs font-semibold bg-[#534AB7] hover:bg-[#4339a0] text-white rounded-lg px-4 py-2 transition-colors cursor-pointer"
                  >
                    Create Automation
                  </button>
                </div>
              </form>
            )}

            {/* Modal Type: Activate Template */}
            {modalType === "template" && selectedTemplate && (
              <div className="space-y-4 font-sans select-none">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Activate Template</h3>
                  <p className="text-[10px] text-white/50 mt-1">Pre-built workspace rule configurations</p>
                </div>

                <div className="space-y-1.5 p-3 rounded-lg bg-white/5 border border-white/[0.04]">
                  <h4 className="font-semibold text-xs text-white">{selectedTemplate.title}</h4>
                  <p className="text-white/60 text-[10px] leading-tight">{selectedTemplate.desc}</p>
                </div>

                <p className="text-[10px] text-white/40">Activating this template will automatically initialize a live automation rule monitoring webhook triggers across tools.</p>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="text-xs font-semibold text-white/50 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleActivateTemplate}
                    className="text-xs font-semibold bg-[#534AB7] hover:bg-[#4339a0] text-white rounded-lg px-4 py-2 transition-colors cursor-pointer"
                  >
                    Activate
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

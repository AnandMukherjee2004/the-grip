"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import EmptyState from "@/components/dashboard/EmptyState";
import ReportSectionHeader from "./ReportSectionHeader";
import { LeadsIcon } from "@/components/ui/Icons";

interface AgentPerformanceReportProps {
  connectedTools: string[];
  dateRange: string;
}

interface AgentData {
  name: string;
  initials: string;
  leadsAssigned: number;
  dealsClosed: number;
  revenueGenerated: number;
  conversionRate: number; // percentage
  avgDealSize: number;
  avgCloseTime: number; // days
}

const initialAgentData: AgentData[] = [
  {
    name: "Aditya Sen",
    initials: "AS",
    leadsAssigned: 180,
    dealsClosed: 25,
    revenueGenerated: 856000,
    conversionRate: 13.89,
    avgDealSize: 34240,
    avgCloseTime: 12,
  },
  {
    name: "Ananya Iyer",
    initials: "AI",
    leadsAssigned: 210,
    dealsClosed: 32,
    revenueGenerated: 1120000,
    conversionRate: 15.24,
    avgDealSize: 35000,
    avgCloseTime: 9,
  },
  {
    name: "Vikram Malhotra",
    initials: "VM",
    leadsAssigned: 150,
    dealsClosed: 18,
    revenueGenerated: 620000,
    conversionRate: 12.0,
    avgDealSize: 34444,
    avgCloseTime: 15,
  },
  {
    name: "Priya Das",
    initials: "PD",
    leadsAssigned: 195,
    dealsClosed: 22,
    revenueGenerated: 750000,
    conversionRate: 11.28,
    avgDealSize: 34090,
    avgCloseTime: 14,
  },
  {
    name: "Rajesh Nair",
    initials: "RN",
    leadsAssigned: 165,
    dealsClosed: 20,
    revenueGenerated: 685000,
    conversionRate: 12.12,
    avgDealSize: 34250,
    avgCloseTime: 13,
  },
];

type SortKey = keyof Omit<AgentData, "initials">;

export default function AgentPerformanceReport({
  connectedTools,
  dateRange,
}: AgentPerformanceReportProps) {
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState<AgentData[]>(initialAgentData);
  const [sortKey, setSortKey] = useState<SortKey>("revenueGenerated");
  const [sortAsc, setSortAsc] = useState(false);
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);

  const hasCrm = connectedTools.some((t) =>
    ["hubspot", "salesforce", "leadsquared", "freshsales", "zoho-crm", "pipedrive"].includes(t)
  );

  useEffect(() => {
    if (!hasCrm) return;
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
  }, [dateRange, hasCrm]);

  // Sort function
  const handleSort = (key: SortKey) => {
    const isAsc = sortKey === key ? !sortAsc : false;
    setSortKey(key);
    setSortAsc(isAsc);

    const sorted = [...agents].sort((a, b) => {
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
    setAgents(sorted);
  };

  // Sort order indicators
  const renderSortIndicator = (key: SortKey) => {
    if (sortKey !== key) return <span className="text-white/20 ml-1">⇅</span>;
    return sortAsc ? <span className="text-indigo-400 ml-1">▲</span> : <span className="text-indigo-400 ml-1">▼</span>;
  };

  if (!hasCrm) {
    return (
      <div className="bg-[#0d0d1a]/20 border border-white/[0.03] rounded-xl p-6 min-h-[320px] flex flex-col justify-between">
        <ReportSectionHeader
          title="Agent performance"
          subtitle="Individual sales agent breakdown"
        />
        <div className="flex-grow flex items-center justify-center">
          <EmptyState
            title="Connect a CRM to view Agent performance"
            description="Integrate Hubspot, Salesforce, or Zoho CRM to see your sales agent stats, deals closed, and revenue metrics."
            buttonText="Connect CRM"
            href="/dashboard/connectors"
            icon={<LeadsIcon size={28} className="text-white/60" />}
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-[#0d0d1a]/20 border border-white/[0.03] rounded-xl p-6 space-y-6 animate-pulse min-h-[480px] flex flex-col justify-between">
        <div className="h-10 bg-white/5 rounded w-1/3" />
        <div className="h-44 bg-white/5 rounded-lg" />
        <div className="h-[200px] bg-white/[0.02] rounded-lg" />
      </div>
    );
  }

  return (
    <section className="bg-[#0d0d1a]/20 border border-white/[0.03] rounded-xl p-6 space-y-6 select-none font-sans">
      <ReportSectionHeader
        title="Agent performance"
        subtitle="Individual sales agent breakdown"
      />

      {/* Agents Table */}
      <div className="overflow-x-auto bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-5">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-white/40 font-semibold cursor-pointer">
              <th className="py-2.5 px-2 hover:text-white" onClick={() => handleSort("name")}>
                Agent Name {renderSortIndicator("name")}
              </th>
              <th className="py-2.5 px-2 hover:text-white" onClick={() => handleSort("leadsAssigned")}>
                Leads Assigned {renderSortIndicator("leadsAssigned")}
              </th>
              <th className="py-2.5 px-2 hover:text-white" onClick={() => handleSort("dealsClosed")}>
                Deals Closed {renderSortIndicator("dealsClosed")}
              </th>
              <th className="py-2.5 px-2 hover:text-white" onClick={() => handleSort("revenueGenerated")}>
                Revenue Generated {renderSortIndicator("revenueGenerated")}
              </th>
              <th className="py-2.5 px-2 hover:text-white" onClick={() => handleSort("conversionRate")}>
                Conversion Rate {renderSortIndicator("conversionRate")}
              </th>
              <th className="py-2.5 px-2 hover:text-white" onClick={() => handleSort("avgDealSize")}>
                Avg Deal Size {renderSortIndicator("avgDealSize")}
              </th>
              <th className="py-2.5 px-2 hover:text-white" onClick={() => handleSort("avgCloseTime")}>
                Avg Close Time (days) {renderSortIndicator("avgCloseTime")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02] text-white/80">
            {agents.map((agent) => (
              <tr
                key={agent.name}
                className={`transition-colors duration-200 ${
                  hoveredAgent === agent.name
                    ? "bg-indigo-500/10 text-white font-medium"
                    : "hover:bg-white/[0.01]"
                }`}
                onMouseEnter={() => setHoveredAgent(agent.name)}
                onMouseLeave={() => setHoveredAgent(null)}
              >
                <td className="py-2.5 px-2 flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shadow-md">
                    {agent.initials}
                  </div>
                  <span>{agent.name}</span>
                </td>
                <td className="py-2.5 px-2">{agent.leadsAssigned}</td>
                <td className="py-2.5 px-2 font-semibold">{agent.dealsClosed}</td>
                <td className="py-2.5 px-2 text-indigo-400 font-bold">
                  ₹{agent.revenueGenerated.toLocaleString("en-IN")}
                </td>
                <td className="py-2.5 px-2">{agent.conversionRate.toFixed(2)}%</td>
                <td className="py-2.5 px-2">₹{agent.avgDealSize.toLocaleString("en-IN")}</td>
                <td className="py-2.5 px-2">{agent.avgCloseTime} days</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Agents Bar Chart */}
      <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-5">
        <span className="text-xs font-semibold text-white/80 block mb-4">Deals Closed by Agent</span>
        <div className="h-[250px] w-full text-xs text-[#70709a]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={agents}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              onMouseMove={(state: unknown) => {
                const typedState = state as { activePayload?: Array<{ payload: { name: string } }> } | undefined;
                if (typedState && typedState.activePayload) {
                  setHoveredAgent(typedState.activePayload[0].payload.name);
                }
              }}
              onMouseLeave={() => setHoveredAgent(null)}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(208,208,232,0.02)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(208,208,232,0.3)" tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(208,208,232,0.3)" tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: "rgba(99, 102, 241, 0.05)" }}
                contentStyle={{
                  backgroundColor: "#0d0d1a",
                  borderColor: "rgba(208, 208, 232, 0.08)",
                  borderRadius: 8,
                  fontSize: 11,
                  color: "#d0d0e8",
                }}
              />
              <Bar dataKey="dealsClosed" name="Deals Closed" radius={[4, 4, 0, 0]} barSize={35}>
                {agents.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={hoveredAgent === entry.name ? "#818CF8" : "#4F46E5"}
                    style={{ transition: "fill 0.2s ease" }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

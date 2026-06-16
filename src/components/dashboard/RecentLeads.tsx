"use client";

import Link from "next/link";
import EmptyState from "./EmptyState";
import { LeadsIcon } from "@/components/ui/Icons";
import { TOOLS } from "@/lib/tools";

interface RecentLeadsProps {
  connectedTools: string[];
}

interface LeadItem {
  name: string;
  source: string;
  stage: string;
  time: string;
}

const mockLeads: LeadItem[] = [
  { name: "Kavya Reddy", source: "LeadSquared", stage: "Qualified", time: "12m ago" },
  { name: "Arjun Mehta", source: "HubSpot", stage: "Won", time: "45m ago" },
  { name: "Sneha Iyer", source: "HubSpot", stage: "Proposal", time: "1h ago" },
  { name: "Rohan Gupta", source: "Zoho CRM", stage: "Won", time: "2h ago" },
  { name: "Divya Nair", source: "HubSpot", stage: "Qualified", time: "4h ago" },
  { name: "Vikram Singh", source: "LeadSquared", stage: "Demo", time: "5h ago" },
  { name: "Ananya Sharma", source: "Salesforce", stage: "Lead", time: "6h ago" },
  { name: "Pranav Patel", source: "Zoho CRM", stage: "Demo", time: "8h ago" },
];

export default function RecentLeads({ connectedTools }: RecentLeadsProps) {
  const isCrmConnected = connectedTools.some((t) =>
    ["hubspot", "salesforce", "leadsquared", "freshsales", "zoho-crm", "pipedrive"].includes(t)
  );

  if (!isCrmConnected) {
    return (
      <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-6 h-[400px] flex flex-col justify-between">
        <h3 className="text-sm font-semibold text-white/90">Recent leads</h3>
        <div className="flex-grow flex items-center justify-center">
          <EmptyState
            title="Connect a CRM to see leads"
            description="Integrate HubSpot, Salesforce, Zoho, or LeadSquared to sync CRM pipelines and deal values automatically."
            icon={<LeadsIcon size={28} className="text-white/60" />}
          />
        </div>
      </div>
    );
  }

  const getSourceStyle = (source: string) => {
    switch (source) {
      case "HubSpot":
        return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
      case "Salesforce":
        return "bg-sky-500/10 text-sky-400 border border-sky-500/20";
      case "Zoho CRM":
        return "bg-red-500/10 text-red-400 border border-red-500/20";
      default:
        return "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20";
    }
  };

  const getStageStyle = (stage: string) => {
    switch (stage) {
      case "Won":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "Proposal":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      default:
        return "bg-white/5 text-white/60 border border-white/10";
    }
  };

  return (
    <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-6 flex flex-col h-[400px] justify-between select-none font-sans relative overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />

      <h3 className="text-sm font-semibold text-white/90 relative z-10">Recent leads</h3>

      <div className="flex-grow overflow-y-auto my-3 relative z-10 pr-1 space-y-2.5 max-h-[270px] scrollbar-thin">
        {mockLeads.map((lead, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between text-xs py-1.5 border-b border-white/[0.02] last:border-b-0 hover:bg-white/[0.01] rounded px-1.5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white/85">{lead.name}</span>
              {(() => {
                const tool = TOOLS.find((t) => t.name.toLowerCase() === lead.source.toLowerCase());
                return tool?.logo ? (
                  <img
                    src={tool.logo}
                    alt={lead.source}
                    className="w-4 h-4 object-contain opacity-85 hover:opacity-100 transition-opacity"
                    title={lead.source}
                  />
                ) : (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${getSourceStyle(lead.source)}`}>
                    {lead.source}
                  </span>
                );
              })()}
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${getStageStyle(lead.stage)}`}>
                {lead.stage}
              </span>
              <span className="text-[10px] text-white/30 font-medium">{lead.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-white/[0.04] relative z-10 flex justify-end">
        <Link
          href="/dashboard/leads"
          className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View all leads →
        </Link>
      </div>
    </div>
  );
}

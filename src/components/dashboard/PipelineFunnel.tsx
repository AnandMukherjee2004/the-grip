"use client";

import EmptyState from "./EmptyState";
import { PipelineIcon } from "@/components/ui/Icons";

interface PipelineFunnelProps {
  connectedTools: string[];
}

interface FunnelStage {
  name: string;
  count: number;
  value: string;
}

const mockStages: FunnelStage[] = [
  { name: "Lead", count: 450, value: "₹90.4L" },
  { name: "Qualified", count: 220, value: "₹58.2L" },
  { name: "Demo", count: 110, value: "₹32.0L" },
  { name: "Proposal", count: 55, value: "₹18.5L" },
  { name: "Won", count: 30, value: "₹12.0L" },
];

export default function PipelineFunnel({ connectedTools }: PipelineFunnelProps) {
  const isCrmConnected = connectedTools.some((t) =>
    ["hubspot", "salesforce", "leadsquared", "freshsales", "zoho-crm", "pipedrive"].includes(t)
  );

  if (!isCrmConnected) {
    return (
      <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-6 h-[400px] flex flex-col justify-between">
        <h3 className="text-sm font-semibold text-white/90">Pipeline</h3>
        <div className="flex-grow flex items-center justify-center">
          <EmptyState
            title="Connect a CRM to see your pipeline"
            description="Integrate HubSpot, Salesforce, Zoho, or LeadSquared to sync CRM pipelines and deal values automatically."
            icon={<PipelineIcon size={28} className="text-white/60" />}
          />
        </div>
      </div>
    );
  }

  const maxCount = mockStages[0].count; // Leads is highest count

  return (
    <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-6 flex flex-col h-[400px] select-none font-sans relative overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />

      <h3 className="text-sm font-semibold text-white/90 mb-5">Pipeline</h3>

      <div className="flex-grow flex flex-col justify-between py-2">
        {mockStages.map((stage, idx) => {
          const widthPct = (stage.count / maxCount) * 100;
          return (
            <div key={stage.name} className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold">
                <span className="text-white/60 flex items-center gap-1.5">
                  <span className="text-white/30 text-[9px]">0{idx + 1}</span>
                  {stage.name}
                </span>
                <span className="text-white/80">
                  {stage.count} deals <span className="text-white/30">·</span> {stage.value}
                </span>
              </div>
              
              <div className="w-full h-5 rounded bg-white/[0.02] border border-white/[0.04] overflow-hidden relative group">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600/40 to-sky-500/30 border-r border-sky-400/30 rounded-l transition-all duration-1000 ease-out"
                  style={{ width: `${widthPct}%` }}
                />
                <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

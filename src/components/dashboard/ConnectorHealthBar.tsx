"use client";

import Link from "next/link";
import { TOOLS } from "@/lib/tools";

interface ConnectorHealthBarProps {
  connectedTools: string[];
}

export default function ConnectorHealthBar({ connectedTools }: ConnectorHealthBarProps) {
  // Map connected tool IDs to their tool configs
  const activeTools = TOOLS.filter((t) => connectedTools.includes(t.id));

  // Determine status dot and minutes ago for a mock tool
  const getToolSyncStatus = (toolId: string) => {
    switch (toolId) {
      case "hubspot":
        return { status: "green", mins: 12 };
      case "stripe":
        return { status: "yellow", mins: 74 };
      case "zoho-crm":
        return { status: "red", mins: 140 }; // Sync error
      case "razorpay":
        return { status: "green", mins: 5 };
      case "shopify":
        return { status: "green", mins: 28 };
      default:
        return { status: "green", mins: 15 };
    }
  };

  return (
    <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-4 select-none font-sans relative overflow-hidden flex flex-col gap-3 w-full">
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/[0.01] to-transparent pointer-events-none" />

      <h4 className="text-[11px] uppercase tracking-wider font-bold text-[#70709a]">
        Connected Tools & Sync Health
      </h4>

      <div className="flex flex-wrap items-center gap-2">
        {activeTools.length === 0 ? (
          <span className="text-xs text-white/30 font-medium py-1">
            No tools connected yet. Connect tools to start synchronizing data.
          </span>
        ) : (
          activeTools.map((tool) => {
            const { status, mins } = getToolSyncStatus(tool.id);
            return (
              <div
                key={tool.id}
                className="relative group flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-help"
              >
                <span className="text-sm select-none">{tool.icon}</span>
                <span className="text-xs font-semibold text-white/80">{tool.name}</span>
                
                {/* Sync status dot */}
                <span
                  className={`w-2.5 h-2.5 rounded-full border border-black/20 ${
                    status === "green"
                      ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"
                      : status === "yellow"
                        ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                        : "bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                  }`}
                />

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-36 text-center bg-[#07070e] border border-white/15 rounded p-1 text-[10px] text-white/80 shadow-2xl pointer-events-none z-20">
                  {status === "green"
                    ? `Synced ${mins}m ago`
                    : status === "yellow"
                      ? `Last sync: ${mins}m ago`
                      : "Sync error detected"}
                </div>
              </div>
            );
          })
        )}

        {/* Add Connector Button */}
        <Link
          href="/dashboard/connectors"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 hover:border-indigo-500/40 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-all active:scale-[0.98] cursor-pointer"
        >
          <span>+</span>
          <span>Add Connector</span>
        </Link>
      </div>
    </div>
  );
}

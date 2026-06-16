"use client";

import { useState, useEffect } from "react";
import { Tool } from "@/types/onboarding";
import { SYNC_THRESHOLDS } from "@/lib/constants";

interface ConnectedToolCardProps {
  toolId: string;
  tool: Tool;
  lastSyncedAt?: string;
  status?: "synced" | "error";
  onSyncNow: (toolId: string) => Promise<void>;
  onDisconnect: (toolId: string) => void;
}

export function ConnectedToolCard({
  toolId,
  tool,
  lastSyncedAt,
  status,
  onSyncNow,
  onDisconnect,
}: ConnectedToolCardProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  // Re-calculate the relative text dynamically based on interval ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  // Format category name nicely
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "crm":
        return "CRM";
      case "payments":
        return "Payments";
      case "ecommerce":
        return "E-commerce";
      case "communication":
        return "Communication";
      case "ads":
        return "Ads";
      case "accounting":
        return "Accounting";
      default:
        return cat.charAt(0).toUpperCase() + cat.slice(1);
    }
  };

  // Compute status details
  let relativeText = "Never synced";
  let statusColor: "green" | "yellow" | "red" = "red";

  if (lastSyncedAt) {
    const diffMs = now - new Date(lastSyncedAt).getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));

    if (status === "error" || diffMins >= SYNC_THRESHOLDS.STALE_MAX_MINUTES) {
      relativeText = "Sync error";
      statusColor = "red";
    } else if (diffMins >= SYNC_THRESHOLDS.HEALTHY_MAX_MINUTES) {
      const hours = Math.floor(diffMins / 60);
      relativeText = `Synced ${hours} hour${hours > 1 ? "s" : ""} ago`;
      statusColor = "yellow";
    } else {
      relativeText =
        diffMins === 0
          ? "Synced just now"
          : `Synced ${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
      statusColor = "green";
    }
  }

  const handleSyncClick = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      // TODO: wire to sync endpoint
      await onSyncNow(toolId);
    } finally {
      setIsSyncing(false);
    }
  };

  const formattedAbsoluteDate = lastSyncedAt
    ? new Date(lastSyncedAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "Never";

  return (
    <div className="group relative flex flex-col justify-between p-5 rounded-xl border border-white/5 bg-[#0e0e1a]/40 shadow-none backdrop-blur-md transition-all duration-300 hover:border-white/10 select-none">
      {/* Top row: Logo & Category */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          {tool.logo ? (
            <img
              src={tool.logo}
              alt={tool.name}
              className="h-8 w-auto max-w-[90px] object-contain select-none"
            />
          ) : (
            <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-lg">
              {tool.icon}
            </div>
          )}
          <div>
            <h3 className="text-white font-bold text-sm tracking-tight leading-snug">
              {tool.name}
            </h3>
            <span className="text-[10px] text-white/40 font-medium">
              {getCategoryLabel(tool.category)}
            </span>
          </div>
        </div>

        {/* Sync Status Row (green/yellow/red dot) */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/[0.02] border border-white/[0.03]">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              statusColor === "green"
                ? "bg-[#1D9E75] shadow-[0_0_8px_rgba(29,158,117,0.5)]"
                : statusColor === "yellow"
                ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
            }`}
          />
          <span className="text-[10px] font-semibold text-white/70">{relativeText}</span>
        </div>
      </div>

      {/* Middle info: last sync absolute time */}
      <div className="flex-grow flex items-end mb-4">
        <p className="text-[10px] text-white/30 font-medium">
          Last sync: <span className="text-white/40">{formattedAbsoluteDate}</span>
        </p>
      </div>

      {/* Card bottom buttons */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onDisconnect(toolId)}
          className="text-xs text-white/40 hover:text-rose-400 transition-colors font-semibold cursor-pointer"
        >
          Disconnect
        </button>

        <button
          type="button"
          disabled={isSyncing}
          onClick={handleSyncClick}
          className="connector-sync-btn h-8 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSyncing ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Syncing...</span>
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
              <span>Sync now</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

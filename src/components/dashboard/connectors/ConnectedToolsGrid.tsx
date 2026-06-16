"use client";

import { ConnectedToolCard } from "./ConnectedToolCard";
import { TOOLS } from "@/lib/tools";

interface ConnectedToolsGridProps {
  connectedTools: string[];
  syncInfo: Record<string, { lastSyncedAt?: string; status?: "synced" | "error" }>;
  onSyncNow: (toolId: string) => Promise<void>;
  onDisconnectClick: (toolId: string) => void;
}

export function ConnectedToolsGrid({
  connectedTools,
  syncInfo,
  onSyncNow,
  onDisconnectClick,
}: ConnectedToolsGridProps) {
  const connectedCount = connectedTools.length;

  return (
    <section className="space-y-4">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white tracking-tight">Connected tools</h2>
        <span className="h-5 px-2.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold flex items-center justify-center select-none">
          {connectedCount} {connectedCount === 1 ? "tool" : "tools"} connected
        </span>
      </div>

      {/* Grid Content / Empty State */}
      {connectedCount === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 py-16 rounded-xl border border-white/5 bg-[#0e0e1a]/20 text-center select-none">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/40 text-xl mb-4">
            🔌
          </div>
          <h3 className="text-white font-bold text-sm tracking-tight mb-1">
            No tools connected yet
          </h3>
          <p className="text-white/40 text-xs max-w-xs mx-auto mb-6 leading-relaxed">
            Add your first tool below to start syncing data
          </p>
          <div className="text-indigo-400 text-lg animate-bounce" aria-hidden="true">
            ↓
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {connectedTools.map((toolId) => {
            const tool = TOOLS.find((t) => t.id === toolId) || {
              id: toolId,
              name: toolId.charAt(0).toUpperCase() + toolId.slice(1).replace("-", " "),
              category: "crm" as const,
              description: "Sync custom data and pipeline stages.",
              icon: "🔌",
            };
            const details = syncInfo[toolId] || {};

            return (
              <ConnectedToolCard
                key={toolId}
                toolId={toolId}
                tool={tool}
                lastSyncedAt={details.lastSyncedAt}
                status={details.status}
                onSyncNow={onSyncNow}
                onDisconnect={onDisconnectClick}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

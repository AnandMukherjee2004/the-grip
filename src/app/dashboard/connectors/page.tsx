"use client";

import { useState } from "react";
import { useOnboarding } from "@/context/OnboardingContext";
import TopBar, { DEFAULT_DATE_RANGE } from "@/components/layout/TopBar";
import type { DateRangeSelection } from "@/lib/dateRange";
import { ConnectedToolsGrid } from "@/components/dashboard/connectors/ConnectedToolsGrid";
import { AvailableToolsGrid } from "@/components/dashboard/connectors/AvailableToolsGrid";
import { DisconnectModal } from "@/components/dashboard/connectors/DisconnectModal";
import { TOOLS } from "@/lib/tools";
import { Tool } from "@/types/onboarding";

export default function ConnectorsPage() {
  const {
    connectedTools,
    setConnectedTools,
    syncInfo,
    updateSyncInfo,
  } = useOnboarding();

  const [dateRange, setDateRange] = useState<DateRangeSelection>(DEFAULT_DATE_RANGE);
  const [disconnectTool, setDisconnectTool] = useState<Tool | null>(null);

  // Sync now mock action
  const handleSyncNow = async (toolId: string) => {
    // TODO: wire to sync endpoint
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        updateSyncInfo(toolId, {
          lastSyncedAt: new Date().toISOString(),
          status: "synced",
        });
        resolve();
      }, 1000);
    });
  };

  // Disconnect confirmation modal triggers
  const handleDisconnectClick = (toolId: string) => {
    const tool = TOOLS.find((t) => t.id === toolId) || {
      id: toolId,
      name: toolId.charAt(0).toUpperCase() + toolId.slice(1).replace("-", " "),
      category: "crm" as const,
      description: "Sync custom data and pipeline stages.",
      icon: "🔌",
    };
    setDisconnectTool(tool);
  };

  // Disconnect confirmed
  const handleDisconnectConfirm = async () => {
    if (!disconnectTool) return;
    const toolId = disconnectTool.id;

    // TODO: wire to disconnect endpoint
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        // Remove from connectedTools in context
        setConnectedTools(connectedTools.filter((id) => id !== toolId));
        // Reset sync state in syncInfo
        updateSyncInfo(toolId, {
          lastSyncedAt: undefined,
          status: undefined,
        });
        resolve();
      }, 500);
    });
  };

  // Connect new tool action
  const handleConnect = async (toolId: string) => {
    // Add to connectedTools list
    if (!connectedTools.includes(toolId)) {
      setConnectedTools([...connectedTools, toolId]);
    }
    // Set healthy initial sync state
    updateSyncInfo(toolId, {
      lastSyncedAt: new Date().toISOString(),
      status: "synced",
    });
  };

  return (
    <div className="flex-grow flex flex-col h-full overflow-hidden bg-[#040409]">
      <TopBar dateRange={dateRange} onDateRangeChange={setDateRange} />

      {/* Main content scrollable area */}
      <main className="flex-grow overflow-y-auto p-6 space-y-8 scrollbar-thin">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Description */}
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-white tracking-tight">Connectors</h1>
            <p className="text-white/40 text-xs">
              Manage data ingestion sources and credentials. Synced data is refreshed in the background automatically.
            </p>
          </div>

          {/* Section 1: Connected Tools */}
          <ConnectedToolsGrid
            connectedTools={connectedTools}
            syncInfo={syncInfo}
            onSyncNow={handleSyncNow}
            onDisconnectClick={handleDisconnectClick}
          />

          {/* Section 2: Available Tools to Add */}
          <AvailableToolsGrid
            connectedTools={connectedTools}
            onConnect={handleConnect}
          />
        </div>
      </main>

      {/* Disconnect Confirmation Modal */}
      {disconnectTool && (
        <DisconnectModal
          tool={disconnectTool}
          isOpen={!!disconnectTool}
          onClose={() => setDisconnectTool(null)}
          onConfirm={handleDisconnectConfirm}
        />
      )}
    </div>
  );
}

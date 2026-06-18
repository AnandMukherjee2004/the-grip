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
import { API_URL } from "@/lib/api";
import { CONNECTORS } from "@/lib/connectors";
import { APIKeyModal } from "@/components/onboarding/APIKeyModal";

export default function ConnectorsPage() {
  const {
    connectedTools,
    setConnectedTools,
    syncInfo,
    updateSyncInfo,
    activeWorkspaceId: workspaceId,
  } = useOnboarding();

  const [dateRange, setDateRange] = useState<DateRangeSelection>(DEFAULT_DATE_RANGE);
  const [disconnectTool, setDisconnectTool] = useState<Tool | null>(null);
  const [modalToolId, setModalToolId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

    try {
      const response = await fetch(`${API_URL}/api/v1/connectors?workspaceId=${workspaceId}&toolId=${toolId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove from connectedTools in context
        setConnectedTools(connectedTools.filter((id) => id !== toolId));
        // Reset sync state in syncInfo
        updateSyncInfo(toolId, {
          lastSyncedAt: undefined,
          status: undefined,
        });
      } else {
        console.error("Failed to disconnect tool from DB");
      }
    } catch (error) {
      console.error("Failed to disconnect tool:", error);
    }
    setDisconnectTool(null);
  };

  const handleConnectClick = async (toolId: string) => {
    setModalToolId(toolId);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (credentials: Record<string, string>) => {
    if (!modalToolId) return;

    const response = await fetch(`${API_URL}/api/v1/connectors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workspaceId: workspaceId || "placeholder_workspace_id",
        toolId: modalToolId,
        credentials,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || "Failed to connect. Please check credentials and try again.");
    }

    // Add to connectedTools list
    if (!connectedTools.includes(modalToolId)) {
      setConnectedTools([...connectedTools, modalToolId]);
    }
    // Set healthy initial sync state
    updateSyncInfo(modalToolId, {
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
            onConnect={handleConnectClick}
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

      {/* API Key Modal */}
      {isModalOpen && modalToolId && (
        <APIKeyModal
          tool={TOOLS.find((t) => t.id === modalToolId) || {
            id: modalToolId,
            name: modalToolId.charAt(0).toUpperCase() + modalToolId.slice(1).replace("-", " "),
            category: "crm" as const,
            description: "Sync custom data and pipeline stages.",
            icon: "🔌",
          }}
          toolId={modalToolId}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}

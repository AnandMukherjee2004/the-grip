"use client";

import { ConnectorConfig, ConnectorStatus } from "@/types/onboarding";
import { ConnectorCard } from "./ConnectorCard";

interface ConnectorGridProps {
  selectedTools: string[];
  connectorsConfig: Record<string, ConnectorConfig>;
  statuses: Record<string, ConnectorStatus>;
  onConnect: (toolId: string) => void;
  onSkip: (toolId: string) => void;
  onDisconnect: (toolId: string) => void;
}

export function ConnectorGrid({
  selectedTools,
  connectorsConfig,
  statuses,
  onConnect,
  onSkip,
  onDisconnect,
}: ConnectorGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto py-2">
      {selectedTools.map((toolId, index) => {
        const config = connectorsConfig[toolId] || {
          toolId,
          authMethod: "oauth" as const,
        };
        const status = statuses[toolId] || "idle";

        return (
          <div
            key={toolId}
            className="animate-fadeIn opacity-0"
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: "forwards",
            }}
          >
            <ConnectorCard
              toolId={toolId}
              config={config}
              status={status}
              onConnect={onConnect}
              onSkip={onSkip}
              onDisconnect={onDisconnect}
            />
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useState } from "react";
import { ConnectorConfig, ConnectorStatus } from "@/types/onboarding";
import { ConnectorCard } from "./ConnectorCard";

type ModalView = "choice" | "apikey";

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
  const [modalState, setModalState] = useState<{ toolId: string; view: ModalView } | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto py-2">
      {selectedTools.map((toolId) => {
        const config = connectorsConfig[toolId] || {
          toolId,
          authMethod: "oauth" as const,
        };
        const status = statuses[toolId] || "idle";

        return (
          <div key={toolId} className="min-h-[210px]">
            <ConnectorCard
              toolId={toolId}
              config={config}
              status={status}
              onConnect={onConnect}
              onSkip={onSkip}
              onDisconnect={onDisconnect}
              modalView={modalState?.toolId === toolId ? modalState.view : null}
              onOpenChoice={() => setModalState({ toolId, view: "choice" })}
              onOpenApiKey={() => setModalState({ toolId, view: "apikey" })}
              onCloseModal={() => setModalState(null)}
            />
          </div>
        );
      })}
    </div>
  );
}

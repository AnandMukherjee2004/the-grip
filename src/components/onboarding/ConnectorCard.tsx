"use client";

import { ConnectorConfig, ConnectorStatus } from "@/types/onboarding";
import { TOOLS } from "@/lib/tools";
import { APIKeyModal } from "./APIKeyModal";
import { AuthMethodModal } from "./AuthMethodModal";
import { API_URL } from "@/lib/api";

interface ConnectorCardProps {
  toolId: string;
  config: ConnectorConfig;
  status: ConnectorStatus;
  onConnect: (toolId: string) => void;
  onSkip: (toolId: string) => void;
  onDisconnect?: (toolId: string) => void;
  modalView: "choice" | "apikey" | null;
  onOpenChoice: () => void;
  onOpenApiKey: () => void;
  onCloseModal: () => void;
}

export function ConnectorCard({
  toolId,
  config,
  status,
  onConnect,
  onSkip,
  onDisconnect,
  modalView,
  onOpenChoice,
  onOpenApiKey,
  onCloseModal,
}: ConnectorCardProps) {
  const tool = TOOLS.find((t) => t.id === toolId) || {
    id: toolId,
    name: toolId.charAt(0).toUpperCase() + toolId.slice(1).replace("-", " "),
    category: "crm" as const,
    description: "Sync custom data and pipeline stages.",
    icon: "🔌",
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "crm":
        return "CRM / Sales";
      case "payments":
        return "Payments";
      case "ecommerce":
        return "E-commerce";
      case "communication":
        return "Communication";
      default:
        return cat;
    }
  };

  const handleSelectOAuth = () => {
    onCloseModal();
    onConnect(toolId);
  };

  const handleSelectAPIKey = () => {
    onOpenApiKey();
  };

  const handleModalSubmit = async (credentials: Record<string, string>) => {
    const workspaceId = localStorage.getItem("grip_workspace_id");
    if (!workspaceId) {
      throw new Error("No active workspace found in local storage.");
    }

    const res = await fetch(`${API_URL}/api/v1/connectors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workspaceId,
        toolId,
        credentials,
      }),
    });

    if (res.status !== 201) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Failed to connect. Please check credentials and try again.");
    }

    onConnect(toolId);
  };

  let cardStyles = "border-white/5 bg-[#0e0e1a]/40 shadow-none";
  if (status === "connected") {
    cardStyles = "border-[#1D9E75] bg-[#0c1514]/40 shadow-[0_0_20px_rgba(29,158,117,0.15)]";
  } else if (status === "connecting") {
    cardStyles = "border-purple-500/50 bg-[#0e0e1a]/40 animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.15)]";
  } else if (status === "error") {
    cardStyles = "border-rose-500/40 bg-[#140b0d]/40 shadow-[0_0_15px_rgba(244,63,94,0.1)]";
  } else if (status === "skipped") {
    cardStyles = "border-white/5 bg-[#0e0e1a]/20 opacity-50 shadow-none";
  }

  return (
    <>
      <div
        className={`group relative flex flex-col justify-between p-5 rounded-xl border backdrop-blur-md transition-all duration-300 min-h-[210px] overflow-hidden select-none ${cardStyles}`}
      >
        <div className="flex justify-between items-start mb-2">
          {tool.logo ? (
            <img
              src={tool.logo}
              alt={tool.name}
              className="h-7 w-auto max-w-[100px] object-contain select-none"
            />
          ) : (
            <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-lg">
              {tool.icon}
            </div>
          )}

          {status === "connected" && (
            <div className="w-5 h-5 flex items-center justify-center rounded-full bg-[#1D9E75] text-white shadow-[0_0_8px_rgba(29,158,117,0.4)]">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex-grow">
          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="text-white font-semibold text-sm tracking-tight">
              {tool.name}
            </h3>
            {status === "connected" && (
              <span className="text-[9px] font-bold text-[#1D9E75] bg-[#1d9e75]/10 px-1.5 py-0.5 rounded border border-[#1d9e75]/20">
                Connected
              </span>
            )}
            {status === "skipped" && (
              <span className="text-[9px] font-bold text-white/40 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                Skipped
              </span>
            )}
          </div>
          <p className="text-white/40 text-[11px] line-clamp-2 leading-relaxed group-hover:text-white/50 transition-colors">
            {tool.description || "Sync your leads, contacts, and stages."}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between h-8">
          <span className="text-[8px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-white/5 text-white/40 border border-white/5">
            {getCategoryLabel(tool.category)}
          </span>

          <div className="flex items-center gap-3">
            {status === "idle" && (
              <>
                <button
                  type="button"
                  onClick={() => onSkip(toolId)}
                  className="text-[11px] text-white/45 hover:text-white transition-colors"
                >
                  Skip
                </button>
                <button
                  type="button"
                  onClick={onOpenChoice}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-[11px] hover:opacity-95 active:scale-[0.98] transition-all shadow-[0_0_12px_rgba(124,58,237,0.25)] flex items-center gap-1 cursor-pointer"
                >
                  Connect {config.connectTime && <span className="opacity-60 text-[9px] font-normal">({config.connectTime})</span>}
                </button>
              </>
            )}

            {status === "connecting" && (
              <div className="flex items-center gap-1.5 text-xs text-purple-400 font-semibold">
                <svg className="animate-spin h-3 w-3 text-purple-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-[10px]">Connecting...</span>
              </div>
            )}

            {status === "connected" && onDisconnect && (
              <button
                type="button"
                onClick={() => onDisconnect(toolId)}
                className="text-[10px] text-white/30 hover:text-rose-400 transition-colors font-medium cursor-pointer"
              >
                Disconnect
              </button>
            )}

            {status === "error" && (
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-rose-400 font-medium">Failed</span>
                <button
                  type="button"
                  onClick={onOpenChoice}
                  className="px-2.5 py-1.2 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 font-bold text-[10px] hover:bg-rose-500/20 transition-all cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            )}

            {status === "skipped" && (
              <button
                type="button"
                onClick={onOpenChoice}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors font-semibold cursor-pointer"
              >
                Connect now
              </button>
            )}
          </div>
        </div>

        {status === "error" && (
          <div className="absolute inset-x-0 bottom-0 bg-rose-950/80 border-t border-rose-900/50 px-5 py-1 text-center">
            <span className="text-[8px] text-rose-300 font-semibold">
              Connection failed. Check credentials and try again.
            </span>
          </div>
        )}
      </div>

      {modalView === "choice" && (
        <AuthMethodModal
          toolName={tool.name}
          toolLogo={tool.logo}
          toolIcon={tool.icon}
          isOpen
          onClose={onCloseModal}
          onSelectOAuth={handleSelectOAuth}
          onSelectAPIKey={handleSelectAPIKey}
        />
      )}

      {modalView === "apikey" && (
        <APIKeyModal
          tool={tool}
          toolId={toolId}
          isOpen
          onClose={onCloseModal}
          onSubmit={handleModalSubmit}
        />
      )}
    </>
  );
}

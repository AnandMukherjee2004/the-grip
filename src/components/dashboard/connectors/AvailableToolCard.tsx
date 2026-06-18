"use client";

import { useState } from "react";
import { Tool, ConnectorConfig } from "@/types/onboarding";
import { APIKeyModal } from "@/components/onboarding/APIKeyModal";
import { CONNECTORS } from "@/lib/connectors";

interface AvailableToolCardProps {
  tool: Tool;
  isConnected: boolean;
  onConnect: (toolId: string) => Promise<void>;
}

export function AvailableToolCard({
  tool,
  isConnected,
  onConnect,
}: AvailableToolCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Retrieve or build connector config
  const config: ConnectorConfig = CONNECTORS[tool.id] || {
    toolId: tool.id,
    authMethod: tool.category === "ads" || tool.id === "zoho-books" ? "oauth" : "apikey",
    apiKeyLabel: "API Key",
    docsUrl: "https://docs.grip.dev",
  };

  const handleConnectClick = async () => {
    if (isConnected || isConnecting) return;

    if (config.authMethod === "oauth") {
      setIsConnecting(true);
      try {
        // Simulate OAuth handshake redirect/completion delay (1.5 seconds)
        await new Promise((resolve) => setTimeout(resolve, 1500));
        await onConnect(tool.id);
      } finally {
        setIsConnecting(false);
      }
    } else {
      await onConnect(tool.id);
    }
  };

  const getCategoryBadgeLabel = (cat: string) => {
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
        return cat.toUpperCase();
    }
  };

  // Border & background based on connection status
  const cardStyles = isConnected
    ? "border-[#1D9E75]/30 bg-[#0c1514]/30 shadow-[0_0_15px_rgba(29,158,117,0.05)]"
    : "border-white/5 bg-[#0e0e1a]/40 hover:border-white/10 hover:bg-[#0e0e1a]/60";

  return (
    <div
      className={`group relative flex flex-col justify-between p-5 rounded-xl border backdrop-blur-md transition-all duration-300 select-none ${cardStyles}`}
    >
      {/* Top: Logo & Category Tag */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          {tool.logo ? (
            <img
              src={tool.logo}
              alt={tool.name}
              className="h-7 w-auto max-w-[85px] object-contain select-none"
            />
          ) : (
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-base">
              {tool.icon}
            </div>
          )}
          <div>
            <h3 className="text-white font-bold text-xs tracking-tight">
              {tool.name}
            </h3>
            <span className="text-[9px] text-white/30 font-medium">
              {getCategoryBadgeLabel(tool.category)}
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Description */}
      <div className="flex-grow my-2">
        <p className="text-white/40 text-[11px] leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>

      {/* Bottom CTA Row */}
      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-end">
        {isConnected ? (
          <span className="h-7 px-2.5 rounded-lg bg-[#1d9e75]/10 border border-[#1d9e75]/20 text-[#1D9E75] font-bold text-[10px] flex items-center justify-center select-none">
            Connected
          </span>
        ) : (
          <button
            type="button"
            disabled={isConnecting}
            onClick={handleConnectClick}
            className="connector-connect-btn h-7 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-medium text-[10px] transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnecting ? (
              <>
                <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Connecting...</span>
              </>
            ) : (
              <span>Connect</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

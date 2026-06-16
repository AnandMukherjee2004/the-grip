"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SyncDetails {
  lastSyncedAt?: string;
  status?: 'synced' | 'error';
}

interface OnboardingContextType {
  selectedTools: string[];
  setSelectedTools: (tools: string[]) => void;
  connectedTools: string[];
  setConnectedTools: (tools: string[]) => void;
  syncInfo: Record<string, SyncDetails>;
  setSyncInfo: (info: Record<string, SyncDetails>) => void;
  updateSyncInfo: (toolId: string, details: SyncDetails) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [selectedTools, setSelectedToolsState] = useState<string[]>([]);
  const [connectedTools, setConnectedToolsState] = useState<string[]>([]);
  const [syncInfo, setSyncInfoState] = useState<Record<string, SyncDetails>>({});

  useEffect(() => {
    const savedSelected = localStorage.getItem("grip_selected_tools");
    const savedConnected = localStorage.getItem("grip_connected_tools");
    const savedSyncInfo = localStorage.getItem("grip_connectors_sync_info");
    
    // Defer state updates to avoid synchronous setState inside useEffect warning
    setTimeout(() => {
      if (savedSelected) {
        try {
          setSelectedToolsState(JSON.parse(savedSelected));
        } catch (e) {
          console.error("Failed to parse saved selected tools", e);
        }
      } else {
        // Initialize default selected tools
        const defaultSelected = ["hubspot", "razorpay", "shopify"];
        setSelectedToolsState(defaultSelected);
        localStorage.setItem("grip_selected_tools", JSON.stringify(defaultSelected));
      }

      if (savedConnected) {
        try {
          setConnectedToolsState(JSON.parse(savedConnected));
        } catch (e) {
          console.error("Failed to parse saved connected tools", e);
        }
      } else {
        // Mock 2-3 connected tools initially
        const defaultConnected = ["hubspot", "razorpay", "shopify"];
        setConnectedToolsState(defaultConnected);
        localStorage.setItem("grip_connected_tools", JSON.stringify(defaultConnected));
      }

      if (savedSyncInfo) {
        try {
          setSyncInfoState(JSON.parse(savedSyncInfo));
        } catch (e) {
          console.error("Failed to parse saved sync info", e);
        }
      } else {
        // Initialize mock sync info
        const now = Date.now();
        const defaultSyncInfo: Record<string, SyncDetails> = {
          hubspot: {
            lastSyncedAt: new Date(now - 25 * 60 * 1000).toISOString(), // 25 min ago (Healthy)
            status: "synced",
          },
          razorpay: {
            lastSyncedAt: new Date(now - 150 * 60 * 1000).toISOString(), // 2.5 hours ago (Stale)
            status: "synced",
          },
          shopify: {
            lastSyncedAt: new Date(now - 8 * 60 * 1000).toISOString(), // 8 min ago (Healthy)
            status: "synced",
          },
        };
        setSyncInfoState(defaultSyncInfo);
        localStorage.setItem("grip_connectors_sync_info", JSON.stringify(defaultSyncInfo));
      }
    }, 0);
  }, []);

  const setSelectedTools = (tools: string[]) => {
    setSelectedToolsState(tools);
    localStorage.setItem("grip_selected_tools", JSON.stringify(tools));
  };

  const setConnectedTools = (tools: string[]) => {
    setConnectedToolsState(tools);
    localStorage.setItem("grip_connected_tools", JSON.stringify(tools));
  };

  const setSyncInfo = (info: Record<string, SyncDetails>) => {
    setSyncInfoState(info);
    localStorage.setItem("grip_connectors_sync_info", JSON.stringify(info));
  };

  const updateSyncInfo = (toolId: string, details: SyncDetails) => {
    setSyncInfoState((prev) => {
      const updated = {
        ...prev,
        [toolId]: {
          ...prev[toolId],
          ...details,
        },
      };
      localStorage.setItem("grip_connectors_sync_info", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <OnboardingContext.Provider
      value={{
        selectedTools,
        setSelectedTools,
        connectedTools,
        setConnectedTools,
        syncInfo,
        setSyncInfo,
        updateSyncInfo,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}

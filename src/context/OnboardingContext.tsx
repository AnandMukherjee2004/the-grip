"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Workspace {
  id: string;
  name: string;
}

export interface SyncDetails {
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
  
  // Workspace specific additions
  workspaces: Workspace[];
  activeWorkspaceId: string;
  setActiveWorkspaceId: (id: string) => void;
  createWorkspace: (name: string) => void;
  updateWorkspaceName: (id: string, name: string) => void;
  
  // Organization and Workspace database identifiers
  orgId: string;
  setOrgId: (id: string) => void;
  workspaceId: string;
  setWorkspaceId: (id: string) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    { id: "frido", name: "Frido" }
  ]);
  const [activeWorkspaceId, setActiveWorkspaceIdState] = useState<string>("frido");
  
  const [selectedTools, setSelectedToolsState] = useState<string[]>([]);
  const [connectedTools, setConnectedToolsState] = useState<string[]>([]);
  const [syncInfo, setSyncInfoState] = useState<Record<string, SyncDetails>>({});

  const [orgId, setOrgIdState] = useState<string>("");
  const [workspaceId, setWorkspaceIdState] = useState<string>("frido");

  // Load orgId and workspaceId from localStorage on init
  useEffect(() => {
    const savedOrgId = localStorage.getItem("grip_org_id");
    const savedWorkspaceId = localStorage.getItem("grip_workspace_id");
    if (savedOrgId) setOrgIdState(savedOrgId);
    if (savedWorkspaceId) setWorkspaceIdState(savedWorkspaceId);
  }, []);

  // 1. Initial load of Workspaces and Active workspace ID
  useEffect(() => {
    // Force active workspace to be "frido"
    setActiveWorkspaceIdState("frido");
    localStorage.setItem("grip_active_workspace_id", "frido");

    const defaultWorkspaces = [{ id: "frido", name: "Frido" }];
    setWorkspaces(defaultWorkspaces);
    localStorage.setItem("grip_workspaces", JSON.stringify(defaultWorkspaces));
  }, []);

  // 2. Load workspace specific details when activeWorkspaceId changes
  useEffect(() => {
    if (!activeWorkspaceId) return;

    const savedSelected = localStorage.getItem(`grip_selected_tools_${activeWorkspaceId}`);
    const savedConnected = localStorage.getItem(`grip_connected_tools_${activeWorkspaceId}`);
    const savedSyncInfo = localStorage.getItem(`grip_connectors_sync_info_${activeWorkspaceId}`);

    if (savedSelected) {
      try {
        setSelectedToolsState(JSON.parse(savedSelected));
      } catch (e) {
        console.error("Failed to parse saved selected tools", e);
      }
    } else {
      const defaultSelected = ["shopify", "razorpay"];
      setSelectedToolsState(defaultSelected);
      localStorage.setItem(`grip_selected_tools_${activeWorkspaceId}`, JSON.stringify(defaultSelected));
    }

    if (savedConnected) {
      try {
        setConnectedToolsState(JSON.parse(savedConnected));
      } catch (e) {
        console.error("Failed to parse saved connected tools", e);
      }
    } else {
      const defaultConnected = ["shopify", "razorpay"];
      setConnectedToolsState(defaultConnected);
      localStorage.setItem(`grip_connected_tools_${activeWorkspaceId}`, JSON.stringify(defaultConnected));
    }

    if (savedSyncInfo) {
      try {
        setSyncInfoState(JSON.parse(savedSyncInfo));
      } catch (e) {
        console.error("Failed to parse saved sync info", e);
      }
    } else {
      const now = Date.now();
      const defaultSyncInfo: Record<string, SyncDetails> = {
        shopify: {
          lastSyncedAt: new Date(now - 12 * 60 * 1000).toISOString(),
          status: "synced",
        },
        razorpay: {
          lastSyncedAt: new Date(now - 4 * 60 * 1000).toISOString(),
          status: "synced",
        },
      };
      setSyncInfoState(defaultSyncInfo);
      localStorage.setItem(`grip_connectors_sync_info_${activeWorkspaceId}`, JSON.stringify(defaultSyncInfo));
    }
  }, [activeWorkspaceId]);

  const setSelectedTools = (tools: string[]) => {
    setSelectedToolsState(tools);
    localStorage.setItem(`grip_selected_tools_${activeWorkspaceId}`, JSON.stringify(tools));
  };

  const setConnectedTools = (tools: string[]) => {
    setConnectedToolsState(tools);
    localStorage.setItem(`grip_connected_tools_${activeWorkspaceId}`, JSON.stringify(tools));
  };

  const setSyncInfo = (info: Record<string, SyncDetails>) => {
    setSyncInfoState(info);
    localStorage.setItem(`grip_connectors_sync_info_${activeWorkspaceId}`, JSON.stringify(info));
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
      localStorage.setItem(`grip_connectors_sync_info_${activeWorkspaceId}`, JSON.stringify(updated));
      return updated;
    });
  };

  const setActiveWorkspaceId = (id: string) => {
    setActiveWorkspaceIdState(id);
    localStorage.setItem("grip_active_workspace_id", id);
  };

  const createWorkspace = (name: string) => {
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, "-") || `ws-${Date.now()}`;
    const newWorkspace = { id, name };
    const updatedWorkspaces = [...workspaces, newWorkspace];
    setWorkspaces(updatedWorkspaces);
    localStorage.setItem("grip_workspaces", JSON.stringify(updatedWorkspaces));
    setActiveWorkspaceId(id);
  };

  const updateWorkspaceName = (id: string, name: string) => {
    const updated = workspaces.map((w) => (w.id === id ? { ...w, name } : w));
    setWorkspaces(updated);
    localStorage.setItem("grip_workspaces", JSON.stringify(updated));
  };

  const setOrgId = (id: string) => {
    setOrgIdState(id);
    localStorage.setItem("grip_org_id", id);
  };

  const setWorkspaceId = (id: string) => {
    setWorkspaceIdState(id);
    localStorage.setItem("grip_workspace_id", id);
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
        workspaces,
        activeWorkspaceId,
        setActiveWorkspaceId,
        createWorkspace,
        updateWorkspaceName,
        orgId,
        setOrgId,
        workspaceId,
        setWorkspaceId,
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

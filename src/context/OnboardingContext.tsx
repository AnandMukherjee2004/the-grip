"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getConnectors, getWorkspace, getWorkspaceByUser } from "@/lib/api";
import { getSession } from "next-auth/react";

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
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceIdState] = useState<string>("");
  
  const [selectedTools, setSelectedToolsState] = useState<string[]>([]);
  const [connectedTools, setConnectedToolsState] = useState<string[]>([]);
  const [syncInfo, setSyncInfoState] = useState<Record<string, SyncDetails>>({});

  const [orgId, setOrgIdState] = useState<string>("");
  const [workspaceId, setWorkspaceIdState] = useState<string>("");

  // Load orgId and workspaceId from localStorage on init
  useEffect(() => {
    const savedOrgId = localStorage.getItem("grip_org_id");
    const savedWorkspaceId = localStorage.getItem("grip_workspace_id");
    if (savedOrgId) setOrgIdState(savedOrgId);
    if (savedWorkspaceId) {
      setWorkspaceIdState(savedWorkspaceId);
      setActiveWorkspaceIdState(savedWorkspaceId);
      
      // Hydrate connected tools from API on mount
      getConnectors(savedWorkspaceId).then((tools) => {
        setConnectedToolsState(tools);
        localStorage.setItem(`grip_connected_tools_${savedWorkspaceId}`, JSON.stringify(tools));
      });
      // Fetch workspace details from API on mount
      getWorkspace(savedWorkspaceId).then((workspace) => {
        if (workspace) {
          setWorkspaces([{ id: workspace.id, name: workspace.name }]);
          setActiveWorkspaceIdState(workspace.id);
        }
      });
    } else {
      getSession().then((session) => {
        if (session?.user?.id) {
          getWorkspaceByUser(session.user.id).then((result) => {
            if (result) {
              setOrgId(result.orgId);
              setWorkspaceId(result.workspaceId);
            }
          });
        }
      });
    }
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
      const defaultSelected: string[] = [];
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
      const defaultConnected: string[] = [];
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
      const defaultSyncInfo: Record<string, SyncDetails> = {};
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
    setActiveWorkspaceIdState(id);
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

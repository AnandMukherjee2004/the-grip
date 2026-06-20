"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { getConnectors, getWorkspace, getWorkspaceByUser } from "@/lib/api";
import {
  getUserProfileImage,
  getWorkspaceImage,
  removeUserProfileImage,
  removeWorkspaceImage,
  setUserProfileImage as persistUserProfileImage,
  setWorkspaceImage as persistWorkspaceImage,
} from "@/lib/profile-images";

export interface Workspace {
  id: string;
  name: string;
  imageUrl?: string | null;
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
  
  workspaces: Workspace[];
  activeWorkspaceId: string;
  setActiveWorkspaceId: (id: string) => void;
  createWorkspace: (name: string) => void;
  updateWorkspaceName: (id: string, name: string) => void;
  updateWorkspaceImage: (id: string, imageUrl: string | null) => void;
  userProfileImage: string | null;
  setUserProfileImage: (imageUrl: string | null) => void;

  orgId: string;
  setOrgId: (id: string) => void;
  workspaceId: string;
  setWorkspaceId: (id: string, name?: string) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceIdState] = useState<string>("");
  
  const [selectedTools, setSelectedToolsState] = useState<string[]>([]);
  const [connectedTools, setConnectedToolsState] = useState<string[]>([]);
  const [syncInfo, setSyncInfoState] = useState<Record<string, SyncDetails>>({});

  const [orgId, setOrgIdState] = useState<string>("");
  const [workspaceId, setWorkspaceIdState] = useState<string>("");
  const [userProfileImage, setUserProfileImageState] = useState<string | null>(null);

  const attachWorkspaceImages = useCallback((items: Workspace[]) => {
    return items.map((workspace) => ({
      ...workspace,
      imageUrl: getWorkspaceImage(workspace.id) ?? workspace.imageUrl ?? null,
    }));
  }, []);

  const hydrateUserWorkspace = useCallback(async (userId: string) => {
    try {
      const result = await getWorkspaceByUser(userId);
      if (!result) return;

      setOrgIdState(result.orgId);
      setWorkspaceIdState(result.workspaceId);
      setActiveWorkspaceIdState(result.workspaceId);
      localStorage.setItem("grip_org_id", result.orgId);
      localStorage.setItem("grip_workspace_id", result.workspaceId);

      let workspaceName = result.workspaceName;
      if (!workspaceName) {
        const workspace = await getWorkspace(result.workspaceId);
        workspaceName = workspace?.name;
      }

      if (workspaceName) {
        const snapshot = attachWorkspaceImages([{ id: result.workspaceId, name: workspaceName }]);
        setWorkspaces(snapshot);
        localStorage.setItem("grip_workspaces", JSON.stringify(snapshot));
      }

      const tools = await getConnectors(result.workspaceId);
      setConnectedToolsState(tools);
      localStorage.setItem(`grip_connected_tools_${result.workspaceId}`, JSON.stringify(tools));
    } catch (error) {
      console.error("Failed to hydrate workspace for user", error);
    }
  }, [attachWorkspaceImages]);

  useEffect(() => {
    const savedOrgId = localStorage.getItem("grip_org_id");
    const savedWorkspaceId = localStorage.getItem("grip_workspace_id");
    const savedWorkspaces = localStorage.getItem("grip_workspaces");

    if (savedOrgId) setOrgIdState(savedOrgId);
    if (savedWorkspaceId) {
      setWorkspaceIdState(savedWorkspaceId);
      setActiveWorkspaceIdState(savedWorkspaceId);
    }
    if (savedWorkspaces) {
      try {
        const parsed = JSON.parse(savedWorkspaces) as Workspace[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setWorkspaces(attachWorkspaceImages(parsed));
        }
      } catch {
        // ignore invalid cache
      }
    }
  }, [attachWorkspaceImages]);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return;
    void hydrateUserWorkspace(session.user.id);
  }, [session?.user?.id, status, hydrateUserWorkspace]);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) {
      setUserProfileImageState(null);
      return;
    }
    setUserProfileImageState(getUserProfileImage(session.user.id));
  }, [session?.user?.id, status]);

  useEffect(() => {
    const onProfileImageUpdated = (event: Event) => {
      const detail = (event as CustomEvent<{ userId?: string }>).detail;
      if (detail?.userId && detail.userId === session?.user?.id) {
        setUserProfileImageState(getUserProfileImage(detail.userId));
      }
    };

    const onWorkspaceImageUpdated = (event: Event) => {
      const detail = (event as CustomEvent<{ workspaceId?: string }>).detail;
      if (!detail?.workspaceId) return;
      setWorkspaces((prev) => {
        const updated = prev.map((workspace) =>
          workspace.id === detail.workspaceId
            ? { ...workspace, imageUrl: getWorkspaceImage(detail.workspaceId!) }
            : workspace,
        );
        localStorage.setItem("grip_workspaces", JSON.stringify(updated));
        return updated;
      });
    };

    window.addEventListener("grip-profile-image-updated", onProfileImageUpdated);
    window.addEventListener("grip-workspace-image-updated", onWorkspaceImageUpdated);
    return () => {
      window.removeEventListener("grip-profile-image-updated", onProfileImageUpdated);
      window.removeEventListener("grip-workspace-image-updated", onWorkspaceImageUpdated);
    };
  }, [session?.user?.id]);

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
    if (activeWorkspaceId) {
      localStorage.setItem(`grip_selected_tools_${activeWorkspaceId}`, JSON.stringify(tools));
    }
  };

  const setConnectedTools = (tools: string[]) => {
    setConnectedToolsState(tools);
    if (activeWorkspaceId) {
      localStorage.setItem(`grip_connected_tools_${activeWorkspaceId}`, JSON.stringify(tools));
    }
  };

  const setSyncInfo = (info: Record<string, SyncDetails>) => {
    setSyncInfoState(info);
    if (activeWorkspaceId) {
      localStorage.setItem(`grip_connectors_sync_info_${activeWorkspaceId}`, JSON.stringify(info));
    }
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
      if (activeWorkspaceId) {
        localStorage.setItem(`grip_connectors_sync_info_${activeWorkspaceId}`, JSON.stringify(updated));
      }
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

  const updateWorkspaceImage = (id: string, imageUrl: string | null) => {
    if (imageUrl) {
      persistWorkspaceImage(id, imageUrl);
    } else {
      removeWorkspaceImage(id);
    }

    const updated = workspaces.map((workspace) =>
      workspace.id === id ? { ...workspace, imageUrl } : workspace,
    );
    setWorkspaces(updated);
    localStorage.setItem("grip_workspaces", JSON.stringify(updated));
  };

  const setUserProfileImage = (imageUrl: string | null) => {
    if (!session?.user?.id) return;
    if (imageUrl) {
      persistUserProfileImage(session.user.id, imageUrl);
    } else {
      removeUserProfileImage(session.user.id);
    }
    setUserProfileImageState(imageUrl);
  };

  const setOrgId = (id: string) => {
    setOrgIdState(id);
    localStorage.setItem("grip_org_id", id);
  };

  const setWorkspaceId = (id: string, name?: string) => {
    setWorkspaceIdState(id);
    setActiveWorkspaceIdState(id);
    localStorage.setItem("grip_workspace_id", id);
    if (name) {
      const snapshot = attachWorkspaceImages([{ id, name }]);
      setWorkspaces(snapshot);
      localStorage.setItem("grip_workspaces", JSON.stringify(snapshot));
    }
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
        updateWorkspaceImage,
        userProfileImage,
        setUserProfileImage,
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

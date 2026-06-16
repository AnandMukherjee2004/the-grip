"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface OnboardingContextType {
  selectedTools: string[];
  setSelectedTools: (tools: string[]) => void;
  connectedTools: string[];
  setConnectedTools: (tools: string[]) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [selectedTools, setSelectedToolsState] = useState<string[]>([]);
  const [connectedTools, setConnectedToolsState] = useState<string[]>([]);

  useEffect(() => {
    const savedSelected = localStorage.getItem("grip_selected_tools");
    const savedConnected = localStorage.getItem("grip_connected_tools");
    
    // Defer state updates to avoid synchronous setState inside useEffect warning
    setTimeout(() => {
      if (savedSelected) {
        try {
          setSelectedToolsState(JSON.parse(savedSelected));
        } catch (e) {
          console.error("Failed to parse saved selected tools", e);
        }
      }
      if (savedConnected) {
        try {
          setConnectedToolsState(JSON.parse(savedConnected));
        } catch (e) {
          console.error("Failed to parse saved connected tools", e);
        }
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

  return (
    <OnboardingContext.Provider
      value={{
        selectedTools,
        setSelectedTools,
        connectedTools,
        setConnectedTools,
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

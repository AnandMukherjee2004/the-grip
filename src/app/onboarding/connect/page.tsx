"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/context/OnboardingContext";
import { StepProgress } from "@/components/onboarding/StepProgress";
import { ConnectProgressBar } from "@/components/onboarding/ConnectProgressBar";
import { ConnectorGrid } from "@/components/onboarding/ConnectorGrid";
import { CONNECTORS } from "@/lib/connectors";
import { ConnectorStatus, OnboardingStep } from "@/types/onboarding";
import { useGripEffects } from "@/hooks/useGripEffects";
import { API_URL } from "@/lib/api";

const ONBOARDING_STEPS: OnboardingStep[] = [
  { id: 1, label: "Account", path: "/onboarding" },
  { id: 2, label: "Business", path: "/onboarding/business" },
  { id: 3, label: "Select Tools", path: "/onboarding/tools" },
  { id: 4, label: "Connect Tools", path: "/onboarding/connect" },
];

export default function OnboardingConnectPage() {
  const router = useRouter();
  const { selectedTools, connectedTools, setConnectedTools } = useOnboarding();
  const [localStatuses, setLocalStatuses] = useState<Record<string, ConnectorStatus>>({});
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Apply visual effects if any (from original design system)
  useGripEffects();

  const [workspaceId, setWorkspaceId] = useState<string | null>(null);

  // Read workspaceId from localStorage key 'grip_workspace_id' on mount
  useEffect(() => {
    const savedWorkspaceId = localStorage.getItem("grip_workspace_id");
    setWorkspaceId(savedWorkspaceId);
  }, []);

  // Guard: Redirect if no tools selected
  useEffect(() => {
    // Check local storage directly in case state hasn't populated yet
    const saved = localStorage.getItem("grip_selected_tools");
    const parsed = saved ? JSON.parse(saved) : [];

    if (selectedTools.length === 0 && parsed.length === 0) {
      router.replace("/onboarding/tools");
    }
  }, [selectedTools, router]);

  const handleConnect = async (toolId: string) => {
    // Set to connecting state
    setLocalStatuses((prev) => ({ ...prev, [toolId]: "connecting" }));

    // Find the config for the current tool
    const toolConfig = CONNECTORS[toolId];
    if (!toolConfig) {
      setLocalStatuses((prev) => ({ ...prev, [toolId]: "error" }));
      return;
    }

    // Map authMethod values
    let authMethod: "api_key" | "oauth2" = "api_key";
    if (toolConfig.authMethod === "oauth") {
      authMethod = "oauth2";
    } else if (toolConfig.authMethod === "apikey") {
      authMethod = "api_key";
    }

    try {
      const response = await fetch(`${API_URL}/api/v1/connectors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workspaceId: workspaceId || "placeholder_workspace_id",
          toolId,
          authMethod,
          credentials: { apiKey: "test_key", apiSecret: "test_secret" },
        }),
      });

      if (response.ok) {
        setLocalStatuses((prev) => {
          const next = { ...prev };
          delete next[toolId];
          return next;
        });

        // Add to connected list in context if not already present
        if (!connectedTools.includes(toolId)) {
          setConnectedTools([...connectedTools, toolId]);
        }
      } else {
        setLocalStatuses((prev) => ({ ...prev, [toolId]: "error" }));
      }
    } catch (error) {
      console.error("Failed to connect tool:", error);
      setLocalStatuses((prev) => ({ ...prev, [toolId]: "error" }));
    }
  };

  const handleSkip = (toolId: string) => {
    setLocalStatuses((prev) => ({ ...prev, [toolId]: "skipped" }));
    // Remove from connected if skipped after being connected
    if (connectedTools.includes(toolId)) {
      setConnectedTools(connectedTools.filter((id) => id !== toolId));
    }
  };

  const handleDisconnect = (toolId: string) => {
    setLocalStatuses((prev) => {
      const next = { ...prev };
      delete next[toolId];
      return next;
    });
    setConnectedTools(connectedTools.filter((id) => id !== toolId));
  };

  // Derive statuses dynamically
  const statuses: Record<string, ConnectorStatus> = {};
  selectedTools.forEach((toolId) => {
    if (localStatuses[toolId]) {
      statuses[toolId] = localStatuses[toolId];
    } else if (connectedTools.includes(toolId)) {
      statuses[toolId] = "connected";
    } else {
      statuses[toolId] = "idle";
    }
  });

  const connectedCount = selectedTools.filter(
    (toolId) => statuses[toolId] === "connected"
  ).length;

  const totalCount = selectedTools.length;
  const isSubmitDisabled = connectedCount === 0;

  const handleGoToDashboard = () => {
    setIsRedirecting(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  // Prevent flash before redirect guard runs
  if (selectedTools.length === 0) {
    return (
      <div className="min-h-screen bg-[#040409] flex items-center justify-center text-white/50 text-xs">
        Loading connection setup...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#040409] text-[#d0d0e8] relative pb-32 overflow-x-hidden font-sans flex flex-col">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/[0.04] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[700px] h-[700px] rounded-full bg-purple-500/[0.03] blur-[160px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10 border-b border-white/[0.03] shrink-0">
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <span className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-[0_0_15px_rgba(99,102,241,0.4)] transform group-hover:rotate-6 transition-transform duration-300" />
          <span className="font-display font-bold text-lg tracking-tight text-white group-hover:text-white/90 transition-colors">
            GRIP
          </span>
        </div>

        <button
          type="button"
          onClick={() => router.push("/")}
          className="text-xs font-medium text-white/50 hover:text-white transition-colors flex items-center gap-1.5"
        >
          ← Back to Home
        </button>
      </header>

      {/* Main Container */}
      <div className="w-full max-w-4xl mx-auto px-6 py-8 relative z-10 flex-grow flex flex-col gap-8">
        {/* Step Progress */}
        <div className="w-full">
          <StepProgress currentStep={4} steps={ONBOARDING_STEPS} />
        </div>

        {/* Page Centered Header */}
        <div className="text-center space-y-2 mt-4 max-w-xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Connect your tools
          </h1>
          <p className="text-white/60 text-sm md:text-base font-medium">
            GRIP needs access to sync your pipeline data.
          </p>
          <p className="text-white/30 text-xs md:text-xs">
            OAuth connections are read-only by default. You control permissions.
          </p>
        </div>

        {/* Connect Progress Bar */}
        <div className="w-full">
          <ConnectProgressBar
            connectedCount={connectedCount}
            totalCount={totalCount}
          />
        </div>

        {/* Selected Connectors Grid */}
        <div className="w-full mt-4">
          <ConnectorGrid
            selectedTools={selectedTools}
            connectorsConfig={CONNECTORS}
            statuses={statuses}
            onConnect={handleConnect}
            onSkip={handleSkip}
            onDisconnect={handleDisconnect}
          />
        </div>
      </div>

      {/* Sticky Bottom CTA Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-[#07070f]/90 border-t border-white/10 backdrop-blur-lg z-40 py-4 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-white/50 font-medium text-center sm:text-left">
            You can finish connecting from your dashboard later
          </span>
          <button
            type="button"
            disabled={isSubmitDisabled || isRedirecting}
            onClick={handleGoToDashboard}
            className={`w-full sm:w-auto h-11 px-6 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-1.5 ${
              isSubmitDisabled || isRedirecting
                ? "bg-white/5 border border-white/10 text-white/30 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-sky-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:opacity-95 active:scale-[0.99] cursor-pointer"
            }`}
          >
            {isRedirecting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Loading Dashboard...</span>
              </>
            ) : (
              <span>Go to Dashboard →</span>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}

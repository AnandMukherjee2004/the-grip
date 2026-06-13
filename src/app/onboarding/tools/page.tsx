"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TOOLS } from "@/lib/tools";
import { ToolGrid } from "@/components/onboarding/ToolGrid";
import { SelectionBar } from "@/components/onboarding/SelectionBar";
import { OnboardingStepShell } from "@/components/onboarding/OnboardingStepShell";
import { Tool, ToolCategory } from "@/types/onboarding";

export default function OnboardingToolsPage() {
  const router = useRouter();
  const [toolsList, setToolsList] = useState<Tool[]>(TOOLS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "all">("all");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStatus, setSyncStatus] = useState("Initializing connection...");

  useEffect(() => {
    if (!isSyncing) return;

    const interval = setInterval(() => {
      setSyncProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 12) + 5;
        if (next >= 100) {
          clearInterval(interval);
          setSyncStatus("Pipeline successfully generated! Redirecting...");
          setTimeout(() => {
            router.push("/");
          }, 1500);
          return 100;
        }

        if (next < 25) {
          setSyncStatus("Analyzing selected stack & dependencies...");
        } else if (next < 50) {
          const selectedNames = toolsList
            .filter((t) => selectedIds.includes(t.id))
            .map((t) => t.name);
          const currentTool =
            selectedNames[Math.floor((next / 100) * selectedNames.length)] ||
            "integrations";
          setSyncStatus(`Establishing secure OAuth handshakes with ${currentTool}...`);
        } else if (next < 75) {
          setSyncStatus("Mapping custom fields and contact objects...");
        } else if (next < 95) {
          setSyncStatus("Deploying webhook listeners & syncing historical logs...");
        } else {
          setSyncStatus("Finalizing pipeline configuration...");
        }

        return next;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [isSyncing, selectedIds, toolsList, router]);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddCustomTool = (name: string) => {
    const newTool: Tool = {
      id: `custom-${Date.now()}`,
      name: name,
      category: activeCategory === "all" ? "crm" : activeCategory,
      description: "Custom connected API tool.",
      icon: "🔌",
    };
    setToolsList((prev) => [...prev, newTool]);
    setSelectedIds((prev) => [...prev, newTool.id]);
  };

  const selectedTools = toolsList.filter((tool) => selectedIds.includes(tool.id));

  return (
    <>
      <OnboardingStepShell
        currentStep={3}
        title="Connect your Stack"
        subtitle="Select the tools you use. We'll build your revenue pipeline."
        onBack={() => router.back()}
        rightWide
        fullWidthPanel
        bottomPadding="pb-36"
      >
        <div className="max-h-[calc(100vh-220px)] overflow-y-auto pr-1 -mr-1">
          <ToolGrid
            tools={toolsList}
            selectedIds={selectedIds}
            onToggle={handleToggle}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            onAddCustomTool={handleAddCustomTool}
            embedded
          />
        </div>
      </OnboardingStepShell>

      <SelectionBar
        selectedTools={selectedTools}
        onContinue={() => setIsSyncing(true)}
      />

      {isSyncing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl px-4 transition-all duration-300">
          <div className="relative w-full max-w-md p-6 rounded-2xl bg-[#07070f] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-center overflow-hidden">
            <div className="absolute -top-20 -left-20 w-48 h-48 rounded-full bg-indigo-600/10 blur-[85px] pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-48 h-48 rounded-full bg-purple-600/10 blur-[85px] pointer-events-none" />

            <h3 className="text-lg font-bold text-white mb-1">
              Generating Pipeline Connectors
            </h3>
            <p className="text-white/40 text-xs mb-6">
              Establishing webhooks and syncing data pipelines.
            </p>

            <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-indigo-500/20 animate-ping" />
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="42"
                  className="stroke-white/5 fill-none"
                  strokeWidth="5"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="42"
                  className="stroke-indigo-500 fill-none transition-all duration-300"
                  strokeWidth="5"
                  strokeDasharray={263.89}
                  strokeDashoffset={263.89 - (263.89 * syncProgress) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-lg font-mono font-bold text-white">
                {syncProgress}%
              </span>
            </div>

            <div className="bg-black/30 border border-white/5 rounded-xl p-4 text-left font-mono text-[10px] space-y-2 mb-6 text-white/50">
              <div className="flex items-center justify-between">
                <span className={syncProgress >= 15 ? "text-white/80" : "text-white/30"}>
                  1. Init secure API handshakes
                </span>
                <span
                  className={
                    syncProgress >= 15 ? "text-emerald-400" : "text-white/20 font-bold"
                  }
                >
                  {syncProgress >= 15 ? "✓ OK" : "● PENDING"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={syncProgress >= 45 ? "text-white/80" : "text-white/30"}>
                  2. Map schema dependencies
                </span>
                <span
                  className={
                    syncProgress >= 45 ? "text-emerald-400" : "text-white/20 font-bold"
                  }
                >
                  {syncProgress >= 45
                    ? "✓ OK"
                    : syncProgress >= 15
                      ? "⏳ SYNCING"
                      : "● PENDING"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={syncProgress >= 75 ? "text-white/80" : "text-white/30"}>
                  3. Configure webhook receivers
                </span>
                <span
                  className={
                    syncProgress >= 75 ? "text-emerald-400" : "text-white/20 font-bold"
                  }
                >
                  {syncProgress >= 75
                    ? "✓ OK"
                    : syncProgress >= 45
                      ? "⏳ SYNCING"
                      : "● PENDING"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={syncProgress >= 95 ? "text-white/80" : "text-white/30"}>
                  4. Sync historical logs
                </span>
                <span
                  className={
                    syncProgress >= 95 ? "text-emerald-400" : "text-white/20 font-bold"
                  }
                >
                  {syncProgress >= 95
                    ? "✓ OK"
                    : syncProgress >= 75
                      ? "⏳ SYNCING"
                      : "● PENDING"}
                </span>
              </div>
            </div>

            <div className="min-h-[20px] mb-3">
              <p className="text-white/70 font-semibold text-xs transition-all duration-300">
                {syncStatus}
              </p>
            </div>

            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                style={{ width: `${syncProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

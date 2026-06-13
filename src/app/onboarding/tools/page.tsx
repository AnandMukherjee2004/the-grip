"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TOOLS } from "@/lib/tools";
import { ToolGrid } from "@/components/onboarding/ToolGrid";
import { SelectionBar } from "@/components/onboarding/SelectionBar";
import { StepProgress } from "@/components/onboarding/StepProgress";
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

  // Syncing simulation animation
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

        // Dynamic status updates based on percentage
        if (next < 25) {
          setSyncStatus("Analyzing selected stack & dependencies...");
        } else if (next < 50) {
          const selectedNames = toolsList
            .filter((t) => selectedIds.includes(t.id))
            .map((t) => t.name);
          const currentTool = selectedNames[Math.floor((next / 100) * selectedNames.length)] || "integrations";
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

  const steps = [
    { id: 1, label: "Connect Stack", path: "/onboarding/tools" },
    { id: 2, label: "Configure Pipelines", path: "#" },
    { id: 3, label: "Complete", path: "#" },
  ];

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
    <main className="min-h-screen bg-[#040409] text-[#d0d0e8] relative pb-36 overflow-x-hidden font-sans">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Dynamic Ambient Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/[0.04] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[700px] h-[700px] rounded-full bg-purple-500/[0.03] blur-[160px] pointer-events-none" />

      {/* Header Bar */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 border-b border-white/[0.03]">
        {/* Brand */}
        <div 
          onClick={() => router.push("/")}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <span className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-[0_0_15px_rgba(99,102,241,0.4)] transform group-hover:rotate-6 transition-transform duration-300" />
          <span className="font-display font-bold text-lg tracking-tight text-white group-hover:text-white/90 transition-colors">GRIP</span>
        </div>

        {/* Onboarding Steps */}
        <StepProgress currentStep={1} steps={steps} />
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-4xl mx-auto text-center px-6 pt-16 pb-12 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider mb-6">
          <span>Step 1 of 3</span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          <span>Connect Stack</span>
        </div>
        
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/70">
          Connect your Stack
        </h1>
        <p className="text-white/50 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Select the software suite you use to process transactions, manage relationships, and chat with clients. We&apos;ll build the revenue pipeline.
        </p>
      </section>

      {/* Tool Grid Section */}
      <section className="relative z-10">
        <ToolGrid
          tools={toolsList}
          selectedIds={selectedIds}
          onToggle={handleToggle}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          onAddCustomTool={handleAddCustomTool}
        />
      </section>

      {/* Fixed bottom selection bar */}
      <SelectionBar
        selectedTools={selectedTools}
        onContinue={() => setIsSyncing(true)}
      />

      {/* Premium Pipeline Syncing Modal */}
      {isSyncing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl px-4 transition-all duration-300">
          <div className="relative w-full max-w-md p-6 rounded-2xl bg-[#07070f] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-center overflow-hidden">
            {/* Ambient inner glow */}
            <div className="absolute -top-20 -left-20 w-48 h-48 rounded-full bg-indigo-600/10 blur-[85px] pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-48 h-48 rounded-full bg-purple-600/10 blur-[85px] pointer-events-none" />

            <h3 className="text-lg font-bold text-white mb-1">
              Generating Pipeline Connectors
            </h3>
            <p className="text-white/40 text-xs mb-6">
              Establishing webhooks and syncing data pipelines.
            </p>

            {/* Circular Progress & Animation */}
            <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full border border-indigo-500/20 animate-ping" />
              
              {/* Spinning progress track */}
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
              
              {/* Inside Text */}
              <span className="absolute text-lg font-mono font-bold text-white">
                {syncProgress}%
              </span>
            </div>

            {/* Terminal sync logs */}
            <div className="bg-black/30 border border-white/5 rounded-xl p-4 text-left font-mono text-[10px] space-y-2 mb-6 text-white/50">
              <div className="flex items-center justify-between">
                <span className={syncProgress >= 15 ? "text-white/80" : "text-white/30"}>1. Init secure API handshakes</span>
                <span className={syncProgress >= 15 ? "text-emerald-400" : "text-white/20 font-bold"}>
                  {syncProgress >= 15 ? "✓ OK" : "● PENDING"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={syncProgress >= 45 ? "text-white/80" : "text-white/30"}>2. Map schema dependencies</span>
                <span className={syncProgress >= 45 ? "text-emerald-400" : "text-white/20 font-bold"}>
                  {syncProgress >= 45 ? "✓ OK" : syncProgress >= 15 ? "⏳ SYNCING" : "● PENDING"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={syncProgress >= 75 ? "text-white/80" : "text-white/30"}>3. Configure webhook receivers</span>
                <span className={syncProgress >= 75 ? "text-emerald-400" : "text-white/20 font-bold"}>
                  {syncProgress >= 75 ? "✓ OK" : syncProgress >= 45 ? "⏳ SYNCING" : "● PENDING"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={syncProgress >= 95 ? "text-white/80" : "text-white/30"}>4. Sync historical logs</span>
                <span className={syncProgress >= 95 ? "text-emerald-400" : "text-white/20 font-bold"}>
                  {syncProgress >= 95 ? "✓ OK" : syncProgress >= 75 ? "⏳ SYNCING" : "● PENDING"}
                </span>
              </div>
            </div>

            {/* Status updates text */}
            <div className="min-h-[20px] mb-3">
              <p className="text-white/70 font-semibold text-xs transition-all duration-300">
                {syncStatus}
              </p>
            </div>

            {/* Progress bar line */}
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                style={{ width: `${syncProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

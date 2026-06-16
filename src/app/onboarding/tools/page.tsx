"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TOOLS } from "@/lib/tools";
import { ToolGrid } from "@/components/onboarding/ToolGrid";
import { SelectionBar } from "@/components/onboarding/SelectionBar";
import { StepProgress } from "@/components/onboarding/StepProgress";
import { Tool, ToolCategory } from "@/types/onboarding";
import { useOnboarding } from "@/context/OnboardingContext";

const ONBOARDING_STEPS = [
  { id: 1, label: "Account", path: "/onboarding" },
  { id: 2, label: "Business", path: "/onboarding/business" },
  { id: 3, label: "Connect Stack", path: "/onboarding/tools" },
] as const;

export default function OnboardingToolsPage() {
  const router = useRouter();
  const { selectedTools: contextSelectedTools, setSelectedTools: setContextSelectedTools } = useOnboarding();
  
  const [toolsList, setToolsList] = useState<Tool[]>(TOOLS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "all">("all");

  useEffect(() => {
    if (contextSelectedTools && contextSelectedTools.length > 0) {
      setTimeout(() => {
        setSelectedIds(contextSelectedTools);
      }, 0);
    }
  }, [contextSelectedTools]);

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

  const handleContinue = () => {
    setContextSelectedTools(selectedIds);
    router.push("/onboarding/connect");
  };

  return (
    <main className="min-h-screen bg-[#040409] text-[#d0d0e8] relative pb-36 overflow-x-hidden font-sans">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/[0.04] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[700px] h-[700px] rounded-full bg-purple-500/[0.03] blur-[160px] pointer-events-none" />

      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 border-b border-white/[0.03]">
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <span className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-[0_0_15px_rgba(99,102,241,0.4)] transform group-hover:rotate-6 transition-transform duration-300" />
          <span className="font-display font-bold text-lg tracking-tight text-white group-hover:text-white/90 transition-colors">
            GRIP
          </span>
        </div>

        <StepProgress currentStep={3} steps={[...ONBOARDING_STEPS]} />
      </header>

      <section className="w-full max-w-4xl mx-auto text-center px-6 pt-16 pb-12 relative z-10">
        <button
          type="button"
          onClick={() => router.push("/onboarding/business")}
          className="mb-6 text-xs text-white/40 transition-colors hover:text-white/70"
        >
          ← Back
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider mb-6">
          <span>Step 3 of 3</span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          <span>Connect Stack</span>
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/70">
          Connect your Stack
        </h1>
        <p className="text-white/50 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Select the software suite you use to process transactions, manage
          relationships, and chat with clients. We&apos;ll build the revenue
          pipeline.
        </p>
      </section>

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

      <SelectionBar
        selectedTools={selectedTools}
        onContinue={handleContinue}
      />
    </main>
  );
}

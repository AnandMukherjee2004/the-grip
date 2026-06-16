"use client";

import { useState } from "react";
import { Tool } from "@/types/onboarding";
import { AvailableToolCard } from "./AvailableToolCard";
import { SearchIcon } from "@/components/ui/Icons";
import { TOOLS } from "@/lib/tools";

interface AvailableToolsGridProps {
  connectedTools: string[];
  onConnect: (toolId: string) => Promise<void>;
}

const CATEGORY_TABS = [
  { id: "all", label: "All" },
  { id: "crm", label: "CRM" },
  { id: "payments", label: "Payments" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "ads", label: "Ads" },
  { id: "communication", label: "Communication" },
  { id: "accounting", label: "Accounting" },
];

export function AvailableToolsGrid({
  connectedTools,
  onConnect,
}: AvailableToolsGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Filter logic
  const filteredTools = TOOLS.filter((tool) => {
    const isConnected = connectedTools.includes(tool.id);
    if (isConnected) return false;
    
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="space-y-6 pt-6 border-t border-white/[0.04]">
      {/* Header with Search and Filter Tab Row */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-base font-bold text-white tracking-tight">Add a connector</h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <SearchIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 [[data-theme='light']_&]:text-slate-400"
              size={12}
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-lg text-xs bg-white/5 [[data-theme='light']_&]:bg-white border border-white/10 [[data-theme='light']_&]:border-slate-200 text-white [[data-theme='light']_&]:text-slate-900 placeholder-white/30 [[data-theme='light']_&]:placeholder-slate-400 hover:border-white/20 [[data-theme='light']_&]:hover:border-slate-300 focus:border-indigo-500/50 [[data-theme='light']_&]:focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-sans"
            />
          </div>

          {/* Category Filter Tab Row */}
          <div className="flex overflow-x-auto gap-1.5 p-1 rounded-lg bg-black/30 [[data-theme='light']_&]:bg-slate-100 border border-white/5 [[data-theme='light']_&]:border-slate-200 scrollbar-none max-w-full">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3 py-1 rounded-md text-[10px] font-semibold tracking-tight transition-all cursor-pointer whitespace-nowrap ${activeCategory === tab.id
                    ? "bg-indigo-500/10 [[data-theme='light']_&]:bg-indigo-500/20 text-indigo-400 [[data-theme='light']_&]:text-indigo-600 border border-indigo-500/20 [[data-theme='light']_&]:border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.15)]"
                    : "border border-transparent text-white/40 [[data-theme='light']_&]:text-slate-500 hover:text-white [[data-theme='light']_&]:hover:text-slate-800"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Content */}
      {filteredTools.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 py-16 rounded-xl border border-white/5 bg-[#0e0e1a]/20 text-center select-none animate-fadeIn">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/30 text-lg mb-3">
            🔍
          </div>
          <p className="text-white/50 text-xs font-semibold">
            No tools found for &quot;{searchQuery}&quot;
          </p>
          <p className="text-white/30 text-[10px] mt-1">
            Try adjusting your search terms or selecting a different category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => {
            const isConnected = connectedTools.includes(tool.id);
            return (
              <AvailableToolCard
                key={tool.id}
                tool={tool}
                isConnected={isConnected}
                onConnect={onConnect}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

"use client";

import { useState } from "react";
import { Tool, ToolCategory } from "@/types/onboarding";
import { ToolCard } from "./ToolCard";
import { CATEGORIES } from "@/lib/tools";

interface ToolGridProps {
  tools: Tool[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: ToolCategory | "all";
  setActiveCategory: (category: ToolCategory | "all") => void;
  onAddCustomTool?: (name: string) => void;
}

export function ToolGrid({
  tools,
  selectedIds,
  onToggle,
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  onAddCustomTool,
}: ToolGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customToolName, setCustomToolName] = useState("");

  // Filter tools based on search and category
  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Group tools by category for the "All" view
  const categoriesToRender = activeCategory === "all"
    ? (Array.from(new Set(filteredTools.map((t) => t.category))) as ToolCategory[])
    : [activeCategory];

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCustomToolName("");
  };

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customToolName && customToolName.trim() && onAddCustomTool) {
      onAddCustomTool(customToolName.trim());
      handleCloseModal();
    }
  };

  const getCategoryTitle = (cat: string) => {
    const found = CATEGORIES.find((c) => c.id === cat);
    return found ? found.label : cat;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6">
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-10">
        {/* Controlled Search Box */}
        <div className="relative flex-grow max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <svg
              className="w-4 h-4 text-white/30 group-focus-within:text-indigo-400 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search connected tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090915]/80 border border-white/5 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-all duration-300 text-sm"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 border ${
                activeCategory === cat.id
                  ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.08)]"
                  : "bg-white/5 text-white/40 border-transparent hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Display */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-[#0a0a14]/30 backdrop-blur-md">
          <svg className="w-10 h-10 text-white/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-white/50 text-sm mb-3">No tools found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-semibold"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {categoriesToRender.map((catId) => {
            const catTools = filteredTools.filter((t) => t.category === catId);
            if (catTools.length === 0) return null;

            return (
              <div key={catId} className="space-y-4">
                {activeCategory === "all" && (
                  <h2 className="text-[10px] font-bold uppercase tracking-wider text-indigo-400/60 pl-1">
                    {getCategoryTitle(catId)}
                  </h2>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {catTools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      isSelected={selectedIds.includes(tool.id)}
                      onToggle={onToggle}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Add custom tool card at the very end */}
          <div className="pt-2">
            <div
              role="button"
              tabIndex={0}
              onClick={handleOpenModal}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleOpenModal();
                }
              }}
              className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-white/10 hover:border-purple-500/40 bg-white/[0.01] hover:bg-white/[0.03] text-center cursor-pointer transition-all duration-300 min-h-[140px] select-none group"
            >
              <span className="text-xl mb-2 text-white/40 group-hover:text-purple-400 group-hover:scale-110 transition-all duration-300">🔌</span>
              <span className="text-sm font-semibold text-white/70 group-hover:text-white transition-colors">
                + Add a custom tool
              </span>
              <span className="text-xs text-white/30 mt-1">
                For tools not listed here
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Styled Dialog Modal for Custom Tool */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            onClick={handleCloseModal} 
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
          />
          
          {/* Dialog Content */}
          <div className="relative w-full max-w-md p-6 rounded-2xl bg-[#0a0a16] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-left overflow-hidden z-10">
            {/* Ambient Radial Glow */}
            <div className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-purple-500/10 blur-[50px] pointer-events-none" />
            
            <h3 className="text-lg font-bold text-white mb-2">
              Add Custom Tool
            </h3>
            <p className="text-white/50 text-xs mb-5 leading-relaxed">
              Define a custom connected API tool. Once configured, you can map webhook pipelines and transfer historical logs.
            </p>

            <form onSubmit={handleSubmitCustom}>
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="tool-name" className="block text-[11px] font-bold text-indigo-400/70 uppercase tracking-wide mb-1.5 pl-1">
                    Tool Name
                  </label>
                  <input
                    id="tool-name"
                    type="text"
                    required
                    placeholder="e.g. ActiveCampaign, Salesforce Sandbox"
                    value={customToolName}
                    onChange={(e) => setCustomToolName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#121226]/60 border border-white/5 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all duration-200 text-sm"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-200"
                >
                  Add Connection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

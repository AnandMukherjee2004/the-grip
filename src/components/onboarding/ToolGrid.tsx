"use client";

import { useState } from "react";
import { Tool, ToolCategory } from "@/types/onboarding";
import { ToolCard } from "./ToolCard";
import { CATEGORIES } from "@/lib/tools";
import {
  authInputClass,
  authLabelClass,
  authPrimaryButtonClass,
} from "@/components/auth/auth-styles";

interface ToolGridProps {
  tools: Tool[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: ToolCategory | "all";
  setActiveCategory: (category: ToolCategory | "all") => void;
  onAddCustomTool?: (name: string) => void;
  embedded?: boolean;
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
  embedded = false,
}: ToolGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customToolName, setCustomToolName] = useState("");

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categoriesToRender = activeCategory === "all"
    ? (Array.from(new Set(filteredTools.map((t) => t.category))) as ToolCategory[])
    : [activeCategory];

  const handleOpenModal = () => setIsModalOpen(true);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCustomToolName("");
  };

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customToolName.trim() && onAddCustomTool) {
      onAddCustomTool(customToolName.trim());
      handleCloseModal();
    }
  };

  const getCategoryTitle = (cat: string) => {
    const found = CATEGORIES.find((c) => c.id === cat);
    return found ? found.label : cat;
  };

  return (
    <div className={`tool-grid ${embedded ? "w-full" : "w-full max-w-6xl mx-auto px-6"}`}>
      <div className={`flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between ${embedded ? "mb-6" : "mb-10"}`}>
        <div className="relative flex-grow max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search connected tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${authInputClass} pl-10`}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all border ${
                activeCategory === cat.id
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {filteredTools.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl bg-gray-50">
          <svg className="w-10 h-10 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 text-sm mb-3">No tools found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="text-xs text-gray-900 hover:underline font-semibold"
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
                  <h2 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 pl-1">
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
              className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-gray-200 hover:border-gray-400 bg-gray-50 hover:bg-gray-100 text-center cursor-pointer transition-all duration-300 min-h-[140px] select-none group"
            >
              <span className="text-xl mb-2 text-gray-400 group-hover:text-gray-700 transition-all">🔌</span>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                + Add a custom tool
              </span>
              <span className="text-xs text-gray-400 mt-1">
                For tools not listed here
              </span>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={handleCloseModal} className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

          <div className="relative w-full max-w-md p-6 rounded-2xl bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] text-left z-10">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Add Custom Tool</h3>
            <p className="text-gray-500 text-xs mb-5 leading-relaxed">
              Define a custom connected API tool. Once configured, you can map webhook pipelines and transfer historical logs.
            </p>

            <form onSubmit={handleSubmitCustom}>
              <div className="mb-6">
                <label htmlFor="tool-name" className={authLabelClass}>
                  Tool Name
                </label>
                <input
                  id="tool-name"
                  type="text"
                  required
                  placeholder="e.g. ActiveCampaign, Salesforce Sandbox"
                  value={customToolName}
                  onChange={(e) => setCustomToolName(e.target.value)}
                  className={authInputClass}
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button type="submit" className={`${authPrimaryButtonClass} w-auto px-5`}>
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

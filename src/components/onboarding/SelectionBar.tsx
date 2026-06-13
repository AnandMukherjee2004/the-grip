"use client";

import { Tool } from "@/types/onboarding";

interface SelectionBarProps {
  selectedTools: Tool[];
  onContinue: () => void;
}

export function SelectionBar({ selectedTools, onContinue }: SelectionBarProps) {
  const count = selectedTools.length;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-40 flex justify-center pointer-events-none">
      <div className="w-full max-w-4xl pointer-events-auto bg-[#090915]/80 backdrop-blur-xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)] rounded-2xl transition-all duration-500 ease-out p-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Selected Tools count and pills */}
        <div className="flex items-center space-x-4">
          <div className="flex -space-x-2 overflow-hidden py-1">
            {selectedTools.slice(0, 5).map((tool) => (
              tool.logo ? (
                <img
                  key={tool.id}
                  title={tool.name}
                  src={tool.logo}
                  alt={tool.name}
                  className="h-6 w-auto max-w-[48px] object-contain select-none transform hover:-translate-y-1 hover:scale-105 transition-all duration-200 self-center"
                />
              ) : (
                <div
                  key={tool.id}
                  title={tool.name}
                  className="w-8 h-8 rounded-xl bg-[#121226] border border-white/10 flex items-center justify-center text-sm shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all duration-200"
                >
                  {tool.icon}
                </div>
              )
            ))}
            {count > 5 && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                +{count - 5}
              </div>
            )}
          </div>

          <div className="text-left">
            <p className="text-white font-semibold text-xs md:text-sm">
              {count === 0
                ? "Select at least 2 tools to continue"
                : count === 1
                ? "Select 1 more tool to continue"
                : `${count} tools selected`}
            </p>
            <p className="text-white/40 text-[10px] hidden sm:block mt-0.5">
              {count < 2 ? "Connect your data channels to build pipelines." : "We'll build out your pipelines dynamically."}
            </p>
          </div>
        </div>

        {/* Right: Continue Action */}
        <div className="relative group w-full sm:w-auto">
          {count < 2 && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#0e0e1a] border border-white/10 text-white/60 text-xs font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Select at least 2 tools
            </div>
          )}
          <button
            disabled={count < 2}
            onClick={onContinue}
            className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-xs tracking-wide uppercase transition-all duration-300 ${count >= 2
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.5)] cursor-pointer hover:scale-[1.02]"
              : "bg-white/5 text-white/20 border border-transparent cursor-not-allowed"
              }`}
          >
            <span>Continue to configure</span>
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

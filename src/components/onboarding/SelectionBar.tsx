"use client";

import { Tool } from "@/types/onboarding";
import {
  authPrimaryButtonClass,
  authStickyBarClass,
} from "@/components/auth/auth-styles";

interface SelectionBarProps {
  selectedTools: Tool[];
  onContinue: () => void;
}

export function SelectionBar({ selectedTools, onContinue }: SelectionBarProps) {
  const count = selectedTools.length;

  return (
    <div className={authStickyBarClass}>
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex -space-x-2 overflow-hidden py-1">
            {selectedTools.slice(0, 5).map((tool) => (
              tool.logo ? (
                <img
                  key={tool.id}
                  title={tool.name}
                  src={tool.logo}
                  alt={tool.name}
                  className="h-6 w-auto max-w-[48px] object-contain select-none bg-white rounded border border-gray-200 p-0.5"
                />
              ) : (
                <div
                  key={tool.id}
                  title={tool.name}
                  className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-sm"
                >
                  {tool.icon}
                </div>
              )
            ))}
            {count > 5 && (
              <div className="w-8 h-8 rounded-lg bg-gray-900 border border-gray-900 flex items-center justify-center text-[10px] font-bold text-white">
                +{count - 5}
              </div>
            )}
          </div>

          <div className="text-left">
            <p className="text-gray-900 font-semibold text-xs md:text-sm">
              {count === 0
                ? "Select at least 2 tools to continue"
                : count === 1
                ? "Select 1 more tool to continue"
                : `${count} tools selected`}
            </p>
            <p className="text-gray-500 text-[10px] hidden sm:block mt-0.5">
              {count < 2
                ? "Connect your data channels to build pipelines."
                : "We'll build out your pipelines dynamically."}
            </p>
          </div>
        </div>

        <button
          disabled={count < 2}
          onClick={onContinue}
          className={`${authPrimaryButtonClass} sm:w-auto sm:px-8 ${
            count < 2 ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          Continue to configure →
        </button>
      </div>
    </div>
  );
}

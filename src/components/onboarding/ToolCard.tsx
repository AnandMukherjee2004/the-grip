"use client";

import { Tool } from "@/types/onboarding";
import { CheckIcon } from "@/components/ui/CheckIcon";

interface ToolCardProps {
  tool: Tool;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

const getToolAccent = (id: string, isSelected: boolean) => {
  const styleId = id.startsWith("custom-") ? "custom" : id;

  const accents: Record<string, { border: string; bg: string; badge: string }> = {
    hubspot: {
      border: "border-orange-400",
      bg: "bg-orange-50",
      badge: "bg-orange-500 text-white",
    },
    salesforce: {
      border: "border-sky-400",
      bg: "bg-sky-50",
      badge: "bg-sky-500 text-white",
    },
    stripe: {
      border: "border-indigo-400",
      bg: "bg-indigo-50",
      badge: "bg-indigo-500 text-white",
    },
    razorpay: {
      border: "border-blue-400",
      bg: "bg-blue-50",
      badge: "bg-blue-500 text-white",
    },
    shopify: {
      border: "border-emerald-400",
      bg: "bg-emerald-50",
      badge: "bg-emerald-500 text-white",
    },
    "whatsapp-business": {
      border: "border-green-400",
      bg: "bg-green-50",
      badge: "bg-green-500 text-white",
    },
    intercom: {
      border: "border-blue-400",
      bg: "bg-blue-50",
      badge: "bg-blue-500 text-white",
    },
    custom: {
      border: "border-purple-400",
      bg: "bg-purple-50",
      badge: "bg-purple-500 text-white",
    },
  };

  const accent = accents[styleId] ?? {
    border: "border-gray-400",
    bg: "bg-gray-50",
    badge: "bg-gray-900 text-white",
  };

  return isSelected
    ? `${accent.border} ${accent.bg} shadow-[0_0_0_1px_rgba(0,0,0,0.04)]`
    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm";
};

export function ToolCard({ tool, isSelected, onToggle }: ToolCardProps) {
  const accent = getToolAccent(tool.id, isSelected);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "crm":
        return "CRM / Sales";
      case "payments":
        return "Payments";
      case "ecommerce":
        return "E-commerce";
      case "communication":
        return "Communication";
      default:
        return cat;
    }
  };

  const brand = getToolAccent(tool.id, isSelected);

  return (
    <div
      role="button"
      aria-pressed={isSelected}
      tabIndex={0}
      onClick={() => onToggle(tool.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle(tool.id);
        }
      }}
      className={`tool-card group relative flex flex-col justify-between p-5 rounded-xl border cursor-pointer transition-all duration-300 select-none hover:-translate-y-0.5 ${brand}`}
    >
      <div className="flex justify-between items-start mb-4">
        {tool.logo ? (
          <img
            src={tool.logo}
            alt={tool.name}
            className="h-8 w-auto max-w-[100px] object-contain transform group-hover:scale-105 transition-transform duration-300 select-none my-1.5"
          />
        ) : (
          <div className="w-11 h-11 flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-xl">
            {tool.icon}
          </div>
        )}
        <div className="flex items-center space-x-1.5">
          {tool.popular && !isSelected && (
            <span className="text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
              Popular
            </span>
          )}
          {isSelected && (
            <div className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-900 text-white">
              <CheckIcon className="w-3 h-3 stroke-[3]" />
            </div>
          )}
        </div>
      </div>

      <div className="flex-grow">
        <h3 className="text-gray-900 font-semibold text-sm mb-1.5 tracking-tight">
          {tool.name}
        </h3>
        <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
          {tool.description}
        </p>
      </div>

      <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[9px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200">
          {getCategoryLabel(tool.category)}
        </span>
      </div>
    </div>
  );
}

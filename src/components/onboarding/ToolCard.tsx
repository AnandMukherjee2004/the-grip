"use client";

import { Tool } from "@/types/onboarding";
import { CheckIcon } from "@/components/ui/CheckIcon";

interface ToolCardProps {
  tool: Tool;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

const getToolBrandStyles = (id: string, isSelected: boolean) => {
  // Normalize custom ids starting with "custom-" to custom style
  const styleId = id.startsWith("custom-") ? "custom" : id;

  switch (styleId) {
    case "hubspot":
      return {
        bgGlow: "group-hover:shadow-[0_0_30px_rgba(249,115,22,0.12)] group-hover:border-orange-500/30",
        selectedBg: "border-orange-500 bg-gradient-to-b from-[#1a120b] to-[#0f0d0a] shadow-[0_0_25px_rgba(249,115,22,0.15)]",
        iconContainer: isSelected 
          ? "bg-orange-500/20 border-orange-500/30 text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.25)]" 
          : "bg-orange-500/5 border-orange-500/10 text-orange-400/80 group-hover:text-orange-400 group-hover:bg-orange-500/10 group-hover:border-orange-500/20",
        selectedBadge: "bg-orange-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.4)]",
      };
    case "salesforce":
      return {
        bgGlow: "group-hover:shadow-[0_0_30px_rgba(14,165,233,0.12)] group-hover:border-sky-500/30",
        selectedBg: "border-sky-500 bg-gradient-to-b from-[#0b1622] to-[#0a0f14] shadow-[0_0_25px_rgba(14,165,233,0.15)]",
        iconContainer: isSelected 
          ? "bg-sky-500/20 border-sky-500/30 text-sky-400 shadow-[0_0_12px_rgba(14,165,233,0.25)]" 
          : "bg-sky-500/5 border-sky-500/10 text-sky-400/80 group-hover:text-sky-400 group-hover:bg-sky-500/10 group-hover:border-sky-500/20",
        selectedBadge: "bg-sky-500 text-white shadow-[0_0_10px_rgba(14,165,233,0.4)]",
      };
    case "stripe":
      return {
        bgGlow: "group-hover:shadow-[0_0_30px_rgba(99,102,241,0.12)] group-hover:border-indigo-500/30",
        selectedBg: "border-indigo-500 bg-gradient-to-b from-[#111129] to-[#0a0a14] shadow-[0_0_25px_rgba(99,102,241,0.18)]",
        iconContainer: isSelected 
          ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.25)]" 
          : "bg-indigo-500/5 border-indigo-500/10 text-indigo-400/80 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20",
        selectedBadge: "bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]",
      };
    case "razorpay":
      return {
        bgGlow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.12)] group-hover:border-blue-500/30",
        selectedBg: "border-blue-500 bg-gradient-to-b from-[#0b1329] to-[#0a0a14] shadow-[0_0_25px_rgba(59,130,246,0.15)]",
        iconContainer: isSelected 
          ? "bg-blue-500/20 border-blue-500/30 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.25)]" 
          : "bg-blue-500/5 border-blue-500/10 text-blue-400/80 group-hover:text-blue-400 group-hover:bg-blue-500/10 group-hover:border-blue-500/20",
        selectedBadge: "bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]",
      };
    case "shopify":
      return {
        bgGlow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.12)] group-hover:border-emerald-500/30",
        selectedBg: "border-emerald-500 bg-gradient-to-b from-[#0b1c14] to-[#0a0f0d] shadow-[0_0_25px_rgba(16,185,129,0.15)]",
        iconContainer: isSelected 
          ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]" 
          : "bg-emerald-500/5 border-emerald-500/10 text-emerald-400/80 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20",
        selectedBadge: "bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]",
      };
    case "whatsapp-business":
      return {
        bgGlow: "group-hover:shadow-[0_0_30px_rgba(34,197,94,0.12)] group-hover:border-green-500/30",
        selectedBg: "border-green-500 bg-gradient-to-b from-[#0b1c11] to-[#0a0f0d] shadow-[0_0_25px_rgba(34,197,94,0.15)]",
        iconContainer: isSelected 
          ? "bg-green-500/20 border-green-500/30 text-green-400 shadow-[0_0_12px_rgba(34,197,94,0.25)]" 
          : "bg-green-500/5 border-green-500/10 text-green-400/80 group-hover:text-green-400 group-hover:bg-green-500/10 group-hover:border-green-500/20",
        selectedBadge: "bg-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.4)]",
      };
    case "intercom":
      return {
        bgGlow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.12)] group-hover:border-blue-500/30",
        selectedBg: "border-blue-500 bg-gradient-to-b from-[#0b1329] to-[#0a0a14] shadow-[0_0_25px_rgba(59,130,246,0.15)]",
        iconContainer: isSelected 
          ? "bg-blue-500/20 border-blue-500/30 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.25)]" 
          : "bg-blue-500/5 border-blue-500/10 text-blue-400/80 group-hover:text-blue-400 group-hover:bg-blue-500/10 group-hover:border-blue-500/20",
        selectedBadge: "bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]",
      };
    case "custom":
      return {
        bgGlow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.12)] group-hover:border-purple-500/30",
        selectedBg: "border-purple-500 bg-gradient-to-b from-[#180f24] to-[#0c0a10] shadow-[0_0_25px_rgba(168,85,247,0.18)]",
        iconContainer: isSelected 
          ? "bg-purple-500/20 border-purple-500/30 text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.25)]" 
          : "bg-purple-500/5 border-purple-500/10 text-purple-400/80 group-hover:text-purple-400 group-hover:bg-purple-500/10 group-hover:border-purple-500/20",
        selectedBadge: "bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]",
      };
    default:
      return {
        bgGlow: "group-hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] group-hover:border-white/20",
        selectedBg: "border-white/30 bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.05)]",
        iconContainer: isSelected 
          ? "bg-white/10 border-white/20 text-white" 
          : "bg-white/5 border-white/5 text-white/60 group-hover:text-white group-hover:bg-white/10 group-hover:border-white/10",
        selectedBadge: "bg-white/80 text-black",
      };
  }
};

export function ToolCard({ tool, isSelected, onToggle }: ToolCardProps) {
  const brand = getToolBrandStyles(tool.id, isSelected);

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
      className={`tool-card group relative flex flex-col justify-between p-5 rounded-xl border backdrop-blur-md cursor-pointer transition-all duration-300 select-none ${
        isSelected ? brand.selectedBg : "border-white/5 bg-[#0e0e1a]/40 hover:bg-[#121226]/50 " + brand.bgGlow
      } hover:-translate-y-0.5`}
    >
      {/* Top action/badge row */}
      <div className="flex justify-between items-start mb-4">
        {tool.logo ? (
          <img 
            src={tool.logo} 
            alt={tool.name} 
            className="h-8 w-auto max-w-[100px] object-contain transform group-hover:scale-110 transition-transform duration-300 select-none my-1.5" 
          />
        ) : (
          <div className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-all duration-300 ${brand.iconContainer}`}>
            <span className="text-xl transform group-hover:scale-110 transition-transform duration-300">{tool.icon}</span>
          </div>
        )}
        <div className="flex items-center space-x-1.5">
          {tool.popular && !isSelected && (
            <span className="text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/10">
              Popular
            </span>
          )}
          {isSelected && (
            <div className={`w-5 h-5 flex items-center justify-center rounded-full transition-all duration-300 ${brand.selectedBadge}`}>
              <CheckIcon className="w-3 h-3 stroke-[3]" />
            </div>
          )}
        </div>
      </div>

      {/* Middle info */}
      <div className="flex-grow">
        <h3 className="text-white font-semibold text-sm mb-1.5 tracking-tight transition-colors group-hover:text-white/95">
          {tool.name}
        </h3>
        <p className="text-white/40 text-xs line-clamp-2 leading-relaxed group-hover:text-white/50 transition-colors">
          {tool.description}
        </p>
      </div>

      {/* Bottom tag */}
      <div className="mt-4 pt-3.5 border-t border-white/5 flex items-center justify-between">
        <span className="text-[9px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-white/5 text-white/40 border border-white/5">
          {getCategoryLabel(tool.category)}
        </span>
      </div>
    </div>
  );
}

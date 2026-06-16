"use client";

import React from "react";

interface ReportKPICardProps {
  label: string;
  value: string | number;
  delta?: string;
  isUp?: boolean;
  compareMode?: boolean;
  compareLabel?: string;
  subtitle?: string;
}

export default function ReportKPICard({
  label,
  value,
  delta,
  isUp = true,
  compareMode = false,
  compareLabel = "vs prev period",
  subtitle,
}: ReportKPICardProps) {
  return (
    <div className="p-4 rounded-xl bg-[#0d0d1a]/40 border border-white/[0.04] backdrop-blur-md relative overflow-hidden flex flex-col justify-between group transition-all hover:border-white/[0.08] select-none font-sans">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.01] to-transparent pointer-events-none" />

      <div className="space-y-1">
        <span className="text-[10px] uppercase font-bold tracking-wider text-[#70709a]">
          {label}
        </span>
        <div className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">
          {value}
        </div>
        {subtitle && !compareMode && (
          <p className="text-[10px] text-[#70709a] font-medium leading-relaxed mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {(compareMode && delta) ? (
        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
              isUp
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            }`}
          >
            {isUp ? "▲" : "▼"} {delta}
          </span>
          <span className="text-[9px] text-[#70709a] truncate">
            {compareLabel}
          </span>
        </div>
      ) : (
        <div className="h-4 mt-3" />
      )}
    </div>
  );
}

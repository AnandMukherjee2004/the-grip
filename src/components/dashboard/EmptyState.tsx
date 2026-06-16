"use client";

import React from "react";
import Link from "next/link";
import { PlugIcon } from "@/components/ui/Icons";

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText?: string;
  href?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  buttonText = "Connect Tool",
  href = "/onboarding/connect",
  icon,
}: EmptyStateProps) {
  const renderedIcon = icon || <PlugIcon size={28} className="text-white/60" />;

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 rounded-xl bg-[#0d0d1a]/50 border border-white/[0.04] backdrop-blur-md relative overflow-hidden h-full min-h-[200px] select-none group">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] to-purple-500/[0.02] pointer-events-none" />
      <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-indigo-500/[0.03] blur-xl group-hover:bg-indigo-500/[0.05] transition-colors duration-500" />
      
      <div className="mb-3 transform group-hover:scale-110 transition-transform duration-300">
        {renderedIcon}
      </div>
      
      <h4 className="text-sm font-semibold text-white/80 mb-1.5 tracking-tight">
        {title}
      </h4>
      
      <p className="text-xs text-white/40 max-w-[280px] mb-4 leading-relaxed">
        {description}
      </p>
      
      <Link
        href={href}
        className="inline-flex items-center justify-center h-8 px-4 rounded-lg text-[11px] font-semibold bg-white/5 hover:bg-indigo-600/20 border border-white/10 hover:border-indigo-500/30 text-white/70 hover:text-white transition-all active:scale-[0.98]"
      >
        {buttonText}
      </Link>
    </div>
  );
}

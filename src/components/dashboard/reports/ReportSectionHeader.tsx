"use client";

import React from "react";
import Link from "next/link";

interface ReportSectionHeaderProps {
  title: string;
  subtitle: string;
  viewFullLink?: string;
}

export default function ReportSectionHeader({
  title,
  subtitle,
  viewFullLink = "#",
}: ReportSectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5 pb-3 border-b border-white/[0.04]">
      <div>
        <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
        <p className="text-xs text-[#70709a] mt-0.5">{subtitle}</p>
      </div>
      <div>
        <Link
          href={viewFullLink}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1 group"
        >
          View full report
          <span className="transform group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { AlertsIcon } from "@/components/ui/Icons";

export type DateRangeOption = "Today" | "Last 7 days" | "Last 30 days" | "This month" | "Custom";

interface TopBarProps {
  selectedRange: DateRangeOption;
  onRangeChange: (range: DateRangeOption) => void;
}

export default function TopBar({ selectedRange, onRangeChange }: TopBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const options: DateRangeOption[] = [
    "Today",
    "Last 7 days",
    "Last 30 days",
    "This month",
    "Custom",
  ];

  return (
    <header className="h-14 shrink-0 w-full bg-[#07070e]/80 border-b border-white/[0.04] backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 select-none font-sans">
      {/* Left side: Search Bar */}
      <div className="flex items-center gap-4">

        {/* Search */}
        <div className="relative w-48 md:w-64 hidden sm:block">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search leads, payments..."
            className="w-full h-8 pl-8 pr-3 rounded-lg text-xs bg-white/5 border border-white/10 text-white placeholder-white/30 hover:border-white/20 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-sans"
          />
        </div>
      </div>

      {/* Right side: Date Picker, Notification, Profile */}
      <div className="flex items-center gap-4">
        {/* Date picker dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-white/60 hover:text-white bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
          >
            <svg
              className="opacity-70"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{selectedRange}</span>
            <svg
              className="opacity-40 transition-transform duration-200"
              width="8"
              height="8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-1.5 w-48 rounded-lg bg-[#0d0d1a] border border-white/[0.08] shadow-2xl p-1 z-20 animate-fadeIn">
                {options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      onRangeChange(opt);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${selectedRange === opt
                      ? "bg-indigo-600/20 text-indigo-400 font-semibold"
                      : "text-white/60 hover:text-white hover:bg-white/[0.03]"
                      }`}
                  >
                    <span>{opt}</span>
                    {selectedRange === opt && <span>✓</span>}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <button
          type="button"
          className="relative w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all cursor-pointer group"
        >
          <AlertsIcon size={14} />
          {/* Notification dot */}
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.7)] animate-pulse" />
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full border border-white/10 bg-gradient-to-tr from-indigo-500 to-sky-500 flex items-center justify-center text-xs font-bold text-white shadow-md cursor-pointer hover:border-white/30 transition-colors">
          AM
        </div>
      </div>
    </header>
  );
}

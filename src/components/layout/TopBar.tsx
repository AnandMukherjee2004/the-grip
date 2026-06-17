"use client";

import { AlertsIcon } from "@/components/ui/Icons";
import DateRangePicker, {
  DEFAULT_DATE_RANGE,
  type DateRangeSelection,
} from "@/components/ui/DateRangePicker";

export type { DateRangeSelection };
export { DEFAULT_DATE_RANGE };

interface TopBarProps {
  dateRange: DateRangeSelection;
  onDateRangeChange: (range: DateRangeSelection) => void;
}

export default function TopBar({ dateRange, onDateRangeChange }: TopBarProps) {
  return (
    <header className="h-14 shrink-0 w-full bg-[#07070e]/80 border-b border-white/[0.04] backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 select-none font-sans">
      <div className="flex items-center gap-4 flex-1 min-w-0">
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

      <div className="flex items-center gap-3 shrink-0">
        <DateRangePicker value={dateRange} onChange={onDateRangeChange} />
        <button
          type="button"
          className="relative w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all cursor-pointer"
          aria-label="Notifications"
        >
          <AlertsIcon size={14} />
          <span className="notification-indicator" aria-hidden="true" />
        </button>

        <div className="w-8 h-8 rounded-full border border-white/10 bg-gradient-to-tr from-indigo-500 to-sky-500 flex items-center justify-center text-xs font-bold text-white shadow-md cursor-pointer hover:border-white/30 transition-colors">
          AM
        </div>
      </div>
    </header>
  );
}

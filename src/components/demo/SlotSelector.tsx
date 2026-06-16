"use client";

import { useState } from "react";

interface SlotSelectorProps {
  onConfirm: (dateStr: string, timeStr: string) => void;
}

export function SlotSelector({ onConfirm }: SlotSelectorProps) {
  // Generate next 5 business days
  const getNextBusinessDays = () => {
    const days = [];
    const current = new Date();
    
    // Start from tomorrow
    current.setDate(current.getDate() + 1);

    while (days.length < 5) {
      const dayOfWeek = current.getDay();
      // Skip Saturday (6) and Sunday (0)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        days.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const businessDays = getNextBusinessDays();
  const timeSlots = ["09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM"];

  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");

  const selectedDay = businessDays[selectedDayIdx];

  const handleConfirm = () => {
    if (!selectedTime) return;

    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };
    const dateStr = selectedDay.toLocaleDateString('en-US', dateOptions);
    onConfirm(dateStr, selectedTime);
  };

  return (
    <div className="w-full max-w-lg lg:ml-auto space-y-6 animate-fadeIn">
      {/* Title */}
      <div className="text-center">
        <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-3">
          <span className="text-md text-indigo-400">📅</span>
        </div>
        <h2 className="font-display text-xl font-bold text-white mb-1 leading-tight">
          Select a Time Slot
        </h2>
        <p className="text-white/50 text-[11px] max-w-sm mx-auto">
          Choose a convenient date and time for your interactive pipeline walkthrough.
        </p>
      </div>

      {/* Date Row Selection */}
      <div className="space-y-2">
        <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest">Select Date</label>
        <div className="grid grid-cols-5 gap-1.5">
          {businessDays.map((date, idx) => {
            const isSelected = selectedDayIdx === idx;
            const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
            const dayNum = date.getDate();
            
            return (
              <button
                type="button"
                key={idx}
                onClick={() => {
                  setSelectedDayIdx(idx);
                  setSelectedTime(""); // Reset time on day change
                }}
                className={`py-2.5 rounded-lg border flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? "bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)] font-semibold"
                    : "bg-black/20 border-white/10 text-white/60 hover:border-white/20 hover:text-white"
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider opacity-60 mb-0.5">{dayName}</span>
                <span className="text-sm font-mono">{dayNum}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Grid Selection */}
      <div className="space-y-2">
        <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest">Select Time</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {timeSlots.map((time) => {
            const isSelected = selectedTime === time;
            
            return (
              <button
                type="button"
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`h-11 rounded-lg border text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                    : "bg-black/20 border-white/10 text-white/60 hover:border-white/20 hover:text-white"
                }`}
              >
                {time}
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirm CTA */}
      <div className="pt-2">
        <button
          type="button"
          disabled={!selectedTime}
          onClick={handleConfirm}
          className="w-full h-11 rounded-lg bg-gradient-to-r from-indigo-600 to-sky-500 text-white font-semibold text-xs hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(99,102,241,0.2)] disabled:opacity-40 disabled:pointer-events-none"
        >
          Confirm Demo Time →
        </button>
      </div>
    </div>
  );
}

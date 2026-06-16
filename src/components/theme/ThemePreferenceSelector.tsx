"use client";

import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { THEME_PREFERENCE_OPTIONS } from "./themePreferenceOptions";

export function ThemePreferenceSelector() {
  const { preference, setPreference } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="theme-preference-inline h-9 rounded-lg bg-white/5 border border-white/10 animate-pulse"
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className="theme-preference-inline"
      role="group"
      aria-label="Color theme"
    >
      {THEME_PREFERENCE_OPTIONS.map((option) => {
        const isActive = preference === option.value;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            type="button"
            className="theme-preference-inline__btn"
            data-active={isActive ? "true" : "false"}
            aria-pressed={isActive}
            onClick={() => setPreference(option.value)}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

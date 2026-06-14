"use client";

import { useTheme } from "./ThemeProvider";
import type { ThemePreference } from "@/lib/theme";

const OPTIONS: Array<{
  value: ThemePreference;
  label: string;
  icon: string;
}> = [
  { value: "light", label: "Light", icon: "☀" },
  { value: "dark", label: "Dark", icon: "🌙" },
  { value: "system", label: "System", icon: "💻" },
];

export function ThemeSwitcher() {
  const { preference, setPreference } = useTheme();

  return (
    <div
      className="theme-switcher"
      role="group"
      aria-label="Color theme"
    >
      {OPTIONS.map((option) => {
        const isActive = preference === option.value;

        return (
          <button
            key={option.value}
            type="button"
            className="theme-switcher__btn"
            data-active={isActive ? "true" : "false"}
            aria-pressed={isActive}
            aria-label={`${option.label} theme`}
            title={`${option.label} theme`}
            onClick={() => setPreference(option.value)}
          >
            <span className="theme-switcher__icon" aria-hidden="true">
              {option.icon}
            </span>
            <span className="theme-switcher__label">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

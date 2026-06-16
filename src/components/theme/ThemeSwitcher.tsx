"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import type { ThemePreference } from "@/lib/theme";
import { THEME_PREFERENCE_OPTIONS } from "./themePreferenceOptions";

export function ThemeSwitcher() {
  const pathname = usePathname();
  const { preference, setPreference } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleButtonClick = (value: ThemePreference, e: React.MouseEvent) => {
    if (!isOpen) {
      e.stopPropagation();
      setIsOpen(true);
    } else {
      setPreference(value);
      setIsOpen(false);
    }
  };

  if (!mounted || pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="theme-switcher"
      data-open={isOpen ? "true" : "false"}
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
            className="theme-switcher__btn"
            data-active={isActive ? "true" : "false"}
            aria-pressed={isActive}
            aria-label={`${option.label} theme`}
            title={`${option.label} theme`}
            onClick={(e) => handleButtonClick(option.value, e)}
          >
            <span className="theme-switcher__icon" aria-hidden="true">
              <Icon className="w-4 h-4" />
            </span>
            <span className="theme-switcher__label">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

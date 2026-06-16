"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import type { ThemePreference } from "@/lib/theme";

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function MonitorIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  );
}

const OPTIONS = [
  { value: "light" as ThemePreference, label: "Light", icon: SunIcon },
  { value: "dark" as ThemePreference, label: "Dark", icon: MoonIcon },
  { value: "system" as ThemePreference, label: "System", icon: MonitorIcon },
];

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
      {OPTIONS.map((option) => {
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

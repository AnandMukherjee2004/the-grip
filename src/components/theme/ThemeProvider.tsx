"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  applyThemeToDocument,
  persistPreference,
  readStoredPreference,
  resolveTheme,
  type ResolvedTheme,
  type ThemePreference,
} from "@/lib/theme";

type ThemeContextValue = {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readInitialPreference(): ThemePreference {
  if (typeof document === "undefined") return "dark";
  const attr = document.documentElement.getAttribute("data-theme-preference");
  if (attr === "dark" || attr === "light" || attr === "system") return attr;
  return readStoredPreference();
}

function readInitialResolved(): ResolvedTheme {
  if (typeof document === "undefined") return "dark";
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "light" ? "light" : "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(
    readInitialPreference
  );
  const [resolved, setResolved] = useState<ResolvedTheme>(readInitialResolved);
  const [ready, setReady] = useState(false);

  const apply = useCallback((nextPreference: ThemePreference) => {
    const nextResolved = resolveTheme(nextPreference);
    setPreferenceState(nextPreference);
    setResolved(nextResolved);
    applyThemeToDocument(nextPreference, nextResolved);
    persistPreference(nextPreference);
  }, []);

  useEffect(() => {
    const stored = readStoredPreference();
    const nextResolved = resolveTheme(stored);
    setPreferenceState(stored);
    setResolved(nextResolved);
    applyThemeToDocument(stored, nextResolved);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || preference !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const onChange = () => {
      const nextResolved = resolveTheme("system");
      setResolved(nextResolved);
      applyThemeToDocument("system", nextResolved);
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [preference, ready]);

  const setPreference = useCallback(
    (nextPreference: ThemePreference) => {
      apply(nextPreference);
    },
    [apply]
  );

  const value = useMemo(
    () => ({ preference, resolved, setPreference }),
    [preference, resolved, setPreference]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

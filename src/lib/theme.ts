export type ThemePreference = "dark" | "light" | "system";
export type ResolvedTheme = "dark" | "light";

export const THEME_STORAGE_KEY = "theme";

const VALID_PREFERENCES: ThemePreference[] = ["dark", "light", "system"];

export function isThemePreference(value: string | null): value is ThemePreference {
  return value !== null && VALID_PREFERENCES.includes(value as ThemePreference);
}

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference === "dark") return "dark";
  if (preference === "light") return "light";
  return getSystemTheme();
}

export function readStoredPreference(): ThemePreference {
  if (typeof window === "undefined") return "dark";

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemePreference(stored)) return stored;

    const legacy = localStorage.getItem("grip-theme");
    if (legacy === "dark" || legacy === "light") {
      localStorage.setItem(THEME_STORAGE_KEY, legacy);
      localStorage.removeItem("grip-theme");
      return legacy;
    }
  } catch {
    /* ignore */
  }

  return "dark";
}

export function applyThemeToDocument(
  preference: ThemePreference,
  resolved?: ResolvedTheme
) {
  const theme = resolved ?? resolveTheme(preference);
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.setAttribute("data-theme-preference", preference);
}

export function persistPreference(preference: ThemePreference) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    /* ignore */
  }
}

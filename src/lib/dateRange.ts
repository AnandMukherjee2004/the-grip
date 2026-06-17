export type DateRangePreset =
  | "Today"
  | "Last 7 days"
  | "Last 30 days"
  | "This month";

export type DateRangeKind = "preset" | "custom-range" | "custom-date";

export type DateRangeSelection = {
  kind: DateRangeKind;
  preset?: DateRangePreset;
  customRangeStart?: string;
  customRangeEnd?: string;
  customDate?: string;
};

export const DEFAULT_DATE_RANGE: DateRangeSelection = {
  kind: "preset",
  preset: "Last 30 days",
};

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseISODate(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatDisplayDate(iso: string): string {
  const date = parseISODate(iso);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getDateRangeLabel(selection: DateRangeSelection): string {
  if (selection.kind === "preset" && selection.preset) {
    return selection.preset;
  }
  if (
    selection.kind === "custom-range" &&
    selection.customRangeStart &&
    selection.customRangeEnd
  ) {
    return `${formatDisplayDate(selection.customRangeStart)} – ${formatDisplayDate(selection.customRangeEnd)}`;
  }
  if (selection.kind === "custom-date" && selection.customDate) {
    return formatDisplayDate(selection.customDate);
  }
  return "Last 30 days";
}

export const DATE_RANGE_PRESETS: DateRangePreset[] = [
  "Today",
  "Last 7 days",
  "Last 30 days",
  "This month",
];

import type { CSSProperties } from "react";
import type { ResolvedTheme } from "./theme";

export type ChartColors = {
  axis: string;
  grid: string;
  tooltip: CSSProperties;
  legend: CSSProperties;
  dotFill: string;
  labelFill: string;
};

const DARK: ChartColors = {
  axis: "rgba(208, 208, 232, 0.55)",
  grid: "rgba(208, 208, 232, 0.06)",
  tooltip: {
    backgroundColor: "#0d0d1a",
    borderColor: "rgba(208, 208, 232, 0.08)",
    borderRadius: 8,
    fontSize: 11,
    color: "#d0d0e8",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
  },
  legend: { fontSize: 10, color: "rgba(208, 208, 232, 0.7)" },
  dotFill: "#0d0d1a",
  labelFill: "#ffffff",
};

const LIGHT: ChartColors = {
  axis: "#6b7280",
  grid: "rgba(99, 102, 241, 0.1)",
  tooltip: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderColor: "rgba(99, 102, 241, 0.12)",
    borderRadius: 8,
    fontSize: 11,
    color: "#374151",
    boxShadow: "0 10px 30px rgba(99, 102, 241, 0.08)",
  },
  legend: { fontSize: 10, color: "#4b5563" },
  dotFill: "#ffffff",
  labelFill: "#374151",
};

export function getChartColors(theme: ResolvedTheme): ChartColors {
  return theme === "light" ? LIGHT : DARK;
}

export function chartAxisProps(colors: ChartColors) {
  return {
    stroke: colors.axis,
    tick: { fill: colors.axis },
    tickLine: false as const,
    axisLine: false as const,
  };
}

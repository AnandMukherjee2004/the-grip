"use client";

import { useTheme } from "@/components/theme/ThemeProvider";
import { chartAxisProps, getChartColors } from "@/lib/chartTheme";

export function useChartColors() {
  const { resolved } = useTheme();
  const colors = getChartColors(resolved);

  return {
    colors,
    axis: chartAxisProps(colors),
  };
}

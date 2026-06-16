"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useChartColors } from "@/hooks/useChartColors";

interface AttributionChartProps {
  connectedTools: string[];
}

const mockAttributionData = [
  { channel: "Meta", revenue: 245000, color: "#1877F2" },
  { channel: "Google", revenue: 185000, color: "#EA4335" },
  { channel: "WhatsApp", revenue: 95000, color: "#25D366" },
  { channel: "Organic", revenue: 120000, color: "#6366F1" },
  { channel: "Direct", revenue: 60000, color: "#9A9AC0" },
];

const mockAttributionSummary = [
  { channel: "Meta Ads", spend: "₹75,000", leads: 420, revenue: "₹2,45,000", roi: "326%" },
  { channel: "Google Ads", spend: "₹50,000", leads: 280, revenue: "₹1,85,000", roi: "370%" },
  { channel: "WhatsApp", spend: "₹12,000", leads: 190, revenue: "₹95,000", roi: "791%" },
  { channel: "Organic Search", spend: "₹0", leads: 210, revenue: "₹1,20,000", roi: "∞" },
  { channel: "Direct Traffic", spend: "₹0", leads: 95, revenue: "₹60,000", roi: "∞" },
];

export default function AttributionChart({ connectedTools }: AttributionChartProps) {
  const { colors, axis } = useChartColors();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Ad platforms check
  // Note: We might select Meta Ads or Google Ads in tools / onboarding
  const hasAdPlatform = connectedTools.some((t) =>
    ["meta", "google-ads", "google", "meta-ads", "facebook", "facebook-ads"].includes(t)
  );

  // Fallback: If no ad platforms are explicitly selected in the store,
  // we do not render this zone at all, as per specification:
  // "If no ad platform connected: do not render this zone at all"
  if (!hasAdPlatform) {
    return null;
  }

  const formatYAxis = (value: number) => {
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${value / 1000}k`;
  };

  return (
    <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-6 select-none font-sans relative overflow-hidden flex flex-col gap-6">
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.01] to-transparent pointer-events-none" />

      <div>
        <h3 className="text-sm font-semibold text-white/90">Revenue by source</h3>
        <p className="text-[10px] text-[#70709a]">Channel ROI and lead source attribution</p>
      </div>

      {/* Bar Chart */}
      <div className="h-[220px] w-full text-xs text-[#70709a]">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockAttributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
              <XAxis
                dataKey="channel"
                {...axis}
                dy={8}
                style={{ fontSize: 9, fontWeight: 500 }}
              />
              <YAxis
                {...axis}
                tickFormatter={formatYAxis}
                style={{ fontSize: 9, fontWeight: 500 }}
              />
              <Tooltip
                contentStyle={colors.tooltip}
                formatter={(value: unknown) => [
                  `₹${Number(value).toLocaleString("en-IN")}`,
                  "Revenue",
                ]}
                labelStyle={{ fontWeight: "bold", color: colors.labelFill, marginBottom: 4 }}
              />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {mockAttributionData.map((entry, index) => (
                  <path
                    key={`bar-path-${index}`}
                    fill={entry.color}
                    opacity={0.8}
                    className="hover:opacity-100 transition-opacity duration-200"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] text-white/20">
            Loading bar visualizations...
          </div>
        )}
      </div>

      {/* Attribution Summary Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-white/30 font-semibold">
              <th className="py-2">Channel</th>
              <th className="py-2">Spend</th>
              <th className="py-2">Leads</th>
              <th className="py-2">Revenue</th>
              <th className="py-2 text-right">ROI %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02] text-white/80">
            {mockAttributionSummary.map((item, idx) => (
              <tr key={idx} className="hover:bg-white/[0.01]">
                <td className="py-2.5 font-semibold text-white/95">{item.channel}</td>
                <td className="py-2.5 font-medium">{item.spend}</td>
                <td className="py-2.5">{item.leads}</td>
                <td className="py-2.5 font-semibold text-indigo-400">{item.revenue}</td>
                <td
                  className={`py-2.5 text-right font-bold ${
                    item.roi === "∞"
                      ? "text-emerald-400"
                      : parseInt(item.roi) > 300
                        ? "text-emerald-400"
                        : "text-white/80"
                  }`}
                >
                  {item.roi === "∞" ? "∞" : item.roi}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

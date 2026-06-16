"use client";

interface AgentLeaderboardProps {
  connectedTools: string[];
}

interface LeaderboardRow {
  rank: number;
  name: string;
  deals: number;
  revenue: string;
  conversion: string;
}

const mockLeaderboard: LeaderboardRow[] = [
  { rank: 1, name: "Arjun Mehta", deals: 14, revenue: "₹18,25,000", conversion: "12.4%" },
  { rank: 2, name: "Kavya Reddy", deals: 11, revenue: "₹14,80,000", conversion: "10.1%" },
  { rank: 3, name: "Rohan Gupta", deals: 9, revenue: "₹11,40,000", conversion: "9.8%" },
  { rank: 4, name: "Sneha Iyer", deals: 8, revenue: "₹9,50,000", conversion: "8.2%" },
  { rank: 5, name: "Divya Nair", deals: 6, revenue: "₹6,80,000", conversion: "7.5%" },
];

export default function AgentLeaderboard({ connectedTools }: AgentLeaderboardProps) {
  const isCrmConnected = connectedTools.some((t) =>
    ["hubspot", "salesforce", "leadsquared", "freshsales", "zoho-crm", "pipedrive"].includes(t)
  );

  // Specification: "If no CRM: do not render"
  if (!isCrmConnected) {
    return null;
  }

  return (
    <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-6 select-none font-sans relative overflow-hidden flex flex-col gap-4">
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.01] to-transparent pointer-events-none" />

      <div>
        <h3 className="text-sm font-semibold text-white/90">Top agents this period</h3>
        <p className="text-[10px] text-[#70709a]">CRM owner attribution leaderboard</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-white/30 font-semibold">
              <th className="py-2 w-16">Rank</th>
              <th className="py-2">Agent Name</th>
              <th className="py-2">Deals Closed</th>
              <th className="py-2">Revenue Generated</th>
              <th className="py-2 text-right">Conversion Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02] text-white/80">
            {mockLeaderboard.map((row) => (
              <tr key={row.rank} className="hover:bg-white/[0.01]">
                <td className="py-2.5 font-mono">
                  <span
                    className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold ${
                      row.rank === 1
                        ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                        : row.rank === 2
                          ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                          : "bg-white/5 text-white/40 border border-white/10"
                    }`}
                  >
                    #{row.rank}
                  </span>
                </td>
                <td className="py-2.5 font-semibold text-white/95">{row.name}</td>
                <td className="py-2.5">{row.deals} deals</td>
                <td className="py-2.5 font-bold text-white">{row.revenue}</td>
                <td className="py-2.5 text-right font-semibold text-indigo-400">{row.conversion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

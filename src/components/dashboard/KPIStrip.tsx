"use client";

interface KPIStripProps {
  connectedTools: string[];
}

export default function KPIStrip({ connectedTools }: KPIStripProps) {
  const isCrmConnected = connectedTools.some((t) =>
    ["hubspot", "salesforce", "leadsquared", "freshsales", "zoho-crm", "pipedrive"].includes(t)
  );

  const isPaymentsConnected = connectedTools.some((t) =>
    ["razorpay", "stripe", "payu", "cashfree"].includes(t)
  );

  // Derive display values based on connector statuses
  const revenueValue = isPaymentsConnected ? "₹6,84,300" : "₹0";
  const revenueDelta = isPaymentsConnected ? "+12.4%" : "0.0%";
  const revenueUp = true;

  const leadsValue = isCrmConnected ? "1,248" : "0";
  const leadsDelta = isCrmConnected ? "+8.2%" : "0.0%";
  const leadsUp = true;

  const conversionValue = isCrmConnected ? "9.6%" : "0.0%";
  const conversionDelta = isCrmConnected ? "+1.1%" : "0.0%";
  const conversionUp = true;

  const activeDealsCount = isCrmConnected ? "142" : "0";
  const activeDealsValue = isCrmConnected ? "₹48.6L" : "₹0";
  const activeDealsDelta = isCrmConnected ? "+15.3%" : "0.0%";
  const activeDealsUp = true;

  const avgDealValue = isCrmConnected ? "₹34,225" : "₹0";
  const avgDealDelta = isCrmConnected ? "-2.4%" : "0.0%";
  const avgDealUp = false;

  const cards = [
    {
      label: "Total Revenue",
      value: revenueValue,
      delta: revenueDelta,
      isUp: revenueUp,
      subtitle: "from all payment tools",
    },
    {
      label: "Total Leads",
      value: leadsValue,
      delta: leadsDelta,
      isUp: leadsUp,
      subtitle: "across connected CRMs",
    },
    {
      label: "Conversion Rate",
      value: conversionValue,
      delta: conversionDelta,
      isUp: conversionUp,
      subtitle: "leads → paid customers",
    },
    {
      label: "Active Deals",
      value: `${activeDealsCount} (${activeDealsValue})`,
      delta: activeDealsDelta,
      isUp: activeDealsUp,
      subtitle: "open sales pipeline",
    },
    {
      label: "Avg Deal Size",
      value: avgDealValue,
      delta: avgDealDelta,
      isUp: avgDealUp,
      subtitle: "rolling period average",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full select-none font-sans">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="p-4 rounded-xl bg-[#0d0d1a]/40 border border-white/[0.04] backdrop-blur-md relative overflow-hidden flex flex-col justify-between group transition-all hover:border-white/[0.08]"
        >
          {/* Subtle Glows */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
          
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#70709a]">
              {card.label}
            </span>
            <div className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">
              {card.value}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5">
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                card.isUp
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              }`}
            >
              {card.isUp ? "▲" : "▼"} {card.delta}
            </span>
            <span className="text-[9px] text-[#70709a] truncate">
              vs prev period
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

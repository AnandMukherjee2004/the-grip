"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useOnboarding } from "@/context/OnboardingContext";
import { TOOLS } from "@/lib/tools";
import {
  LeadsIcon,
  PaymentsIcon,
  OrdersIcon,
  XCircleIcon,
  CheckCircleIcon,
  ZapIcon,
} from "@/components/ui/Icons";

interface ActivityEvent {
  id: string;
  type:
  | "lead_added"
  | "deal_won"
  | "payment_received"
  | "order_placed"
  | "order_fulfilled"
  | "payment_failed"
  | "sync_completed";
  description: string;
  timeAgo: string;
  timestamp: Date;
}

const initialEvents: ActivityEvent[] = [
  {
    id: "evt-1",
    type: "payment_received",
    description: "Payment of ₹1,800 received via Razorpay.",
    timeAgo: "2m ago",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
  },
  {
    id: "evt-2",
    type: "order_placed",
    description: "Order #SH-1025 placed in Shopify.",
    timeAgo: "10m ago",
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
  },
  {
    id: "evt-3",
    type: "lead_added",
    description: "New Lead Kavya Reddy synced from HubSpot.",
    timeAgo: "12m ago",
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
  },
  {
    id: "evt-4",
    type: "deal_won",
    description: "Deal for Arjun Mehta marked Won in Salesforce.",
    timeAgo: "45m ago",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
  },
  {
    id: "evt-5",
    type: "sync_completed",
    description: "HubSpot CRM database sync completed.",
    timeAgo: "1h ago",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: "evt-6",
    type: "payment_failed",
    description: "Stripe payment failed for Sanjay Kumar (₹2,400).",
    timeAgo: "2h ago",
    timestamp: new Date(Date.now() - 120 * 60 * 1000),
  },
  {
    id: "evt-7",
    type: "order_fulfilled",
    description: "Order #SH-1021 marked Fulfilled in Shopify.",
    timeAgo: "3h ago",
    timestamp: new Date(Date.now() - 180 * 60 * 1000),
  },
];

interface ActivityFeedProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function ActivityFeed({ isCollapsed, onToggleCollapse }: ActivityFeedProps) {
  const { connectedTools } = useOnboarding();
  const [events, setEvents] = useState<ActivityEvent[]>(initialEvents);
  const [timeReady, setTimeReady] = useState(false);

  // Map connected tool IDs to their configs
  const activeTools = TOOLS.filter((t) => connectedTools.includes(t.id));

  useEffect(() => {
    setTimeReady(true);

    // Poll every 30 seconds for new events
    // TODO: wire to real events endpoint
    const interval = setInterval(() => {
      const randomEventTypes: ActivityEvent["type"][] = [
        "lead_added",
        "payment_received",
        "order_placed",
        "payment_failed",
      ];
      const randomType = randomEventTypes[Math.floor(Math.random() * randomEventTypes.length)];

      let description = "";
      if (randomType === "lead_added") {
        description = "New lead captured via Meta Ads connector.";
      } else if (randomType === "payment_received") {
        description = "Payment of ₹1,450 received via Razorpay.";
      } else if (randomType === "order_placed") {
        description = "Order #SH-1026 placed in Shopify.";
      } else if (randomType === "payment_failed") {
        description = "Razorpay payment of ₹950 failed (customer cancelled).";
      }

      const newEvent: ActivityEvent = {
        id: `evt-${Date.now()}`,
        type: randomType,
        description,
        timeAgo: "Just now",
        timestamp: new Date(),
      };

      setEvents((prev) => [newEvent, ...prev].slice(0, 20)); // Max 20 visible events
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getToolSyncStatus = (toolId: string) => {
    switch (toolId) {
      case "hubspot":
        return { status: "green", mins: 12 };
      case "stripe":
        return { status: "yellow", mins: 74 };
      case "zoho-crm":
        return { status: "red", mins: 140 };
      case "razorpay":
        return { status: "green", mins: 5 };
      case "shopify":
        return { status: "green", mins: 28 };
      default:
        return { status: "green", mins: 15 };
    }
  };

  const getEventIcon = (type: ActivityEvent["type"]) => {
    switch (type) {
      case "lead_added":
        return <LeadsIcon size={14} className="text-indigo-400" />;
      case "deal_won":
        return <CheckCircleIcon size={14} className="text-emerald-400" />;
      case "payment_received":
        return <PaymentsIcon size={14} className="text-sky-400" />;
      case "order_placed":
        return <OrdersIcon size={14} className="text-amber-400" />;
      case "order_fulfilled":
        return <CheckCircleIcon size={14} className="text-emerald-400" />;
      case "payment_failed":
        return <XCircleIcon size={14} className="text-rose-400" />;
      case "sync_completed":
        return <ZapIcon size={14} className="text-indigo-400" />;
      default:
        return <ZapIcon size={14} className="text-white/60" />;
    }
  };

  const updateTimeAgo = (timestamp: Date) => {
    const diffMs = Date.now() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 1000 / 60);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return timestamp.toLocaleDateString();
  };

  if (isCollapsed) {
    return (
      <div className="w-[40px] h-full bg-[#07070e] border-l border-white/[0.04] flex flex-col items-center py-4 shrink-0 transition-all select-none">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="text-xs font-semibold text-white/50 hover:text-white transition-colors cursor-pointer w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center"
          title="Expand Feed"
        >
          ◀
        </button>
        <div className="h-full flex items-center justify-center">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#70709a] rotate-90 whitespace-nowrap">
            Activity & Tools
          </span>
        </div>
      </div>
    );
  }

  return (
    <aside className="w-[280px] h-full bg-[#07070e] border-l border-white/[0.04] flex flex-col shrink-0 select-none font-sans relative transition-all">
      {/* Main Top Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-white/[0.03]">
        <span className="font-semibold text-xs text-white">Feed</span>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="text-[10px] text-white/40 hover:text-white transition-colors cursor-pointer w-6 h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center"
          title="Collapse Feed"
        >
          ▶
        </button>
      </div>

      {/* Section 1: Connected Tools Sync Health */}
      <div className="p-4 border-b border-white/[0.03] flex flex-col gap-3">
        <span className="text-[10px] uppercase tracking-wider text-[#70709a] font-bold">
          Connected Tools
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {activeTools.length === 0 ? (
            <span className="text-[11px] text-white/30 font-medium py-1">
              No tools connected.
            </span>
          ) : (
            activeTools.map((tool) => {
              const { status, mins } = getToolSyncStatus(tool.id);
              return (
                <div
                  key={tool.id}
                  className="relative group w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all flex items-center justify-center cursor-help shrink-0"
                >
                  {tool.logo ? (
                    <img
                      src={tool.logo}
                      alt={tool.name}
                      className="w-5 h-5 object-contain"
                    />
                  ) : (
                    <span className="text-xs">{tool.icon}</span>
                  )}

                  {/* Status dot — minimal, bottom-right */}
                  <span
                    className={`connector-status-dot connector-status-dot--${status}`}
                    aria-hidden="true"
                  />

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-36 text-center bg-[#07070e] border border-white/15 rounded p-1 text-[10px] text-white/80 shadow-2xl pointer-events-none z-20">
                    <p className="font-semibold text-white">{tool.name}</p>
                    <p className="text-white/40 mt-0.5">
                      {status === "red"
                        ? "Sync Error"
                        : status === "yellow"
                          ? `Synced ${mins}m ago`
                          : `Synced ${mins}m ago`}
                    </p>
                  </div>
                </div>
              );
            })
          )}

          {/* Add Connector Button */}
          <Link
            href="/dashboard/connectors"
            className="w-8 h-8 rounded-lg border border-dashed border-white/20 hover:border-indigo-500/40 hover:bg-white/5 flex items-center justify-center text-xs font-bold text-[#70709a] hover:text-indigo-400 transition-all cursor-pointer shrink-0"
            title="Add Connector"
          >
            +
          </Link>
        </div>
      </div>

      {/* Section 2: Live Activity Feed */}
      <div className="flex-grow flex flex-col p-4 min-h-0">
        <span className="text-[10px] uppercase tracking-wider text-[#70709a] font-bold mb-3 block">
          Live Activity
        </span>
        <div className="flex-grow overflow-y-auto space-y-4 pr-1 scrollbar-thin">
          {events.map((evt) => {
            const isError = evt.type === "payment_failed";
            return (
              <div key={evt.id} className="flex gap-3 items-start group">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 select-none border transition-all ${isError
                      ? "bg-rose-500/10 border-rose-500/20 text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.1)]"
                      : "bg-white/5 border-white/10 text-white/70"
                    }`}
                >
                  {getEventIcon(evt.type)}
                </div>

                <div className="flex flex-col min-w-0">
                  <span
                    className={`text-xs leading-snug transition-colors ${isError ? "text-rose-400 font-medium" : "text-white/80 group-hover:text-white"
                      }`}
                  >
                    {evt.description}
                  </span>
                  <span className="text-[9px] text-[#70709a] mt-0.5 font-medium">
                    {timeReady
                      ? evt.timeAgo === "Just now"
                        ? "Just now"
                        : updateTimeAgo(evt.timestamp)
                      : evt.timeAgo}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

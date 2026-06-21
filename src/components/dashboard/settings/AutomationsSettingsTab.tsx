"use client";

import { useState } from "react";
import Link from "next/link";

interface AutomationItem {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  lastTriggered: string;
}

const INITIAL_AUTOMATIONS: AutomationItem[] = [
  {
    id: "auto_1",
    name: "Razorpay Failed Alert",
    description: "Payment fails → send WhatsApp notification to support",
    isActive: true,
    lastTriggered: "10 mins ago",
  },
  {
    id: "auto_2",
    name: "Shopify First Order Move",
    description: "First order placed → auto-move lead to Contacted stage",
    isActive: true,
    lastTriggered: "2 hours ago",
  },
  {
    id: "auto_3",
    name: "High Value Slack Alert",
    description: "Deal above ₹1,00,000 → notify sales on Slack",
    isActive: true,
    lastTriggered: "Yesterday",
  },
  {
    id: "auto_4",
    name: "Meta Budget Threshold Alert",
    description: "Daily spend exceeds ₹10,000 → email admin",
    isActive: false,
    lastTriggered: "3 days ago",
  },
  {
    id: "auto_5",
    name: "LeadSquared Status Sync",
    description: "Lead status update → post to workspace channels",
    isActive: true,
    lastTriggered: "4 hours ago",
  },
];

export function AutomationsSettingsTab() {
  const [automations, setAutomations] = useState(INITIAL_AUTOMATIONS);

  const toggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((rule) =>
        rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
  };

  const activeCount = automations.filter((rule) => rule.isActive).length;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Automations
          </h1>
          <p className="text-sm text-gray-500">
            Build trigger workflows and operational alerts across your connectors.
          </p>
        </div>
        <Link
          href="/dashboard/automations"
          className="shrink-0 rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-gray-800 active:scale-95"
        >
          + New automation
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Active</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{activeCount}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Total rules</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{automations.length}</p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-500">Your automations</p>
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm divide-y divide-gray-100">
          {automations.map((rule) => (
            <div
              key={rule.id}
              className="flex items-start justify-between gap-4 p-4 hover:bg-gray-50/50 transition-colors"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900">{rule.name}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      rule.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {rule.isActive ? "Active" : "Paused"}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{rule.description}</p>
                <p className="text-[11px] text-gray-400">Last run {rule.lastTriggered}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleAutomation(rule.id)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                  rule.isActive ? "bg-gray-900" : "bg-gray-200"
                }`}
                aria-label={rule.isActive ? "Pause automation" : "Activate automation"}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    rule.isActive ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-gray-900">Need the full builder?</p>
        <p className="mt-1 text-xs text-gray-500">
          Open the automations workspace for templates, run logs, and advanced workflow editing.
        </p>
        <Link
          href="/dashboard/automations"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
        >
          Open automations dashboard
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}

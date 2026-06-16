"use client";

import Link from "next/link";
import { useOnboarding } from "@/context/OnboardingContext";
import {
  DashboardIcon,
  ReportsIcon,
  OrdersIcon,
  PaymentsIcon,
  LeadsIcon,
  PipelineIcon,
  AutomationsIcon,
  ConnectorsIcon,
  AlertsIcon,
  SettingsIcon,
} from "@/components/ui/Icons";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const { connectedTools } = useOnboarding();

  // Mock value for failed payments
  const failedPaymentsCount = 3;

  return (
    <aside
      className={`h-screen bg-[#07070e] border-r border-white/[0.04] flex flex-col justify-between shrink-0 select-none font-sans transition-all duration-300 ${
        isCollapsed ? "w-[60px]" : "w-[220px]"
      }`}
    >
      {/* Top Section */}
      <div className="flex flex-col">
        {/* Brand/Logo */}
        <div
          className={`h-14 px-4 flex items-center border-b border-b-white/[0.03] ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!isCollapsed && (
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-md bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-[0_0_12px_rgba(99,102,241,0.4)]" />
              <span className="font-semibold text-sm tracking-wider text-white font-display">
                GRIP
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="text-[10px] text-white/40 hover:text-white transition-colors cursor-pointer w-6 h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? "▶" : "◀"}
          </button>
        </div>

        {/* Nav Links */}
        <nav className={`space-y-5 ${isCollapsed ? "p-2" : "p-4"}`}>
          {/* Section: Overview */}
          <div>
            {!isCollapsed && (
              <div className="text-[10px] uppercase tracking-widest text-white/30 font-semibold px-2.5 mb-2">
                Overview
              </div>
            )}
            <ul className="space-y-1">
              <li>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-2.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-white/[0.04] border border-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all ${
                    isCollapsed ? "justify-center px-0" : "px-2.5"
                  }`}
                  title="Dashboard"
                >
                  <DashboardIcon className="text-white/70" size={14} />
                  {!isCollapsed && <span>Dashboard</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/reports"
                  className={`flex items-center gap-2.5 py-1.5 rounded-lg text-xs font-medium text-white/50 hover:text-white hover:bg-white/[0.02] transition-all ${
                    isCollapsed ? "justify-center px-0" : "px-2.5"
                  }`}
                  title="Reports"
                >
                  <ReportsIcon className="text-white/40 group-hover:text-white/70" size={14} />
                  {!isCollapsed && <span>Reports</span>}
                </Link>
              </li>
            </ul>
          </div>

          {/* Section: Revenue */}
          <div>
            {!isCollapsed && (
              <div className="text-[10px] uppercase tracking-widest text-white/30 font-semibold px-2.5 mb-2">
                Revenue
              </div>
            )}
            <ul className="space-y-1">
              <li>
                <Link
                  href="/dashboard/orders"
                  className={`flex items-center gap-2.5 py-1.5 rounded-lg text-xs font-medium text-white/50 hover:text-white hover:bg-white/[0.02] transition-all ${
                    isCollapsed ? "justify-center px-0" : "px-2.5"
                  }`}
                  title="Orders"
                >
                  <OrdersIcon className="text-white/40 group-hover:text-white/70" size={14} />
                  {!isCollapsed && <span>Orders</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/payments"
                  className={`flex items-center rounded-lg text-xs font-medium text-white/50 hover:text-white hover:bg-white/[0.02] transition-all ${
                    isCollapsed ? "justify-center py-1.5" : "justify-between px-2.5 py-1.5"
                  }`}
                  title="Payments"
                >
                  <div className="flex items-center gap-2.5">
                    <PaymentsIcon className="text-white/40 group-hover:text-white/70" size={14} />
                    {!isCollapsed && <span>Payments</span>}
                  </div>
                  {!isCollapsed && failedPaymentsCount > 0 && (
                    <span className="h-4 min-w-4 px-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[9px] font-bold flex items-center justify-center">
                      {failedPaymentsCount}
                    </span>
                  )}
                </Link>
              </li>
            </ul>
          </div>

          {/* Section: Sales */}
          <div>
            {!isCollapsed && (
              <div className="text-[10px] uppercase tracking-widest text-white/30 font-semibold px-2.5 mb-2">
                Sales
              </div>
            )}
            <ul className="space-y-1">
              <li>
                <Link
                  href="/dashboard/leads"
                  className={`flex items-center gap-2.5 py-1.5 rounded-lg text-xs font-medium text-white/50 hover:text-white hover:bg-white/[0.02] transition-all ${
                    isCollapsed ? "justify-center px-0" : "px-2.5"
                  }`}
                  title="Leads"
                >
                  <LeadsIcon className="text-white/40 group-hover:text-white/70" size={14} />
                  {!isCollapsed && <span>Leads</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/pipeline"
                  className={`flex items-center gap-2.5 py-1.5 rounded-lg text-xs font-medium text-white/50 hover:text-white hover:bg-white/[0.02] transition-all ${
                    isCollapsed ? "justify-center px-0" : "px-2.5"
                  }`}
                  title="Pipeline"
                >
                  <PipelineIcon className="text-white/40 group-hover:text-white/70" size={14} />
                  {!isCollapsed && <span>Pipeline</span>}
                </Link>
              </li>
            </ul>
          </div>

          {/* Section: Ops */}
          <div>
            {!isCollapsed && (
              <div className="text-[10px] uppercase tracking-widest text-white/30 font-semibold px-2.5 mb-2">
                Ops
              </div>
            )}
            <ul className="space-y-1">
              <li>
                <Link
                  href="/dashboard/automations"
                  className={`flex items-center gap-2.5 py-1.5 rounded-lg text-xs font-medium text-white/50 hover:text-white hover:bg-white/[0.02] transition-all ${
                    isCollapsed ? "justify-center px-0" : "px-2.5"
                  }`}
                  title="Automations"
                >
                  <AutomationsIcon className="text-white/40 group-hover:text-white/70" size={14} />
                  {!isCollapsed && <span>Automations</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/connectors"
                  className={`flex items-center rounded-lg text-xs font-medium text-white/50 hover:text-white hover:bg-white/[0.02] transition-all ${
                    isCollapsed ? "justify-center py-1.5" : "justify-between px-2.5 py-1.5"
                  }`}
                  title="Connectors"
                >
                  <div className="flex items-center gap-2.5">
                    <ConnectorsIcon className="text-white/40 group-hover:text-white/70" size={14} />
                    {!isCollapsed && <span>Connectors</span>}
                  </div>
                  {!isCollapsed && (
                    <span className="h-4 min-w-4 px-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[9px] font-bold flex items-center justify-center">
                      {connectedTools.length}
                    </span>
                  )}
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Bottom Pinned Section */}
      <div className={`border-t border-white/[0.03] space-y-4 ${isCollapsed ? "p-2" : "p-4"}`}>
        <ul className="space-y-1">
          <li>
            <Link
              href="/dashboard/alerts"
              className={`flex items-center gap-2.5 py-1.5 rounded-lg text-xs font-medium text-white/50 hover:text-white hover:bg-white/[0.02] transition-all ${
                isCollapsed ? "justify-center px-0" : "px-2.5"
              }`}
              title="Alerts"
            >
              <AlertsIcon className="text-white/40 group-hover:text-white/70" size={14} />
              {!isCollapsed && <span>Alerts</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/settings"
              className={`flex items-center gap-2.5 py-1.5 rounded-lg text-xs font-medium text-white/50 hover:text-white hover:bg-white/[0.02] transition-all ${
                isCollapsed ? "justify-center px-0" : "px-2.5"
              }`}
              title="Settings"
            >
              <SettingsIcon className="text-white/40 group-hover:text-white/70" size={14} />
              {!isCollapsed && <span>Settings</span>}
            </Link>
          </li>
        </ul>

        {/* User profile */}
        <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center px-0" : "px-2"}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-500 border border-white/10 flex items-center justify-center text-xs font-bold text-white shadow-md shrink-0">
            AM
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-white/90 truncate leading-tight">
                Anand M.
              </span>
              <span className="text-[10px] text-white/40 truncate">
                GRIP Workspace
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

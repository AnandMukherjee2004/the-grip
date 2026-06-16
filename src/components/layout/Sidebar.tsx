"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const { connectedTools, workspaces, activeWorkspaceId } = useOnboarding();
  const pathname = usePathname();

  // Mock value for failed payments
  const failedPaymentsCount = 3;

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || {
    id: "frido",
    name: "Frido",
  };

  return (
    <aside
      className={`h-screen bg-[#07070e] border-r border-white/[0.04] flex flex-col justify-between shrink-0 select-none font-sans transition-all duration-300 ${
        isCollapsed ? "w-[60px]" : "w-[220px]"
      }`}
    >
      {/* Top Section */}
      <div className="flex flex-col min-h-0 flex-grow">
        {/* Brand/Logo */}
        <div
          className={`h-14 px-4 flex items-center border-b border-b-white/[0.03] shrink-0 ${
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
        <nav className={`flex-grow overflow-y-auto space-y-5 scrollbar-thin ${isCollapsed ? "p-2" : "p-4"}`}>
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
                  className={`flex items-center gap-2.5 py-1.5 rounded-lg text-xs transition-all ${
                    pathname === "/dashboard"
                      ? "text-white bg-white/[0.04] border border-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] font-semibold"
                      : "text-white/50 hover:text-white hover:bg-white/[0.02] border border-transparent font-medium"
                  } ${isCollapsed ? "justify-center px-0" : "px-2.5"}`}
                  title="Dashboard"
                >
                  <DashboardIcon className={pathname === "/dashboard" ? "text-white/70" : "text-white/40 group-hover:text-white/70"} size={14} />
                  {!isCollapsed && <span>Dashboard</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/analytics"
                  className={`flex items-center gap-2.5 py-1.5 rounded-lg text-xs transition-all ${
                    pathname === "/dashboard/analytics"
                      ? "text-white bg-white/[0.04] border border-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] font-semibold"
                      : "text-white/50 hover:text-white hover:bg-white/[0.02] border border-transparent font-medium"
                  } ${isCollapsed ? "justify-center px-0" : "px-2.5"}`}
                  title="Analytics"
                >
                  <ReportsIcon className={pathname === "/dashboard/analytics" ? "text-white/70" : "text-white/40 group-hover:text-white/70"} size={14} />
                  {!isCollapsed && <span>Analytics</span>}
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
                  className={`flex items-center gap-2.5 py-1.5 rounded-lg text-xs transition-all ${
                    pathname === "/dashboard/orders"
                      ? "text-white bg-white/[0.04] border border-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] font-semibold"
                      : "text-white/50 hover:text-white hover:bg-white/[0.02] border border-transparent font-medium"
                  } ${isCollapsed ? "justify-center px-0" : "px-2.5"}`}
                  title="Orders"
                >
                  <OrdersIcon className={pathname === "/dashboard/orders" ? "text-white/70" : "text-white/40 group-hover:text-white/70"} size={14} />
                  {!isCollapsed && <span>Orders</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/payments"
                  className={`flex items-center rounded-lg text-xs transition-all ${
                    pathname === "/dashboard/payments"
                      ? "text-white bg-white/[0.04] border border-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] font-semibold"
                      : "text-white/50 hover:text-white hover:bg-white/[0.02] border border-transparent font-medium"
                  } ${isCollapsed ? "justify-center py-1.5" : "justify-between px-2.5 py-1.5"}`}
                  title="Payments"
                >
                  <div className="flex items-center gap-2.5">
                    <PaymentsIcon className={pathname === "/dashboard/payments" ? "text-white/70" : "text-white/40 group-hover:text-white/70"} size={14} />
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
                  className={`flex items-center gap-2.5 py-1.5 rounded-lg text-xs transition-all ${
                    pathname === "/dashboard/leads"
                      ? "text-white bg-white/[0.04] border border-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] font-semibold"
                      : "text-white/50 hover:text-white hover:bg-white/[0.02] border border-transparent font-medium"
                  } ${isCollapsed ? "justify-center px-0" : "px-2.5"}`}
                  title="Leads"
                >
                  <LeadsIcon className={pathname === "/dashboard/leads" ? "text-white/70" : "text-white/40 group-hover:text-white/70"} size={14} />
                  {!isCollapsed && <span>Leads</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/pipeline"
                  className={`flex items-center gap-2.5 py-1.5 rounded-lg text-xs transition-all ${
                    pathname === "/dashboard/pipeline"
                      ? "text-white bg-white/[0.04] border border-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] font-semibold"
                      : "text-white/50 hover:text-white hover:bg-white/[0.02] border border-transparent font-medium"
                  } ${isCollapsed ? "justify-center px-0" : "px-2.5"}`}
                  title="Pipeline"
                >
                  <PipelineIcon className={pathname === "/dashboard/pipeline" ? "text-white/70" : "text-white/40 group-hover:text-white/70"} size={14} />
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
                  className={`flex items-center gap-2.5 py-1.5 rounded-lg text-xs transition-all ${
                    pathname === "/dashboard/automations"
                      ? "text-white bg-white/[0.04] border border-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] font-semibold"
                      : "text-white/50 hover:text-white hover:bg-white/[0.02] border border-transparent font-medium"
                  } ${isCollapsed ? "justify-center px-0" : "px-2.5"}`}
                  title="Automations"
                >
                  <AutomationsIcon className={pathname === "/dashboard/automations" ? "text-white/70" : "text-white/40 group-hover:text-white/70"} size={14} />
                  {!isCollapsed && <span>Automations</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/connectors"
                  className={`flex items-center rounded-lg text-xs transition-all ${
                    pathname === "/dashboard/connectors"
                      ? "text-white bg-white/[0.04] border border-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] font-semibold"
                      : "text-white/50 hover:text-white hover:bg-white/[0.02] border border-transparent font-medium"
                  } ${isCollapsed ? "justify-center py-1.5" : "justify-between px-2.5 py-1.5"}`}
                  title="Connectors"
                >
                  <div className="flex items-center gap-2.5">
                    <ConnectorsIcon className={pathname === "/dashboard/connectors" ? "text-white/70" : "text-white/40 group-hover:text-white/70"} size={14} />
                    {!isCollapsed && <span>Connectors</span>}
                  </div>
                  {!isCollapsed && (
                    <span className="h-4 min-w-4 px-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[9px] font-bold flex items-center justify-center font-mono">
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
      <div className={`border-t border-white/[0.03] space-y-4 shrink-0 ${isCollapsed ? "p-2" : "p-4"}`}>
        <ul className="space-y-1">
          <li>
            <Link
              href="/dashboard/alerts"
              className={`flex items-center gap-2.5 py-1.5 rounded-lg text-xs transition-all ${
                pathname === "/dashboard/alerts"
                  ? "text-white bg-white/[0.04] border border-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] font-semibold"
                  : "text-white/50 hover:text-white hover:bg-white/[0.02] border border-transparent font-medium"
              } ${isCollapsed ? "justify-center px-0" : "px-2.5"}`}
              title="Alerts"
            >
              <AlertsIcon className={pathname === "/dashboard/alerts" ? "text-white/70" : "text-white/40 group-hover:text-white/70"} size={14} />
              {!isCollapsed && <span>Alerts</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/settings"
              className={`flex items-center gap-2.5 py-1.5 rounded-lg text-xs transition-all ${
                pathname === "/dashboard/settings"
                  ? "text-white bg-white/[0.04] border border-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] font-semibold"
                  : "text-white/50 hover:text-white hover:bg-white/[0.02] border border-transparent font-medium"
              } ${isCollapsed ? "justify-center px-0" : "px-2.5"}`}
              title="Settings"
            >
              <SettingsIcon className={pathname === "/dashboard/settings" ? "text-white/70" : "text-white/40 group-hover:text-white/70"} size={14} />
              {!isCollapsed && <span>Settings</span>}
            </Link>
          </li>
        </ul>

        {/* User profile & Workspace representation */}
        <div className="space-y-2">
          <div
            className={`flex items-center gap-3 rounded-xl p-1.5 ${
              isCollapsed ? "justify-center" : "px-2"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-500 border border-white/10 flex items-center justify-center text-xs font-bold text-white shadow-md shrink-0">
              {activeWorkspace.name.substring(0, 2).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="flex-grow flex flex-col min-w-0">
                <span className="text-xs font-semibold text-white/90 truncate leading-tight font-sans">
                  {activeWorkspace.name}
                </span>
                <span className="text-[10px] text-white/40 truncate">
                  Active Workspace
                </span>
              </div>
            )}
          </div>

          {/* User Profile Link */}
          <Link
            href="/dashboard/profile"
            className={`flex items-center gap-3 rounded-xl transition-all hover:bg-white/[0.04] p-1.5 cursor-pointer ${
              pathname === "/dashboard/profile" ? "bg-white/[0.04]" : ""
            } ${isCollapsed ? "justify-center" : "px-2"}`}
          >
            <div className="w-8 h-8 rounded-full border border-white/10 bg-indigo-500/10 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0">
              AM
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-white/80 truncate leading-tight">
                  Anand Mukherjee
                </span>
                <span className="text-[9px] text-white/30 truncate">
                  View profile
                </span>
              </div>
            )}
          </Link>
        </div>
      </div>
    </aside>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useOnboarding } from "@/context/OnboardingContext";
import { getInitials } from "@/lib/profile-images";
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

const OrgIcon = ({ className, size = 14 }: { className?: string; size?: number }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <line x1="15" y1="3" x2="15" y2="21" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
  </svg>
);

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const { connectedTools, workspaces, activeWorkspaceId, userProfileImage } = useOnboarding();
  const pathname = usePathname();
  const { data: session } = useSession();

  const [isOrgExpanded, setIsOrgExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setActiveTab(params.get("tab"));
    }
  }, [pathname]);

  const failedPaymentsCount = 3;

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || {
    id: "",
    name: "...",
    imageUrl: null,
  };
  const displayName = session?.user?.name ?? session?.user?.email ?? "Account";
  const initials = getInitials(displayName);
  const workspaceInitials = getInitials(activeWorkspace.name);

  return (
    <aside
      className={`h-screen bg-[#07070e] border-r border-white/[0.04] flex flex-col justify-between shrink-0 select-none font-sans transition-all duration-300 ${isCollapsed ? "w-[60px]" : "w-[220px]"
        }`}
    >
      {/* Top Section */}
      <div className="flex flex-col min-h-0 flex-grow">
        {/* Brand/Logo -> Active Workspace */}
        <div
          className={`h-14 px-4 flex items-center border-b border-white/[0.04] shrink-0 ${isCollapsed ? "justify-center" : "justify-between"
            }`}
        >
          {!isCollapsed && (
            <div className="flex items-center gap-2.5 min-w-0 flex-grow mr-2">
              <div className="w-7 h-7 rounded-md border border-white/10 bg-gradient-to-tr from-indigo-500 to-sky-500 flex items-center justify-center text-[10px] font-bold text-white shadow-md shrink-0 overflow-hidden">
                {activeWorkspace.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={activeWorkspace.imageUrl} alt={activeWorkspace.name} className="w-full h-full object-cover" />
                ) : (
                  workspaceInitials
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-xs text-white/90 truncate font-sans leading-tight">
                  {activeWorkspace.name}
                </span>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="text-[10px] text-white/40 hover:text-white transition-colors cursor-pointer w-6 h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center shrink-0"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? "▶" : "◀"}
          </button>
        </div>

        {/* Nav Links */}
        <nav className={`flex-grow overflow-y-auto space-y-3 scrollbar-none ${isCollapsed ? "p-2" : "p-4"}`}>
          {/* Section: Overview */}
          <div>
            {!isCollapsed && (
              <div className="text-[10px] uppercase tracking-widest text-white/30 font-semibold px-2.5 mb-1">
                Overview
              </div>
            )}
            <ul className="space-y-1">
              <li>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-2.5 py-1 rounded-lg text-xs transition-all ${pathname === "/dashboard"
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
                  className={`flex items-center gap-2.5 py-1 rounded-lg text-xs transition-all ${pathname === "/dashboard/analytics"
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
              <div className="text-[10px] uppercase tracking-widest text-white/30 font-semibold px-2.5 mb-1">
                Revenue
              </div>
            )}
            <ul className="space-y-1">
              <li>
                <Link
                  href="/dashboard/orders"
                  className={`flex items-center gap-2.5 py-1 rounded-lg text-xs transition-all ${pathname === "/dashboard/orders"
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
                  className={`flex items-center rounded-lg text-xs transition-all ${pathname === "/dashboard/payments"
                      ? "text-white bg-white/[0.04] border border-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] font-semibold"
                      : "text-white/50 hover:text-white hover:bg-white/[0.02] border border-transparent font-medium"
                    } ${isCollapsed ? "justify-center py-1" : "justify-between px-2.5 py-1"}`}
                  title="Payments"
                >
                  <div className="flex items-center gap-2.5">
                    <PaymentsIcon className={pathname === "/dashboard/payments" ? "text-white/70" : "text-white/40 group-hover:text-white/70"} size={14} />
                    {!isCollapsed && <span>Payments</span>}
                  </div>
                  {!isCollapsed && failedPaymentsCount > 0 && (
                    <span className="sidebar-count">{failedPaymentsCount}</span>
                  )}
                </Link>
              </li>
            </ul>
          </div>

          {/* Section: Sales */}
          <div>
            {!isCollapsed && (
              <div className="text-[10px] uppercase tracking-widest text-white/30 font-semibold px-2.5 mb-1">
                Sales
              </div>
            )}
            <ul className="space-y-1">
              <li>
                <Link
                  href="/dashboard/leads"
                  className={`flex items-center gap-2.5 py-1 rounded-lg text-xs transition-all ${pathname === "/dashboard/leads"
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
                  className={`flex items-center gap-2.5 py-1 rounded-lg text-xs transition-all ${pathname === "/dashboard/pipeline"
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

          {/* Section: Organization */}
          <div>
            {!isCollapsed ? (
              <button
                type="button"
                onClick={() => setIsOrgExpanded(!isOrgExpanded)}
                className="w-full flex items-center justify-between text-[10px] uppercase tracking-widest text-white/30 hover:text-white/60 font-semibold px-2.5 mb-1 cursor-pointer transition-colors focus:outline-none"
              >
                <span>Organization</span>
                <span className={`text-[10px] text-white/30 font-bold transition-transform duration-200 ${isOrgExpanded ? "rotate-90" : ""}`}>
                  &gt;
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onToggleCollapse();
                  setIsOrgExpanded(true);
                }}
                className="w-full flex items-center justify-center p-2 text-white/40 hover:text-white transition-colors cursor-pointer focus:outline-none"
                title="Organization"
              >
                <OrgIcon size={14} />
              </button>
            )}

            {isOrgExpanded && !isCollapsed && (
              <ul className="space-y-1 mt-1 pl-2 border-l border-white/[0.04] ml-3.5 animate-fadeIn">
                {[
                  { name: "General", href: "/dashboard/settings?tab=workspace" },
                  { name: "Workspaces", href: "/dashboard/settings?tab=workspace" },
                  { name: "Members", href: "/dashboard/settings?tab=team" },
                  { name: "Datasources", href: "/dashboard/settings?tab=api" },
                  { name: "Connections", href: "/dashboard/connectors" },
                  { name: "Knowledge", href: "/dashboard/settings?tab=privacy" },
                  { name: "Billing", href: "/dashboard/settings?tab=billing" },
                ].map((item) => {
                  const tabParam = item.href.includes("tab=") ? item.href.split("tab=")[1] : null;
                  const isActive = tabParam 
                    ? (pathname === "/dashboard/settings" && activeTab === tabParam)
                    : (pathname === item.href);

                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-2.5 py-1 px-2 rounded-lg text-xs transition-all ${
                          isActive
                            ? "text-white bg-white/[0.04] border border-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] font-semibold"
                            : "text-white/50 hover:text-white hover:bg-white/[0.02] border border-transparent font-medium"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </nav>
      </div>

      {/* Bottom Pinned Section */}
      <div className={`border-t border-white/[0.03] space-y-4 shrink-0 ${isCollapsed ? "p-2" : "p-4"}`}>
        <ul className="space-y-1">
          <li>
            <Link
              href="/dashboard/alerts"
              className={`flex items-center gap-2.5 py-1 rounded-lg text-xs transition-all ${pathname === "/dashboard/alerts"
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
              className={`flex items-center gap-2.5 py-1 rounded-lg text-xs transition-all ${pathname === "/dashboard/settings"
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

        {/* User profile */}
        <div className="space-y-1">
          {/* User Profile Link */}
          <Link
            href="/dashboard/profile"
            className={`flex items-center gap-3 rounded-xl transition-all hover:bg-white/[0.04] p-1.5 cursor-pointer ${pathname === "/dashboard/profile" ? "bg-white/[0.04]" : ""
              } ${isCollapsed ? "justify-center" : "px-2"}`}
          >
            <div className="w-8 h-8 rounded-full border border-white/10 bg-indigo-500/10 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0 overflow-hidden">
              {userProfileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={userProfileImage} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-white/80 truncate leading-tight">
                  {displayName}
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

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

const AccountIcon = ({ className, size = 14 }: { className?: string; size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const GeneralIcon = ({ className, size = 14 }: { className?: string; size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <line x1="9" y1="22" x2="9" y2="16" />
    <line x1="15" y1="22" x2="15" y2="16" />
    <line x1="9" y1="16" x2="15" y2="16" />
    <line x1="9" y1="16" x2="15" y2="16" />
    <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01" />
  </svg>
);

const MembersIcon = ({ className, size = 14 }: { className?: string; size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const DatasourcesIcon = ({ className, size = 14 }: { className?: string; size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
  </svg>
);

const ConnectionsIcon = ({ className, size = 14 }: { className?: string; size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

const KnowledgeIcon = ({ className, size = 14 }: { className?: string; size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const BillingIcon = ({ className, size = 14 }: { className?: string; size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const { connectedTools, workspaces, activeWorkspaceId, userProfileImage } = useOnboarding();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const [menuMode, setMenuMode] = useState<"main" | "org">("main");
  const [prevRoute, setPrevRoute] = useState<string>("/dashboard");
  const [activeTab, setActiveTab] = useState<string | null>(null);

  // Sync activeTab from URL on route change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setActiveTab(params.get("tab"));
    }
  }, [pathname]);

  // Auto-reset to main menu when navigating away from settings (e.g. browser back button)
  useEffect(() => {
    if (!pathname.startsWith("/dashboard/settings")) {
      setMenuMode("main");
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
      {menuMode === "main" ? (
        <>
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
                <button
                  type="button"
                  onClick={() => {
                    // Save current route so Back can return here
                    setPrevRoute(pathname);
                    setMenuMode("org");
                    if (isCollapsed) {
                      onToggleCollapse();
                    }
                    router.push("/dashboard/settings?tab=workspace");
                  }}
                  className={`w-full flex items-center gap-2.5 py-1 rounded-lg text-xs transition-all ${
                    pathname === "/dashboard/settings"
                      ? "text-white bg-white/[0.04] border border-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] font-semibold"
                      : "text-white/50 hover:text-white hover:bg-white/[0.02] border border-transparent font-medium"
                  } cursor-pointer focus:outline-none ${isCollapsed ? "justify-center px-0" : "px-2.5"}`}
                  title="Settings"
                >
                  <SettingsIcon className={pathname === "/dashboard/settings" ? "text-white/70" : "text-white/40 group-hover:text-white/70"} size={14} />
                  {!isCollapsed && <span>Settings</span>}
                </button>
              </li>
            </ul>

            {/* User profile */}
            <div className="space-y-1">
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
        </>
      ) : (
        <>
          {/* Organization Submenu View */}
          {/* Back Button */}
          <div className="h-14 px-4 flex items-center border-b border-white/[0.04] shrink-0">
            <button
              type="button"
              onClick={() => {
                setMenuMode("main");
                router.push(prevRoute);
              }}
              className="flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white cursor-pointer focus:outline-none transition-colors"
            >
              <span className="text-[10px] font-bold">&lt;</span>
              <span>Back</span>
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-grow overflow-y-auto p-4 space-y-5 scrollbar-none">
            {/* Personal Section */}
            <div className="space-y-1.5">
              <div className="text-[10px] uppercase tracking-widest text-white/30 font-semibold px-2.5">
                Personal
              </div>
              <ul>
                <li>
                  <Link
                    href="/dashboard/profile"
                    className={`flex items-center gap-2.5 py-1.5 px-2.5 rounded-lg text-xs font-medium transition-all ${
                      pathname === "/dashboard/profile"
                        ? "text-white bg-white/[0.04] border border-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] font-semibold"
                        : "text-white/50 hover:text-white hover:bg-white/[0.02] border border-transparent"
                    }`}
                  >
                    <AccountIcon size={14} className={pathname === "/dashboard/profile" ? "text-white/70" : "text-white/40"} />
                    <span>Account</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Organization Section */}
            <div className="space-y-1.5">
              <div className="text-[10px] uppercase tracking-widest text-white/30 font-semibold px-2.5">
                Organization
              </div>
              <ul className="space-y-1">
                {[
                  { name: "General", href: "/dashboard/settings?tab=workspace", icon: GeneralIcon },
                  { name: "Members", href: "/dashboard/members", icon: MembersIcon },
                  { name: "Datasources", href: "/dashboard/settings?tab=api", icon: DatasourcesIcon, count: 2 },
                  { name: "Connections", href: "/dashboard/connectors", icon: ConnectionsIcon, count: 2 },
                  { name: "Knowledge", href: "/dashboard/settings?tab=privacy", icon: KnowledgeIcon },
                  { name: "Billing", href: "/dashboard/settings?tab=billing", icon: BillingIcon, external: true },
                ].map((item) => {
                  const tabParam = item.href.includes("tab=") ? item.href.split("tab=")[1] : null;
                  const isActive = tabParam 
                    ? (pathname === "/dashboard/settings" && activeTab === tabParam)
                    : (pathname === item.href);
                  const Icon = item.icon;

                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg text-xs transition-all ${
                          isActive
                            ? "text-white bg-white/[0.04] border border-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] font-semibold"
                            : "text-white/50 hover:text-white hover:bg-white/[0.02] border border-transparent font-medium"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon size={14} className={isActive ? "text-white/70" : "text-white/40"} />
                          <span>{item.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {item.count !== undefined && (
                            <span className="sidebar-count">{item.count}</span>
                          )}
                          {item.external && (
                            <span className="text-[10px] text-white/30">↗</span>
                          )}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* Bottom Pinned Section for Organization Mode */}
          <div className="border-t border-white/[0.03] p-4 space-y-4 shrink-0">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-semibold text-white/45 leading-none">
                <span>Pro plan trial</span>
                <span className="text-white/60">14 days left</span>
              </div>
              <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: "30%" }} />
              </div>
            </div>
            <div className="flex items-center pt-2">
              <div className="w-8 h-8 rounded-full border border-white/10 bg-indigo-500/10 flex items-center justify-center text-xs font-bold text-indigo-400">
                {initials}
              </div>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}

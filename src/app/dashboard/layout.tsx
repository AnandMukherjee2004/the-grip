"use client";

import React, { Suspense, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import { OnboardingProvider } from "@/context/OnboardingContext";

function SidebarFallback() {
  return <aside className="h-screen w-[220px] shrink-0 bg-[#07070e] border-r border-white/[0.04]" />;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isFeedCollapsed, setIsFeedCollapsed] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const isSettings = pathname.startsWith("/dashboard/settings");
  const showFeed = pathname !== "/dashboard/connectors" && !isSettings;

  return (
    <OnboardingProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[#040409] text-[#d0d0e8] font-sans">
        {/* Left column: Sidebar navigation (fixed width or collapsed) */}
        <Suspense fallback={<SidebarFallback />}>
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </Suspense>

        {/* Center column: Main content area (scrollable) */}
        <div className="flex-grow flex flex-col min-w-0 overflow-hidden">
          {children}
        </div>

        {/* Right column: Live activity feed (fixed, 280px, collapsible) */}
        {showFeed && (
          <ActivityFeed
            isCollapsed={isFeedCollapsed}
            onToggleCollapse={() => setIsFeedCollapsed(!isFeedCollapsed)}
          />
        )}
      </div>
    </OnboardingProvider>
  );
}

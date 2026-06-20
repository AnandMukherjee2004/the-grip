"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import { OnboardingProvider } from "@/context/OnboardingContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isFeedCollapsed, setIsFeedCollapsed] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const showFeed = pathname !== "/dashboard/connectors";

  return (
    <OnboardingProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[#040409] text-[#d0d0e8] font-sans">
        {/* Left column: Sidebar navigation (fixed width or collapsed) */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

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

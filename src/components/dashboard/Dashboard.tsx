"use client";

import { CheckIcon } from "@/components/ui/CheckIcon";

type DashboardProps = {
  className?: string;
  counterRef?: React.RefObject<HTMLSpanElement | null>;
  pillRef?: React.RefObject<HTMLSpanElement | null>;
  toastRef?: React.RefObject<HTMLDivElement | null>;
  newRowRef?: React.RefObject<HTMLDivElement | null>;
  initialCounter?: string;
};

export function Dashboard({
  className = "",
  counterRef,
  pillRef,
  toastRef,
  newRowRef,
  initialCounter = "₹0",
}: DashboardProps) {
  return (
    <div className={`dash ${className}`}>
      <div className="dash-bar">
        <div className="dash-brand">
          <span className="brand-line" />
          Grip
        </div>
        <div className="dash-tabs">
          <span className="on">Pipeline</span>
          <span>Attribution</span>
          <span>Agents</span>
        </div>
        <div className="dash-live">
          <span className="dot" />
          LIVE · SYNCED 2 MIN AGO
        </div>
      </div>
      <div className="dash-metrics">
        <div className="dm">
          <span className="dm-label">Revenue · this week</span>
          <span
            className="dm-value big"
            ref={counterRef}
            data-dash-counter
          >
            {initialCounter}
          </span>
          <span className="dm-delta">▲ 12.4% vs last week</span>
        </div>
        <div className="dm">
          <span className="dm-label">Leads captured</span>
          <span className="dm-value">847</span>
          <span className="dm-sub">across 5 sources</span>
        </div>
        <div className="dm">
          <span className="dm-label">Orders auto-created</span>
          <span className="dm-value">63</span>
          <span className="dm-sub">Shopify · Razorpay</span>
        </div>
      </div>
      <div className="dash-table">
        <div className="drow head">
          <span>Lead</span>
          <span>Source</span>
          <span>Value</span>
          <span>Stage</span>
        </div>
        <div className="drow newrow" ref={newRowRef} data-dash-newrow>
          <span className="lead">Kavya Reddy</span>
          <span className="src">Meta Ads</span>
          <span className="val">₹38,500</span>
          <span className="pill">New lead</span>
        </div>
        <div className="drow">
          <span className="lead">Arjun Mehta</span>
          <span className="src">Leadsquared</span>
          <span className="val">₹52,000</span>
          <span className="pill" ref={pillRef} data-dash-pill>
            Sale Done
          </span>
        </div>
        <div className="drow">
          <span className="lead">Sneha Iyer</span>
          <span className="src">HubSpot</span>
          <span className="val">₹41,200</span>
          <span className="pill">Proposal sent</span>
        </div>
        <div className="drow">
          <span className="lead">Rohan Gupta</span>
          <span className="src">Shopify</span>
          <span className="val">₹28,900</span>
          <span className="pill win">Sale Done</span>
        </div>
        <div className="drow">
          <span className="lead">Divya Nair</span>
          <span className="src">Meta Ads</span>
          <span className="val">₹19,400</span>
          <span className="pill">Qualified</span>
        </div>
      </div>
      <div className="dash-toast" ref={toastRef} data-dash-toast>
        <CheckIcon className="ck" />
        <span className="toast-text">
          Order #4821 created automatically in Shopify
        </span>
      </div>
    </div>
  );
}

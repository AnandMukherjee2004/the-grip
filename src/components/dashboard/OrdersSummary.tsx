"use client";

import Link from "next/link";
import EmptyState from "./EmptyState";
import { OrdersIcon } from "@/components/ui/Icons";

interface OrdersSummaryProps {
  connectedTools: string[];
}

interface OrderItem {
  id: string;
  customer: string;
  amount: string;
  status: "Fulfilled" | "Pending";
  time: string;
}

const mockOrders: OrderItem[] = [
  { id: "#SH-1025", customer: "Priya Sharma", amount: "₹1,250", status: "Fulfilled", time: "10m ago" },
  { id: "#SH-1024", customer: "Amit Patel", amount: "₹950", status: "Fulfilled", time: "32m ago" },
  { id: "#SH-1023", customer: "Rahul Verma", amount: "₹2,400", status: "Pending", time: "1h ago" },
  { id: "#SH-1022", customer: "Neha Gupta", amount: "₹1,800", status: "Fulfilled", time: "3h ago" },
  { id: "#SH-1021", customer: "Sanjay Kumar", amount: "₹1,100", status: "Pending", time: "5h ago" },
];

export default function OrdersSummary({ connectedTools }: OrdersSummaryProps) {
  const isEcomConnected = connectedTools.some((t) =>
    ["shopify", "woocommerce", "magento", "unicommerce"].includes(t)
  );

  if (!isEcomConnected) {
    return (
      <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-6 h-[380px] flex flex-col justify-between">
        <h3 className="text-sm font-semibold text-white/90">Orders today</h3>
        <div className="flex-grow flex items-center justify-center">
          <EmptyState
            title="Connect store to track orders"
            description="Integrate Shopify or WooCommerce to pull real-time store orders, fulfillment statistics, and tables."
            icon={<OrdersIcon size={28} className="text-white/60" />}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-6 flex flex-col h-[380px] justify-between select-none font-sans relative overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />

      <h3 className="text-sm font-semibold text-white/90 relative z-10">Orders today</h3>

      {/* Stat Chips */}
      <div className="grid grid-cols-3 gap-2.5 my-4 relative z-10">
        <div className="p-2 rounded bg-white/5 border border-white/10 flex flex-col">
          <span className="text-[9px] uppercase tracking-wider text-white/40 font-bold">Total orders</span>
          <span className="text-base font-bold text-white mt-0.5">38</span>
        </div>
        <div className="p-2 rounded bg-emerald-500/5 border border-emerald-500/10 flex flex-col">
          <span className="text-[9px] uppercase tracking-wider text-emerald-400/50 font-bold">Fulfilled</span>
          <span className="text-base font-bold text-emerald-400 mt-0.5">32</span>
        </div>
        <div className="p-2 rounded bg-amber-500/5 border border-amber-500/10 flex flex-col">
          <span className="text-[9px] uppercase tracking-wider text-amber-400/50 font-bold">Pending</span>
          <span className="text-base font-bold text-amber-400 mt-0.5">6</span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="flex-grow overflow-x-auto relative z-10">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-white/30 font-semibold">
              <th className="py-2">Order ID</th>
              <th className="py-2">Customer</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Status</th>
              <th className="py-2 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02] text-white/80">
            {mockOrders.map((order) => (
              <tr key={order.id} className="hover:bg-white/[0.01]">
                <td className="py-2 font-mono font-bold text-indigo-400">{order.id}</td>
                <td className="py-2">{order.customer}</td>
                <td className="py-2 font-semibold">{order.amount}</td>
                <td className="py-2">
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      order.status === "Fulfilled"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-2 text-right text-white/40">{order.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-3 border-t border-white/[0.04] relative z-10 flex justify-end">
        <Link
          href="/dashboard/orders"
          className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View all orders →
        </Link>
      </div>
    </div>
  );
}

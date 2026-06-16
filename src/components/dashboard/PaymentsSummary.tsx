"use client";

import Link from "next/link";
import EmptyState from "./EmptyState";
import { PaymentsIcon } from "@/components/ui/Icons";

interface PaymentsSummaryProps {
  connectedTools: string[];
}

interface TransactionItem {
  amount: string;
  gateway: string;
  status: "Succeeded" | "Failed" | "Pending";
  time: string;
}

const mockTransactions: TransactionItem[] = [
  { amount: "₹12,500", gateway: "Razorpay", status: "Succeeded", time: "8m ago" },
  { amount: "₹8,000", gateway: "Stripe", status: "Succeeded", time: "22m ago" },
  { amount: "₹3,500", gateway: "Razorpay", status: "Failed", time: "40m ago" },
  { amount: "₹14,200", gateway: "Razorpay", status: "Succeeded", time: "1h ago" },
  { amount: "₹1,800", gateway: "Stripe", status: "Succeeded", time: "2h ago" },
];

export default function PaymentsSummary({ connectedTools }: PaymentsSummaryProps) {
  const isPaymentsConnected = connectedTools.some((t) =>
    ["razorpay", "stripe", "payu", "cashfree"].includes(t)
  );

  if (!isPaymentsConnected) {
    return (
      <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-6 h-[380px] flex flex-col justify-between">
        <h3 className="text-sm font-semibold text-white/90">Payments</h3>
        <div className="flex-grow flex items-center justify-center">
          <EmptyState
            title="Connect gateway to track payments"
            description="Integrate Razorpay or Stripe to see live transaction feeds, success rates, and gateway summaries."
            icon={<PaymentsIcon size={28} className="text-white/60" />}
          />
        </div>
      </div>
    );
  }

  const failedCount = 3;

  return (
    <div className="bg-[#0d0d1a]/40 border border-white/[0.04] rounded-xl p-6 flex flex-col h-[380px] justify-between select-none font-sans relative overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />

      <h3 className="text-sm font-semibold text-white/90 relative z-10">Payments</h3>

      {/* Stat Chips */}
      <div className="grid grid-cols-3 gap-2.5 my-4 relative z-10">
        <div className="p-2 rounded bg-white/5 border border-white/10 flex flex-col">
          <span className="text-[9px] uppercase tracking-wider text-white/40 font-bold">Collected</span>
          <span className="text-base font-bold text-white mt-0.5">₹1.45L</span>
        </div>
        <div className="p-2 rounded bg-white/5 border border-white/10 flex flex-col">
          <span className="text-[9px] uppercase tracking-wider text-white/40 font-bold">Pending</span>
          <span className="text-base font-bold text-white/80 mt-0.5">₹18,400</span>
        </div>
        <div
          className={`p-2 rounded flex flex-col border transition-all ${
            failedCount > 0
              ? "bg-rose-500/5 border-rose-500/20 text-rose-400"
              : "bg-white/5 border border-white/10 text-white/40"
          }`}
        >
          <span className={`text-[9px] uppercase tracking-wider font-bold ${failedCount > 0 ? "text-rose-400/60" : "text-white/40"}`}>
            Failed
          </span>
          <span className="text-base font-bold mt-0.5">{failedCount}</span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="flex-grow overflow-x-auto relative z-10">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-white/30 font-semibold">
              <th className="py-2">Amount</th>
              <th className="py-2">Gateway</th>
              <th className="py-2">Status</th>
              <th className="py-2 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02] text-white/80">
            {mockTransactions.map((tx, idx) => (
              <tr key={idx} className="hover:bg-white/[0.01]">
                <td className="py-2 font-bold text-white">{tx.amount}</td>
                <td className="py-2">
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      tx.gateway === "Razorpay"
                        ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                    }`}
                  >
                    {tx.gateway}
                  </span>
                </td>
                <td className="py-2">
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      tx.status === "Succeeded"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : tx.status === "Failed"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
                <td className="py-2 text-right text-white/40">{tx.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-3 border-t border-white/[0.04] relative z-10 flex justify-end">
        <Link
          href="/dashboard/payments"
          className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View all transactions →
        </Link>
      </div>
    </div>
  );
}

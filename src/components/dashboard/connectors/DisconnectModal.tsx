"use client";

import { Tool } from "@/types/onboarding";

interface DisconnectModalProps {
  tool: Tool;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DisconnectModal({
  tool,
  isOpen,
  onClose,
  onConfirm,
}: DisconnectModalProps) {
  if (!isOpen) return null;

  const handleDisconnect = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md p-6 rounded-2xl bg-[#090911]/95 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden transition-all duration-300 select-none">
        {/* Glow Effects */}
        <div className="absolute -top-20 -left-20 w-48 h-48 rounded-full bg-rose-600/10 blur-[85px] pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 rounded-full bg-white/5 blur-[85px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5">
          {tool.logo ? (
            <img
              src={tool.logo}
              alt={tool.name}
              className="h-8 w-auto max-w-[100px] object-contain"
            />
          ) : (
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-xl">
              {tool.icon}
            </div>
          )}
          <div>
            <h3 className="text-base font-bold text-white leading-tight">
              Disconnect {tool.name}?
            </h3>
            <p className="text-rose-400 text-[10px] uppercase tracking-wider font-semibold">
              Warning
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-4 mb-6">
          <p className="text-white/60 text-xs leading-relaxed">
            This will stop syncing data from <span className="font-semibold text-white">{tool.name}</span>. Your historical data will be preserved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-3 border-t border-white/[0.04]">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-lg border border-white/10 text-white/60 hover:text-white hover:bg-white/5 font-semibold text-xs transition-all active:scale-[0.99] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDisconnect}
            className="flex-1 h-11 rounded-lg bg-gradient-to-r from-rose-600 to-red-600 text-white font-semibold text-xs hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(220,38,38,0.2)] cursor-pointer"
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

interface AuthMethodModalProps {
  toolName: string;
  toolLogo?: string;
  toolIcon?: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectOAuth: () => void;
  onSelectAPIKey: () => void;
}

export function AuthMethodModal({
  toolName,
  toolLogo,
  toolIcon,
  isOpen,
  onClose,
  onSelectOAuth,
  onSelectAPIKey,
}: AuthMethodModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-md p-6 rounded-2xl bg-[#090911]/95 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden transition-all duration-300">
        {/* Decorative Glows */}
        <div className="absolute -top-20 -left-20 w-48 h-48 rounded-full bg-indigo-600/10 blur-[85px] pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 rounded-full bg-purple-600/10 blur-[85px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          {toolLogo ? (
            <img
              src={toolLogo}
              alt={toolName}
              className="h-8 w-auto max-w-[100px] object-contain"
            />
          ) : (
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-xl">
              {toolIcon}
            </div>
          )}
          <div>
            <h3 className="text-base font-bold text-white leading-tight">
              Connect {toolName}
            </h3>
            <p className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">
              Select Connection Method
            </p>
          </div>
        </div>

        {/* Options Stack */}
        <div className="space-y-3.5 mb-6">
          {/* OAuth Option */}
          <button
            type="button"
            onClick={onSelectOAuth}
            className="w-full text-left p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.03] hover:bg-indigo-500/[0.08] hover:border-indigo-500/40 transition-all duration-200 group flex justify-between items-center cursor-pointer"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1.5">
                OAuth 2.0
                <span className="text-[8px] tracking-wide uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-extrabold">
                  Recommended
                </span>
              </span>
              <p className="text-white/50 text-[11px] leading-relaxed pr-4">
                Fast and secure authorization. No client credentials required.
              </p>
            </div>
            <svg
              className="text-indigo-400 transition-transform group-hover:translate-x-1"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* API Key Option */}
          <button
            type="button"
            onClick={onSelectAPIKey}
            className="w-full text-left p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-white/20 transition-all duration-200 group flex justify-between items-center cursor-pointer"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold text-white/80 group-hover:text-white">
                API Key Credentials
              </span>
              <p className="text-white/40 text-[11px] leading-relaxed pr-4">
                Manually configure API keys and secrets for access.
              </p>
            </div>
            <svg
              className="text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-white"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Footer Actions */}
        <div className="flex pt-3 border-t border-white/[0.04]">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-10 rounded-lg border border-white/10 text-white/60 hover:text-white hover:bg-white/5 font-semibold text-xs transition-all active:scale-[0.99] cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

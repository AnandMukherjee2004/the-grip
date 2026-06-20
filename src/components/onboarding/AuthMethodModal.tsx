"use client";

import { ModalPortal } from "@/components/ui/ModalPortal";
import { authPrimaryButtonClass } from "@/components/auth/auth-styles";

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
    <ModalPortal>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />

        <div className="relative w-full max-w-md p-6 rounded-2xl bg-white border border-gray-100 shadow-[0_25px_60px_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-300">
          <div className="flex items-center gap-3.5 mb-6">
            {toolLogo ? (
              <img
                src={toolLogo}
                alt={toolName}
                className="h-8 w-auto max-w-[100px] object-contain"
              />
            ) : (
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 border border-gray-200 text-xl">
                {toolIcon}
              </div>
            )}
            <div>
              <h3 className="text-base font-bold text-gray-900 leading-tight">
                Connect {toolName}
              </h3>
              <p className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">
                Select Connection Method
              </p>
            </div>
          </div>

          <div className="space-y-3.5 mb-6">
            <button
              type="button"
              onClick={onSelectOAuth}
              className="w-full text-left p-4 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-300 transition-all duration-200 group flex justify-between items-center cursor-pointer"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-700 group-hover:text-indigo-800 flex items-center gap-1.5">
                  OAuth 2.0
                  <span className="text-[8px] tracking-wide uppercase px-1.5 py-0.5 rounded bg-indigo-200 text-indigo-800 font-extrabold">
                    Recommended
                  </span>
                </span>
                <p className="text-gray-500 text-[11px] leading-relaxed pr-4">
                  Fast and secure authorization. No client credentials required.
                </p>
              </div>
              <svg
                className="text-indigo-600 transition-transform group-hover:translate-x-1"
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

            <button
              type="button"
              onClick={onSelectAPIKey}
              className="w-full text-left p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 group flex justify-between items-center cursor-pointer"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-800 group-hover:text-gray-900">
                  API Key Credentials
                </span>
                <p className="text-gray-500 text-[11px] leading-relaxed pr-4">
                  Manually configure API keys and secrets for access.
                </p>
              </div>
              <svg
                className="text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-gray-700"
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

          <div className="flex pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="w-full h-10 rounded-full border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-semibold text-xs transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}

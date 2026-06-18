"use client";

import { useState } from "react";
import { Tool } from "@/types/onboarding";
import { getConnector } from "@/lib/connector-registry";

interface APIKeyModalProps {
  tool: Tool;
  toolId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (credentials: Record<string, string>) => Promise<void>;
}

export function APIKeyModal({
  tool,
  toolId,
  isOpen,
  onClose,
  onSubmit,
}: APIKeyModalProps) {
  const meta = getConnector(toolId);
  const [values, setValues] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleOAuth = (id: string) => {
    // TODO: Implement OAuth authorization flow for id using meta.oauthScopes
    console.log(`Starting OAuth flow for ${id}`);
    setIsLoading(true);
    // Simulate OAuth connection completion
    setTimeout(async () => {
      try {
        await onSubmit({});
        onClose();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to connect via OAuth.");
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (meta?.authMethod === "oauth2") {
      handleOAuth(toolId);
      return;
    }

    const missingFields = (meta?.credentialFields || []).filter(
      (field) => !(values[field.key] || "").trim()
    );

    if (missingFields.length > 0) {
      setError(`${missingFields[0].label} is required`);
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(values);
      setValues({});
      onClose();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to connect tool. Please check details and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300" 
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md p-6 rounded-2xl bg-[#090911]/95 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden transition-all duration-300">
        {/* Glow Effects */}
        <div className="absolute -top-20 -left-20 w-48 h-48 rounded-full bg-indigo-600/10 blur-[85px] pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 rounded-full bg-purple-600/10 blur-[85px] pointer-events-none" />

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
              Connect {tool.name}
            </h3>
            <p className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">
              {meta?.authMethod === "oauth2" ? "OAuth Authorization" : "API Credentials Setup"}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {meta?.authMethod === "oauth2" ? (
            <div className="py-4 space-y-4">
              <p className="text-white/60 text-xs text-center">
                This connector uses OAuth 2.0 authentication. Click below to authorize read-only access.
              </p>
              {error && <p className="text-xs text-rose-400 leading-normal text-center">{error}</p>}
              <div className="flex gap-3 pt-3 border-t border-white/[0.04]">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={onClose}
                  className="flex-1 h-11 rounded-lg border border-white/10 text-white/60 hover:text-white hover:bg-white/5 font-semibold text-xs transition-all active:scale-[0.99]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleOAuth(toolId)}
                  className="flex-1 h-11 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(124,58,237,0.2)]"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <span>Connect with OAuth</span>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <>
              {meta?.credentialFields?.map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor={field.key} className="text-[10px] font-bold text-white/60 uppercase tracking-wider">
                      {field.label}
                    </label>
                  </div>
                  <input
                    id={field.key}
                    type={field.secret ? "password" : "text"}
                    value={values[field.key] || ""}
                    disabled={isLoading}
                    onChange={(e) => setValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full h-11 px-4 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-white focus:ring-0 transition-all font-mono"
                    placeholder={(field as any).placeholder || `Enter ${field.label}`}
                  />
                </div>
              ))}

              {error && <p className="text-xs text-rose-400 leading-normal animate-fadeIn">{error}</p>}

              {/* Security Note */}
              <div className="pt-2 flex items-start gap-2 text-white/40 text-[10px] leading-relaxed">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5" aria-hidden>
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>Your credentials are encrypted and never stored in plaintext</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3 border-t border-white/[0.04]">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={onClose}
                  className="flex-1 h-11 rounded-lg border border-white/10 text-white/60 hover:text-white hover:bg-white/5 font-semibold text-xs transition-all active:scale-[0.99]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-11 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(124,58,237,0.2)] disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <span>Connect Tool →</span>
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

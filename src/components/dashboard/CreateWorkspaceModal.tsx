"use client";

import React, { useState } from "react";

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export function CreateWorkspaceModal({ isOpen, onClose, onCreate }: CreateWorkspaceModalProps) {
  const [workspaceName, setWorkspaceName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceName.trim()) return;
    onCreate(workspaceName.trim());
    setWorkspaceName("");
    onClose();
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal core card */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6 rounded-2xl bg-[#0d0d1a] border border-white/10 shadow-2xl backdrop-blur-md animate-fadeIn select-none font-sans">
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white tracking-tight">Create Workspace</h3>
            <p className="text-white/40 text-[11px]">
              Set up a isolated workspace company profile to partition integrations and dashboard KPIs.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/60 tracking-wider uppercase">
                Company / Workspace Name
              </label>
              <input
                type="text"
                autoFocus
                required
                placeholder="e.g. Frido, Acme Corp"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full h-9 px-3 rounded-lg text-xs bg-[#040409] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all font-sans"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-white/10 hover:border-white/20 text-xs font-semibold text-white/80 hover:text-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!workspaceName.trim()}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-xs font-semibold text-white active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-indigo-500/20"
              >
                Create Workspace
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

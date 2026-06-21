"use client";

import { useState } from "react";
import { useOnboarding } from "@/context/OnboardingContext";
import { DisconnectModal } from "@/components/dashboard/connectors/DisconnectModal";
import { APIKeyModal } from "@/components/onboarding/APIKeyModal";
import { TOOLS } from "@/lib/tools";
import { Tool } from "@/types/onboarding";
import { API_URL } from "@/lib/api";
import { listConnectors } from "@/lib/connector-registry";

const LOGO_MAP: Record<string, string> = {
  razorpay: "/assets/crm-logos/razorpay.svg",
  shopify: "/assets/crm-logos/shopify.svg",
  leadsquared: "/assets/crm-logos/leadsquared.png",
  "meta-ads": "/assets/crm-logos/meta-ads.png",
  "google-ads": "/assets/crm-logos/google-ads.png",
  woocommerce: "/assets/crm-logos/WooCommerce_Logo.svg",
  "whatsapp-business": "/assets/crm-logos/whatsapp.svg",
  tally: "/assets/crm-logos/tally.svg",
  limechat: "/assets/crm-logos/limechat.jpeg",
  salesforce: "/assets/crm-logos/salesforce.svg",
};

export default function ConnectorsPage({ embedded = false }: { embedded?: boolean }) {
  const {
    connectedTools,
    setConnectedTools,
    updateSyncInfo,
    activeWorkspaceId: workspaceId,
  } = useOnboarding();

  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [disconnectTool, setDisconnectTool] = useState<Tool | null>(null);
  const [modalToolId, setModalToolId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Inline Setup States
  const [setupToolId, setSetupToolId] = useState<string | null>(null);
  const [setupName, setSetupName] = useState("");
  const [setupSchema, setSetupSchema] = useState("");
  const [setupValues, setSetupValues] = useState<Record<string, string>>({});
  const [connectedAccounts, setConnectedAccounts] = useState(false);
  const [syncTimeframe, setSyncTimeframe] = useState("All time");
  const [syncStartDate, setSyncStartDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Viewing Active Connection Detail State
  const [viewingToolId, setViewingToolId] = useState<string | null>(null);

  // Testing Keys State
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');

  // Fetch connectors list from connector-registry.ts
  const registryConnectors = listConnectors();

  // Disconnect confirmation modal triggers
  const handleDisconnectClick = (toolId: string) => {
    const tool = TOOLS.find((t) => t.id === toolId) || {
      id: toolId,
      name: toolId.charAt(0).toUpperCase() + toolId.slice(1).replace("-", " "),
      category: "crm" as const,
      description: "Sync custom data and pipeline stages.",
      icon: "🔌",
    };
    setDisconnectTool(tool);
  };

  // Disconnect confirmed
  const handleDisconnectConfirm = async () => {
    if (!disconnectTool) return;
    const toolId = disconnectTool.id;

    try {
      const response = await fetch(`${API_URL}/api/v1/connectors?workspaceId=${workspaceId}&toolId=${toolId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setConnectedTools(connectedTools.filter((id) => id !== toolId));
        updateSyncInfo(toolId, {
          lastSyncedAt: undefined,
          status: undefined,
        });
        setViewingToolId(null);
      } else {
        console.error("Failed to disconnect tool from DB");
      }
    } catch (error) {
      console.error("Failed to disconnect tool:", error);
    }
    setDisconnectTool(null);
  };

  const handleConnectClick = (toolId: string) => {
    const conn = registryConnectors.find((c) => c.toolId === toolId);
    setSetupToolId(toolId);
    setSetupName(conn?.displayName || "");
    setSetupSchema(toolId);
    setTestStatus('idle');

    // Retrieve saved credentials if any, otherwise prefill mock defaults
    const savedCreds = localStorage.getItem(`grip_credentials_${workspaceId}_${toolId}`);
    if (savedCreds) {
      try {
        setSetupValues(JSON.parse(savedCreds));
        return;
      } catch (e) {
        console.error("Failed to parse saved credentials", e);
      }
    }

    // Default mock credential prefill for demonstration/testing
    if (toolId === "razorpay") {
      setSetupValues({
        key_id: "rzp_live_8374hDks82k",
        key_secret: "rzp_sec_91823h89ad"
      });
    } else if (toolId === "leadsquared") {
      setSetupValues({
        access_key: "lsq_acc_83741",
        secret_key: "lsq_sec_99182",
        host_url: "https://api-us11.leadsquared.com"
      });
    } else if (toolId === "woocommerce") {
      setSetupValues({
        store_url: "https://example.com",
        consumer_key: "ck_91823a8b",
        consumer_secret: "cs_192837bc"
      });
    } else if (toolId === "whatsapp-business") {
      setSetupValues({
        api_token: "wa_tok_19283",
        phone_number_id: "192837461"
      });
    } else if (toolId === "tally") {
      setSetupValues({
        export_path: "C:\\Tally\\Export"
      });
    } else if (toolId === "limechat") {
      setSetupValues({
        account_id: "lime_acc_102",
        api_token: "lime_tok_9912"
      });
    } else {
      setSetupValues({});
    }
  };

  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupToolId) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/connectors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workspaceId: workspaceId || "placeholder_workspace_id",
          toolId: setupToolId,
          credentials: setupValues,
          name: setupName,
          schema: setupSchema,
          connectedAccounts,
          syncTimeframe,
          syncStartDate,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to connect. Please check credentials and try again.");
      }

      // Save credentials locally
      localStorage.setItem(`grip_credentials_${workspaceId}_${setupToolId}`, JSON.stringify(setupValues));

      if (!connectedTools.includes(setupToolId)) {
        setConnectedTools([...connectedTools, setupToolId]);
      }
      updateSyncInfo(setupToolId, {
        lastSyncedAt: new Date().toISOString(),
        status: "synced",
      });
      setSetupToolId(null);
      setIsAdding(false);
    } catch (error) {
      console.error("Failed to setup connection:", error);
      alert(error instanceof Error ? error.message : "Failed to setup connection");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuthStart = (toolId: string) => {
    console.log(`Starting OAuth flow for ${toolId}`);
    alert(`Starting simulated OAuth flow for ${toolId}. Authorizing...`);
    const val = { oauth_authorized: "true" };
    setSetupValues(val);
    localStorage.setItem(`grip_credentials_${workspaceId}_${toolId}`, JSON.stringify(val));
    setTestStatus('success');
  };

  const setupConnector = registryConnectors.find((c) => c.toolId === setupToolId);

  const handleTestConnection = async () => {
    if (!setupToolId) return;
    setIsTesting(true);
    setTestStatus('testing');
    try {
      const response = await fetch(`${API_URL}/api/v1/connectors/test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolId: setupToolId,
          credentials: setupValues,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTestStatus('success');
        } else {
          setTestStatus('failed');
        }
      } else {
        setTestStatus('failed');
      }
    } catch (error) {
      console.error("Failed to test connection:", error);
      setTestStatus('failed');
    } finally {
      setIsTesting(false);
    }
  };

  // Filter tools based on search query
  const filteredTools = registryConnectors.filter((tool) =>
    tool.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Active tools in connected state
  const activeConnectedTools = registryConnectors.filter((tool) =>
    connectedTools.includes(tool.toolId)
  );

  const pageContent = (
    <div className="space-y-8">
          {viewingToolId ? (
            /* ================= VIEW 5: VIEW / MANAGE ACTIVE CONNECTION ================= */
            <div className="space-y-6 animate-fadeIn">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h1 className="text-2xl font-semibold tracking-tight text-gray-900 capitalize">
                    {viewingToolId.toLowerCase()}
                  </h1>
                  <p className="text-gray-500 text-sm">View and manage this connection.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingToolId(null)}
                  className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  Back
                </button>
              </div>

              {/* Connection Details Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-400">Connection Details</h3>

                <div className="border border-gray-200 rounded-2xl bg-white shadow-sm p-6 space-y-6">
                  {/* Top: Logo + Name & Description */}
                  <div className="flex items-start gap-4">
                    {LOGO_MAP[viewingToolId] ? (
                      <div className="w-12 h-12 p-2 rounded-xl bg-gray-50 border border-gray-150 flex items-center justify-center shrink-0">
                        <img
                          src={LOGO_MAP[viewingToolId]}
                          alt={viewingToolId}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xl shrink-0 border border-gray-200">
                        🔌
                      </div>
                    )}
                    <div className="space-y-1">
                      <h4 className="font-semibold text-gray-900 text-sm leading-none">{viewingToolId?.toLowerCase()}</h4>
                      <p className="text-xs text-gray-500 leading-normal">
                        {(registryConnectors.find((c) => c.toolId === viewingToolId) as any)?.description ||
                          `Sync your data pipeline and entities directly from ${viewingToolId}.`}
                      </p>
                    </div>
                  </div>

                  <hr className="border-gray-100" />
                  <div className="space-y-4 text-sm font-medium">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Type</span>
                      <span className="text-gray-900 font-semibold">
                        {registryConnectors.find((c) => c.toolId === viewingToolId)?.displayName || viewingToolId}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Created</span>
                      <span className="text-gray-900 font-semibold">20/6/2026</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Last Updated</span>
                      <span className="text-gray-900 font-semibold">20/6/2026</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Manage Connection Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-400">Manage Connection</h3>

                <div className="border border-gray-200 rounded-2xl bg-white shadow-sm p-6 space-y-6">
                  {/* Row 1: Configure Connection */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-gray-800">Configure connection</h4>
                      <p className="text-xs text-gray-500">View and modify your connection settings</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (viewingToolId) {
                          handleConnectClick(viewingToolId);
                          setViewingToolId(null);
                        }
                      }}
                      className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-700 flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      Configure
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h1.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992.004.042.006.085.006.128 0 .042-.002.085-.006.128-.008.379.137.751.43.992l1.003.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.94-1.11.94h-1.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c-.007-.378-.152-.75-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Row 2: Delete Connection */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-gray-800">Delete connection</h4>
                      <p className="text-xs text-gray-500">Permanently delete this connection</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDisconnectClick(viewingToolId)}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : setupToolId ? (
            /* ================= VIEW 4: SETUP CONNECTION ================= */
            <div className="space-y-6 animate-fadeIn">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Setup connection</h1>
                <button
                  type="button"
                  onClick={() => setSetupToolId(null)}
                  className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  Back
                </button>
              </div>

              {/* Sub-label */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400">{setupConnector?.displayName}</h3>
              </div>

              {/* Setup Form Card */}
              <form onSubmit={handleSetupSubmit} className="border border-gray-200 rounded-2xl bg-white shadow-sm p-8 space-y-6">

                {/* Logo + Name Input Row */}
                <div className="flex items-center gap-6">
                  {setupToolId && LOGO_MAP[setupToolId] ? (
                    <div className="w-14 h-14 p-2.5 rounded-2xl bg-gray-50 border border-gray-150 flex items-center justify-center shrink-0">
                      <img
                        src={LOGO_MAP[setupToolId]}
                        alt={setupConnector?.displayName}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl select-none shrink-0 border border-gray-200">
                      🔌
                    </div>
                  )}
                  <div className="flex-grow space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Connection name"
                      value={setupName}
                      onChange={(e) => setSetupName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all shadow-sm"
                    />
                  </div>
                </div>

                {/* Destination Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">
                    Destination
                  </label>
                  <div className="relative">
                    <div className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 cursor-pointer shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7M3 7c0-1.657 3.134-3 7-3s7 1.343 7 3-3.134 3-7 3-7-1.343-7-3z" />
                          </svg>
                        </div>
                        <span className="font-semibold text-gray-800">Grip warehouse</span>
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">Choose where this connection&apos;s data should land.</p>
                </div>

                {/* Schema */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">
                    Schema
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="schema_name"
                    value={setupSchema}
                    onChange={(e) => setSetupSchema(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all font-mono shadow-sm"
                  />
                </div>

                {/* Credential Fields / OAuth Actions */}
                {setupConnector?.authMethod === "oauth2" ? (
                  <div className="py-2 space-y-3">
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">
                      Authentication
                    </label>
                    <div className="p-4 border border-gray-150 rounded-xl bg-gray-50 flex items-center justify-between shadow-sm">
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-gray-800">OAuth 2.0 Authorization</p>
                        <p className="text-xs text-gray-500">Authorize access to sync leads & data read-only.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setupToolId && handleOAuthStart(setupToolId)}
                        className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
                      >
                        Authorize Access
                      </button>
                    </div>
                  </div>
                ) : (
                  setupConnector?.credentialFields?.map((field) => (
                    <div key={field.key} className="space-y-1.5">
                      <label htmlFor={field.key} className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">
                        {field.label}
                      </label>
                      <input
                        id={field.key}
                        type={field.secret ? "password" : "text"}
                        required
                        value={setupValues[field.key] || ""}
                        onChange={(e) => {
                          setSetupValues(prev => ({ ...prev, [field.key]: e.target.value }));
                          setTestStatus('idle');
                        }}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all font-mono shadow-sm"
                        placeholder={(field as any).placeholder || `Enter ${field.label}`}
                      />
                    </div>
                  ))
                )}



                {testStatus === 'failed' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm flex items-start gap-2.5 animate-fadeIn">
                    <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="space-y-1">
                      <p className="font-semibold text-red-900">Connection test failed</p>
                      <p className="text-xs text-red-700">The credentials provided could not be verified. Please check your keys/credentials and try again.</p>
                    </div>
                  </div>
                )}

                {/* Create Button Row */}
                <div className="flex justify-between items-center pt-4">
                  <div>
                    {testStatus === 'success' && (
                      <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 animate-fadeIn">
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Connection test successful
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={isTesting || isSubmitting}
                      className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {testStatus === 'testing' ? (
                        <>
                          <svg className="animate-spin h-3.5 w-3.5 text-gray-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Testing...</span>
                        </>
                      ) : (
                        <span>Test connection</span>
                      )}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-semibold transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : isAdding ? (
            /* ================= VIEW 3: ADD CONNECTION ================= */
            <div className="space-y-6 animate-fadeIn">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Add connection</h1>
                  <p className="text-gray-500 text-sm">Choose a source to sync data from.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setSearchQuery("");
                  }}
                  className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  Back
                </button>
              </div>

              {/* Title label */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400">Connectors</h3>
              </div>

              {/* Search bar */}
              <div className="relative">
                <svg className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all shadow-sm"
                />
              </div>

              {/* Grid of Tools */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTools.map((tool) => {
                  const isConnected = connectedTools.includes(tool.toolId);
                  return (
                    <button
                      key={tool.toolId}
                      onClick={() => handleConnectClick(tool.toolId)}
                      disabled={isConnected}
                      className={`flex items-center gap-4 p-4 border border-gray-150 rounded-xl bg-white hover:border-gray-300 hover:shadow-sm transition-all text-left w-full cursor-pointer group ${isConnected ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                      {LOGO_MAP[tool.toolId] ? (
                        <img
                          src={LOGO_MAP[tool.toolId]}
                          alt={tool.displayName}
                          className="w-8 h-8 object-contain shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold select-none shrink-0">
                          🔌
                        </div>
                      )}
                      <span className="font-semibold text-gray-800 text-sm group-hover:text-gray-950 transition-colors">
                        {tool.displayName}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="text-center pt-8 text-sm text-gray-400 font-medium">
                Need something specific? <a href="#" className="underline hover:text-gray-600 transition-colors">Let us know</a>
              </div>
            </div>

          ) : (
            /* ================= VIEW 1 & 2: LIST / EMPTY STATE ================= */
            <div className="space-y-6 animate-fadeIn">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Connectors</h1>
                  <p className="text-gray-500 text-sm">Manage your third-party connectors.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAdding(true)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add connector
                </button>
              </div>

              {/* Title label */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400">Manage connectors</h3>
              </div>

              {activeConnectedTools.length > 0 ? (
                /* ================= VIEW 1: SELECTED STATE ================= */
                <div className="border border-gray-150 rounded-2xl bg-white shadow-sm p-8 space-y-4">
                  {activeConnectedTools.map((tool) => (
                    <button
                      key={tool.toolId}
                      onClick={() => setViewingToolId(tool.toolId)}
                      className="flex items-center justify-between p-4 border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 rounded-xl bg-white transition-all text-left w-full cursor-pointer group animate-fadeIn"
                    >
                      <div className="flex items-center gap-4">
                        {LOGO_MAP[tool.toolId] ? (
                          <img
                            src={LOGO_MAP[tool.toolId]}
                            alt={tool.displayName}
                            className="w-8 h-8 object-contain shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold select-none shrink-0">
                            🔌
                          </div>
                        )}
                        <span className="font-semibold text-gray-800 text-sm group-hover:text-gray-950 transition-colors">
                          {tool.displayName}
                        </span>
                      </div>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  ))}
                </div>
              ) : (
                /* ================= VIEW 2: EMPTY STATE ================= */
                <div className="border border-gray-150 rounded-2xl bg-white shadow-sm p-12 py-20 min-h-[400px] flex flex-col items-center justify-center text-center">
                  <h3 className="text-base font-semibold text-gray-900">Add your first connector</h3>
                  <p className="text-sm text-gray-500 mt-1.5 mb-6 max-w-sm">
                    Add your first connector to start syncing data to your warehouse.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsAdding(true)}
                    className="px-5 py-2.5 bg-gray-900 !text-white hover:bg-gray-800 rounded-xl text-sm font-semibold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add connector
                  </button>
                </div>
              )}

            </div>
          )}

        </div>
  );

  const disconnectModal = disconnectTool ? (
    <DisconnectModal
      tool={disconnectTool}
      isOpen={!!disconnectTool}
      onClose={() => setDisconnectTool(null)}
      onConfirm={handleDisconnectConfirm}
    />
  ) : null;

  if (embedded) {
    return (
      <>
        {pageContent}
        {disconnectModal}
      </>
    );
  }

  return (
    <div className="flex-grow flex flex-col min-h-screen bg-[#fafafa] font-sans text-gray-900">
      <main className="flex-grow overflow-y-auto p-12 scrollbar-thin lg:p-20">
        <div className="mx-auto max-w-4xl">{pageContent}</div>
      </main>
      {disconnectModal}
    </div>
  );
}

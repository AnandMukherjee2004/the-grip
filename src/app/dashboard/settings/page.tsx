"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useOnboarding } from "@/context/OnboardingContext";
import { getInitials } from "@/lib/profile-images";
import { readImageFile } from "@/lib/profile-images";

const ConnectorsPage = dynamic(() => import("../connectors/page"), {
  loading: () => (
    <div className="py-12 text-center text-sm text-gray-400">Loading connectors...</div>
  ),
});

type TabId =
  | "workspace"
  | "members"
  | "connectors"
  | "connections"
  | "team"
  | "billing"
  | "notifications"
  | "privacy"
  | "knowledge"
  | "api"
  | "danger";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  isYou?: boolean;
}

interface ApiKeyItem {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
}

// Slack logo SVG
const SlackLogo = () => (
  <svg width="28" height="28" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.712.133a5.381 5.381 0 0 0-5.376 5.387 5.381 5.381 0 0 0 5.376 5.386h5.376V5.52A5.381 5.381 0 0 0 19.712.133m0 14.365H5.376A5.381 5.381 0 0 0 0 19.884a5.381 5.381 0 0 0 5.376 5.387h14.336a5.381 5.381 0 0 0 5.376-5.387 5.381 5.381 0 0 0-5.376-5.386" fill="#36C5F0"/>
    <path d="M53.76 19.884a5.381 5.381 0 0 0-5.376-5.386 5.381 5.381 0 0 0-5.376 5.386v5.387h5.376a5.381 5.381 0 0 0 5.376-5.387m-14.336 0V5.52A5.381 5.381 0 0 0 34.048.133a5.381 5.381 0 0 0-5.376 5.387v14.364a5.381 5.381 0 0 0 5.376 5.387 5.381 5.381 0 0 0 5.376-5.387" fill="#2EB67D"/>
    <path d="M34.048 54a5.381 5.381 0 0 0 5.376-5.387 5.381 5.381 0 0 0-5.376-5.386h-5.376v5.386A5.381 5.381 0 0 0 34.048 54m0-14.365h14.336a5.381 5.381 0 0 0 5.376-5.386 5.381 5.381 0 0 0-5.376-5.387H34.048a5.381 5.381 0 0 0-5.376 5.387 5.381 5.381 0 0 0 5.376 5.386" fill="#ECB22E"/>
    <path d="M0 34.249a5.381 5.381 0 0 0 5.376 5.386 5.381 5.381 0 0 0 5.376-5.386v-5.387H5.376A5.381 5.381 0 0 0 0 34.249m14.336 0v14.364A5.381 5.381 0 0 0 19.712 54a5.381 5.381 0 0 0 5.376-5.387V34.249a5.381 5.381 0 0 0-5.376-5.387 5.381 5.381 0 0 0-5.376 5.387" fill="#E01E5A"/>
  </svg>
);

function SettingsPageContent() {
  const { workspaces, activeWorkspaceId, updateWorkspaceName, updateWorkspaceImage } = useOnboarding();
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || {
    id: "frido",
    name: "Frido",
    imageUrl: null,
  };

  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<TabId>("workspace");

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam === "connections" ? "connectors" : (tabParam as TabId));
    }
  }, [tabParam]);

  // Workspace state
  const [workspaceName, setWorkspaceName] = useState(activeWorkspace.name);
  const [workspaceSlug, setWorkspaceSlug] = useState(
    activeWorkspace.name.toLowerCase().replace(/\s+/g, "-")
  );
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [slackConnected, setSlackConnected] = useState(false);

  // API Keys state
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([
    { id: "1", name: "Production Ingestion Link", key: "grip_live_5fa83d2c88f18...", created: "01/06/2026", lastUsed: "5 mins ago" },
    { id: "2", name: "Staging sandbox", key: "grip_live_d82e1194ba32e...", created: "14/06/2026", lastUsed: "1 day ago" },
  ]);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const [inviteEmail, setInviteEmail] = useState("");
  const [members, setMembers] = useState<Member[]>([
    {
      id: "1",
      name: "Anand Mukherjee",
      email: "anandmukherjee2004@gmail.com",
      role: "Owner",
      isYou: true,
    },
  ]);

  useEffect(() => {
    setWorkspaceName(activeWorkspace.name);
    setWorkspaceSlug(activeWorkspace.name.toLowerCase().replace(/\s+/g, "-"));
  }, [activeWorkspaceId, activeWorkspace.name]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleUpdateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      updateWorkspaceName(activeWorkspaceId, workspaceName);
      triggerToast("Workspace updated successfully!");
    }, 900);
  };

  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (dataUrl: string) => {
    if (!activeWorkspaceId) return;
    updateWorkspaceImage(activeWorkspaceId, dataUrl);
    triggerToast("Workspace logo updated!");
  };

  const handleGenerateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;
    const randomHex = Array.from({ length: 24 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    const fullKey = `grip_live_${randomHex}`;
    const newKeyItem: ApiKeyItem = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `${fullKey.substring(0, 15)}...`,
      created: new Date().toLocaleDateString("en-GB"),
      lastUsed: "Never",
    };
    setApiKeys([...apiKeys, newKeyItem]);
    setGeneratedKey(fullKey);
    setNewKeyName("");
    triggerToast("API Key generated successfully!");
  };

  const handleRevokeApiKey = (id: string, name: string) => {
    setApiKeys(apiKeys.filter((k) => k.id !== id));
    triggerToast(`API key "${name}" revoked.`);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newMember: Member = {
      id: Date.now().toString(),
      name: inviteEmail.split("@")[0].replace(".", " "),
      email: inviteEmail,
      role: "Member",
    };

    setMembers([...members, newMember]);
    setInviteEmail("");
    triggerToast(`Invitation sent to ${inviteEmail}!`);
  };

  return (
    <div className="flex-grow flex flex-col h-full overflow-hidden bg-[#fafafa] font-sans text-gray-900">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 bg-white border border-gray-200 text-gray-800 px-4 py-3 rounded-xl shadow-lg text-xs font-semibold animate-fadeIn">
          <span className="text-emerald-500">✓</span>
          {toastMessage}
        </div>
      )}

      {/* Scrollable main content */}
      <main className="flex-grow overflow-y-auto scrollbar-thin">
        <div className="max-w-2xl mx-auto px-6 py-10 space-y-10">

          {/* ─── GENERAL / WORKSPACE TAB ─── */}
          {(activeTab === "workspace" || !activeTab) && (
            <div className="space-y-8">
              {/* Header */}
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">General</h1>
                <p className="text-gray-500 text-sm">Manage your workspace details.</p>
              </div>

              {/* Settings section */}
              <div className="space-y-3">
                <p className="text-sm text-gray-500 font-medium">Settings</p>
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
                  {/* Logo + Name + Slug */}
                  <form onSubmit={handleUpdateWorkspace} className="space-y-5">
                    <div className="flex items-start gap-5">
                      {/* Logo */}
                      <div className="shrink-0">
                        <input
                          ref={logoInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            e.target.value = "";
                            if (!file) return;
                            try {
                              const dataUrl = await readImageFile(file);
                              handleLogoUpload(dataUrl);
                            } catch {
                              triggerToast("Could not upload image.");
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => logoInputRef.current?.click()}
                          title="Click to upload logo"
                          className="w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-500 overflow-hidden hover:border-gray-400 transition-all cursor-pointer group relative"
                        >
                          {activeWorkspace.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={activeWorkspace.imageUrl} alt={activeWorkspace.name} className="w-full h-full object-cover" />
                          ) : (
                            getInitials(activeWorkspace.name)
                          )}
                          <span className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-[9px] text-white font-semibold">
                            Upload
                          </span>
                        </button>
                      </div>

                      {/* Fields */}
                      <div className="flex-grow space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            value={workspaceName}
                            onChange={(e) => setWorkspaceName(e.target.value)}
                            required
                            className="w-full h-10 px-3.5 rounded-lg text-sm bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-gray-700">Slug</label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 select-none pointer-events-none">
                              https://app.grip.com/
                            </span>
                            <input
                              type="text"
                              value={workspaceSlug}
                              onChange={(e) =>
                                setWorkspaceSlug(
                                  e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
                                )
                              }
                              className="w-full h-10 pl-[172px] pr-3.5 rounded-lg text-sm bg-white border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all font-mono"
                            />
                          </div>
                          <p className="text-xs text-gray-400">This will be your organization&apos;s unique URL identifier</p>
                        </div>
                      </div>
                    </div>

                    {/* Update button */}
                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-5 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white text-sm font-semibold transition-all active:scale-95 cursor-pointer"
                      >
                        {saving ? "Updating..." : "Update"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Slack section */}
              <div className="space-y-3">
                <p className="text-sm text-gray-500 font-medium">Slack</p>
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                        <SlackLogo />
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-sm font-semibold text-gray-900">Chat with us on Slack</div>
                        <div className="text-xs text-gray-400">Shared channel for direct support.</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSlackConnected(!slackConnected);
                        triggerToast(slackConnected ? "Slack disconnected." : "Connected to Slack successfully!");
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all cursor-pointer active:scale-95 ${
                        slackConnected
                          ? "bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200"
                          : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <SlackLogo />
                      {slackConnected ? "Connected" : "Connect"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="space-y-3">
                <p className="text-sm text-gray-500 font-medium">Danger zone</p>
                <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-semibold text-gray-900">Delete workspace</div>
                      <div className="text-xs text-gray-400">Permanently delete this workspace and all its data.</div>
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg bg-white border border-red-200 text-red-500 hover:bg-red-50 text-sm font-semibold transition-all cursor-pointer active:scale-95"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── API KEYS TAB ─── */}
          {activeTab === "api" && (
            <div className="space-y-8">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">API Keys</h1>
                <p className="text-gray-500 text-sm">Integrate GRIP with your internal systems.</p>
              </div>

              {/* Generate key */}
              <div className="space-y-3">
                <p className="text-sm text-gray-500 font-medium">Generate new key</p>
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <form onSubmit={handleGenerateApiKey} className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Key nickname (e.g. Production)"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      className="flex-grow h-10 px-3.5 rounded-lg text-sm bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all"
                    />
                    <button
                      type="submit"
                      className="px-5 h-10 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                    >
                      Generate Key
                    </button>
                  </form>

                  {generatedKey && (
                    <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                      <div className="text-xs font-semibold text-emerald-700">Copy your API key — it won&apos;t be shown again:</div>
                      <div className="flex items-center justify-between bg-white border border-emerald-200 rounded-lg px-3.5 py-2.5">
                        <span className="text-sm font-mono text-gray-800 truncate">{generatedKey}</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedKey);
                            triggerToast("Copied to clipboard!");
                          }}
                          className="ml-3 px-3 py-1 bg-gray-900 text-white rounded text-xs font-semibold cursor-pointer shrink-0"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Active keys */}
              <div className="space-y-3">
                <p className="text-sm text-gray-500 font-medium">Active keys</p>
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-100">
                  {apiKeys.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-gray-900">{item.name}</div>
                        <div className="text-xs font-mono text-gray-400">{item.key}</div>
                        <div className="text-xs text-gray-400">Created {item.created} · Last used {item.lastUsed}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRevokeApiKey(item.id, item.name)}
                        className="text-sm text-red-500 hover:text-red-700 font-semibold transition-colors cursor-pointer shrink-0 ml-4"
                      >
                        Revoke
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── BILLING TAB ─── */}
          {activeTab === "billing" && (
            <div className="space-y-8">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Billing</h1>
                <p className="text-gray-500 text-sm">Manage your subscription and invoices.</p>
              </div>

              {/* Current Plan */}
              <div className="space-y-3">
                <p className="text-sm text-gray-500 font-medium">Current plan</p>
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-gray-900">Growth Plan</div>
                      <div className="text-xl font-bold text-gray-900">₹11,999<span className="text-sm font-normal text-gray-400">/month</span></div>
                    </div>
                    <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold rounded-full">Active</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Connectors Active</span>
                      <span className="font-semibold text-gray-900">3 / 5</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: "60%" }} />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Team Seats</span>
                      <span className="font-semibold text-gray-900">3 / 10</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: "30%" }} />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-lg transition-all active:scale-95 cursor-pointer">Upgrade Plan</button>
                    <button className="px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-xs font-semibold rounded-lg transition-all active:scale-95 cursor-pointer">Change Plan</button>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-3">
                <p className="text-sm text-gray-500 font-medium">Payment method</p>
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">💳</div>
                    <div className="space-y-0.5">
                      <div className="text-sm font-semibold text-gray-900">Visa ending in 4242</div>
                      <div className="text-xs text-gray-400">Expires 12/28</div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-sm font-semibold rounded-lg transition-all cursor-pointer">Update</button>
                </div>
              </div>

              {/* Invoices */}
              <div className="space-y-3">
                <p className="text-sm text-gray-500 font-medium">Invoice history</p>
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-100">
                  {[
                    { id: "INV-2026-004", date: "01/06/2026", amt: "₹11,999" },
                    { id: "INV-2026-003", date: "01/05/2026", amt: "₹11,999" },
                    { id: "INV-2026-002", date: "01/04/2026", amt: "₹11,999" },
                  ].map((inv) => (
                    <div key={inv.id} className="p-4 flex justify-between items-center hover:bg-gray-50/50 transition-colors">
                      <div className="flex gap-4">
                        <span className="text-sm font-semibold text-gray-900">{inv.id}</span>
                        <span className="text-sm text-gray-400">{inv.date}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-gray-900">{inv.amt}</span>
                        <button className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer">Download</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cancel */}
              <div className="space-y-3">
                <p className="text-sm text-gray-500 font-medium">Danger zone</p>
                <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-semibold text-gray-900">Cancel subscription</div>
                    <div className="text-xs text-gray-400">Halts all data syncs and disconnects integrations.</div>
                  </div>
                  <button className="px-4 py-2 bg-white border border-red-200 text-red-500 hover:bg-red-50 text-sm font-semibold rounded-lg transition-all cursor-pointer">Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* ─── NOTIFICATIONS TAB ─── */}
          {activeTab === "notifications" && (
            <div className="space-y-8">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Notifications</h1>
                <p className="text-gray-500 text-sm">Configure where and when you receive alerts.</p>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-gray-500 font-medium">Preferences</p>
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-100">
                  {[
                    { key: "syncFailures", title: "Integration sync failures", desc: "Notify when HubSpot, Shopify, or Razorpay drop sync.", default: true },
                    { key: "paymentFailures", title: "Payment failures", desc: "Send critical transaction drop alerts.", default: true },
                    { key: "dailySummary", title: "Daily analytics digest", desc: "Email metrics snapshots at the end of each day.", default: false },
                    { key: "weeklyReport", title: "Weekly report", desc: "Email PDF overview breakdowns every Monday.", default: true },
                    { key: "inAppAlerts", title: "In-app activity alerts", desc: "Real-time alerts in the top dashboard navigation bar.", default: true },
                  ].map((pref) => {
                    const [enabled, setEnabled] = useState(pref.default);
                    return (
                      <div key={pref.key} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                        <div className="space-y-0.5 pr-4">
                          <div className="text-sm font-semibold text-gray-900">{pref.title}</div>
                          <div className="text-xs text-gray-400">{pref.desc}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEnabled(!enabled)}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer flex items-center shrink-0 ${
                            enabled ? "bg-gray-900 justify-end" : "bg-gray-200 justify-start"
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ─── KNOWLEDGE TAB ─── */}
          {activeTab === "knowledge" && (
            <div className="space-y-8">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Knowledge</h1>
                <p className="text-gray-500 text-sm">Manage workspace knowledge and documentation.</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-12 shadow-sm text-center text-gray-400 text-sm">
                Nothing here yet.
              </div>
            </div>
          )}

          {/* ─── PRIVACY TAB ─── */}
          {activeTab === "privacy" && (
            <div className="space-y-8">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Privacy</h1>
                <p className="text-gray-500 text-sm">Configure data retention and compliance settings.</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-500 font-medium">Data retention</p>
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="text-sm font-semibold text-gray-900">Synced Data Retention Window</div>
                  <div className="flex gap-3">
                    {["30 days", "90 days", "180 days"].map((opt) => (
                      <label key={opt} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="radio" name="retention" defaultChecked={opt === "90 days"} className="accent-gray-900" />
                        {opt}
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">Raw sync records are compressed or deleted permanently past this timeline.</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-500 font-medium">Export data</p>
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex justify-between items-center">
                  <div className="space-y-0.5">
                    <div className="text-sm font-semibold text-gray-900">Export Ingestion Database</div>
                    <div className="text-xs text-gray-400">Download all raw leads, payments, and records as a CSV ZIP.</div>
                  </div>
                  <button className="px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-sm font-semibold rounded-lg transition-all cursor-pointer">Export CSV</button>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-500 font-medium">Compliance</p>
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-2">
                  <div className="text-sm font-semibold text-indigo-600">⚖️ DPDP Act 2023 Compliance</div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Under the Digital Personal Data Protection Act of India, GRIP operates strictly as a data processor. Customers retain complete ownership over synced records. Customer fields are ingested solely for building reporting analytics, encrypted at rest, never shared with third parties, and fully purged upon deletion.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ─── MEMBERS TAB ─── */}
          {activeTab === "members" && (
            <div className="space-y-8">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Members</h1>
                <p className="text-gray-500 text-sm">Manage your team members.</p>
              </div>

              <form onSubmit={handleSendInvite} className="space-y-3">
                <h2 className="text-sm font-semibold text-gray-700">Invite your team</h2>
                <div className="flex gap-3">
                  <input
                    type="email"
                    required
                    placeholder="etufte@grip.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="flex-grow px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all shadow-sm"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    Send invite
                  </button>
                </div>
              </form>

              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-gray-700">Manage members</h2>
                <div className="border border-gray-200 rounded-[20px] p-6 bg-white shadow-sm space-y-4">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0">
                          {getInitials(member.name)}
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                            {member.name}
                            {member.isYou && (
                              <span className="text-xs text-gray-400 font-normal">(You)</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-400 font-medium">{member.email}</div>
                        </div>
                      </div>
                      <select
                        value={member.role}
                        onChange={(e) => {
                          setMembers(
                            members.map((m) =>
                              m.id === member.id ? { ...m, role: e.target.value } : m
                            )
                          );
                        }}
                        className="appearance-none bg-transparent hover:bg-gray-50 text-xs font-semibold text-gray-600 px-3 py-1.5 pr-8 border border-transparent rounded-lg cursor-pointer focus:outline-none transition-colors"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: "right 6px center",
                          backgroundSize: "16px",
                          backgroundRepeat: "no-repeat",
                        }}
                      >
                        <option value="Owner">Owner</option>
                        <option value="Admin">Admin</option>
                        <option value="Member">Member</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── CONNECTORS TAB ─── */}
          {(activeTab === "connectors" || activeTab === "connections") && (
            <div className="relative -mx-6 -my-10 min-h-[600px]">
              <ConnectorsPage />
            </div>
          )}

          {/* ─── TEAM TAB (legacy redirect) ─── */}
          {activeTab === "team" && (
            <div className="space-y-8">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Members</h1>
                <p className="text-gray-500 text-sm">Manage your team members.</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center text-gray-400 text-sm">
                Team settings are now under <strong className="text-gray-700">Members</strong> in the sidebar.
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-sm text-gray-400">Loading settings...</div>
      </div>
    }>
      <SettingsPageContent />
    </Suspense>
  );
}

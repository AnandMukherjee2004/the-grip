"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import TopBar, { DEFAULT_DATE_RANGE } from "@/components/layout/TopBar";
import CustomSelect from "@/components/ui/CustomSelect";
import type { DateRangeSelection } from "@/lib/dateRange";
import { InfoIcon, CheckCircleIcon, SettingsIcon } from "@/components/ui/Icons";
import { useOnboarding } from "@/context/OnboardingContext";
import { ImageUploadField } from "@/components/profile/ImageUploadField";
import { getInitials } from "@/lib/profile-images";

type TabId =
  | "workspace"
  | "team"
  | "billing"
  | "notifications"
  | "connectors"
  | "privacy"
  | "api"
  | "danger";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Member" | "Viewer";
  lastActive: string;
}

interface ApiKeyItem {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
}

const INDUSTRY_OPTIONS = [
  { value: "E-commerce", label: "E-commerce" },
  { value: "SaaS", label: "SaaS / Software" },
  { value: "Fintech", label: "Fintech" },
  { value: "Retail & Brands", label: "Retail & Brands" },
  { value: "Agency / Services", label: "Agency / Services" },
];

const CURRENCY_OPTIONS = [
  { value: "INR", label: "INR (₹) - Indian Rupee" },
  { value: "USD", label: "USD ($) - US Dollar" },
  { value: "EUR", label: "EUR (€) - Euro" },
  { value: "GBP", label: "GBP (£) - British Pound" },
];

const TIMEZONE_OPTIONS = [
  { value: "IST", label: "IST (UTC+05:30) - India Standard Time" },
  { value: "UTC", label: "UTC (UTC+00:00) - Coordinated Universal Time" },
  { value: "EST", label: "EST (UTC-05:00) - Eastern Standard Time" },
  { value: "PST", label: "PST (UTC-08:00) - Pacific Standard Time" },
];

const INVITE_ROLE_OPTIONS = [
  { value: "Admin", label: "Admin" },
  { value: "Member", label: "Member" },
  { value: "Viewer", label: "Viewer (Read-only)" },
];

const RETENTION_OPTIONS = [
  { value: "30", label: "30 Days" },
  { value: "90", label: "90 Days (Recommended)" },
  { value: "180", label: "180 Days" },
];

export default function SettingsPage() {
  const { workspaces, activeWorkspaceId, updateWorkspaceName, updateWorkspaceImage } = useOnboarding();
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || {
    id: "frido",
    name: "Frido",
    imageUrl: null,
  };

  const [dateRange, setDateRange] = useState<DateRangeSelection>(DEFAULT_DATE_RANGE);
  const [activeTab, setActiveTab] = useState<TabId>("workspace");

  // State: Workspace details
  const [workspaceName, setWorkspaceName] = useState(activeWorkspace.name);
  const [industry, setIndustry] = useState("E-commerce");
  const [currency, setCurrency] = useState("INR");
  const [timezone, setTimezone] = useState("IST");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");

  useEffect(() => {
    setWorkspaceName(activeWorkspace.name);
  }, [activeWorkspaceId, activeWorkspace.name]);

  // State: Team Members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: "1", name: "Anand Mukherjee", email: "anand.mukherjee@example.com", role: "Admin", lastActive: "Active now" },
    { id: "2", name: "Rajesh Kumar", email: "rajesh.kumar@example.com", role: "Member", lastActive: "2 hours ago" },
    { id: "3", name: "Priya Patel", email: "priya.patel@example.com", role: "Viewer", lastActive: "1 day ago" },
  ]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"Admin" | "Member" | "Viewer">("Member");

  // State: API Keys
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([
    { id: "1", name: "Production Ingestion Link", key: "grip_live_5fa83d2c88f18...", created: "01/06/2026", lastUsed: "5 mins ago" },
    { id: "2", name: "Staging sandbox", key: "grip_live_d82e1194ba32e...", created: "14/06/2026", lastUsed: "1 day ago" },
  ]);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  // State: Notifications
  const [notifications, setNotifications] = useState({
    syncFailures: true,
    paymentFailures: true,
    dailySummary: false,
    weeklyReport: true,
    inAppAlerts: true,
    whatsappOptIn: false,
  });

  // State: Data and Privacy
  const [retention, setRetention] = useState("90");
  const [deleteDataConfirm, setDeleteDataConfirm] = useState("");
  const [deleteWorkspaceConfirm, setDeleteWorkspaceConfirm] = useState("");

  // Saving states
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3500);
  };

  const handleSaveWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      updateWorkspaceName(activeWorkspaceId, workspaceName);
      triggerToast("Workspace details updated successfully!");
    }, 1000);
  };

  const handleSecuritySave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      triggerToast("Security credentials and API parameters saved!");
    }, 1200);
  };

  const handleNotificationsSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      triggerToast("Notification preferences updated!");
    }, 1200);
  };

  const handleSyncSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      triggerToast("Data integration and synchronization intervals saved!");
    }, 1200);
  };

  // Team Invite Action
  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteEmail.split("@")[0].replace(".", " "),
      email: inviteEmail,
      role: inviteRole,
      lastActive: "Invited",
    };
    setTeamMembers([...teamMembers, newMember]);
    setInviteEmail("");
    triggerToast(`Invitation sent to ${inviteEmail}!`);
  };

  // Team Remove Action
  const handleRemoveMember = (id: string, name: string) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== id));
    triggerToast(`Removed member ${name}.`);
  };

  // API Key Generation Action
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

  // Cancel Subscription Action
  const handleCancelSubscription = () => {
    triggerToast("Subscription cancellation request received. A team member will contact you.");
  };

  // Export Data Action
  const handleExportData = () => {
    // TODO: Trigger backend data export as a ZIP containing CSV collections of ingestion databases
    triggerToast("Data export triggered! You will receive an email with your CSV Zip download links shortly.");
  };

  // Delete Synced Data
  const handleDeleteSyncedData = (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteDataConfirm !== workspaceName) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setDeleteDataConfirm("");
      triggerToast("All synced raw ingestion database records have been purged.");
    }, 1500);
  };

  // Delete Workspace
  const handleDeleteWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteWorkspaceConfirm !== workspaceName) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setDeleteWorkspaceConfirm("");
      triggerToast("Workspace delete event simulation: redirected to dashboard onboarding.");
    }, 1500);
  };

  const handleLogoUpload = (dataUrl: string) => {
    if (!activeWorkspaceId) return;
    updateWorkspaceImage(activeWorkspaceId, dataUrl);
    triggerToast("Workspace logo uploaded successfully!");
  };

  return (
    <div className="flex-grow flex flex-col h-full overflow-hidden bg-[#040409]">
      <TopBar dateRange={dateRange} onDateRangeChange={setDateRange} />

      {/* Main content scrollable area */}
      <main className="flex-grow overflow-y-auto p-6 space-y-8 scrollbar-thin relative">
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-[#0d0d1a] border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md animate-fadeIn transition-all duration-300">
            <CheckCircleIcon className="text-emerald-400" size={16} />
            <span className="text-xs font-semibold">{toastMessage}</span>
          </div>
        )}

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header Title */}
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <SettingsIcon className="text-indigo-400" size={20} /> Settings
            </h1>
            <p className="text-white/40 text-xs">
              Manage your workspace branding, team member roles, billing cycles, syncing alerts, and developer APIs.
            </p>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 space-y-1">
              {[
                { id: "workspace", label: "Workspace Details", desc: "Branding, currency & formats" },
                { id: "team", label: "Team & Access", desc: "Manage members & permissions" },
                { id: "billing", label: "Billing & Plans", desc: "Usage, invoices & upgrades" },
                { id: "notifications", label: "Notifications", desc: "Alerts & WhatsApp updates" },
                { id: "connectors", label: "Data Connectors", desc: "Manage ingestion channels" },
                { id: "privacy", label: "Data & Privacy", desc: "Retention & DPDP compliance" },
                { id: "api", label: "API Keys", desc: "Integrate GRIP with your systems" },
                { id: "danger", label: "Danger Zone", desc: "Purge databases & workspaces" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTab(t.id as TabId);
                    setGeneratedKey(null);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                    activeTab === t.id
                      ? "bg-gradient-to-r from-indigo-500/10 to-indigo-500/[0.02] border-indigo-500/30 text-white shadow-[0_0_20px_rgba(99,102,241,0.05)]"
                      : "bg-transparent border-transparent text-white/50 hover:text-white/80 hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="text-xs font-semibold">{t.label}</div>
                  <div className="text-[10px] opacity-60 mt-0.5 font-normal leading-normal">{t.desc}</div>
                </button>
              ))}
            </div>

            {/* Config Panels */}
            <div className="lg:col-span-3 bg-[#0d0d1a] border border-white/10 rounded-2xl p-6 shadow-xl">
              
              {/* WORKSPACE TAB */}
              {activeTab === "workspace" && (
                <form onSubmit={handleSaveWorkspace} className="space-y-6">
                  <div>
                    <h2 className="text-sm font-bold text-white mb-1">Workspace Details</h2>
                    <p className="text-white/40 text-[11px]">Configure your workspace settings and user experience parameters.</p>
                  </div>

                  <ImageUploadField
                    label="Workspace Logo"
                    description="Optional image shown next to your workspace name across the dashboard."
                    imageUrl={activeWorkspace.imageUrl ?? null}
                    fallbackLabel={getInitials(activeWorkspace.name)}
                    optional
                    previewClassName="w-14 h-14 rounded-full"
                    onUpload={handleLogoUpload}
                    onRemove={() => {
                      if (!activeWorkspaceId) return;
                      updateWorkspaceImage(activeWorkspaceId, null);
                      triggerToast("Workspace logo removed.");
                    }}
                  />

                  {/* Workspace form grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-white/60 tracking-wider uppercase">Workspace Name</label>
                      <input
                        type="text"
                        value={workspaceName}
                        onChange={(e) => setWorkspaceName(e.target.value)}
                        required
                        className="w-full h-9 px-3 rounded-lg text-xs bg-[#040409] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 transition-all font-sans"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-white/60 tracking-wider uppercase">Industry / Business Type</label>
                      <CustomSelect
                        value={industry}
                        onChange={setIndustry}
                        options={INDUSTRY_OPTIONS}
                        aria-label="Industry / Business Type"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-white/60 tracking-wider uppercase">Default Currency</label>
                      <CustomSelect
                        value={currency}
                        onChange={setCurrency}
                        options={CURRENCY_OPTIONS}
                        aria-label="Default Currency"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-white/60 tracking-wider uppercase">Time Zone</label>
                      <CustomSelect
                        value={timezone}
                        onChange={setTimezone}
                        options={TIMEZONE_OPTIONS}
                        aria-label="Time Zone"
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold text-white/60 tracking-wider uppercase">Default Date Format</label>
                    <div className="flex gap-4">
                      {[
                        { val: "DD/MM/YYYY", desc: "DD/MM/YYYY (e.g. 16/06/2026)" },
                        { val: "MM/DD/YYYY", desc: "MM/DD/YYYY (e.g. 06/16/2026)" },
                      ].map((opt) => (
                        <label key={opt.val} className="flex items-center gap-2 text-xs text-white/80 cursor-pointer">
                          <input
                            type="radio"
                            name="dateFormat"
                            checked={dateFormat === opt.val}
                            onChange={() => setDateFormat(opt.val)}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <span>{opt.desc}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 rounded-lg btn-gradient bg-gradient-to-r disabled:opacity-50 text-white text-xs font-semibold shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      {saving ? "Saving..." : "Save Workspace"}
                    </button>
                  </div>
                </form>
              )}

              {/* TEAM & ACCESS TAB */}
              {activeTab === "team" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-sm font-bold text-white mb-1">Team & Access Control</h2>
                    <p className="text-white/40 text-[11px]">Invite team members and allocate their read/write permissions roles.</p>
                  </div>

                  {/* Invite form */}
                  <form onSubmit={handleInviteMember} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <div className="text-xs font-semibold text-white">Invite Team Member</div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="email"
                        required
                        placeholder="collaborator@company.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="flex-grow h-9 px-3 rounded-lg text-xs bg-[#040409] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 transition-all font-sans"
                      />
                      <div className="flex gap-2">
                        <CustomSelect
                          value={inviteRole}
                          onChange={(value) =>
                            setInviteRole(value as "Admin" | "Member" | "Viewer")
                          }
                          options={INVITE_ROLE_OPTIONS}
                          className="w-[160px]"
                          aria-label="Invite role"
                        />
                        <button
                          type="submit"
                          className="px-4 h-9 rounded-lg btn-gradient bg-gradient-to-r text-xs font-semibold text-white cursor-pointer active:scale-95 transition-all whitespace-nowrap"
                        >
                          Send Invite
                        </button>
                      </div>
                    </div>
                    <div className="text-[10px] text-white/30 leading-normal">
                      <span className="font-semibold text-indigo-400">Viewer role note:</span> Viewers have full dashboard visibility but are restricted from modifying tools, keys, or automation schedules.
                    </div>
                  </form>

                  {/* Member list table */}
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-white">Active Members</div>
                    <div className="overflow-x-auto border border-white/10 rounded-xl">
                      <table className="w-full border-collapse text-left text-xs text-white/80">
                        <thead className="bg-white/5 border-b border-white/10 text-[10px] font-bold text-white/40 tracking-wider uppercase">
                          <tr>
                            <th className="p-3">Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Last Active</th>
                            <th className="p-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {teamMembers.map((member) => (
                            <tr key={member.id} className="hover:bg-white/[0.01]">
                              <td className="p-3 font-semibold text-white">{member.name}</td>
                              <td className="p-3 text-white/50">{member.email}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                  member.role === "Admin"
                                    ? "bg-indigo-500/10 border border-indigo-500/20 text-indigo-400"
                                    : member.role === "Member"
                                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                                    : "bg-white/5 border border-white/10 text-white/40"
                                }`}>
                                  {member.role}
                                </span>
                              </td>
                              <td className="p-3 text-white/45">{member.lastActive}</td>
                              <td className="p-3 text-right">
                                {member.id !== "1" ? (
                                  <button
                                    onClick={() => handleRemoveMember(member.id, member.name)}
                                    className="text-[10px] font-semibold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                                  >
                                    Remove
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-white/20 select-none">Locked</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* BILLING TAB */}
              {activeTab === "billing" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-sm font-bold text-white mb-1">Billing & Subscription</h2>
                    <p className="text-white/40 text-[11px]">Manage your growth subscription details, connectors quotas, and invoices.</p>
                  </div>

                  {/* Plan Details & Limits */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="text-xs font-semibold text-white">Current Tier</div>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 rounded-full">
                          Growth Plan
                        </span>
                      </div>
                      <div className="text-xl font-bold text-white">₹11,999<span className="text-xs font-normal text-white/40">/month</span></div>
                      
                      <div className="pt-2 flex gap-2">
                        <button className="px-3 py-1.5 rounded btn-gradient bg-gradient-to-r text-[10px] font-semibold text-white active:scale-95 transition-all cursor-pointer">
                          Upgrade Tier
                        </button>
                        <button className="px-3 py-1.5 rounded bg-white/5 border border-white/10 hover:border-white/20 text-[10px] font-semibold text-white/80 hover:text-white active:scale-95 transition-all cursor-pointer">
                          Change Plan
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
                      <div className="text-xs font-semibold text-white">Resource Ingestion Limits</div>
                      
                      {/* Limit Progress Bars */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] text-white/50">
                          <span>Connectors Active</span>
                          <span className="text-white font-semibold">3 / 5</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: "60%" }} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] text-white/50">
                          <span>Team Seats Occupied</span>
                          <span className="text-white font-semibold">3 / 10</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: "30%" }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Card Info */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-white">Payment Method</div>
                      <div className="text-xs text-white/50 flex items-center gap-1.5 font-mono">
                        💳 Visa ending in <span className="text-white font-bold">4242</span> (Expires 12/28)
                      </div>
                    </div>
                    <button className="px-3 h-8 rounded border border-white/10 hover:border-white/20 text-xs font-semibold text-white hover:bg-white/5 cursor-pointer transition-all">
                      Update Card
                    </button>
                  </div>

                  {/* Invoices list */}
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-white">Invoice History</div>
                    <div className="border border-white/10 rounded-xl overflow-hidden divide-y divide-white/10 text-xs text-white/80">
                      {[
                        { id: "INV-2026-004", date: "01/06/2026", amt: "₹11,999" },
                        { id: "INV-2026-003", date: "01/05/2026", amt: "₹11,999" },
                        { id: "INV-2026-002", date: "01/04/2026", amt: "₹11,999" },
                      ].map((inv) => (
                        <div key={inv.id} className="p-3.5 flex justify-between items-center hover:bg-white/[0.01]">
                          <div className="flex gap-4">
                            <span className="font-bold text-white">{inv.id}</span>
                            <span className="text-white/40">{inv.date}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-semibold">{inv.amt}</span>
                            <button className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer">
                              Download PDF
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subscription cancellation */}
                  <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-white">Cancel Workspace Subscription</div>
                      <div className="text-[10px] text-white/40">Immediately halts data stream syncs and disconnects integration instances.</div>
                    </div>
                    <button
                      onClick={handleCancelSubscription}
                      className="px-3 h-8 rounded border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold cursor-pointer transition-all"
                    >
                      Cancel Subscription
                    </button>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeTab === "notifications" && (
                <form onSubmit={handleNotificationsSave} className="space-y-6">
                  <div>
                    <h2 className="text-sm font-bold text-white mb-1">Notification Preferences</h2>
                    <p className="text-white/40 text-[11px]">Customize where and when you receive critical warnings and performance reports.</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { key: "syncFailures", title: "Integration Sync Failures", desc: "Notify immediately via email if HubSpot, Shopify, or Razorpay credentials drop sync." },
                      { key: "paymentFailures", title: "Customer Billing/Payment Failures", desc: "Send critical transaction drop alerts." },
                      { key: "dailySummary", title: "Daily Analytics Digest Summary", desc: "Email metrics snapshots at the end of each day." },
                      { key: "weeklyReport", title: "Weekly Insights Analytical Report", desc: "Email PDF overview breakdowns every Monday." },
                      { key: "inAppAlerts", title: "Enable In-App Activity Bell Alerts", desc: "Render real-time alerts in the top dashboard navigation bar." },
                    ].map((pref) => {
                      const value = notifications[pref.key as keyof typeof notifications];
                      return (
                        <div key={pref.key} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                          <div className="space-y-0.5 pr-4">
                            <div className="text-xs font-semibold text-white">{pref.title}</div>
                            <div className="text-[10px] text-white/40 leading-normal">{pref.desc}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setNotifications({ ...notifications, [pref.key]: !value })}
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer flex items-center ${
                              value ? "bg-indigo-600 justify-end" : "bg-white/10 justify-start"
                            }`}
                          >
                            <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
                          </button>
                        </div>
                      );
                    })}

                    {/* WhatsApp Opt-in */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#25d366]/5 to-[#25d366]/[0.01] border border-[#25d366]/20">
                      <div className="space-y-0.5 pr-4">
                        <div className="text-xs font-semibold text-white flex items-center gap-2">
                          <span>WhatsApp Ingestion Opt-in</span>
                          <span className="text-[9px] px-2 py-0.2 bg-[#25d366]/10 border border-[#25d366]/20 text-[#25d366] rounded-full font-bold">
                            Recommended for Indian SMBs
                          </span>
                        </div>
                        <div className="text-[10px] text-white/40 leading-normal">
                          Get immediate real-time sync failure alarms and payment failure summaries delivered straight to your registered WhatsApp mobile number.
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotifications({ ...notifications, whatsappOptIn: !notifications.whatsappOptIn })}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer flex items-center ${
                          notifications.whatsappOptIn ? "bg-[#25d366] justify-end" : "bg-white/10 justify-start"
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 rounded-lg btn-gradient bg-gradient-to-r disabled:opacity-50 text-white text-xs font-semibold shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      {saving ? "Saving..." : "Save Settings"}
                    </button>
                  </div>
                </form>
              )}

              {/* CONNECTORS TAB */}
              {activeTab === "connectors" && (
                <div className="space-y-6 py-8 text-center select-none">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-xl flex items-center justify-center mx-auto mb-4">
                    🔌
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white tracking-tight mb-2">Ingestion Sources Redirect</h2>
                    <p className="text-white/40 text-xs max-w-sm mx-auto mb-6 leading-relaxed">
                      All connected credentials, APIs, databases, and synchronization indicators reside inside the Connectors panel to prevent duplicate setups.
                    </p>
                    <Link
                      href="/dashboard/connectors"
                      className="inline-flex px-4 py-2 btn-gradient bg-gradient-to-r rounded-lg text-xs font-semibold text-white transition-all active:scale-95 cursor-pointer shadow-lg hover:shadow-indigo-500/20"
                    >
                      Go to Connectors Page
                    </Link>
                  </div>
                </div>
              )}

              {/* DATA & PRIVACY TAB */}
              {activeTab === "privacy" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-sm font-bold text-white mb-1">Data Management & Privacy</h2>
                    <p className="text-white/40 text-[11px]">Configure database retention windows, download CSV data packages, or verify data storage notices.</p>
                  </div>

                  {/* Retention selector */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2.5">
                    <div className="text-xs font-semibold text-white">Synced Data Ingestion Retention Window</div>
                    <CustomSelect
                      value={retention}
                      onChange={setRetention}
                      options={RETENTION_OPTIONS}
                      className="max-w-xs"
                      aria-label="Data retention window"
                    />
                    <div className="text-[10px] text-white/40">Raw synchronizations of CRM fields and invoice ledgers are compressed or deleted permanently past this timeline.</div>
                  </div>

                  {/* Export CSV Zip */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-white">Export Ingestion Database</div>
                      <div className="text-[10px] text-white/40">Download a full bundle of all raw leads, payments, and synced records in a CSV ZIP format.</div>
                    </div>
                    <button
                      onClick={handleExportData}
                      className="px-3.5 h-8 bg-white/5 border border-white/10 hover:border-white/20 text-xs font-semibold text-white rounded cursor-pointer transition-all active:scale-95"
                    >
                      Export CSV ZIP
                    </button>
                  </div>

                  {/* DPDP Notice section */}
                  <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-2">
                    <div className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 font-sans">
                      ⚖️ DPDP Act 2023 Compliance Information
                    </div>
                    <p className="text-[10px] text-white/40 leading-relaxed">
                      Under the Digital Personal Data Protection Act of India, GRIP operates strictly as a data processor. Customers retain complete ownership over synced records. Customer fields (e.g. name, email, billing totals) are ingested solely for building reporting dashboard analytics. These files are encrypted at rest, never shared with third parties, and are fully purged upon data deletion.
                    </p>
                  </div>

                  {/* Delete all data */}
                  <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/[0.02] space-y-4">
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-rose-400">Purge Ingested Records (Destructive Action)</div>
                      <div className="text-[10px] text-white/40 leading-normal">
                        Instantly deletes all cached database records. This does NOT delete your account, but clears your analytics history.
                      </div>
                    </div>

                    <form onSubmit={handleDeleteSyncedData} className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        placeholder={`Type "${workspaceName}" to confirm`}
                        value={deleteDataConfirm}
                        onChange={(e) => setDeleteDataConfirm(e.target.value)}
                        className="flex-grow h-9 px-3 rounded-lg text-xs bg-[#040409] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-rose-500/50 transition-all font-mono"
                      />
                      <button
                        type="submit"
                        disabled={deleteDataConfirm !== workspaceName}
                        className="px-4 h-9 rounded bg-rose-600 hover:bg-rose-500 disabled:opacity-30 disabled:hover:bg-rose-600 disabled:cursor-not-allowed text-xs font-bold text-white transition-all whitespace-nowrap"
                      >
                        Purge All Data
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* API ACCESS TAB */}
              {activeTab === "api" && (
                <form onSubmit={handleSecuritySave} className="space-y-6">
                  <div>
                    <h2 className="text-sm font-bold text-white mb-1">API Integrations</h2>
                    <p className="text-white/40 text-[11px]">Generate access credentials to fetch analytics directly into your internal tooling setups.</p>
                  </div>

                  {/* API Secret Key Generator */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <div className="text-xs font-semibold text-white">Generate Integration Token</div>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Key nickname (e.g., Retool Dashboard)"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        className="flex-grow h-9 px-3 rounded-lg text-xs bg-[#040409] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 transition-all font-sans"
                      />
                      <button
                        type="button"
                        onClick={handleGenerateApiKey}
                        className="px-4 h-9 rounded-lg btn-gradient bg-gradient-to-r text-xs font-semibold text-white cursor-pointer active:scale-95 transition-all whitespace-nowrap"
                      >
                        Generate Key
                      </button>
                    </div>
                  </div>

                  {/* Generated Key Presentation Modal-within-tab */}
                  {generatedKey && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                      <div className="text-xs font-bold text-emerald-400 font-sans">Copy your API Key:</div>
                      <div className="bg-[#040409] p-2.5 rounded border border-white/10 flex items-center justify-between text-xs select-all font-mono text-white">
                        <span>{generatedKey}</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedKey);
                            triggerToast("Full API key copied to clipboard!");
                          }}
                          className="px-2 py-1 bg-white/5 border border-white/10 hover:border-white/20 rounded text-[10px] text-white/80 font-semibold cursor-pointer transition-all"
                        >
                          Copy
                        </button>
                      </div>
                      <div className="text-[10px] text-emerald-400/80">Make sure to copy it now. It won&apos;t be shown again for security reasons.</div>
                    </div>
                  )}

                  {/* Active keys table */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="text-xs font-semibold text-white">Active Token Credentials</div>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          triggerToast("Redirecting placeholder link to developer API manuals.");
                        }}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                      >
                        API Documentation →
                      </a>
                    </div>

                    <div className="border border-white/10 rounded-xl overflow-hidden divide-y divide-white/10 text-xs text-white/80">
                      {apiKeys.map((item) => (
                        <div key={item.id} className="p-3.5 flex justify-between items-center hover:bg-white/[0.01]">
                          <div className="space-y-1">
                            <div className="font-bold text-white">{item.name}</div>
                            <div className="text-[10px] text-white/40 font-mono">{item.key}</div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right space-y-0.5">
                              <div className="text-[10px] text-white/30">Created: {item.created}</div>
                              <div className="text-[10px] text-white/30">Last used: {item.lastUsed}</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRevokeApiKey(item.id, item.name)}
                              className="text-[10px] text-rose-400 hover:text-rose-300 font-bold transition-colors cursor-pointer"
                            >
                              Revoke
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 rounded-lg btn-gradient bg-gradient-to-r disabled:opacity-50 text-white text-xs font-semibold shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      {saving ? "Saving..." : "Save Settings"}
                    </button>
                  </div>
                </form>
              )}

              {/* DANGER ZONE TAB */}
              {activeTab === "danger" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-sm font-bold text-rose-400 mb-1">Danger Zone</h2>
                    <p className="text-rose-400/50 text-[11px]">Irreversible actions concerning ownership and workspace deletion.</p>
                  </div>

                  <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/[0.03] space-y-4">
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-rose-400">Permanently Delete Workspace</div>
                      <div className="text-[11px] text-white/40 leading-relaxed">
                        This action will immediately terminate your subscription, wipe out all team collaborators, revoke all client integrations, and permanently erase all analytical history. This is completely irreversible.
                      </div>
                    </div>

                    <form onSubmit={handleDeleteWorkspace} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-rose-400/80 uppercase">Confirm Workspace Name</label>
                        <input
                          type="text"
                          placeholder={`Type "${workspaceName}" to delete`}
                          value={deleteWorkspaceConfirm}
                          onChange={(e) => setDeleteWorkspaceConfirm(e.target.value)}
                          className="w-full h-9 px-3 rounded-lg text-xs bg-[#040409] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-rose-500/50 transition-all font-mono"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={deleteWorkspaceConfirm !== workspaceName || saving}
                          className="px-4 py-2 rounded bg-rose-600 hover:bg-rose-500 disabled:opacity-30 disabled:hover:bg-rose-600 disabled:cursor-not-allowed text-xs font-bold text-white transition-all shadow-lg hover:shadow-rose-500/15"
                        >
                          Delete Workspace Irreversibly
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

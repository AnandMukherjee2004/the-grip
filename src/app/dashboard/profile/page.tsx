"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import TopBar, { DEFAULT_DATE_RANGE } from "@/components/layout/TopBar";
import CustomSelect from "@/components/ui/CustomSelect";
import type { DateRangeSelection } from "@/lib/dateRange";
import { CheckCircleIcon } from "@/components/ui/Icons";
import { ThemePreferenceSelector } from "@/components/theme/ThemePreferenceSelector";
import { ImageUploadField } from "@/components/profile/ImageUploadField";
import { useOnboarding } from "@/context/OnboardingContext";
import { getInitials } from "@/lib/profile-images";

const TIMEZONE_OPTIONS = [
  { value: "UTC-08:00 (Pacific Time)", label: "UTC-08:00 (Pacific Time)" },
  { value: "UTC-05:00 (Eastern Time)", label: "UTC-05:00 (Eastern Time)" },
  { value: "UTC+00:00 (Greenwich Mean Time)", label: "UTC+00:00 (GMT)" },
  { value: "UTC+01:00 (Central European Time)", label: "UTC+01:00 (CET)" },
  { value: "UTC+05:30 (India Standard Time)", label: "UTC+05:30 (India Standard Time)" },
  { value: "UTC+09:00 (Japan Standard Time)", label: "UTC+09:00 (Japan Standard Time)" },
];

export default function ProfilePage() {
  const { data: session } = useSession();
  const {
    activeWorkspaceId,
    workspaces,
    userProfileImage,
    setUserProfileImage,
    updateWorkspaceImage,
  } = useOnboarding();
  const [dateRange, setDateRange] = useState<DateRangeSelection>(DEFAULT_DATE_RANGE);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const activeWorkspace = workspaces.find((workspace) => workspace.id === activeWorkspaceId);
  const displayName = profileName(session?.user?.name, session?.user?.email);
  const profileInitials = getInitials(displayName);
  const workspaceInitials = getInitials(activeWorkspace?.name ?? "WS");

  const [profile, setProfile] = useState({
    name: session?.user?.name ?? "",
    email: session?.user?.email ?? "",
    company: activeWorkspace?.name ?? "",
    timezone: "UTC+05:30 (India Standard Time)",
  });

  useEffect(() => {
    setProfile((prev) => ({
      ...prev,
      name: session?.user?.name ?? "",
      email: session?.user?.email ?? "",
      company: activeWorkspace?.name ?? prev.company,
    }));
  }, [session?.user?.name, session?.user?.email, activeWorkspace?.name]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3500);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      triggerToast("Profile settings updated successfully!");
    }, 1200);
  };

  const handleProfilePhotoUpload = (dataUrl: string) => {
    setUserProfileImage(dataUrl);
    triggerToast("Profile photo updated.");
  };

  const handleWorkspaceImageUpload = (dataUrl: string) => {
    if (!activeWorkspaceId) return;
    updateWorkspaceImage(activeWorkspaceId, dataUrl);
    triggerToast("Workspace image updated.");
  };

  return (
    <div className="flex-grow flex flex-col overflow-hidden bg-[#040409]">
      <TopBar dateRange={dateRange} onDateRangeChange={setDateRange} />

      <main className="flex-grow overflow-y-auto p-6 space-y-8 scrollbar-thin relative">
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-[#0d0d1a] border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md animate-fadeIn transition-all duration-300">
            <CheckCircleIcon className="text-emerald-400" size={16} />
            <span className="text-xs font-semibold">{toastMessage}</span>
          </div>
        )}

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-white tracking-tight">User Profile</h1>
            <p className="text-white/40 text-xs">
              Manage your personal identity, company details, appearance, and local timezone settings.
            </p>
          </div>

          <div className="bg-[#0d0d1a] border border-white/10 rounded-2xl p-6 shadow-xl">
            <form onSubmit={handleProfileSave} className="space-y-6">
              <div>
                <h2 className="text-sm font-bold text-white mb-1">General Profile Details</h2>
                <p className="text-white/40 text-[11px]">Manage how your identity appears in reports and invoices.</p>
              </div>

              <ImageUploadField
                label="Profile Photo"
                description="Upload a photo for your profile. It appears in the sidebar and across your account."
                imageUrl={userProfileImage}
                fallbackLabel={profileInitials}
                disabled={saving}
                onUpload={handleProfilePhotoUpload}
                onRemove={() => {
                  setUserProfileImage(null);
                  triggerToast("Profile photo removed.");
                }}
              />

              {activeWorkspaceId && (
                <ImageUploadField
                  label="Workspace Image"
                  description="Optional image for your workspace. It appears next to your workspace name in the sidebar."
                  imageUrl={activeWorkspace?.imageUrl ?? null}
                  fallbackLabel={workspaceInitials}
                  optional
                  disabled={saving}
                  previewClassName="w-14 h-14 rounded-md"
                  onUpload={handleWorkspaceImageUpload}
                  onRemove={() => {
                    updateWorkspaceImage(activeWorkspaceId, null);
                    triggerToast("Workspace image removed.");
                  }}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 tracking-wider uppercase">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    required
                    disabled={saving}
                    className="w-full h-9 px-3 rounded-lg text-xs bg-white/5 border border-white/10 text-white placeholder-white/30 hover:border-white/20 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 tracking-wider uppercase">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    required
                    disabled={saving}
                    className="w-full h-9 px-3 rounded-lg text-xs bg-white/5 border border-white/10 text-white placeholder-white/30 hover:border-white/20 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 tracking-wider uppercase">Organization Name</label>
                  <input
                    type="text"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    required
                    disabled={saving}
                    className="w-full h-9 px-3 rounded-lg text-xs bg-white/5 border border-white/10 text-white placeholder-white/30 hover:border-white/20 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 tracking-wider uppercase">Time Zone</label>
                  <CustomSelect
                    value={profile.timezone}
                    onChange={(value) => setProfile({ ...profile, timezone: value })}
                    options={TIMEZONE_OPTIONS}
                    disabled={saving}
                    aria-label="Time Zone"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-white/10">
                <div>
                  <h3 className="text-[10px] font-bold text-white/60 tracking-wider uppercase">
                    Appearance
                  </h3>
                  <p className="text-white/40 text-[11px] mt-1">
                    Choose how Grip looks on your device.
                  </p>
                </div>
                <ThemePreferenceSelector />
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/sign-in" })}
                  className="profile-sign-out-btn px-4 py-2 rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-400 text-xs font-semibold shadow-[0_4px_14px_rgba(244,63,94,0.18)] hover:bg-rose-500/20 hover:border-rose-500/55 hover:shadow-[0_6px_20px_rgba(244,63,94,0.28)] active:scale-95 transition-all cursor-pointer"
                >
                  Sign out
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg btn-gradient bg-gradient-to-r disabled:opacity-50 text-white text-xs font-semibold shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving changes...
                    </>
                  ) : (
                    "Save Profile"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

function profileName(name?: string | null, email?: string | null) {
  return name ?? email ?? "Account";
}

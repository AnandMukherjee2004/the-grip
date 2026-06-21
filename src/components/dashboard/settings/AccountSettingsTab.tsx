"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import CustomSelect from "@/components/ui/CustomSelect";
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

interface AccountSettingsTabProps {
  onToast: (message: string) => void;
}

export function AccountSettingsTab({ onToast }: AccountSettingsTabProps) {
  const { data: session } = useSession();
  const {
    activeWorkspaceId,
    workspaces,
    userProfileImage,
    setUserProfileImage,
    updateWorkspaceImage,
  } = useOnboarding();
  const [saving, setSaving] = useState(false);

  const activeWorkspace = workspaces.find((workspace) => workspace.id === activeWorkspaceId);
  const displayName = session?.user?.name ?? session?.user?.email ?? "Account";
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

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onToast("Profile settings updated successfully!");
    }, 1200);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Account</h1>
        <p className="text-sm text-gray-500">
          Manage your personal identity, appearance, and timezone settings.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleProfileSave} className="space-y-6">
          <ImageUploadField
            label="Profile Photo"
            description="Upload a photo for your profile. It appears in the sidebar and across your account."
            imageUrl={userProfileImage}
            fallbackLabel={profileInitials}
            disabled={saving}
            onUpload={(dataUrl) => {
              setUserProfileImage(dataUrl);
              onToast("Profile photo updated.");
            }}
            onRemove={() => {
              setUserProfileImage(null);
              onToast("Profile photo removed.");
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
              onUpload={(dataUrl) => {
                updateWorkspaceImage(activeWorkspaceId, dataUrl);
                onToast("Workspace image updated.");
              }}
              onRemove={() => {
                updateWorkspaceImage(activeWorkspaceId, null);
                onToast("Workspace image removed.");
              }}
            />
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
                disabled={saving}
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 transition-all hover:border-gray-300 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                required
                disabled={saving}
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 transition-all hover:border-gray-300 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Organization Name</label>
              <input
                type="text"
                value={profile.company}
                onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                required
                disabled={saving}
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 transition-all hover:border-gray-300 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Time Zone</label>
              <CustomSelect
                value={profile.timezone}
                onChange={(value) => setProfile({ ...profile, timezone: value })}
                options={TIMEZONE_OPTIONS}
                disabled={saving}
                aria-label="Time Zone"
              />
            </div>
          </div>

          <div className="space-y-3 border-t border-gray-100 pt-4">
            <div>
              <h3 className="text-xs font-semibold text-gray-700">Appearance</h3>
              <p className="mt-1 text-xs text-gray-500">Choose how Grip looks on your device.</p>
            </div>
            <ThemePreferenceSelector />
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/sign-in" })}
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition-all hover:bg-red-100 active:scale-95"
            >
              Sign out
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-gray-800 active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving changes...
                </>
              ) : (
                "Save changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

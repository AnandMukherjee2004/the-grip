const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getUserProfileImageKey(userId: string) {
  return `grip_user_image_${userId}`;
}

export function getWorkspaceImageKey(workspaceId: string) {
  return `grip_workspace_image_${workspaceId}`;
}

export function getUserProfileImage(userId: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(getUserProfileImageKey(userId));
}

export function setUserProfileImage(userId: string, dataUrl: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getUserProfileImageKey(userId), dataUrl);
  window.dispatchEvent(new CustomEvent("grip-profile-image-updated", { detail: { userId } }));
}

export function removeUserProfileImage(userId: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(getUserProfileImageKey(userId));
  window.dispatchEvent(new CustomEvent("grip-profile-image-updated", { detail: { userId } }));
}

export function getWorkspaceImage(workspaceId: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(getWorkspaceImageKey(workspaceId));
}

export function setWorkspaceImage(workspaceId: string, dataUrl: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getWorkspaceImageKey(workspaceId), dataUrl);
  window.dispatchEvent(new CustomEvent("grip-workspace-image-updated", { detail: { workspaceId } }));
}

export function removeWorkspaceImage(workspaceId: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(getWorkspaceImageKey(workspaceId));
  window.dispatchEvent(new CustomEvent("grip-workspace-image-updated", { detail: { workspaceId } }));
}

export async function readImageFile(file: File): Promise<string> {
  if (!ACCEPTED_TYPES.has(file.type)) {
    throw new Error("Please upload a JPG, PNG, or WebP image.");
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be 2 MB or smaller.");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not read the selected image."));
      }
    };
    reader.onerror = () => reject(new Error("Could not read the selected image."));
    reader.readAsDataURL(file);
  });
}

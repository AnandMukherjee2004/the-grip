const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export type HealthResponse = {
  ok: boolean;
  service: string;
  runtime: string;
  version: string;
};

export type StatusResponse = {
  pipeline: string;
  connectors: string[];
  syncedMinutesAgo: number;
};

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export function getHealth() {
  return apiFetch<HealthResponse>("/health");
}

export function getStatus() {
  return apiFetch<StatusResponse>("/status");
}

// Next.js API configuration for connectors
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function getConnectors(workspaceId: string): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/api/v1/connectors?workspaceId=${workspaceId}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    if (data && Array.isArray(data.connectors)) {
      return data.connectors
        .filter((c: any) => c.status === 'active')
        .map((c: any) => c.toolId);
    }

    return [];
  } catch (error) {
    console.error("Failed to fetch connectors from API", error);
    return [];
  }
}

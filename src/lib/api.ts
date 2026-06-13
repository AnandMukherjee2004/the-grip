const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api";

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

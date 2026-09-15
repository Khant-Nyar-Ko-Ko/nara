// Thin client for the web/ Next.js backend's API routes (F1/F2's
// /api/digest, F3/LR4's /api/consent). Base URL comes from
// VITE_API_BASE_URL (see .env.example); whatever origin that points at
// must also be listed in manifest.json's host_permissions, or these
// fetches are blocked by CORS.

import type { Headline } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

interface DigestResponse {
  headlines: Headline[];
}

export async function fetchDigest(): Promise<Headline[]> {
  const res = await fetch(`${API_BASE_URL}/api/digest`);
  if (!res.ok) throw new Error(`GET /api/digest: HTTP ${res.status}`);
  const data: DigestResponse = await res.json();
  return data.headlines;
}

export interface ConsentRequest {
  email: string | null;
  documentVersionHash: string;
  buttonText: string;
  granted: boolean;
}

// Requires the nara_session cookie (set by a future login flow — there
// isn't one yet, so this 401s until then, which is the correct default).
export async function postConsent(body: ConsentRequest): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/consent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}) as { error?: string });
    throw new Error((data as { error?: string }).error ?? `HTTP ${res.status}`);
  }
}

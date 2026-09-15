// Thin client for the web/ Next.js backend's API routes (just /api/digest
// for now — F1/F2). Base URL comes from VITE_API_BASE_URL (see
// .env.example); whatever origin that points at must also be listed in
// manifest.json's host_permissions, or this fetch is blocked by CORS.

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

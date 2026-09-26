// Thin client for the web/ Next.js backend's API routes (F1/F2's
// /api/digest, F3's sign-in and /api/consent). Base URL comes from
// VITE_API_BASE_URL (see .env.example); whatever origin that points at
// must also be listed in manifest.json's host_permissions, or these
// fetches are blocked by CORS.

import type { Headline } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";
const SESSION_KEY = "naranews.session";

interface DigestResponse {
  headlines: Headline[];
}

export interface Session {
  token: string;
  email: string;
  expiresAt: string;
}

async function errorFrom(res: Response): Promise<Error> {
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  return new Error(data.error ?? `HTTP ${res.status}`);
}

export async function fetchDigest(): Promise<Headline[]> {
  const res = await fetch(`${API_BASE_URL}/api/digest`);
  if (!res.ok) throw new Error(`GET /api/digest: HTTP ${res.status}`);
  const data: DigestResponse = await res.json();
  return data.headlines;
}

export async function readSession(): Promise<Session | null> {
  const stored = (await chrome.storage.local.get(SESSION_KEY))[SESSION_KEY] as Session | undefined;
  if (!stored || new Date(stored.expiresAt).getTime() <= Date.now()) return null;
  return stored;
}

export async function signOut(): Promise<void> {
  await chrome.storage.local.remove(SESSION_KEY);
}

export async function requestSignInCode(email: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/auth/request-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw await errorFrom(res);
}

export async function verifySignInCode(email: string, code: string): Promise<Session> {
  const res = await fetch(`${API_BASE_URL}/api/auth/verify-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  if (!res.ok) throw await errorFrom(res);
  const session = (await res.json()) as Session;
  await chrome.storage.local.set({ [SESSION_KEY]: session });
  return session;
}

export interface ConsentRequest {
  email: string | null;
  documentVersionHash: string;
  buttonText: string;
  granted: boolean;
}

export async function postConsent(session: Session, body: ConsentRequest): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/consent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.token}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await errorFrom(res);
}

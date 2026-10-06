"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

// This exact notice is displayed before consent and hashed into the existing audit record.
const NOTICE = "Turn on the email digest for the verified address shown above. NaraNews uses this address for sign-in codes and the news digest, never marketing. Account, consent and access records are stored in Supabase in Seoul, South Korea. Email is sent through Resend. You can withdraw email consent on this screen at any time. Automatic delivery requires the extension to be signed in and Chrome to be running.";
const AGREE = "I agree — turn on email digest";
const WITHDRAW = "Turn off email digest";
type Account = { email: string; granted: boolean };
async function request(path: string, method = "GET", body?: unknown) {
  const response = await fetch(path, { method, credentials: "same-origin", cache: "no-store", headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(response.status >= 500 ? "The service is temporarily unavailable. Please try again." : data.error ?? "Request failed. Please try again.");
  return data;
}
export function EmailSettings() {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  async function loadAccount() {
    setLoading(true); setLoadFailed(false); setError("");
    try {
      const response = await fetch("/api/auth/session", { cache: "no-store" });
      if (response.status === 401) { setAccount(null); return; }
      if (!response.ok) throw new Error("Could not load your settings. Please try again.");
      setAccount(await response.json());
    } catch (err) { setLoadFailed(true); setError(err instanceof Error ? err.message : "Could not load settings."); }
    finally { setLoading(false); }
  }
  useEffect(() => { void loadAccount(); }, []);
  async function run(action: () => Promise<void>) {
    setBusy(true); setError(""); setMessage("");
    try { await action(); } catch (err) { setError(err instanceof Error ? err.message : "Please try again."); }
    finally { setBusy(false); }
  }
  async function consent(granted: boolean) {
    if (!account) return;
    const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(NOTICE));
    const documentVersionHash = Array.from(new Uint8Array(hash)).map(byte => byte.toString(16).padStart(2, "0")).join("");
    await request("/api/consent", "POST", { email: granted ? account.email : null, documentVersionHash, buttonText: granted ? AGREE : WITHDRAW, granted });
    setAccount({ ...account, granted });
    setMessage(granted ? "Email digest is now enabled." : "Email digest is now turned off.");
  }
  return <section className="preview-card account-card" aria-label="Sign-in and email preferences">
    {loading ? <p role="status">Loading your settings…</p> : loadFailed ? <button className="text-link" onClick={() => void loadAccount()}>Retry loading settings</button> : account ? <>
      <div className="account-heading"><div><small>Signed in · verified email</small><h2>{account.email}</h2></div><button className="text-link" disabled={busy} onClick={() => void run(async () => { await request("/api/auth/session", "DELETE"); setAccount(null); setCodeSent(false); setCode(""); setEmail(""); })}>Sign out</button></div>
      <div className="preference"><strong>Email digest</strong><span className="badge">{account.granted ? "On" : "Off"}</span></div>
      <p className="consent-notice">{NOTICE}</p>
      <Link href="/privacy" className="text-link">Read the privacy notice</Link>
      <button className="primary-button" disabled={busy} onClick={() => void run(() => consent(!account.granted))}>{busy ? "Please wait…" : account.granted ? WITHDRAW : AGREE}</button>
      {account.granted && <button className="text-link" disabled={busy} onClick={() => void run(async () => { await request("/api/dispatch/email", "POST"); setMessage("Digest sent. Check your inbox. Another digest can be sent after 10 minutes."); })}>Send me a digest now</button>}
      <p className="fine-print">Website sign-in does not sign in the extension. <Link href="/install" className="text-link">Set up Chrome delivery →</Link></p>
    </> : <form onSubmit={event => { event.preventDefault(); void run(async () => {
      if (!codeSent) { await request("/api/auth/request-code", "POST", { email }); setCodeSent(true); setMessage("Code sent. Check your inbox; it expires in 10 minutes."); }
      else { await request("/api/auth/verify-code", "POST", { email, code, webSession: true }); setCode(""); await loadAccount(); }
    }); }}>
      <h2>{codeSent ? "Check your inbox" : "Sign in with your email"}</h2>
      <p>{codeSent ? `Enter the 6-digit code sent to ${email}.` : "We’ll send a verification code. Signing in does not subscribe you to the digest."}</p>
      {!codeSent ? <label className="form-field">Email address<input type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} disabled={busy} /></label> : <label className="form-field">Verification code<input type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={event => setCode(event.target.value.replace(/\D/g, ""))} disabled={busy} /></label>}
      <p className="fine-print">Your email is used for sign-in and, only if you opt in, digest delivery. <Link className="text-link" href="/privacy">Privacy notice</Link></p>
      <button className="primary-button" disabled={busy} type="submit">{busy ? "Please wait…" : codeSent ? "Verify and open settings" : "Send sign-in code"}</button>
      {codeSent && <button className="text-link" disabled={busy} type="button" onClick={() => { setCodeSent(false); setCode(""); setMessage(""); setError(""); }}>Change email or request a new code</button>}
    </form>}
    {error && <p className="error-notice" role="alert">{error}</p>}{message && <p className="success-notice" role="status">{message}</p>}
  </section>;
}

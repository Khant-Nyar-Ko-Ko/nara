// F3: sign in with an emailed code (verifies the address, LR3), then the
// LR1/LR4 email opt-in. The consent text is hashed client-side, so
// document_version_hash always matches what was actually displayed. Opt-out
// uses the same screen (PDPA: withdrawable from the same screen it was given on).
//
// Load account consent so website and extension show the same delivery state.

import { useEffect, useState, type ReactNode } from "react";
import {
  postConsent,
  readEmailSettings,
  readSession,
  requestSignInCode,
  signOut,
  verifySignInCode,
  type Session,
} from "../lib/api";
import "./Options.css";

const CONSENT_NOTICE =
  "By turning on the email digest, NaraNews will send a one-line news summary to the verified email address shown above. " +
  "This address is used only to deliver that digest — never for marketing or any other purpose — and you can " +
  "withdraw this consent on this same screen at any time.";

const AGREE_BUTTON_TEXT = "I agree — turn on email digest";
const WITHDRAW_BUTTON_TEXT = "Turn off email digest";

async function hashText(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

type SubmitState = "idle" | "submitting" | "error";
type Step = 1 | 2 | 3;

function useSubmit() {
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function run(action: () => Promise<void>) {
    setState("submitting");
    setErrorMessage(null);
    try {
      await action();
      setState("idle");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  return { busy: state === "submitting", errorMessage: state === "error" ? errorMessage : null, run };
}

export function Options() {
  const [session, setSession] = useState<Session | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void readSession().then((stored) => {
      setSession(stored);
      setLoaded(true);
    });
  }, []);

  if (!loaded) return null;

  return session ? (
    <ConsentStep session={session} onSignOut={() => void signOut().then(() => setSession(null))} />
  ) : (
    <SignIn onSignedIn={setSession} />
  );
}

function SettingsShell({ step, subtitle, children }: { step: Step; subtitle: string; children: ReactNode }) {
  return (
    <main className="settings-shell">
      <header className="settings-header">
        <div className="brand-mark" aria-hidden="true">N</div>
        <div>
          <h1>Email digest</h1>
          <p>{subtitle}</p>
        </div>
      </header>
      <section className="settings-content">{children}</section>
      <footer className="progress-footer" aria-label={`Step ${step} of 3`}>
        <span className="active" />
        <span className={step >= 2 ? "active" : ""} />
        <span className={step >= 3 ? "active" : ""} />
        <strong>{step}/3</strong>
      </footer>
    </main>
  );
}

function ErrorText({ message }: { message: string | null }) {
  return message ? <p className="error-text" role="alert">{message}</p> : null;
}

function SignIn({ onSignedIn }: { onSignedIn: (session: Session) => void }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const { busy, errorMessage, run } = useSubmit();

  if (!codeSent) {
    return (
      <SettingsShell step={1} subtitle="Step 1 · Your email address">
        <p className="section-kicker">✉ &nbsp; SIGN IN</p>
        <p className="settings-intro">
          Get your digest by email when you're away from Chrome. First, we'll send a 6-digit code to confirm the
          address is yours.
        </p>
        <form
          className="settings-form"
          onSubmit={(e) => {
            e.preventDefault();
            void run(async () => {
              await requestSignInCode(email);
              setCodeSent(true);
            });
          }}
        >
          <label className="field">
            <span>Email address</span>
            <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <ErrorText message={errorMessage} />
          <button className="primary-button" type="submit" disabled={busy}>
            {busy ? "Sending…" : "Send code"} <span aria-hidden="true">›</span>
          </button>
        </form>
      </SettingsShell>
    );
  }

  return (
    <SettingsShell step={2} subtitle="Step 2 · Confirm it's you">
      <p className="section-kicker">◷ &nbsp; ENTER CODE</p>
      <p className="settings-intro">
        We sent a code to <strong>{email}</strong>. It expires in 10 minutes.
      </p>
      <form
        className="settings-form"
        onSubmit={(e) => {
          e.preventDefault();
          void run(async () => onSignedIn(await verifySignInCode(email, code)));
        }}
      >
        <label className="field">
          <span>6-digit code</span>
          <input
            className="code-input"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{6}"
            maxLength={6}
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          />
        </label>
        <ErrorText message={errorMessage} />
        <button className="primary-button" type="submit" disabled={busy || code.length !== 6}>
          {busy ? "Checking…" : "Verify"} <span aria-hidden="true">›</span>
        </button>
        <button className="link-button" type="button" onClick={() => setCodeSent(false)}>
          Use a different email
        </button>
      </form>
    </SettingsShell>
  );
}

function ConsentStep({ session, onSignOut }: { session: Session; onSignOut: () => void }) {
  const [granted, setGranted] = useState<boolean | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [reload, setReload] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setLoadError(false);
    setGranted(null);
    readEmailSettings(session).then(settings => {
      if (!cancelled) setGranted(settings.granted);
    }).catch(() => { if (!cancelled) setLoadError(true); });
    return () => { cancelled = true; };
  }, [session, reload]);
  const { busy, errorMessage, run } = useSubmit();

  function submitConsent(nextGranted: boolean) {
    void run(async () => {
      const documentVersionHash = await hashText(CONSENT_NOTICE);
      await postConsent(session, {
        email: nextGranted ? session.email : null,
        documentVersionHash,
        buttonText: nextGranted ? AGREE_BUTTON_TEXT : WITHDRAW_BUTTON_TEXT,
        granted: nextGranted,
      });
      setGranted(nextGranted);
    });
  }

  return (
    <SettingsShell step={3} subtitle="Step 3 · Turn on the email digest">
      <div className="account-row">
        <span>
          <small>Signed in · verified</small>
          <strong>{session.email}</strong>
        </span>
        <button className="link-button" type="button" onClick={onSignOut}>
          Sign out
        </button>
      </div>

      {loadError ? <><p role="alert">Could not load your email settings.</p><button className="secondary-button" onClick={() => setReload(value => value + 1)}>Try again</button></> : granted === null ? <p role="status">Loading email settings…</p> : granted ? (
        <>
          <div className="status-on" role="status">
            <strong>Email digest is on</strong>
            <small>
              Sent to a verified address only, used for this digest and nothing else. Turn off any time here or on the website.
            </small>
          </div>
          <ErrorText message={errorMessage} />
          <button className="secondary-button" type="button" disabled={busy} onClick={() => submitConsent(false)}>
            {WITHDRAW_BUTTON_TEXT}
          </button>
        </>
      ) : (
        <>
          <p className="notice-box">{CONSENT_NOTICE}</p>
          <ErrorText message={errorMessage} />
          <button className="primary-button" type="button" disabled={busy} onClick={() => submitConsent(true)}>
            {AGREE_BUTTON_TEXT}
          </button>
        </>
      )}
    </SettingsShell>
  );
}

// F3: sign in with an emailed code (verifies the address, LR3), then the
// LR1/LR4 email opt-in. The consent text is hashed client-side, so
// document_version_hash always matches what was actually displayed. Opt-out
// uses the same screen (PDPA: withdrawable from the same screen it was given on).
//
// There's no read endpoint for existing consent state yet, so the consent form
// always starts from the opt-in-required view — unchecked-by-default either way.

import { useEffect, useState } from "react";
import {
  postConsent,
  readSession,
  requestSignInCode,
  signOut,
  verifySignInCode,
  type Session,
} from "../lib/api";

const CONSENT_NOTICE =
  "By turning on the email digest, NaraNews will send a one-line news summary to the email address below. " +
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

  return (
    <section>
      <h2>Email digest</h2>
      {session ? (
        <ConsentForm
          session={session}
          onSignOut={() => void signOut().then(() => setSession(null))}
        />
      ) : (
        <SignIn onSignedIn={setSession} />
      )}
    </section>
  );
}

function SignIn({ onSignedIn }: { onSignedIn: (session: Session) => void }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
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

  return (
    <>
      <p>Sign in with your email first. We'll send a 6-digit code to confirm it's yours.</p>
      {!codeSent ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void run(async () => {
              await requestSignInCode(email);
              setCodeSent(true);
            });
          }}
        >
          <label>
            Email address
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <button type="submit" disabled={state === "submitting"}>
            Send code
          </button>
        </form>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void run(async () => onSignedIn(await verifySignInCode(email, code)));
          }}
        >
          <p>We sent a code to {email}. It expires in 10 minutes.</p>
          <label>
            Code
            <input
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </label>
          <button type="submit" disabled={state === "submitting"}>
            Verify
          </button>
          <button type="button" onClick={() => setCodeSent(false)}>
            Use a different email
          </button>
        </form>
      )}
      {state === "error" && <p role="alert">{errorMessage}</p>}
    </>
  );
}

function ConsentForm({ session, onSignOut }: { session: Session; onSignOut: () => void }) {
  const [granted, setGranted] = useState(false);
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function submitConsent(nextGranted: boolean) {
    setState("submitting");
    setErrorMessage(null);
    try {
      const documentVersionHash = await hashText(CONSENT_NOTICE);
      await postConsent(session, {
        email: nextGranted ? session.email : null,
        documentVersionHash,
        buttonText: nextGranted ? AGREE_BUTTON_TEXT : WITHDRAW_BUTTON_TEXT,
        granted: nextGranted,
      });
      setGranted(nextGranted);
      setState("idle");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to save.");
      setState("error");
    }
  }

  return (
    <>
      <p>
        Signed in as <strong>{session.email}</strong>{" "}
        <button type="button" onClick={onSignOut}>
          Sign out
        </button>
      </p>
      <p>{CONSENT_NOTICE}</p>
      {!granted ? (
        <button type="button" disabled={state === "submitting"} onClick={() => void submitConsent(true)}>
          {AGREE_BUTTON_TEXT}
        </button>
      ) : (
        <button type="button" disabled={state === "submitting"} onClick={() => void submitConsent(false)}>
          {WITHDRAW_BUTTON_TEXT}
        </button>
      )}
      {state === "error" && <p role="alert">{errorMessage}</p>}
    </>
  );
}

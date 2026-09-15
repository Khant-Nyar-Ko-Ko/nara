// LR1/LR4: email opt-in for F3. Shows the reader exactly what they're
// agreeing to and hashes that exact text client-side, so document_version_hash
// always matches what was actually displayed. Opt-out uses the same screen
// (PDPA: consent must be withdrawable from the same screen it was given on).
//
// There's no read endpoint for existing consent state yet (out of scope
// here), so this always starts from the opt-in-required view rather than
// guessing a stored state — opt-in stays unchecked-by-default either way.

import { useState } from "react";
import { postConsent } from "../lib/api";

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
  const [email, setEmail] = useState("");
  const [granted, setGranted] = useState(false);
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function submitConsent(nextGranted: boolean) {
    setState("submitting");
    setErrorMessage(null);
    try {
      const documentVersionHash = await hashText(CONSENT_NOTICE);
      await postConsent({
        email: nextGranted ? email : null,
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
    <section>
      <h2>Email digest</h2>
      <p>{CONSENT_NOTICE}</p>

      {!granted ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submitConsent(true);
          }}
        >
          <label>
            Email address
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <button type="submit" disabled={state === "submitting"}>
            {AGREE_BUTTON_TEXT}
          </button>
        </form>
      ) : (
        <button type="button" disabled={state === "submitting"} onClick={() => void submitConsent(false)}>
          {WITHDRAW_BUTTON_TEXT}
        </button>
      )}

      {state === "error" && <p role="alert">{errorMessage}</p>}
    </section>
  );
}

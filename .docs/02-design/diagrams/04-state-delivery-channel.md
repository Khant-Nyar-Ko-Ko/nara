# Diagram 4 — State: Which Channel Does a Reader Get?

```mermaid
stateDiagram-v2
    [*] --> ChromeActive: Chrome open, in use
    [*] --> ChromeInactive: Chrome not in use / not running

    ChromeActive --> Popup: new digest ready\n(F2, in scope)
    ChromeInactive --> EmailFallback: verified + consented\n(F3, in scope)
    ChromeInactive --> NoDelivery: not verified/consented\n(LR1/LR3/LR4 not met)

    ChromeActive --> ChromeInactive: reader leaves Chrome
    ChromeInactive --> ChromeActive: reader returns to Chrome

    state "Chrome open, idle" as ChromeIdle
    ChromeActive --> ChromeIdle: no interaction for N min
    ChromeIdle --> SystemNotification: F5 [Should] - has a\nnotification preference on file (LR5)
    ChromeIdle --> ChromeActive: reader interacts again

    Popup --> [*]
    EmailFallback --> [*]
    NoDelivery --> [*]
    SystemNotification --> [*]
```

The `ChromeIdle` → `SystemNotification` transition is now backed by F5 [Should], sourced to survey data: P4 found
readers evenly split (3/7 Chrome notification, 3/7 email digest, 1/7 neither) on how they want to be notified when
idle. This is survey-supported, not yet interview-validated — see
[01-spec/20260902-01-news-digest.md](../../01-requirements/01-spec/20260902-01-news-digest.md) for the full
citation and [00-proposal.md](../00-proposal.md) for status.

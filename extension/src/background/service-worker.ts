// Template only — no implementation yet.
// TODO(F1): register a chrome.alarms trigger that polls web/'s digest endpoint
//   on a schedule and caches the result for the popup.
// TODO(F5): when the alarm fires and Chrome has been idle (chrome.idle) for
//   the reader's configured threshold, fire a chrome.notifications digest
//   notification instead of just updating the popup badge.
// TODO(LR5): only fire the F5 notification if the reader's stored channel
//   preference (chrome.storage) says "notification", not "email"/"none".

export {};

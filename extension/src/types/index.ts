// Template only — shared shape stubs, no logic.

export interface Headline {
  id: string;
  source: string;
  category: string;
  summary: string; // one-line summary, F2
  url: string; // source article, F2 click target
  fetchedAt: string;
}

export type DeliveryChannel = "popup" | "notification" | "email" | "none"; // F2 / F5 / F3 / opt-out

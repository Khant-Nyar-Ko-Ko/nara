// F1: load the digest (cache-first, then a live refresh).
// F2: render as a scrollable, one-line-per-headline list; clicking a row
// opens the source article in a new tab.

import { useEffect, useState } from "react";
import { fetchDigest } from "../lib/api";
import { readCachedDigest, writeCachedDigest } from "../lib/digestCache";
import type { Headline } from "../types";

type Status = "loading" | "ready" | "error";

export function Popup() {
  const [headlines, setHeadlines] = useState<Headline[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const cached = await readCachedDigest();
      if (cached && !cancelled) {
        setHeadlines(cached.headlines);
        setStatus("ready");
      }

      try {
        const fresh = await fetchDigest();
        if (cancelled) return;
        setHeadlines(fresh);
        setStatus("ready");
        void writeCachedDigest(fresh);
      } catch (err) {
        console.error("naranews: popup digest fetch failed", err);
        if (!cancelled && !cached) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading") return <p>Loading headlines…</p>;
  if (status === "error") return <p>Couldn't load headlines. Try again later.</p>;
  if (headlines.length === 0) return <p>No headlines right now.</p>;

  return (
    <ul style={{ maxHeight: 400, overflowY: "auto", margin: 0, padding: 0, listStyle: "none" }}>
      {headlines.map((headline) => (
        <li key={headline.id}>
          <a href={headline.url} target="_blank" rel="noopener noreferrer">
            {headline.summary}
          </a>
        </li>
      ))}
    </ul>
  );
}

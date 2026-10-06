"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

// Hero card: the newest real headlines from /api/digest, so the first screen
// shows the product working rather than sample content.
type Headline = { id: string; source: string; category: string | null; summary: string; url: string; fetchedAt: string };
const SHOWN = 3;

function safeUrl(raw: string): string | null {
  try { const url = new URL(raw); return ["https:", "http:"].includes(url.protocol) ? url.href : null; } catch { return null; }
}

function age(iso: string): string {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (Number.isNaN(minutes)) return "";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  return hours < 48 ? `${hours}h ago` : `${Math.round(hours / 24)}d ago`;
}

export function HeroLive() {
  const [items, setItems] = useState<Headline[] | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/digest?lang=en", { signal: controller.signal, cache: "no-store" })
      .then(async response => {
        if (!response.ok) throw new Error();
        const data = await response.json();
        if (!Array.isArray(data.headlines)) throw new Error();
        setItems(data.headlines.slice(0, SHOWN));
      })
      .catch(() => { if (!controller.signal.aborted) setFailed(true); });
    return () => controller.abort();
  }, []);

  return <aside className="preview-card hero-live" aria-label="Latest headlines">
    <div className="card-header"><span className="brand-mark">N</span><div><h3>Latest headlines</h3><p><span className="live-dot" aria-hidden="true" />Live from the NaraNews feed</p></div></div>
    {failed || (items && items.length === 0)
      ? <p className="hero-live-note">Headlines are refreshing. <Link className="text-link" href="/digest">Open the live digest →</Link></p>
      : !items
        ? <div aria-busy="true">{Array.from({ length: SHOWN }, (_, i) => <div className="story" key={i}><span className="skeleton short" /><span className="skeleton" /></div>)}</div>
        : items.map(item => {
          const href = safeUrl(item.url);
          const body = <><div className="story-meta"><span className="source-dot" />{item.source}{item.category && item.category !== "Other" && <span>/ {item.category}</span>}<span className="story-age">{age(item.fetchedAt)}</span></div><h4>{item.summary}{href && <span aria-hidden="true">↗</span>}</h4></>;
          return href ? <a className="story" key={item.id} href={href} target="_blank" rel="noopener noreferrer">{body}</a> : <div className="story" key={item.id}>{body}</div>;
        })}
    <div className="card-footer"><span>Summarised from Thai news sources</span><Link className="text-link" href="/digest">See all →</Link></div>
  </aside>;
}

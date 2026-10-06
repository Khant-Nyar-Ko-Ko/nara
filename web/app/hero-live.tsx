"use client";
import Link from "next/link";
import { age, categoryLabel, safeUrl, useLiveHeadlines } from "./live-headlines";

// Hero card: the newest real headlines, so the first screen shows the
// product working rather than sample content.
export const HERO_SHOWN = 3;

export function HeroLive() {
  const live = useLiveHeadlines();
  const items = live.status === "ready" ? live.items.slice(0, HERO_SHOWN) : null;

  return <aside className="preview-card hero-live" aria-label="Latest headlines">
    <div className="card-header"><span className="brand-mark">N</span><div><h3>Latest headlines</h3><p><span className="live-dot" aria-hidden="true" />Live from the NaraNews feed</p></div></div>
    {live.status === "error" || (items && items.length === 0)
      ? <p className="hero-live-note">Headlines are refreshing. <Link className="text-link" href="/digest">Open the live digest →</Link></p>
      : !items
        ? <div aria-busy="true">{Array.from({ length: HERO_SHOWN }, (_, i) => <div className="story" key={i}><span className="skeleton short" /><span className="skeleton" /></div>)}</div>
        : items.map(item => {
          const href = safeUrl(item.url);
          const category = categoryLabel(item.category);
          const body = <><div className="story-meta"><span className="source-dot" />{item.source}{category && <span>/ {category}</span>}<span className="story-age">{age(item.fetchedAt)}</span></div><h4>{item.summary}{href && <span aria-hidden="true">↗</span>}</h4></>;
          return href ? <a className="story" key={item.id} href={href} target="_blank" rel="noopener noreferrer">{body}</a> : <div className="story" key={item.id}>{body}</div>;
        })}
    <div className="card-footer"><span>Summarised from Thai news sources</span><Link className="text-link" href="/digest">See all →</Link></div>
  </aside>;
}

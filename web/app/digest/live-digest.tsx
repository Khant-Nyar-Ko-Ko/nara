"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
const topics = ["Politics", "Economy", "Bangkok", "Weather", "Society", "Travel", "Health", "Sport"];
type Headline = { id: string; source: string; category: string | null; summary: string; url: string; fetchedAt: string };
export function LiveDigest() { return <Suspense fallback={<p role="status">Loading your digest…</p>}><Digest /></Suspense>; }
function Digest() {
  const params = useSearchParams();
  const [selected, setSelected] = useState(() => (params.get("topics") ?? "").split(",").filter(topic => topics.includes(topic)));
  const [lang, setLang] = useState("th");
  const [items, setItems] = useState<Headline[]>([]);
  const [status, setStatus] = useState("loading");
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    fetch(`/api/digest?lang=${lang}`, { signal: controller.signal, cache: "no-store" }).then(async response => {
      if (!response.ok) throw new Error("Could not load the digest");
      const data = await response.json();
      if (!Array.isArray(data.headlines)) throw new Error("Invalid digest");
      setItems(data.headlines); setStatus("ready");
    }).catch(() => { if (!controller.signal.aborted) setStatus("error"); });
    return () => controller.abort();
  }, [lang, refresh]);
  const sorted = [...items].sort((a, b) => Number(selected.includes(b.category ?? "")) - Number(selected.includes(a.category ?? "")));
  return <section className="live-feed" aria-label="News digest"><div className="feed-controls"><label>Language <select value={lang} onChange={e => setLang(e.target.value)}><option value="th">ไทย</option><option value="en">English</option><option value="mm">မြန်မာ</option></select></label><button className="text-link" onClick={() => setRefresh(value => value + 1)} disabled={status === "loading"}>Refresh headlines ↻</button></div><div className="topic-filters" aria-label="Priority topics">{topics.map(topic => <button key={topic} aria-pressed={selected.includes(topic)} onClick={() => setSelected(current => current.includes(topic) ? current.filter(value => value !== topic) : [...current, topic])}>{topic}</button>)}</div><p className="fine-print">Selected topics appear first. These choices apply to this page.</p>{status === "loading" ? <p role="status" className="state-panel">Loading the latest headlines…</p> : status === "error" ? <div role="alert" className="state-panel"><h2>Headlines are temporarily unavailable</h2><p>Please try again shortly.</p><button className="text-link" onClick={() => setRefresh(value => value + 1)}>Try again</button></div> : items.length === 0 ? <p className="state-panel" role="status">No headlines in this language yet. Try another language or check back later.</p> : <div className="preview-card live-list">{sorted.map(item => {
    let safeUrl: string | null = null;
    try { const url = new URL(item.url); if (["https:", "http:"].includes(url.protocol)) safeUrl = url.href; } catch { /* Invalid source links are not rendered. */ }
    return <article className="story" key={item.id}><div className="story-meta">{item.source} · {item.category ?? "News"}</div><h2>{safeUrl ? <a href={safeUrl} target="_blank" rel="noopener noreferrer">{item.summary} ↗</a> : item.summary}</h2><p>Read the full story at {item.source}</p></article>;
  })}</div>}</section>;
}

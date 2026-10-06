"use client";

import { useState } from "react";
import Link from "next/link";

const topics = [
  ["Politics", "การเมือง"], ["Economy", "เศรษฐกิจ"], ["Bangkok", "กรุงเทพฯ"],
  ["Weather", "สภาพอากาศ"], ["Society", "สังคม"], ["Travel", "ท่องเที่ยว"],
  ["Health", "สุขภาพ"], ["Sport", "กีฬา"],
];
const sources = [
  { name: "Bangkok Post", url: "https://www.bangkokpost.com/", topic: "Politics", title: "Catch up on Thailand’s political news", summary: "One place to start exploring the latest stories and developments." },
  { name: "Thai PBS World", url: "https://www.thaipbsworld.com/", topic: "Economy", title: "See the bigger picture in business and the economy", summary: "Scan a short overview before diving into a full report." },
  { name: "The Nation", url: "https://www.nationthailand.com/", topic: "Bangkok", title: "Keep up with the city around you", summary: "Find news from Bangkok and beyond, all in one digest." },
  { name: "Khaosod English", url: "https://www.khaosodenglish.com/", topic: "Weather", title: "Make room for the news that matters to your day", summary: "Get a quick overview, then head to the source for the details." },
  { name: "Prachatai", url: "https://prachatai.com/english/", topic: "Society", title: "Explore more perspectives from Thailand", summary: "Discover stories from different newsrooms in a single list." },
];

function CardHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return <div className="card-header"><span className="brand-mark">N</span><div><h3>{title}</h3><p>{subtitle}</p></div></div>;
}

export function DigestPreview({ selected = [], onSettings }: { selected?: string[]; onSettings?: () => void }) {
  const sorted = [...sources].sort((a, b) => Number(selected.includes(b.topic)) - Number(selected.includes(a.topic)));
  return <div className="preview-card digest-card"><CardHeader title="NaraNews" subtitle="Thailand headline digest" /><div className="digest-toolbar"><span className="badge">Sample digest</span><span>Explore the sources ↗</span></div><p className="demo-note">Illustrative content, not live news. Links open publisher homepages.</p><div className="digest-list">{sorted.map((story) => <a className="story" key={story.name} href={story.url} target="_blank" rel="noopener noreferrer"><div className="story-meta"><span className="source-dot" />{story.name}<span>/ {story.topic}</span></div><h4>{story.title}<span aria-hidden="true">↗</span></h4><p>{story.summary}</p></a>)}</div><div className="card-footer"><span>One list. Multiple perspectives.</span>{onSettings ? <button className="text-link" onClick={onSettings}>Demo settings</button> : <a className="text-link" href="#preview">Try setup</a>}</div></div>;
}

export function LandingDemo() {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState(["Politics", "Economy", "Bangkok"]);
  const [email, setEmail] = useState(false);
  function toggle(topic: string) { setSelected(current => current.includes(topic) ? current.filter(item => item !== topic) : [...current, topic]); }
  return <div className="demo-shell"><div aria-live="polite" className="sr-only">Preview step {step} of 3: {step === 1 ? "Choose your topics" : step === 2 ? "Delivery preferences" : "Your sample digest"}</div>{step === 3 ? <><DigestPreview selected={selected} onSettings={() => setStep(2)} /><Link className="primary-button" href={`/digest?topics=${encodeURIComponent(selected.join(","))}`}>Read live headlines with these topics →</Link>{email && <Link className="text-link" href="/settings">Verify your email and enable delivery →</Link>}</> : <div className="preview-card"><CardHeader title={step === 1 ? "Choose your topics" : "Delivery preferences"} subtitle={`Step ${step} · ${step === 1 ? "Priority categories" : "Make it yours"}`} /><div className="setup-body">{step === 1 ? <><p>Pick the topics you want at the top of your digest. You can change these any time.</p><div className="topic-grid">{topics.map(([name, thai]) => <button className={`topic ${selected.includes(name) ? "selected" : ""}`} key={name} aria-pressed={selected.includes(name)} onClick={() => toggle(name)}><span><strong>{name}</strong><small lang="th">{thai}</small></span><span className="check" aria-hidden="true">{selected.includes(name) ? "✓" : "+"}</span></button>)}</div><p className="selection-note">{selected.length} selected · prioritized first, everything else follows.</p><button className="primary-button" onClick={() => setStep(2)}>Next: delivery preferences <span aria-hidden="true">→</span></button></> : <><button className="text-link back-link" onClick={() => setStep(1)}>← Back to topics</button><p>Read in the popup whenever you like, or opt in to an email when you’re away.</p><label className="preference"><span><strong>Email when away</strong><small>Preview only · no email will be sent</small></span><input type="checkbox" checked={email} onChange={event => setEmail(event.target.checked)} /></label><p className="demo-note">{email ? "In the extension, you’ll verify your email and give consent in Settings." : "Email is optional. Your digest is always available in the popup."}</p><div className="preference"><span><strong>Scheduled digests</strong><small>Choose when your news arrives</small></span><span className="badge">Coming soon</span></div><div className="preference"><span><strong>Notifications & quiet hours</strong><small>A little more control over your day</small></span><span className="badge">Coming soon</span></div><button className="primary-button" onClick={() => setStep(3)}>Open my sample digest <span aria-hidden="true">→</span></button></>}</div><div className="progress" aria-label={`Step ${step} of 3`}>{[1, 2, 3].map(value => <span key={value} className={value <= step ? "active" : ""} />)}<strong>{step}/3</strong></div></div>}</div>;
}

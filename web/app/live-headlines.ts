"use client";
import { useEffect, useState } from "react";

export type LiveHeadline = { id: string; source: string; category: string | null; summary: string; url: string; fetchedAt: string };
export type LiveState = { status: "loading" } | { status: "ready"; items: LiveHeadline[] } | { status: "error" };

let request: Promise<LiveHeadline[]> | null = null;

function loadHeadlines(): Promise<LiveHeadline[]> {
  request ??= fetch("/api/digest?lang=en", { cache: "no-store" })
    .then(async response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data.headlines)) throw new Error("invalid digest");
      return data.headlines as LiveHeadline[];
    })
    .catch(err => { request = null; throw err; }); // let a later mount retry
  return request;
}

export function useLiveHeadlines(): LiveState {
  const [state, setState] = useState<LiveState>({ status: "loading" });
  useEffect(() => {
    let active = true;
    loadHeadlines()
      .then(items => { if (active) setState({ status: "ready", items }); })
      .catch(() => { if (active) setState({ status: "error" }); });
    return () => { active = false; };
  }, []);
  return state;
}

export function safeUrl(raw: string): string | null {
  try { const url = new URL(raw); return ["https:", "http:"].includes(url.protocol) ? url.href : null; } catch { return null; }
}

export function age(iso: string): string {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (Number.isNaN(minutes)) return "";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  return hours < 48 ? `${hours}h ago` : `${Math.round(hours / 24)}d ago`;
}

// The crawler's catch-all category isn't worth showing as a label.
export function categoryLabel(category: string | null): string | null {
  return category && category !== "Other" ? category : null;
}

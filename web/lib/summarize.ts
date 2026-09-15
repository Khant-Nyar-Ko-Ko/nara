// F2: reduce a fetched headline to one clean, bounded-length line for the
// popup list. Prefers the feed's own description (an editorial summary of
// the article) over the bare title, since that's closer to what lets a
// reader decide whether to click through without opening the article.

import type { FetchedHeadline } from "./headlines";

const MAX_SUMMARY_LENGTH = 140;

export function summarize(headline: Pick<FetchedHeadline, "title" | "description">): string {
  const raw = headline.description?.trim() || headline.title;
  const text = cleanText(raw) || cleanText(headline.title);
  return truncate(text, MAX_SUMMARY_LENGTH);
}

function cleanText(input: string): string {
  return decodeNumericEntities(stripHtml(input)).replace(/\s+/g, " ").trim();
}

function stripHtml(input: string): string {
  return input.replace(/<[^>]+>/g, "");
}

// Some feeds double-escape numeric refs (e.g. a literal "&#8230;" left in
// the text after the XML parser's own entity decoding already ran once).
function decodeNumericEntities(input: string): string {
  return input
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)));
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

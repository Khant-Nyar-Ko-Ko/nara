// F2: combine the F1 fetch (lib/headlines.ts) with a one-line summary per
// headline (lib/summarize.ts) — this is what the extension popup renders.

import { withAccessLog } from "@/lib/logging";
import { fetchAllHeadlines } from "@/lib/headlines";
import { summarize } from "@/lib/summarize";

export const GET = withAccessLog(async function GET() {
  const headlines = await fetchAllHeadlines();
  const fetchedAt = new Date().toISOString();
  const digest = headlines.map((headline) => ({
    id: headline.id,
    source: headline.source,
    summary: summarize(headline),
    url: headline.url,
    fetchedAt,
  }));
  return Response.json({ headlines: digest });
});

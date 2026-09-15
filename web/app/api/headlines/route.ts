// F1: raw, unsummarized headlines. See /api/digest for the F2 one-line
// summarized version the extension popup actually renders.

import { withAccessLog } from "@/lib/logging";
import { fetchAllHeadlines } from "@/lib/headlines";

export const GET = withAccessLog(async function GET() {
  const headlines = await fetchAllHeadlines();
  return Response.json({ headlines });
});

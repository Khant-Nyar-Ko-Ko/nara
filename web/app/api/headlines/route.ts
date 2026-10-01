// F1: aggregated headlines from the crawler's `news` table, every language
// per item. /api/digest is the single-language list the popup renders.

import { withAccessLog } from "@/lib/logging";
import { readHeadlines } from "@/lib/news";

export const dynamic = "force-dynamic";

export const GET = withAccessLog(async function GET() {
  const headlines = await readHeadlines();
  return Response.json({ headlines });
});

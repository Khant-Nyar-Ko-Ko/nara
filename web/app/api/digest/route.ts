// F2: one-line headlines for the extension popup, read from the crawler's
// `news` table. ?lang=th|en|mm picks the headline language (default th).
// fetchedAt carries the article's publish time so the popup's "Xm ago" is real.

import type { NextRequest } from "next/server";
import { withAccessLog } from "@/lib/logging";
import { DIGEST_LANGS, parseLang, readDigest } from "@/lib/news";

export const dynamic = "force-dynamic";

export const GET = withAccessLog(async function GET(req: NextRequest) {
  const lang = parseLang(req.nextUrl.searchParams.get("lang"));
  if (!lang) {
    return Response.json({ error: `lang must be one of ${DIGEST_LANGS.join(", ")}` }, { status: 400 });
  }

  const headlines = await readDigest(lang);
  return Response.json({ headlines });
});

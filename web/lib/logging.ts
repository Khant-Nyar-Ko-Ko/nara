// Append-only access-log writer (rule.md CCA §26 / LR2). Route handlers
// wrap themselves with `withAccessLog` (not middleware.ts — Next.js
// middleware never sees a route's final response/status). Only
// traffic-shape fields are written, never bodies/content/tokens.

import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { query } from "./db";
import { resolveSession } from "./auth";

export interface AccessLogEntry {
  ts: string; // UTC ISO-8601
  ip: string;
  route: string;
  method: string;
  status: number;
  bytes: number;
  userId: string | null;
  sessionId: string | null;
  userAgent: string | null;
}

function hashEntry(entry: AccessLogEntry, prevHash: string | null): string {
  const h = createHash("sha256");
  h.update(prevHash ?? "");
  h.update(JSON.stringify(entry));
  return h.digest("hex");
}

export async function logAccess(entry: AccessLogEntry): Promise<void> {
  const [last] = await query<{ hash: string }>(
    "SELECT hash FROM access_log ORDER BY id DESC LIMIT 1",
  );
  const prevHash = last?.hash ?? null;
  const hash = hashEntry(entry, prevHash);

  // INSERT only — see db.ts runRetentionJob for the sanctioned exception.
  await query(
    `INSERT INTO access_log
       (ts, ip, route, method, status, bytes, user_id, session_id, user_agent, prev_hash, hash)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    [
      entry.ts,
      entry.ip,
      entry.route,
      entry.method,
      entry.status,
      entry.bytes,
      entry.userId,
      entry.sessionId,
      entry.userAgent,
      prevHash,
      hash,
    ],
  );
}

export function requestIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

// Anonymous (null userId) whenever there's no valid session — still
// logged, since CCA §26 traffic logging applies regardless of auth state.
function requestIdentity(req: NextRequest): { userId: string | null; sessionId: string | null } {
  const session = resolveSession(req);
  return { userId: session?.userId ?? null, sessionId: session?.sessionId ?? null };
}

type RouteHandler = (req: NextRequest, ctx: unknown) => Promise<Response> | Response;

// Wraps a route handler so every call, success or thrown error, writes
// exactly one access_log row.
export function withAccessLog(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest, ctx: unknown) => {
    const ts = new Date().toISOString();
    const ip = requestIp(req);
    const { userId, sessionId } = requestIdentity(req);
    const userAgent = req.headers.get("user-agent");
    const route = req.nextUrl.pathname;
    const method = req.method;

    const write = async (status: number, bytes: number) => {
      try {
        await logAccess({ ts, ip, route, method, status, bytes, userId, sessionId, userAgent });
      } catch (loggingError) {
        console.error("access_log write failed", loggingError);
      }
    };

    try {
      const res = await handler(req, ctx);
      const body = await res.clone().arrayBuffer();
      await write(res.status, body.byteLength);
      return res;
    } catch (err) {
      await write(500, 0);
      throw err;
    }
  };
}

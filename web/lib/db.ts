// DB client + schema. Personal data (email) is isolated in its own table
// so it can never leak via a join/log against the rest of the schema
// (rule.md PDPA). TLS is required except for localhost dev.

import { Pool, type PoolClient, type QueryResultRow } from "pg";

function isLocalDb(connectionString: string): boolean {
  return /\/\/(localhost|127\.0\.0\.1)([:/]|$)/.test(connectionString);
}

function createPool(envVar: string): Pool {
  const connectionString = process.env[envVar];
  if (!connectionString) {
    throw new Error(`${envVar} is not set — DB credentials must come from env/secrets manager, never hard-coded.`);
  }
  return new Pool({
    connectionString,
    ssl: isLocalDb(connectionString) ? undefined : { rejectUnauthorized: true },
  });
}

// Lazy singleton so Next.js dev-mode hot reload doesn't leak connections.
const globalForDb = globalThis as unknown as { naraPool?: Pool };

export function getPool(): Pool {
  if (!globalForDb.naraPool) {
    globalForDb.naraPool = createPool("DATABASE_URL");
  }
  return globalForDb.naraPool;
}

export async function query<R extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<R[]> {
  const result = await getPool().query<R>(text, params);
  return result.rows;
}

export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// --- Schema -------------------------------------------------------------
// Applied via ensureSchema() (idempotent). No migration framework yet —
// add one (e.g. node-pg-migrate) before this grows further.

// Non-personal identity anchor + feature preferences.
const USERS_TABLE = `
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_channel TEXT NOT NULL DEFAULT 'popup' CHECK (delivery_channel IN ('popup', 'notification', 'email')),
  followed_sources JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at TIMESTAMPTZ
);
`;

// Isolated on purpose (see file header). Anonymised 2y after last login
// by runRetentionJob (rule.md PDPA inactive-account default).
const USER_CONTACTS_TABLE = `
CREATE TABLE IF NOT EXISTS user_contacts (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  email TEXT,
  email_verified_at TIMESTAMPTZ
);
`;

// CCA §26 traffic log. Append-only — the DATABASE_URL role should be
// granted INSERT/SELECT only, never DELETE/UPDATE. prev_hash/hash chain
// each row to the last for tamper evidence.
const ACCESS_LOG_TABLE = `
CREATE TABLE IF NOT EXISTS access_log (
  id BIGSERIAL PRIMARY KEY,
  ts TIMESTAMPTZ NOT NULL,
  ip TEXT NOT NULL,
  route TEXT NOT NULL,
  method TEXT NOT NULL,
  status INTEGER NOT NULL,
  bytes INTEGER NOT NULL,
  user_id UUID,
  session_id TEXT,
  user_agent TEXT,
  prev_hash TEXT,
  hash TEXT NOT NULL
);
`;

// ETA §9/26 consent record. Immutable — withdrawal is a new row, never
// an edit of the original. Not covered by runRetentionJob.
const CONSENT_LOG_TABLE = `
CREATE TABLE IF NOT EXISTS consent_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  purpose TEXT NOT NULL,
  document_version_hash TEXT NOT NULL,
  button_text TEXT NOT NULL,
  granted BOOLEAN NOT NULL,
  ip TEXT NOT NULL,
  ts TIMESTAMPTZ NOT NULL DEFAULT now()
);
`;

export async function ensureSchema(): Promise<void> {
  await query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`); // for gen_random_uuid()
  await query(USERS_TABLE);
  await query(USER_CONTACTS_TABLE);
  await query(ACCESS_LOG_TABLE);
  await query(CONSENT_LOG_TABLE);
}

// --- Retention / anonymisation job ---------------------------------------
// Call from an external scheduler with a pool built from RETENTION_DATABASE_URL
// (a credential with UPDATE/DELETE grants DATABASE_URL's role lacks) —
// never from an API route (rule.md CCA §26: no delete permission for the
// app's service account, no bulk log endpoint).
const ACCESS_LOG_RETENTION_DAYS = 365; // PDPA default for activity logs; CCA §26 floor is 90.
const MIN_LAWFUL_RETENTION_DAYS = 90;
const INACTIVE_CONTACT_RETENTION_DAYS = 730; // PDPA default: 2 years after last login.

export async function runRetentionJob(retentionPool: Pool): Promise<{ accessLogDeleted: number; contactsAnonymised: number }> {
  if (ACCESS_LOG_RETENTION_DAYS < MIN_LAWFUL_RETENTION_DAYS) {
    throw new Error(`access_log retention (${ACCESS_LOG_RETENTION_DAYS}d) may not go below the CCA §26 floor of ${MIN_LAWFUL_RETENTION_DAYS}d.`);
  }

  const deleted = await retentionPool.query(
    `DELETE FROM access_log WHERE ts < now() - ($1 || ' days')::interval`,
    [ACCESS_LOG_RETENTION_DAYS],
  );

  const anonymised = await retentionPool.query(
    `UPDATE user_contacts SET email = NULL, email_verified_at = NULL
     WHERE user_id IN (
       SELECT id FROM users
       WHERE last_login_at IS NOT NULL
         AND last_login_at < now() - ($1 || ' days')::interval
     )
     AND email IS NOT NULL`,
    [INACTIVE_CONTACT_RETENTION_DAYS],
  );

  return { accessLogDeleted: deleted.rowCount ?? 0, contactsAnonymised: anonymised.rowCount ?? 0 };
}

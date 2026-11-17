-- Crawl timer (Digest freshness NFR, 2026-11-17).
-- GitHub's own cron skipped about 2 of every 3 scheduled crawls and started the
-- rest up to 4 h late (gaps of 4–18 h, Nov 9–17). This job asks GitHub to start
-- crawl.yml on time instead: every 2 h, 07:00–21:00 Thailand time
-- (00:00–14:00 UTC), no night runs.
--
-- BEFORE running this file, store the GitHub token in Supabase Vault yourself,
-- in the SQL editor (fine-grained token, repository Khant-Nyar-Ko-Ko/nara only,
-- permission "Actions: Read and write"):
--   select vault.create_secret('<paste token here>', 'github_crawl_dispatch_token');
-- Never put the token in this file, in git, or in a log.
--
-- rule.md CCA §26: a new cron job must emit to the central log sink, so every
-- trigger appends one hash-chained access_log row, built exactly like
-- web/lib/logging.ts logAccess (traffic data only, never the token or body).
--
-- Run once in the Supabase SQL editor. Safe to re-run.

create extension if not exists pg_cron;
create extension if not exists http with schema extensions;
create extension if not exists pgcrypto with schema extensions;

create or replace function public.trigger_crawl()
returns integer
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  token text;
  resp extensions.http_response;
  status integer := 0;  -- 0 = not sent (token missing or network error)
  ts timestamptz := now();
  route constant text := '/repos/Khant-Nyar-Ko-Ko/nara/actions/workflows/crawl.yml/dispatches';
  agent constant text := 'naranews-crawl-timer';
  prev text;
  entry text;
begin
  select decrypted_secret into token
  from vault.decrypted_secrets
  where name = 'github_crawl_dispatch_token';

  if token is not null then
    begin
      resp := extensions.http((
        'POST',
        'https://api.github.com' || route,
        array[
          extensions.http_header('Authorization', 'Bearer ' || token),
          extensions.http_header('Accept', 'application/vnd.github+json'),
          extensions.http_header('X-GitHub-Api-Version', '2022-11-28'),
          extensions.http_header('User-Agent', agent)
        ],
        'application/json',
        '{"ref":"main"}'
      )::extensions.http_request);
      status := resp.status;  -- GitHub answers 204 when the run is queued
    exception when others then
      status := 0;
    end;
  end if;

  -- Same JSON shape and key order as JSON.stringify(entry) in logAccess.
  select hash into prev from access_log order by id desc limit 1;
  entry := '{"ts":' || to_json(to_char(ts at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))::text
        || ',"ip":' || to_json('supabase-pg_cron'::text)::text
        || ',"route":' || to_json(route)::text
        || ',"method":"POST"'
        || ',"status":' || status
        || ',"bytes":0,"userId":null,"sessionId":null'
        || ',"userAgent":' || to_json(agent)::text
        || '}';

  insert into access_log
    (ts, ip, route, method, status, bytes, user_id, session_id, user_agent, prev_hash, hash)
  values
    (ts, 'supabase-pg_cron', route, 'POST', status, 0, null, null, agent, prev,
     encode(extensions.digest(coalesce(prev, '') || entry, 'sha256'), 'hex'));

  if status <> 204 then
    raise warning 'crawl timer: GitHub returned status % (0 = not sent)', status;
  end if;
  return status;
end;
$$;

-- Security definer: never callable from the public API (anon/authenticated).
revoke all on function public.trigger_crawl() from public, anon, authenticated;

-- 07:00, 09:00, ... 21:00 Thailand time. Re-running replaces the schedule.
select cron.schedule('naranews-crawl', '0 0-14/2 * * *', $$select public.trigger_crawl()$$);

-- Check after the first run:
--   select status, return_message, start_time from cron.job_run_details
--     where jobid = (select jobid from cron.job where jobname = 'naranews-crawl')
--     order by start_time desc limit 5;
--   select ts, status, route from access_log where ip = 'supabase-pg_cron' order by id desc limit 5;
-- Stop it:
--   select cron.unschedule('naranews-crawl');

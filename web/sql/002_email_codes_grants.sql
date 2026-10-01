-- Lets nara_app use the sign-in codes table (lib/emailCode.ts). Run once in the
-- Supabase SQL editor, after ensureSchema() has created email_codes.
-- No DELETE: old codes are removed by runRetentionJob with RETENTION_DATABASE_URL.

GRANT SELECT, INSERT, UPDATE ON email_codes TO nara_app;
GRANT USAGE ON SEQUENCE email_codes_id_seq TO nara_app;
CREATE POLICY nara_app_all ON email_codes FOR ALL TO nara_app USING (true) WITH CHECK (true);
REVOKE ALL ON email_codes FROM anon, authenticated;

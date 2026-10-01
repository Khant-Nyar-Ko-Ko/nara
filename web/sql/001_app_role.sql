-- Restricted login for DATABASE_URL (rule.md CCA §26: the app's service
-- account may never delete or edit logs). Run once in the Supabase SQL editor,
-- after web/lib/db.ts ensureSchema() has created the tables.
-- Replace <STRONG_PASSWORD> first (letters and digits only, so the URL needs no escaping).
-- The `postgres` login moves to RETENTION_DATABASE_URL and is used only by the retention job.

CREATE ROLE nara_app LOGIN PASSWORD '<STRONG_PASSWORD>';

GRANT USAGE ON SCHEMA public TO nara_app;

GRANT SELECT ON news TO nara_app;
GRANT SELECT, INSERT ON access_log, consent_log TO nara_app;
GRANT SELECT, INSERT, UPDATE ON users, user_contacts TO nara_app;
GRANT USAGE ON SEQUENCE access_log_id_seq, consent_log_id_seq TO nara_app;

-- RLS is on for every table and nara_app doesn't own them, so it needs policies.
-- The GRANTs above still decide which operations are allowed.
CREATE POLICY nara_app_read ON news FOR SELECT TO nara_app USING (true);
CREATE POLICY nara_app_all ON users FOR ALL TO nara_app USING (true) WITH CHECK (true);
CREATE POLICY nara_app_all ON user_contacts FOR ALL TO nara_app USING (true) WITH CHECK (true);
CREATE POLICY nara_app_all ON access_log FOR ALL TO nara_app USING (true) WITH CHECK (true);
CREATE POLICY nara_app_all ON consent_log FOR ALL TO nara_app USING (true) WITH CHECK (true);

-- Supabase grants every public table to its API roles by default; RLS already
-- blocks them, this removes the grants too for the personal-data tables.
REVOKE ALL ON users, user_contacts, access_log, consent_log FROM anon, authenticated;

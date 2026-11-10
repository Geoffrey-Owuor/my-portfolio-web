-- When each contact message arrived and when the owner read it. The default is
-- set in a second statement on purpose: ADD COLUMN ... DEFAULT would stamp
-- existing messages with the migration time, and their real time is unknown,
-- so they stay NULL.
BEGIN;

ALTER TABLE user_feedback ADD COLUMN IF NOT EXISTS created_at timestamptz;
ALTER TABLE user_feedback ALTER COLUMN created_at SET DEFAULT NOW();
ALTER TABLE user_feedback ADD COLUMN IF NOT EXISTS read_at timestamptz;

COMMIT;

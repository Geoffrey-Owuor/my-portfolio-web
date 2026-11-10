-- Manual display order for the homepage lists: ascending sort_order is display
-- order. The backfill copies today's order, so nothing visibly moves. Tools
-- stay alphabetical and need no column.
--
-- Run once: running the backfill again would undo any manual reordering.
BEGIN;

ALTER TABLE projects ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;
ALTER TABLE workexperience ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;
ALTER TABLE education ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;
ALTER TABLE technical_skills ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;
ALTER TABLE soft_skills ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

-- Newest first today.
UPDATE projects AS t SET sort_order = r.position
FROM (SELECT id, ROW_NUMBER() OVER (ORDER BY id DESC) AS position FROM projects) AS r
WHERE t.id = r.id;

UPDATE workexperience AS t SET sort_order = r.position
FROM (SELECT id, ROW_NUMBER() OVER (ORDER BY id DESC) AS position FROM workexperience) AS r
WHERE t.id = r.id;

UPDATE education AS t SET sort_order = r.position
FROM (SELECT id, ROW_NUMBER() OVER (ORDER BY id DESC) AS position FROM education) AS r
WHERE t.id = r.id;

-- Oldest first today.
UPDATE technical_skills AS t SET sort_order = r.position
FROM (SELECT id, ROW_NUMBER() OVER (ORDER BY id ASC) AS position FROM technical_skills) AS r
WHERE t.id = r.id;

UPDATE soft_skills AS t SET sort_order = r.position
FROM (SELECT id, ROW_NUMBER() OVER (ORDER BY id ASC) AS position FROM soft_skills) AS r
WHERE t.id = r.id;

COMMIT;

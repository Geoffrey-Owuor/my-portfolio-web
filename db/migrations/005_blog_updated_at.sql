-- When a post was last edited. NULL until its first edit, so a post that has
-- never changed doesn't claim a modified date; readers fall back to blog_date.
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS updated_at timestamptz;

-- When a project was last edited (its fields or its image; reordering doesn't
-- count). NULL until its first edit, like blogs.updated_at.
ALTER TABLE projects ADD COLUMN IF NOT EXISTS updated_at timestamptz;

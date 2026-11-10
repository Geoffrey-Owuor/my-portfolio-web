-- Each project's screenshot, as a path under public/. NULL shows the
-- placeholder, so a new project needs only a row, not a deploy.
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_image text;

UPDATE projects SET project_image = '/project_images/staffproductpurchase_image.webp' WHERE id = 3;
UPDATE projects SET project_image = '/project_images/google_sheet_image.webp' WHERE id = 5;
UPDATE projects SET project_image = '/project_images/helpdesk_image.webp' WHERE id = 7;
UPDATE projects SET project_image = '/project_images/apps_hub_image.webp' WHERE id = 8;

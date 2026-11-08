import { query } from "@/lib/db";

const MAX_SLUG_LENGTH = 80;

const slugify = (title) => {
  const slug = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // accents, so "é" becomes "e"
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/^-+|-+$/g, "");

  // An all-digit slug would shadow the /blog/<id> redirect for old links.
  if (!slug || /^\d+$/.test(slug)) return `post-${slug || "untitled"}`;
  return slug;
};

// A slug is set once, when the post is created. Editing a title later keeps the
// URL, so links and search rankings survive the edit.
export async function createBlogSlug(title) {
  const base = slugify(title);
  const rows = await query(
    "SELECT slug FROM blogs WHERE slug = $1 OR slug LIKE $1 || '-%'",
    [base],
  );
  const taken = new Set(rows.map((row) => row.slug));

  let slug = base;
  for (let suffix = 2; taken.has(slug); suffix += 1) {
    slug = `${base}-${suffix}`;
  }
  return slug;
}

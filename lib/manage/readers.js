import "server-only";
import { query } from "@/lib/db";
import { getResource, listRows } from "@/lib/manage/resources";
import { getCachedLatestResume, getResumeHtml } from "@/lib/ResumeStorage";

const LISTS = [
  "projects",
  "experience",
  "education",
  "technical-skills",
  "soft-skills",
  "tools",
];

const readList = async (name, text) => {
  try {
    return await query(text);
  } catch (error) {
    console.error(`Failed to read ${name} for /manage:`, error);
    return null;
  }
};

// The current PDF and its web version, hidden or not. A web version that
// can't be read counts as missing (the owner can rebuild it); only a failed
// PDF lookup marks the tab as failed.
const readResume = async () => {
  let latest;
  try {
    latest = await getCachedLatestResume();
  } catch (error) {
    console.error("Failed to look up the résumé for /manage:", error);
    return { failed: true };
  }
  if (!latest) return { latest: null, html: null };
  const html = await getResumeHtml(latest.key).catch((error) => {
    console.error("Failed to read the résumé's web version:", error);
    return null;
  });
  return { latest, html };
};

// Direct and uncached, so the owner always edits what's really stored. One
// failed read marks only its own list as failed (null).
export const getManageContent = async () => {
  const [entries, blogs, resume] = await Promise.all([
    Promise.all(
      LISTS.map(async (name) => [
        name,
        await readList(name, listRows(getResource(name))),
      ]),
    ),
    // No article text here: the editor fetches a post when it opens.
    readList(
      "blogs",
      `SELECT id, slug, blog_title, blog_date, read_time
       FROM blogs ORDER BY blog_date DESC, id DESC`,
    ),
    readResume(),
  ]);

  return { ...Object.fromEntries(entries), blogs, resume };
};

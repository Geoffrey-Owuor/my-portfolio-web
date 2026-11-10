import "server-only";
import { query } from "@/lib/db";
import { getResource, listRows } from "@/lib/manage/resources";
import { getCachedLatestResume } from "@/lib/ResumeStorage";

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
       FROM blogs ORDER BY blog_date DESC`,
    ),
    getCachedLatestResume().then(
      (latest) => ({ latest }),
      (error) => {
        console.error("Failed to look up the résumé for /manage:", error);
        return { failed: true };
      },
    ),
  ]);

  return { ...Object.fromEntries(entries), blogs, resume };
};

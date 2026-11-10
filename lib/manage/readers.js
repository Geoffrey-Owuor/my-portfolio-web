import "server-only";
import { query } from "@/lib/db";
import { getResource, listRows } from "@/lib/manage/resources";

const LISTS = [
  "projects",
  "experience",
  "education",
  "technical-skills",
  "soft-skills",
  "tools",
];

// Direct and uncached, so the owner always edits what's really stored. One
// failed read marks only its own list as failed (null).
export const getManageContent = async () => {
  const entries = await Promise.all(
    LISTS.map(async (name) => {
      try {
        return [name, await query(listRows(getResource(name)))];
      } catch (error) {
        console.error(`Failed to read ${name} for /manage:`, error);
        return [name, null];
      }
    }),
  );
  return Object.fromEntries(entries);
};

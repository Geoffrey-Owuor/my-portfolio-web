import "server-only";
import { query } from "@/lib/db";
import { unstable_cache } from "next/cache";

const getBlogData = async () => {
  // Every reader of this list only builds a short excerpt, so whole posts stay
  // out of the cache entry (unstable_cache caps one at 2 MB).
  const blogsQuery = `
    SELECT id, slug, blog_title, blog_author, blog_date, read_time,
           LEFT(blog_content, 2000) AS content_head
    FROM blogs
    ORDER BY blog_date DESC
    `;
  const blogs = await query(blogsQuery);
  return blogs;
};

const cachedBlogData = unstable_cache(getBlogData, ["BlogsData"], {
  tags: ["BlogsData"],
});

// Failures are caught outside the cache so they're never stored (see
// cache/CachedData.js); resolves to null when the read fails.
export const BlogsData = async () => {
  try {
    return await cachedBlogData();
  } catch (error) {
    console.error("Error fetching blogs data:", error);
    return null;
  }
};
